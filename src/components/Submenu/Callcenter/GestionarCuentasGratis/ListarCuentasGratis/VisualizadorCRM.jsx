import { Alert, Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material';
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

const VisualizadorCRM = ({open, data}) => {
    console.log(data)
    return (
       <Dialog open={open}>
                <DialogTitle>{data.nombres}</DialogTitle>
                <DialogContent className='flex flex-col gap-2'>
                    <div className='flex gap-3 text-sm text-gray-500'>
                        {data.contactos?
                        <div className='flex flex-col'>
                            {
                                data.contactos.map((item, index) => (
                                    <span>{item.contacto}</span>
                                ))
                            }
                        </div>
                        :<></>
                        }
                        {
                            data.laboral?
                                <div className='flex flex-col'>
                                    {
                                        data.laboral.map((item, index) => (
                                            <div className='flex flex-col'>
                                                <span className='font-bold'>{item.empresa}</span>
                                                <span className='text-xs'>{item.ocupacion}</span>
                                                <span className='text-xs'>{item.ingreso}</span>
                                                <span className='text-xs'>{item.salario}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            :<></>
                        }
                    </div>
                </DialogContent>
       </Dialog>
    );
};

export default VisualizadorCRM;