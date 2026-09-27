import { useState, useEffect } from 'react';
import { obtenerDatosReporte } from '@/services/reportesService';
import type { DatosReporte } from '@/types/reporte'
import { exportarAPDF, exportarAExcel } from '@/utils/exportService';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';

export default function ReportesPage() {
    const [datos, setDatos] = useState<DatosReporte | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const cargarReportes = async () => {
            try {
                setLoading(true);
                const resultado = await obtenerDatosReporte();
                setDatos(resultado);
            } catch (error) {
                console.error("Error al cargar los datos del reporte", error);
            } finally {
                setLoading(false);
            }
        };

        cargarReportes();
    }, []);

    // Manejo del estado de carga (Criterio de aceptación)
    if (loading) {
        return (
            <div className="p-6">
                <h2>Cargando módulo de reportes...</h2>
            </div>
        );
    }

    // Manejo de estado vacío (Criterio de aceptación)
    if (!datos) {
        return (
            <div className="p-6">
                <h2>No hay datos disponibles para reportar en este momento.</h2>
            </div>
        );
    }

    return (
        <div className="p-6">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Reportes</h1>
                    <p style={{ margin: 0, color: 'gray' }}>Métricas clave y análisis del sistema</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button onClick={() => exportarAPDF(datos)}>Exportar PDF</Button>
                    <Button onClick={() => exportarAExcel(datos)}>Exportar Excel</Button>
                </div>
            </header>

            {/* Componentes visuales adaptados a tu interfaz Card */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <Card title="EVENTOS HOY">
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1a5f7a' }}>
                        {datos.eventosCriticos}
                    </p>
                </Card>
                <Card title="ALERTAS">
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
                        {datos.totalAlertas}
                    </p>
                </Card>
                <Card title="MEDICAMENTOS">
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1a5f7a' }}>
                        {datos.medicamentosAdministrados}
                    </p>
                </Card>
            </section>
        </div>
    );
}