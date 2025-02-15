import React, {useMemo, useState} from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';


const VisualizadorCRM = ({ open, data, onClose }) => {
    const [childModalOpen, setChildModalOpen] = useState(false);

    const contactosAgrupados = useMemo(() => {
        if (!data.contactos) return { telefonos: [], direcciones: [], correos: [] };

        return data.contactos.reduce((acc, item) => {
            if (item.contacto.includes('@')) {
                acc.correos.push(item.contacto);
            } else if (item.contacto.match(/^\+?[\d\s-]+$/)) {
                acc.telefonos.push(item.contacto);
            } else {
                acc.direcciones.push(item.contacto);
            }
            return acc;
        }, { telefonos: [], direcciones: [], correos: [] });
    }, [data.contactos]);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 300,
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'

    };

    const childModalStyle = {
        ...modalStyle,
        width: '80%',
        maxWidth: 500,
    };

    const ContactSection = ({ icon, title, items }) => (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {icon}
                <Typography variant="subtitle2" color="primary">
                    {title}
                </Typography>
            </Box>
            <Box sx={{ pl: 4 }}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                            {item}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No hay información disponible
                    </Typography>
                )}
            </Box>
        </Box>
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2" mb={2} sx={{ textDecoration: 'underline', textUnderlineOffset: '6px',
                    textDecorationColor: '#9e9e9e', fontStyle: 'italic'}} >
                    {data.nombres}
                </Typography>
                <Box sx={{ mb: 3 }}>
                    <ContactSection
                        title="Teléfonos"
                        items={contactosAgrupados.telefonos}
                    />
                    <ContactSection

                        title="Direcciones"
                        items={contactosAgrupados.direcciones}
                    />
                    <ContactSection

                        title="Correos Electrónicos"
                        items={contactosAgrupados.correos}
                    />
                </Box>


                    {data.laboral && (
                        <Button
                            variant="outlined"
                            onClick={() => setChildModalOpen(true)}
                            color="success"


                        >
                            Información Laboral
                        </Button>
                    )}

                <Modal
                    open={childModalOpen}
                    onClose={() => setChildModalOpen(false)}
                    aria-labelledby="child-modal-title"
                >
                    <Box sx={childModalStyle}>
                        <Typography id="child-modal-title" variant="h6" component="h2" mb={2}>
                            Información Laboral
                        </Typography>

                        {data.laboral && (
                            <div className='flex flex-col gap-4'>
                                {data.laboral.map((item, index) => (
                                    <div key={index} className='flex flex-col border-b pb-2'>
                                        <Typography variant="subtitle1" className='font-bold'>
                                            {item.empresa}
                                        </Typography>
                                        <Typography variant="body2" className='text-gray-600'>
                                            <b>Ocupación:</b> {item.ocupacion}
                                        </Typography>
                                        <Typography variant="body2" className='text-gray-600'>
                                            <b> Fecha de Ingreso:</b> {item.ingreso}
                                        </Typography>
                                        <Typography variant="body2" className='text-gray-600'>
                                            <b>Salario:</b> {item.salario}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setChildModalOpen(false)}>Cerrar</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Modal>
    );
};

export default VisualizadorCRM;
