import React, { useState } from 'react';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { listarReservasFiltro } from '../../../../controllers/smart/SmartController';
import Config from '../../../../global/config';

const DescargarReservas = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const generarExcel = async () => {
    setLoading(true);
    listarReservasFiltro(params, true).then(async (res) => {
      setLoading(false);
      if (res) {
        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte");

        // Definir las columnas
  const columns = [
    { header: "ID Reserva", key: "id_tbl_reserva", format: "text" },
    { header: "Gestionado por", key: "vendedor", format: "text" },
    { header: "Fecha Reservación", key: "fechaReserva", format: "date" },
    { header: "Fecha Actualización", key: "fecha_actualizacion", format: "date" },
    { header: "Suscriptor", key: "nombreSuscriptor", format: "text" },
    { header: "Identificación", key: "ci_ruc", format: "text" },
    { header: "ID Suscriptor", key: "idSuscripcion", format: "text" },
    { header: "Establecimiento", key: "establecimiento", format: "text" },
    { header: "ID Establecimiento", key: "id_tbl_establecimiento", format: "text" },
    { header: "Ciudad", key: "ubicacion", format: "text" },
    { header: "Habitación", key: "tituloOferta", format: "text" },
    { header: "Ingreso", key: "fecha_inicio", format: "date" },
    { header: "Salida", key: "fecha_fin", format: "date" },
    { header: "Acomodación", key: "acomodacion", format: "text" },
    { header: "Aplicabilidad", key: "aplicaEn", format: "text" },
    { header: "# Ofertas", key: "cantidadOfertas", format: "number" },
    { header: "Adultos", key: "adultos", format: "number" },
    { header: "Adultos Adicionales", key: "adultos_extras", format: "number" },
    { header: "Precio Adulto", key: "precio_adulto_adicional", format: "currency" },
    { header: "Niños", key: "ninos", format: "number" },
    { header: "Niños Adicionales", key: "ninos_extras", format: "number" },
    { header: "Precio Niño", key: "precio_nino_adicional", format: "currency" },
    { header: "Edades Niños", key: "edades_ninos", format: "text" },
    { header: "Noches", key: "nochesOferta", format: "number" },
    { header: "Días", key: "diasOferta", format: "number" },
    { header: "Forma de Pago", key: "forma_pago_oferta", format: "text" },
    { header: "Tarifa Rack", key: "costoRack", format: "currency" },
    { header: "Precio Oferta", key: "precioOferta", format: "currency" },
    { header: "Precio Feriado", key: "precio_feriado", format: "currency" },
    { header: "Precio Total", key: "precio_total", format: "currency" },
  ];
  

  // Procesar los datos y convertir el tipo de pago
  const rows = res.map(element => {
    element.forma_pago_oferta = Config.obtenerTipoPago(element.forma_pago_oferta);
    return [
      element.id_tbl_reserva,
      element.vendedor,
      element.fechaReserva,
      element.fecha_actualizacion,
      element.nombreSuscriptor,
      element.ci_ruc,
      element.idSuscripcion,
      element.establecimiento,
      element.id_tbl_establecimiento,
      element.ubicacion,
      element.tituloOferta,
      element.fecha_inicio,
      element.fecha_fin,
      element.acomodacion,
      element.aplicaEn,
      element.cantidadOfertas,
      element.adultos,
      element.adultos_extras,
      element.precio_adulto_adicional,
      element.ninos,
      element.ninos_extras,
      element.precio_nino_adicional,
      element.edades_ninos,
      element.nochesOferta,
      element.diasOferta,
      element.forma_pago_oferta,
      element.costoRack,
      element.precioOferta,
      element.precio_feriado,
      element.precio_total
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
  res.forEach((element, rowIndex) => {
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
    <button className='flex gap-1 items-center justify-center bg-greenVE-400 border-2 border-greenVE-600 h-8 w-8 rounded-full' onClick={loading ? null : generarExcel}>
      {
        loading
          ? <span className="icon-[line-md--loading-twotone-loop] h-5 w-5 text-gray-500"></span>
          : <span className="icon-[vscode-icons--file-type-excel] h-5 w-5"></span>
      }
    </button>
  );
};

export default DescargarReservas;