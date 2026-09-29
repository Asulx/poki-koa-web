import { useState } from 'react';

export interface PacienteFormData {
    nombre: string;
    edadGestacional: string;
    sexo: string;
    peso: string;
    numeroCuna: string;
    fechaIngreso: string;
    medicoResponsable: string;
    diagnostico: string;
    estadoCanula: string;
    viaIntravenosa: string;
}

interface PacienteFormProps {
    pacienteInicial?: PacienteFormData;
    onSubmit: (datos: PacienteFormData) => void;
    isLoading?: boolean;
}

export default function PacienteForm({ pacienteInicial, onSubmit, isLoading = false }: PacienteFormProps) {
    // 1. Estado inicial con todos los campos de tu diseño
    const [formData, setFormData] = useState<PacienteFormData>(
        pacienteInicial || {
            nombre: '', edadGestacional: '', sexo: 'Femenino', peso: '',
            numeroCuna: 'Cuna 04', fechaIngreso: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
            medicoResponsable: '', diagnostico: '',
            estadoCanula: 'OK - Conectada', viaIntravenosa: 'OK - Activa'
        }
    );

    const [errores, setErrores] = useState<Partial<PacienteFormData>>({});

    // 2. Lógica de validación en tiempo real (ejemplo simple)
    const validarCampo = (nombre: string, valor: string) => {
        let error = '';
        if (nombre === 'nombre' && valor.trim() === '') error = 'El nombre es obligatorio.';
        if (nombre === 'peso' && isNaN(Number(valor))) error = 'El peso debe ser un número.';
        setErrores(prev => ({ ...prev, [nombre]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validarCampo(name, value);
    };

    const tieneErrores = Object.values(errores).some(err => err !== '') || formData.nombre === '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tieneErrores) onSubmit(formData);
    };

    const handleLimpiar = () => {
        setFormData({
            nombre: '', edadGestacional: '', sexo: 'Femenino', peso: '',
            numeroCuna: 'Cuna 04', fechaIngreso: new Date().toISOString().split('T')[0],
            medicoResponsable: '', diagnostico: '',
            estadoCanula: 'OK - Conectada', viaIntravenosa: 'OK - Activa'
        });
        setErrores({});
    };

    // Estilos reutilizables para mantener el diseño limpio
    const sectionStyle = { marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' };
    const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' };
    const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#6b7280', marginBottom: '0.3rem', textTransform: 'uppercase' as 'uppercase' };
    const inputStyle = { width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' };

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '700px' }}>
            
            {/* SECCIÓN: INFORMACIÓN PERSONAL */}
            <div style={sectionStyle}>
                <h3 style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>INFORMACIÓN PERSONAL</h3>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Nombre Completo</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del bebé" style={{ ...inputStyle, border: errores.nombre ? '1px solid red' : inputStyle.border }} />
                        {errores.nombre && <span style={{ color: 'red', fontSize: '0.75rem' }}>{errores.nombre}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Edad / Semanas Gestacionales</label>
                        <input type="text" name="edadGestacional" value={formData.edadGestacional} onChange={handleChange} placeholder="ej. 2 meses / 34 sem" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Sexo</label>
                        <select name="sexo" value={formData.sexo} onChange={handleChange} style={inputStyle}>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Peso (KG)</label>
                        <input type="text" name="peso" value={formData.peso} onChange={handleChange} placeholder="ej. 3.2" style={{ ...inputStyle, border: errores.peso ? '1px solid red' : inputStyle.border }} />
                        {errores.peso && <span style={{ color: 'red', fontSize: '0.75rem' }}>{errores.peso}</span>}
                    </div>
                </div>
            </div>

            {/* SECCIÓN: ASIGNACIÓN CLÍNICA */}
            <div style={sectionStyle}>
                <h3 style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>ASIGNACIÓN CLÍNICA</h3>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Número de Cuna</label>
                        <select name="numeroCuna" value={formData.numeroCuna} onChange={handleChange} style={inputStyle}>
                            <option value="Cuna 01">Cuna 01</option>
                            <option value="Cuna 02">Cuna 02</option>
                            <option value="Cuna 03">Cuna 03</option>
                            <option value="Cuna 04">Cuna 04</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Fecha de Ingreso</label>
                        <input type="date" name="fechaIngreso" value={formData.fechaIngreso} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Médico Responsable</label>
                        <input type="text" name="medicoResponsable" value={formData.medicoResponsable} onChange={handleChange} placeholder="Nombre del médico" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Diagnóstico Principal</label>
                        <input type="text" name="diagnostico" value={formData.diagnostico} onChange={handleChange} placeholder="Diagnóstico de ingreso" style={inputStyle} />
                    </div>
                </div>
            </div>

            {/* SECCIÓN: DISPOSITIVOS */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>DISPOSITIVOS</h3>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Estado de Cánula</label>
                        <select name="estadoCanula" value={formData.estadoCanula} onChange={handleChange} style={inputStyle}>
                            <option value="OK - Conectada">OK - Conectada</option>
                            <option value="Alerta - Desconectada">Alerta - Desconectada</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Vía Intravenosa</label>
                        <select name="viaIntravenosa" value={formData.viaIntravenosa} onChange={handleChange} style={inputStyle}>
                            <option value="OK - Activa">OK - Activa</option>
                            <option value="Alerta - Obstruida">Alerta - Obstruida</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                    type="submit" 
                    disabled={tieneErrores || isLoading} 
                    style={{ backgroundColor: '#1f5b6a', color: 'white', flex: 1, padding: '0.8rem', borderRadius: '4px', border: 'none', cursor: tieneErrores ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                    {isLoading ? 'Procesando...' : (pacienteInicial ? 'Actualizar Paciente' : 'Registrar Paciente')}
                </button>
                <button 
                    type="button" 
                    onClick={handleLimpiar} 
                    style={{ padding: '0.8rem 2rem', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: '#4b5563' }}
                >
                    Limpiar
                </button>
            </div>
        </form>
    );
}