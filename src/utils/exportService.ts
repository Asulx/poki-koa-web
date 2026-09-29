import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Función para obtener la fecha actual en formato AAAAMMDD
const obtenerFechaFormateada = () => {
    const hoy = new Date();
    const aaaa = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${aaaa}${mm}${dd}`;
};

export const exportarAPDF = (datos: any) => {
    const doc = new jsPDF();
    doc.text("Reporte Clínico - Poki Koa", 14, 15);
    
    autoTable(doc, {
        startY: 25,
        head: [['Métrica', 'Cantidad']],
        body: [
            ['Eventos Críticos Hoy', datos.eventosCriticos],
            ['Alertas Activas', datos.totalAlertas],
            ['Medicamentos Administrados', datos.medicamentosAdministrados]
        ],
        theme: 'grid',
        headStyles: { fillColor: [26, 95, 122] }
    });
    
    const fecha = obtenerFechaFormateada();
    doc.save(`reporte_pokikoa_${fecha}.pdf`);
};

export const exportarAExcel = (datos: any) => {
    const filas = [
        { Métrica: 'Eventos Críticos Hoy', Cantidad: datos.eventosCriticos },
        { Métrica: 'Alertas Activas', Cantidad: datos.totalAlertas },
        { Métrica: 'Medicamentos Administrados', Cantidad: datos.medicamentosAdministrados }
    ];

    const hoja = XLSX.utils.json_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reportes Diarios");
    
    const fecha = obtenerFechaFormateada();
    XLSX.writeFile(libro, `reporte_pokikoa_${fecha}.xlsx`);
};