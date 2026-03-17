import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import Config from '../../../../../global/config';
import EditarCuentaGratis from './EditarCuentaGratis';
import { capitalize } from '../../../../../global/utils';
import { getDatosCRM } from '../../../../../controllers/crm/CrmController';
import VisualizadorCRM from './VisualizadorCRM';


const TablaCuentasGratis = ({ listado, handleUpdateData }) => {
  const [loadingId, setLoadingId] = useState();
  const [editId, setEditId] = useState();
  var cedulaCRM = "";
  const [openEdit, setOpenEdit]=useState(false);
  const [openCRM, setOpenCRM]=useState(false);
  const [dataCRM, setDataCRM]=useState();

  const handleClickCrm = () => {
      getDatosCRM(cedulaCRM).then((res)=>{
          if(res){
              setDataCRM(res);
              setOpenCRM(true);
          }
      }).finally(()=>{
       setLoadingId()
      })
  };

  const obtenerReservaPorId = (id) => {
    return listado.find(map => map.id_tbl_usuario === id);
  };

  const buttonEditar = (id) => {
    return <div className="flex justify-start items-center h-full w-full gap-2 mt-1">
      <div title='Editar reserva' onClick={() => {setEditId(id);setOpenEdit(true)}}><a className="icon-[typcn--edit] w-5 h-5 hover:bg-blue-600 cursor-pointer text-gray-500" /></div>
    </div>
  }

  const buttonCRM = (id) => {
    return <div>
      <div title='Buscar en CRM' onClick={() => {cedulaCRM = id;setLoadingId(id);handleClickCrm()}}>
      {
          loadingId === id?
          <a className="icon-[line-md--loading-twotone-loop] w-5 h-5 hover:bg-blue-600 cursor-pointer text-gray-500" />
          :
          <a className="icon-[material-symbols-light--data-loss-prevention-outline-rounded] w-5 h-5 hover:bg-blue-600 cursor-pointer text-gray-500" />
        }
      </div>
    </div>
  }
  // Definir las columnas y su configuración
  const columns = [
    { field: 'id', headerName: '#', flex: 2 },
    { field: 'opciones', headerName: 'Opc.', flex: 7, renderCell: (params) => (buttonEditar(params.row.id_tbl_usuario)), sortable: false },
    { field: 'nombre', headerName: 'Nombre', flex: 19 },
    { field: 'ci', headerName: 'Cédula', flex: 10 },
    { field: 'mail', headerName: 'Correo', flex: 19 },
    { field: 'telefono', headerName: 'Teléfono', flex: 10 },
    { field: 'fecha', headerName: 'Fecha', flex: 8 },
    { field: 'hora', headerName: 'Hora', flex: 8 },
    { field: 'llamada', headerName: 'Llamada', flex: 10 },
    {
      field: 'venta',
      headerName: 'Venta',
      flex: 7,
    },
    { field: 'crm', headerName: 'CRM', flex: 5, renderCell: (params) => (buttonCRM(params.row.ci)), sortable: false  }
  ];

  // Mapear la lista recibida a las filas
  const rows = listado.map((item, index) => ({
    id: index + 1, // Utilizo el índice + 1 como identificador
    id_tbl_usuario: item.id_tbl_usuario,
    nombre: capitalize(item.nombre),
    ci: item.ci,
    mail: item.mail,
    telefono: item.telefono,
    fecha: item.fecha.split(" ")[0],
    hora: item.fecha.split(" ")[1],
    llamada: Config.obtenerLlamada(item.callcenter ? parseInt(item.callcenter.estado_llamada) : 1), // Valor predeterminado si no está definido
    venta: Config.obtenerVenta(item.callcenter ? (item.callcenter.id_tbl_suscripcion_renovacion ? 2 : 1) : 1),
    
  }));

  

  return (
    <>
      <div style={{ width: '100%', }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={() => 'auto'}
        disableSelectionOnClick
        localeText={Config.esEs}
        hideFooterPagination={true}
        sx={Config.SettingTable}
        autoHeight
        pagination={false}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: rows.length,
            },
          },
        }}
      />
      </div>
      {editId&&<EditarCuentaGratis open={openEdit} setOpen={setOpenEdit} item={obtenerReservaPorId(editId)} handleUpdateData={handleUpdateData}/>}
      {(openCRM&&dataCRM)&&<VisualizadorCRM open={openCRM} data={dataCRM} onClose={() => setOpenCRM(false)}/>}
    </>
  );
};

export default TablaCuentasGratis;
