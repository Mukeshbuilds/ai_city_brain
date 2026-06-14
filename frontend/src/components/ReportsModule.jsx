import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader2, CheckCircle, Activity, Wind } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { API_BASE_URL } from '../config';

const ReportsModule = ({ theme }) => {
  const [generating, setGenerating] = useState(false);
  const [lastReport, setLastReport] = useState(null);

  const generateReport = async (type) => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/report/generate?type=${type}`);
      setLastReport(res.data.report);
      
      // Auto-trigger Download
      downloadPDF(res.data.report);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = (report) => {
    const doc = new jsPDF();
    const data = report.data;

    // Logo & Header
    doc.setFillColor(10, 10, 20);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(0, 243, 255);
    doc.setFontSize(22);
    doc.text("AI CITY BRAIN - URBAN LOGS", 20, 25);

    // Metadata
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`REPORT_TYPE: ${report.type.toUpperCase()}`, 20, 50);
    doc.text(`GENERATED_AT: ${new Date(report.timestamp).toLocaleString()}`, 20, 55);
    doc.text(`SYSTEM_ID: BRAIN_ALPHA_V2`, 20, 60);

    // Insights Section
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(40, 40, 50);
    doc.rect(20, 70, 170, 30, 'F');
    doc.setTextColor(0, 243, 255);
    doc.setFontSize(12);
    doc.text("AI_DIAGNOSTIC_INSIGHT:", 25, 80);
    doc.setTextColor(255, 255, 255);
    doc.text(report.insights, 25, 90);

    // Metrics Table
    const tableData = [
      ["Metric", "Value", "Status"],
      ["Traffic Flow", `${data.traffic.toFixed(1)}%`, data.traffic > 80 ? "Critical" : "Nominal"],
      ["Environment (AQI)", `${data.aqi.toFixed(1)}`, data.aqi > 100 ? "Warning" : "Safe"],
      ["Energy Grid Load", `${data.energy.toFixed(1)}%`, "Stable"],
      ["Public Satisfaction", `${data.satisfaction.toFixed(1)}%`, "Tracking"],
    ];

    autoTable(doc, {
      startY: 110,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: { fillStyle: [0, 243, 255], textColor: [0, 0, 0] },
      styles: { fontSize: 10, cellPadding: 5 }
    });

    doc.save(`City_Report_${report.type}_${Date.now()}.pdf`);
  };

  const reportTypes = [
    { id: 'summary', name: 'City Summary Report', icon: <FileText /> },
    { id: 'traffic', name: 'Traffic Flow Report', icon: <Activity /> },
    { id: 'environment', name: 'Environment Report', icon: <Wind /> }
  ];

  return (
    <div className="reports-module" style={{ padding: '20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h2 className="font-orbitron" style={{ color: 'var(--neon-cyan)', fontSize: '1.2rem' }}>REPORT_GENERATION_HUB</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '5px' }}>Generate and serialize urban data snapshots into secure PDF logs.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {reportTypes.map(type => (
          <motion.div key={type.id} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ color: 'var(--neon-cyan)' }}>{type.icon}</div>
                <h3 className="font-orbitron" style={{ fontSize: '0.9rem' }}>{type.name}</h3>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
               Comprehensive analysis including live sensor data, historical trends, and AI-driven optimization recommendations.
            </p>

            <button 
              onClick={() => generateReport(type.id)}
              disabled={generating}
              className="action-btn on" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}
            >
              {generating ? <Loader2 className="animate-spin" size={18}/> : <Download size={18}/>}
              {generating ? 'SERIALIZING...' : 'GENERATE & DOWNLOAD'}
            </button>
          </motion.div>
        ))}
      </div>

      {lastReport && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '40px', padding: '20px', background: 'rgba(0, 255, 157, 0.05)', borderRadius: '8px', border: '1px solid var(--neon-green)', display: 'flex', alignItems: 'center', gap: '15px' }}
        >
            <CheckCircle color="var(--neon-green)" />
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>LAST_REPORT_GENERATED_SUCCESSFULLY</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Type: {lastReport.type.toUpperCase()} | Timestamp: {new Date(lastReport.timestamp).toLocaleTimeString()}</div>
            </div>
            <button onClick={() => downloadPDF(lastReport)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>
                Redownload PDF
            </button>
        </motion.div>
      )}
    </div>
  );
};

export default ReportsModule;
