import React, { useState } from 'react';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { listarSuscriptores } from '../../../../controllers/suscriptores/SuscriptoresController';

const DescargarSuscriptores = ({ params }) => {
    const [loading, setLoading] = useState(false);

    const generarExcel = async () => {
        setLoading(true);
        listarSuscriptores({filtros: params}).then(async (res) => {
            setLoading(false);
            if (res) {
                // Create new Excel workbook
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Suscriptores");

                // Define columns
                const columns = [
                    { header: "ID Suscripción", key: "id_suscripcion", format: "text" },
                    { header: "Cédula Cliente", key: "ci_cliente", format: "text" },
                    { header: "Nombre Cliente", key: "nombre_cliente", format: "text" },
                    { header: "ID Vendedor", key: "id_vendedor", format: "text" },
                    { header: "Nombre Vendedor", key: "nombre_vendedor", format: "text" },
                    { header: "Estado", key: "estado", format: "text" },
                    { header: "Fecha Inicio", key: "fecha_inicio", format: "date" },
                    { header: "Fecha Fin", key: "fecha_fin", format: "date" },
                    { header: "Tipo Suscripción", key: "tipo_suscripcion", format: "text" },
                    { header: "Valor", key: "valor", format: "currency" }
                ];

                // Process data
                const rows = res.suscripciones.map(element => {
                    return [
                        element.id_suscripcion,
                        element.ci_cliente,
                        element.nombre_cliente,
                        element.id_vendedor,
                        element.nombre_vendedor,
                        element.estado,
                        element.fecha_inicio,
                        element.fecha_fin,
                        element.tipo_suscripcion,
                        element.valor
                    ];
                });

                // Create table with filters
                worksheet.addTable({
                    name: 'SuscriptoresTable',
                    ref: 'A1',
                    headerRow: true,
                    totalsRow: false,
                    style: {
                        theme: 'TableStyleMedium2',
                        showRowStripes: true,
                    },
                    columns: columns.map(col => ({ name: col.header, filterButton: true })),
                    rows: rows,
                });

                // Apply format to each cell
                res.suscripciones.forEach((element, rowIndex) => {
                    const row = worksheet.getRow(rowIndex + 2);
                    columns.forEach((col, colIndex) => {
                        const cell = row.getCell(colIndex + 1);

                        if (col.format === 'date' && element[col.key]) {
                            cell.value = new Date(element[col.key]);
                            cell.numFmt = 'mmmm dd, yyyy';
                        } else if (col.format === 'number' && element[col.key] !== undefined) {
                            cell.value = Number(element[col.key]);
                            cell.numFmt = '0';
                        } else if (col.format === 'currency' && element[col.key] !== undefined) {
                            cell.value = Number(element[col.key]);
                            cell.numFmt = '$#,##0.00';
                        } else if (col.format === 'text') {
                            cell.value = element[col.key] || "";
                        }
                    });
                });

                // Auto-adjust column widths
                worksheet.columns.forEach((column, colIndex) => {
                    let maxLength = columns[colIndex].header.length;
                    column.eachCell({ includeEmpty: true }, cell => {
                        const columnLength = cell.value ? cell.value.toString().length : 0;
                        if (columnLength > maxLength) {
                            maxLength = columnLength;
                        }
                    });
                    column.width = maxLength + 2;
                });

                // Generate Excel file in memory
                const buffer = await workbook.xlsx.writeBuffer();

                // Download file
                const opciones = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                };
                const blob = new Blob([buffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
                saveAs(blob, "Reporte Suscriptores " + (new Date().toLocaleString('es-ES', opciones)) + ".xlsx");
            }
        });
    };

    return (
        <button
            title='Descargar excel'
            className='flex gap-1 items-center justify-center bg-greenVE-400 border-2 border-greenVE-600 h-8 w-8 rounded-full'
            onClick={loading ? null : generarExcel}
        >
            {loading ? (
                <span className="icon-[line-md--loading-twotone-loop] h-5 w-5 text-gray-500" />
            ) : (
                <span className="icon-[vscode-icons--file-type-excel] h-5 w-5" />
            )}
        </button>
    );
};

export default DescargarSuscriptores;
