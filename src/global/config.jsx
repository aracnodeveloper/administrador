class Config {
    static get URL_SERVICIOS() {
        return "https://apidev.visitaecuador.com/v1.7";
    }

    static get URL_CRM() {
        return "https://api.visitaecuador.com/v1.7";
    }

    static get DEVELOPER_TOKEN() {
        return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjI2NTI5OTcxMDcsImF1ZCI6IjY0NzY2ZTJiYzllYWUxNGI3ZjBhZGIyZGQ4ZWYyNjJlOThkNzZjZjkiLCJkYXRhIjp7ImlkX3NlcnZpY2lvIjoxLCJpZF9tZXRvZG8iOjEsIm5vbWJyZXMiOm51bGwsIm9yaWdlbiI6ImFwcCIsImlkX2Rlc2Fycm9sbGFkb3IiOjMsImlkX3VzdWFyaW9fdmVuZGVkb3IiOjM5OCwiZXhwIjoiMTAwMDAwMDAwMCJ9fQ.5P7XYwxRz3Ex3ARExA3Fdr59vM8yIP-mB5NZJlDgPBM";
    }

    static get CRM_TOKEN() {
        return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3Njc4MDE2NTcsImF1ZCI6IjI1NGMyOTA1OTg1MmRkN2I4MjI3OTk3MTY5ZTMzOTJlNzUxZWU0ZjYiLCJkYXRhIjp7ImNvZGlnbyI6InZpc2l0YWVjdWFkb3IiLCJub21icmVzIjoiVmlzaXRhRWN1YWRvci5jb20iLCJpZF91c3VhcmlvIjoiMCIsImlkX3NlcnZpY2lvIjoyNTUsIm1ldG9kbyI6bnVsbCwib3JpZ2VuIjoiYXBwIiwiaWRfY2FuYWwiOm51bGwsImlkX3VzdWFyaW9fY3JtIjoiMTcxNyJ9fQ.1KQLvxoCha0hl20NgYqOeXEWvAzD_93Q9QaM40i_Ob8"
    }

    static get METRICAS() {
        return "/met/";
    }

    static get ADMIN() {
        return "/adm";
    }

    static get CRM_PERSONA() {
        return "/p";
    }

    static get RESERVAS() {
        return "/res/";
    }

    static get CALLCENTER() {
        return "/call/";
    }

    static get SUSCRIPTOR() {
        return "/sus/";
    }

    static get VERINFO() {
        return "/info/";
    }

    static get VERLUG() {
        return "/lug/";
    }

    static get VEREST() {
        return "/est/";
    }

    static get ESTADOS() {
        return [
            {
                "id": 1,
                "nombre": "Pendiente"
            },
            {
                "id": 2,
                "nombre": "Confirmado"
            },
            {
                "id": 3,
                "nombre": "Cancelado"
            },
            {
                "id": 4,
                "nombre": "Cotización"
            },
        ]
    }

    static isMobile(){
        return  window.innerWidth < 768;
    }

    static obtenerEstadoReserva(id) {
        const item = this.ESTADOS.find(elemento => elemento.id === id);
        return item ? item.nombre : null;
    }

    static get LLAMADA() {
        return [
            {
                "id": 1,
                "nombre": "Sin llamar"
            },
            {
                "id": 2,
                "nombre": "Si contestó"
            },
            {
                "id": 3,
                "nombre": "No contestó"
            },
            {
                "id": 4,
                "nombre": "Gestionado"
            }
        ]
    }

    static obtenerLlamada(id) {
        const item = this.LLAMADA.find(elemento => elemento.id === id);
        return item ? item.nombre : null;
    }


    static get VENTA() {
        return [
            {
                "id": 1,
                "nombre": "NO"
            },
            {
                "id": 2,
                "nombre": "SI"
            }
        ]
    }

    static obtenerVenta(id) {
        const item = this.VENTA.find(elemento => elemento.id === id);
        return item ? item.nombre : null;
    }

    static get PAGOS() {
        return [
            {
                "id": "-1",
                "nombre": "Sin especificar"
            },
            {
                "id": "1",
                "nombre": "Bono de producción"
            },
            {
                "id": "2",
                "nombre": "Canje"
            },
            {
                "id": "3",
                "nombre": "Canje empresarial"
            },
            {
                "id": "4",
                "nombre": "Certificado GIFT"
            },
            {
                "id": "5",
                "nombre": "Certificado VIP"
            },
            {
                "id": "6",
                "nombre": "Convenios con bancos"
            },
            {
                "id": "7",
                "nombre": "Directa al establecimiento"
            },
            {
                "id": "8",
                "nombre": "Premios"
            },
        ]
    }

    static obtenerTipoPago(id) {
        const item = this.PAGOS.find(elemento => elemento.id === id);
        return item ? item.nombre : null;
    }

    static get TIPOCONT() {
        return [
            {
                "id": "1",
                "nombre": "Email"
            },
            {
                "id": "2",
                "nombre": "Teléfono"
            },
            {
                "id": "3",
                "nombre": "Celular Trabajo"
            },
            {
                "id": "4",
                "nombre": "Celular Personal"
            },
            {
                "id": "5",
                "nombre": "Página web"
            },
            {
                "id": "6",
                "nombre": "Teléfono Reservas"
            },
            {
                "id": "7",
                "nombre": "Teléfono Internet (SIP)"
            },
            {
                "id": "9",
                "nombre": "Email 2"
            },
            {
                "id": "12",
                "nombre": "Dirección"
            },
            {
                "id": "14",
                "nombre": "Whatsapp"
            },
        ]
    }

    static get ESTADOPAGO() {
        return [
            {
                "id": "1",
                "nombre": "Fondos por confirmar"
            },
            {
                "id": "2",
                "nombre": "Pagado"
            },
            {
                "id": "3",
                "nombre": "Cortesía"
            },
            {
                "id": "4",
                "nombre": "Anulado"
            },
            {
                "id": "8",
                "nombre": "Bloqueado"
            },
        ]
    }

    static get ELEMENTOSHOJAS() {
        return [
            {
                "id": "1",
                "nombre": "Todos"
            },
            {
                "id": "10",
                "nombre": "10"
            },
            {
                "id": "20",
                "nombre": "20"
            },
            {
                "id": "40",
                "nombre": "40"
            },
            {
                "id": "80",
                "nombre": "80"
            },
        ]
    }

    static get esEs() {
        return {
            // Textos para los filtros
            columnMenuFilter: 'Filtro',
            columnMenuSortAsc: 'Ordenar ascendente',
            columnMenuSortDesc: 'Ordenar descendente',
            columnMenuRemoveSort: 'Eliminar orden',
            columnMenuHideColumn: 'Ocultar columna',
            columnMenuShowColumns: 'Mostrar columnas',
            filterPanelInputPlaceholder: 'Buscar...',
            filterPanelSubmit: 'Aplicar',
            filterPanelReset: 'Restablecer',
            columnMenuUnsort: 'Quitar orden',
            columnMenuManageColumns: 'Gestionar columnas',
            filterPanelColumns: 'Columna',
            filterPanelOperator: 'Operadores',
            filterPanelInputLabel: 'Valor',
            filterOperatorContains: 'Contiene',
            filterOperatorEquals: 'Igual a',
            filterOperatorStartsWith: 'Empieza con',
            filterOperatorEndsWith: 'Termina con',
            filterOperatorIsEmpty: 'Está vacío',
            filterOperatorIsNotEmpty: 'No está vacío',
            filterOperatorIsAnyOf: 'Es alguno de',
            columnsPanelHideAllButton: 'Ocultar todo',
            columnsPanelResetButton: 'Restablecer',
        };
    }

    static get SettingTable() {
        return {
            border: '1px solid #f1f5f9',
            borderRadius: '12px',
            overflow: 'hidden',
            '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #f1f5f9',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: '800',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#64748b',
                outline: 'none',
            },
            '& .MuiDataGrid-columnHeader': {
                borderRight: '1px solid #f1f5f9', // Bordes verticales en cabecera
            },
            '& .MuiDataGrid-cell': {
                fontSize: '0.8rem',
                padding: '4px 12px', // Reducido de 12px a 4px para compactar verticalmente
                borderBottom: '1px solid #f1f5f9',
                borderRight: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                color: '#334155',
            },
            '& .MuiDataGrid-footerContainer': {
                display: 'none',
            },
            '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f1f5f9 !important',
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: '#fcfdfe',
            },
            '& .MuiDataGrid-cell:focus-within': {
                outline: 'none',
            },
        }
    }
}
export default Config;