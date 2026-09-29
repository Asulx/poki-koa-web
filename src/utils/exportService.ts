import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportarAPDF = (datos: any) => {
    // Inicializamos el documento en blanco
    const doc = new jsPDF();
    
    // Agregamos un título formal
    doc.text("Reporte Clínico - Poki Koa", 14, 15);
    
    // Generamos una tabla estructurada
    autoTable(doc, {
        startY: 25,
        head: [['Métrica', 'Cantidad']],
        body: [
            ['Eventos Críticos Hoy', datos.eventosCriticos],
            ['Alertas Activas', datos.totalAlertas],
            ['Medicamentos Administrados', datos.medicamentosAdministrados]
        ],
        theme: 'grid',
        headStyles: { fillColor: [26, 95, 122] } // Color azul acorde a tu UI
    });
    
    // Descarga automática del archivo PDF
    doc.save("reporte_pokikoa.pdf");
};

export const exportarAExcel = (datos: any) => {
    // Preparamos los datos en formato de filas y columnas
    const filas = [
        { Métrica: 'Eventos Críticos Hoy', Cantidad: datos.eventosCriticos },
        { Métrica: 'Alertas Activas', Cantidad: datos.totalAlertas },
        { Métrica: 'Medicamentos Administrados', Cantidad: datos.medicamentosAdministrados }
    ];

    // Creamos la hoja de cálculo y el libro de Excel
    const hoja = XLSX.utils.json_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reportes Diarios");
    
    // Descarga automática del archivo Excel (.xlsx)
    XLSX.writeFile(libro, "reporte_pokikoa.xlsx");
};