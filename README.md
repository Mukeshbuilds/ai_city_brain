# AI City Brain - Urban Cognitive System

Welcome to the future of urban management. **AI City Brain** is a high-end, cyberpunk-themed smart city control dashboard designed for real-time monitoring and intelligent coordination.

##  Key Features
- **Cyberpunk UI**: Glassmorphism, neon glows, and animated backgrounds.
- **Real-Time Data**: Polling system fetching AQI from OpenWeather and simulating Traffic, Energy, and Emergency metrics.
- **AI Agents**: Monitoring panel for localized AI decision processes.
- **Simulation**: Live canvas-based particle grid showing urban flow (Vehicles, Pedestrians, Incidents).
- **Intelligence Graph**: Force-directed knowledge graph of the city's neuromorphic network.

##  Project Structure
- `frontend/`: React + Vite + Framer Motion
- `backend/`: FastAPI + Python + MongoDB integration

##  Setup Instructions

### 1. Configuration
Open the `.env` file in the root directory and add your credentials:
```env
MONGODB_URL=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_api_key
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The API will run on `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

## System Modes
- **Default**: Balanced urban load.
- **Traffic Peak**: Increases traffic density and pollution risk.
- **Emergency Mode**: Prioritizes emergency response and system security.


