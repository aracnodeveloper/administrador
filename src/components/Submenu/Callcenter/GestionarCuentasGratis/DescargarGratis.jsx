import React, { useState } from 'react';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Config from '../../../../global/config';
import { getCuentaGratis } from '../../../../controllers/callcenter/CallcenterController';

const DescargarGratis = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const generarExcel = async () => {
    setLoading(true);
    getCuentaGratis(params).then(async (res) => {
      setLoading(false);
      if (res) {
        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte");

        // Definir las columnas
        const columns = [
          { header: "Fecha Registro", key: "fecha", format: "date" },
          { header: "Cédula", key: "ci", format: "text" },
          { header: "Nombre", key: "nombre", format: "text" },
          { header: "Teléfono", key: "telefono", format: "text" },
          { header: "Correo", key: "mail", format: "text" },
          { header: "Estado Llamada", key: "estado_llamada", format: "text" },
          { header: "Comentario", key: "comentario", format: "text" },
          { header: "Producto", key: "producto", format: "text" },
          { header: "Valor", key: "valor", format: "text" },
          { header: "Inicio", key: "fecha_inicio", format: "text" },
          { header: "Fin", key: "fecha_fin", format: "text" },
          { header: "Suscriptor", key: "nomSuscriptor", format: "text" },
          { header: "Vendedor", key: "nomVendedor", format: "text" },
        ];

        // Procesar los datos y convertir el tipo de pago
        const rows = res.listado.map(element => {
          if (element.callcenter) {
            element.comentario = element.callcenter.comentario;
            element.estado_llamada = Config.obtenerLlamada(parseInt(element.callcenter.estado_llamada)||1);
            element.producto = element.callcenter.producto;
            element.valor = element.callcenter.valor;
            element.fecha_inicio = element.callcenter.fecha_inicio;
            element.fecha_fin = element.callcenter.fecha_fin;
            element.nomSuscriptor = element.callcenter.nomSuscriptor;
            element.nomVendedor = element.callcenter.nomVendedor;
          }else{
            element.estado_llamada = Config.obtenerLlamada(parseInt(1));
          }
          return [
            element.fecha,
            element.ci,
            element.nombre,
            element.telefono,
            element.mail,
            element.estado_llamada,
            element.comentario,
            element.producto,
            element.valor,
            element.fecha_inicio,
            element.fecha_fin,
            element.nomSuscriptor,
            element.nomVendedor
          ];
        });

        // Crear la tabla en la hoja de trabajo con filtros
        worksheet.addTable({
          name: 'ReservacionesTable',
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

        // Aplicar el formato a cada celda después de haber agregado la tabla
        res.listado.forEach((element, rowIndex) => {
          const row = worksheet.getRow(rowIndex + 2); // +2 porque el header está en la primera fila
          columns.forEach((col, colIndex) => {
            const cell = row.getCell(colIndex + 1);

            if (col.format === 'date' && element[col.key]) {
              cell.value = new Date(element[col.key]); // Convertir a objeto Date
              cell.numFmt = 'mmmm dd, yyyy'; // Formato de fecha larga
            } else if (col.format === 'number' && element[col.key] !== undefined) {
              cell.value = Number(element[col.key]); // Convertir a número
              cell.numFmt = '0'; // Formato numérico
            } else if (col.format === 'currency' && element[col.key] !== undefined) {
              cell.value = Number(element[col.key]); // Convertir a número
              cell.numFmt = '$#,##0.00'; // Formato de moneda
            } else if (col.format === 'text') {
              cell.value = element[col.key] || ""; // Asegurarse de que no haya valores undefined
            }
          });
        });

        // Ajustar automáticamente el ancho de las columnas al contenido
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

        // Generar un archivo Excel en memoria
        const buffer = await workbook.xlsx.writeBuffer();

        // Descargar el archivo
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Reporte Reservas " + (new Date().toLocaleString('es-ES', opciones)) + ".xlsx");
      }
    });
  };

  return (
    <button title='Descargar excel' className='flex gap-1 items-center justify-center bg-greenVE-400 border-2 border-greenVE-600 h-8 w-8 rounded-full' onClick={loading ? null : generarExcel}>
      {
        loading
          ? <span className="icon-[line-md--loading-twotone-loop] h-5 w-5 text-gray-500"></span>
          : <span className="icon-[vscode-icons--file-type-excel] h-5 w-5"></span>
      }
    </button>
  );
};

export default DescargarGratis;