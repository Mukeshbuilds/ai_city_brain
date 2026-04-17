import os
import random
import time
from typing import List, Optional, Dict
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

load_dotenv(dotenv_path="../.env")

app = FastAPI(title="AI City Brain Core v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
MONGODB_URL = os.getenv("MONGODB_URL") or "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGODB_URL)
db = client.city_brain

# System Config Model
class SystemConfig(BaseModel):
    simulation_speed: int = 1
    sound: bool = True
    theme: str = "dark"
    agents: Dict[str, bool] = {
        "traffic": True,
        "energy": True,
        "environment": True
    }

# Simulation state
simulation_state = {
    "traffic_peak": False,
    "emergency_mode": False,
    "night_mode": False,
    "simulation_speed": 1,
    "policies": {
        "traffic_tax": False,
        "pollution_limit": False,
        "green_energy": True
    }
}

@app.on_event("startup")
async def startup_db_client():
    # Initialize system config in DB if not present
    config = await db.system_config.find_one({"id": "global_config"})
    if not config:
        default_config = {
            "id": "global_config",
            "simulation_speed": 1,
            "sound": True,
            "theme": "dark",
            "agents": {"traffic": True, "energy": True, "environment": True}
        }
        await db.system_config.insert_one(default_config)
    else:
        simulation_state["simulation_speed"] = config.get("simulation_speed", 1)

@app.get("/")
async def root():
    return {"status": "AI_BRAIN_OPERATIONAL", "version": "2.1.0"}

@app.get("/api/system/config")
async def get_system_config():
    config = await db.system_config.find_one({"id": "global_config"}, {"_id": 0})
    return config

@app.post("/api/system/config")
async def update_system_config(config: SystemConfig):
    await db.system_config.update_one(
        {"id": "global_config"},
        {"$set": config.dict()}
    )
    simulation_state["simulation_speed"] = config.simulation_speed
    return {"status": "success", "config": config}

async def get_real_aqi():
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key: return random.uniform(20, 110)
    try:
        async with httpx.AsyncClient() as c:
            r = await c.get(f"http://api.openweathermap.org/data/2.5/air_pollution?lat=51.5&lon=-0.12&appid={api_key}")
            return r.json()['list'][0]['main']['aqi'] * 22
    except: return random.uniform(40, 70)

@app.get("/dashboard")
async def get_dashboard():
    aqi = await get_real_aqi()
    speed_factor = simulation_state.get("simulation_speed", 1)
    
    # Policy Impacts
    traffic_tax_impact = 0.85 if simulation_state["policies"]["traffic_tax"] else 1.0
    pollution_limit_impact = 0.9 if simulation_state["policies"]["pollution_limit"] else 1.0
    green_energy_impact = 0.92 if simulation_state["policies"]["green_energy"] else 1.0
    
    # Logic influenced by scenarios
    traffic_base = 80 if simulation_state["traffic_peak"] else 40
    if simulation_state["night_mode"]: traffic_base = 15
    traffic = (traffic_base * traffic_tax_impact) + (random.uniform(-5, 10) * speed_factor)
    
    energy_base = 30 if simulation_state["night_mode"] else 70
    if simulation_state["traffic_peak"]: energy_base += 15
    energy = (energy_base * green_energy_impact) + (random.uniform(-5, 5) * speed_factor)
    
    emergency = 90 if simulation_state["emergency_mode"] else random.uniform(5, 15)
    if traffic > 85: emergency += 20
    
    final_aqi = aqi * pollution_limit_impact
    satisfaction = 100 - (traffic*0.2 + final_aqi*0.1 + emergency*0.4)
    if simulation_state["night_mode"]: satisfaction += 10
    
    health_risk = "Low"
    if final_aqi > 150: health_risk = "High"
    elif final_aqi > 80: health_risk = "Medium"

    data = {
        "traffic": max(0, min(100, traffic)),
        "aqi": final_aqi,
        "energy": max(0, min(100, energy)),
        "emergency": max(0, min(100, emergency)),
        "satisfaction": max(0, min(100, satisfaction)),
        "health_risk": health_risk,
        "sync_level": random.uniform(85, 99), 
        "scenarios": simulation_state,
        "timestamp": datetime.now().isoformat()
    }
    
    data["predictions"] = {
        "traffic": max(0, min(100, traffic + random.uniform(-10, 10))),
        "aqi": max(0, min(100, aqi + random.uniform(-5, 5))),
        "energy": max(0, min(100, energy + random.uniform(-5, 5)))
    }
    
    decisions = []
    if traffic > 75: decisions.append({"type": "warning", "msg": "Traffic Surge: Optimizing Sector-7 signal cycles."})
    if aqi > 100: decisions.append({"type": "critical", "msg": "Air Quality Warning: Activating Zone-3 air filtration units."})
    if emergency > 50: decisions.append({"type": "critical", "msg": "Emergency detected: Rerouting autonomous medical units."})
    if energy > 85: decisions.append({"type": "warning", "msg": "High Load: Dimming non-essential Zone-5 lighting."})
    if not decisions: decisions.append({"type": "info", "msg": "System Nominal: Monitoring urban flow patterns."})
    data["decisions"] = decisions

    try: await db.history.insert_one(data.copy())
    except: pass
    return data

@app.get("/api/traffic")
async def get_traffic_data():
    dash = await get_dashboard()
    return {"value": dash["traffic"], "trend": "up" if random.random() > 0.5 else "down", "timestamp": dash["timestamp"]}

@app.get("/api/aqi")
async def get_aqi_data():
    dash = await get_dashboard()
    return {"value": dash["aqi"], "trend": "up" if random.random() > 0.5 else "down", "timestamp": dash["timestamp"]}

@app.get("/api/energy")
async def get_energy_data():
    dash = await get_dashboard()
    return {"value": dash["energy"], "trend": "up" if random.random() > 0.5 else "down", "timestamp": dash["timestamp"]}

@app.get("/api/status")
async def get_api_status():
    async def get_ping(url):
        start = time.time()
        try:
            async with httpx.AsyncClient() as c:
                await c.get(url, timeout=2.0)
                return {"status": "online", "latency": int((time.time() - start) * 1000)}
        except:
            return {"status": "offline", "latency": 0}

    return {
        "traffic_api": await get_ping("http://127.0.0.1:8000/api/traffic"),
        "aqi_api": await get_ping("http://127.0.0.1:8000/api/aqi"),
        "energy_api": await get_ping("http://127.0.0.1:8000/api/energy"),
        "database": {"status": "online", "latency": random.randint(1, 5)}
    }

@app.post("/api/report/generate")
async def generate_report(type: str = Query(...)):
    dash = await get_dashboard()
    report = {
        "type": type,
        "timestamp": datetime.now().isoformat(),
        "data": dash,
        "insights": f"AI_ANALYSIS: {type.capitalize()} nodes showing {'stable' if dash['satisfaction'] > 70 else 'volatile'} patterns."
    }
    await db.reports.insert_one(report.copy())
    if "_id" in report: del report["_id"]
    return {"status": "success", "report": report}

@app.get("/agents")
async def get_agents():
    dash = await get_dashboard()
    def get_status(val, thresh_warn, thresh_crit):
        if val > thresh_crit: return "critical"
        if val > thresh_warn: return "warning"
        return "active"
    return [
        {"id": "a1", "name": "Traffic Agent", "status": get_status(dash["traffic"], 70, 85), "confidence": 0.98, "message": "Optimizing flow..."},
        {"id": "a2", "name": "Energy Agent", "status": get_status(dash["energy"], 75, 90), "confidence": 0.94, "message": "Balancing grid..."},
        {"id": "a3", "name": "Emergency Agent", "status": get_status(dash["emergency"], 40, 70), "confidence": 0.92, "message": "Patrolling hotspots..."},
        {"id": "a4", "name": "Environment Agent", "status": get_status(dash["aqi"], 80, 120), "confidence": 0.96, "message": "Monitoring sensors..."},
        {"id": "a5", "name": "Decision Brain", "status": "active", "confidence": 0.99, "message": "Analyzing system tree..."}
    ]

@app.post("/simulation/control")
async def control_simulation(mode: str, active: bool):
    if mode in simulation_state:
        simulation_state[mode] = active
        return {"status": "success", "state": simulation_state}
    raise HTTPException(status_code=400, detail="Invalid Mode")

@app.post("/simulation/policy")
async def control_policy(policy: str, active: bool):
    if "policies" in simulation_state and policy in simulation_state["policies"]:
        simulation_state["policies"][policy] = active
        return {"status": "success", "state": simulation_state}
    raise HTTPException(status_code=400, detail="Invalid Policy")

@app.get("/alerts")
async def get_alerts():
    try:
        cursor = db.alerts.find().sort("timestamp", -1).limit(10)
        items = await cursor.to_list(length=10)
        for item in items:
            item["_id"] = str(item["_id"])
        return items
    except: return []

@app.get("/analytics")
async def get_analytics():
    try:
        cursor = db.history.find().sort("timestamp", -1).limit(24)
        items = await cursor.to_list(length=24)
        for item in items:
            item["_id"] = str(item["_id"])
        return items[::-1]
    except:
        return [{"timestamp": (datetime.now() - timedelta(minutes=i)).isoformat(), "traffic": random.uniform(30, 80), "aqi": random.uniform(40, 90), "energy": random.uniform(50, 70)} for i in range(24)][::-1]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
