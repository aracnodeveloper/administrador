import React, { useState } from 'react';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { listarSuscriptores } from '../../../../controllers/suscriptores/SuscriptoresController';
import { Tooltip } from 'flowbite-react';

const DescargarSuscriptores = ({ params }) => {
    const [loading, setLoading] = useState(false);

    const generarExcel = async () => {
        setLoading(true);
        listarSuscriptores({filtros: params}).then(async (res) => {
            setLoading(false);
            if (res) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Suscriptores");

                const columns = [
                    { header: "ID", key: "codigo", format: "text" },
                    { header: "Cédula/RUC", key: "ci_ruc", format: "text" },
                    { header: "Nombres", key: "usuario", format: "text" },
                    { header: "Fecha Inicio", key: "fecha_inicio", format: "date" },
                    { header: "Fecha Fin", key: "fecha_fin", format: "date" },
                    { header: "Patrocinador", key: "vendedor", format: "text" },
                    { header: "Estado de Pago", key: "estado_pago", format: "text" },
                    { header: "Empresa", key: "nombre", format: "text" }
                ];

                const fActual = new Date();

                const rows = res.suscripciones.map(element => {
                    const fechaFin = new Date(element.fecha_fin.split(" ")[0]);
                    const estado = fechaFin < fActual ? "Expirado" : "Vigente";

                    return [
                        element.codigo,
                        element.ci_ruc,
                        element.usuario,
                        element.fecha_inicio.split(" ")[0],
                        element.fecha_fin.split(" ")[0],
                        element.vendedor,
                        element.estado_pago,
                        element.nombre,
                        estado
                    ];
                });

                worksheet.addTable({
                    name: 'SuscriptoresTable',
                    ref: 'A1',
                    headerRow: true,
                    totalsRow: false,
                    style: {
                        theme: 'TableStyleMedium2',
                        showRowStripes: true,
                    },
                    columns: [...columns, { name: "Estado Suscripción", filterButton: true }].map(col => ({
                        name: col.header || col.name,
                        filterButton: true
                    })),
                    rows: rows,
                });

                worksheet.addConditionalFormatting({
                    ref: `A2:I${rows.length + 1}`,
                    rules: [
                        {
                            type: 'expression',
                            formulae: [`=$I2="Expirado"`],
                            style: {
                                font: { color: { argb: 'FFFF0000' } }
                            }
                        }
                    ]
                });

                res.suscripciones.forEach((element, rowIndex) => {
                    const row = worksheet.getRow(rowIndex + 2);
                    columns.forEach((col, colIndex) => {
                        const cell = row.getCell(colIndex + 1);

                        if (col.format === 'date' && element[col.key]) {
                            cell.value = new Date(element[col.key].split(" ")[0]);
                            cell.numFmt = 'yyyy-mm-dd';
                        } else if (col.format === 'text') {
                            cell.value = element[col.key] || "";
                        }
                    });
                });

                worksheet.columns.forEach(column => {
                    let maxLength = 0;
                    column.eachCell({ includeEmpty: true }, cell => {
                        const columnLength = cell.value ? cell.value.toString().length : 10;
                        if (columnLength > maxLength) {
                            maxLength = columnLength;
                        }
                    });
                    column.width = maxLength < 10 ? 10 : maxLength + 2;
                });

                const buffer = await workbook.xlsx.writeBuffer();

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
        <Tooltip content="Descargar Excel" className='bg-gray-700 text-[10px] py-1' arrow={false}>
            <button
                className='flex gap-1 items-center justify-center bg-greenVE-400 border-2 border-greenVE-600 h-8 w-8 rounded-full'
                onClick={loading ? null : generarExcel}
            >
                {loading ? (
                    <span className="icon-[line-md--loading-twotone-loop] h-5 w-5 text-gray-500" />
                ) : (
                    <span className="icon-[vscode-icons--file-type-excel] h-5 w-5" />
                )}
            </button>
        </Tooltip>
    );
};

export default DescargarSuscriptores;
