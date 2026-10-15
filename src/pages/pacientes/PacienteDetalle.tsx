import React from 'react';
import './PacienteDetalle.css';

export default function PacienteDetalle() {
  return (
    <div className="paciente-detalle-container">
      <header className="detalle-header">
        <div className="header-info">
          <h1>Bebé Pérez</h1>
          <span className="cuna-badge">Cuna 04</span>
          <span className="badge badge-success">Estable</span>
        </div>
        <div className="header-actions">
          <button className="btn-outline">Editar Datos</button>
          <button className="btn-primary">+ Añadir Medicamento</button>
        </div>
      </header>

      <section className="info-clinica">
        <div className="info-group">
          <label>Edad Gestacional</label>
          <p>34 Semanas</p>
        </div>
        <div className="info-group">
          <label>Peso Actual</label>
          <p>2.100 kg</p>
        </div>
        <div className="info-group">
          <label>Vía IV Activa</label>
          <p>Sí (Brazo derecho)</p>
        </div>
        <div className="info-group">
          <label>Soporte Respiratorio</label>
          <p>Cánula Nasal</p>
        </div>
      </section>

      <h2 className="section-title">Monitor de Signos Vitales</h2>
      
      <section className="vital-signs-grid">
        {/* Tarjeta Frecuencia Cardíaca */}
        <div className="vital-card hr-card">
          <div className="vital-header">
            <h3>Ritmo Cardíaco (FC)</h3>
            <span className="icon">❤️</span>
          </div>
          <div className="vital-body">
            <span className="vital-value">142</span>
            <span className="vital-unit">bpm</span>
          </div>
          <div className="vital-footer">
            <span>Normal: 120 - 160</span>
          </div>
        </div>

        {/* Tarjeta Saturación de Oxígeno */}
        <div className="vital-card spo2-card">
          <div className="vital-header">
            <h3>Saturación (SpO2)</h3>
            <span className="icon">💨</span>
          </div>
          <div className="vital-body">
            <span className="vital-value">96</span>
            <span className="vital-unit">%</span>
          </div>
          <div className="vital-footer">
            <span>Normal: &gt; 90%</span>
          </div>
        </div>

        {/* Tarjeta Temperatura */}
        <div className="vital-card temp-card">
          <div className="vital-header">
            <h3>Temperatura</h3>
            <span className="icon">🌡️</span>
          </div>
          <div className="vital-body">
            <span className="vital-value">36.8</span>
            <span className="vital-unit">°C</span>
          </div>
          <div className="vital-footer">
            <span>Normal: 36.5 - 37.5</span>
          </div>
        </div>
      </section>
    </div>
  );
}