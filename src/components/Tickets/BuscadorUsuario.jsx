import React, { useEffect, useRef, useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { buscarUsuariosTicket } from '../../controllers/ticket/TicketController';

/**
 * BuscadorUsuario
 * Input con autocompletado que consulta usuarios por nombre / cédula / email.
 * Onseleccionar, llama a onSelect(usuario) con el objeto completo.
 *
 * Props:
 *  - value: string (texto del input)
 *  - onChange: (texto) => void
 *  - onSelect: (usuarioObject) => void
 *  - onClear: () => void
 *  - placeholder?: string
 *  - label?: string
 */
const BuscadorUsuario = ({
                             value,
                             onChange,
                             onSelect,
                             onClear,
                             placeholder = 'Nombres, cédula o ID...',
                             label = 'Buscar usuario',
                         }) => {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    // flag para NO disparar búsqueda al momento de seleccionar
    const skipNextSearchRef = useRef(false);

    useEffect(() => {
        // Si acabamos de seleccionar, ignoramos este cambio
        if (skipNextSearchRef.current) {
            skipNextSearchRef.current = false;
            return;
        }

        const timer = setTimeout(async () => {
            if (value && value.trim().length >= 2) {
                setLoading(true);
                const res = await buscarUsuariosTicket(value);
                setLoading(false);
                setSuggestions(res.length ? res : []);
            } else {
                setSuggestions(null);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [value]);

    const handleClickAway = () => {
        if (suggestions) setSuggestions(null);
    };

    const handleSelect = (item) => {
        skipNextSearchRef.current = true;
        setSuggestions(null);
        onSelect(item);
    };

    const handleClear = () => {
        setSuggestions(null);
        if (onClear) onClear();
    };

    return (
        <div className="relative">
            {label && (
                <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            )}
            <div className="flex items-center border rounded overflow-hidden">
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 px-2 py-1.5 text-xs focus:outline-none"
                />
                {(value || loading) && (
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={loading}
                        className="px-2 text-gray-400 hover:text-gray-600 text-xs border-l"
                        title="Limpiar">
                        {loading ? (
                            <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
                        ) : (
                            '✕'
                        )}
                    </button>
                )}
            </div>

            {suggestions !== null && (
                <ClickAwayListener onClickAway={handleClickAway}>
                    <div className="absolute left-0 right-0 top-full mt-1 max-h-64 bg-white border rounded shadow-lg z-50 overflow-y-auto">
                        {suggestions.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-gray-400 text-center">
                                Sin resultados
                            </div>
                        ) : (
                            suggestions.map((item, i) => (
                                <button
                                    key={`${item.id_tbl_usuario}-${i}`}
                                    type="button"
                                    onClick={() => handleSelect(item)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-green-50 border-b last:border-b-0">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">
                                            {item.nombres || '—'}
                                        </span>
                                        <span className="text-gray-500">
                                            CI: {item.ci_ruc || '—'} · ID: {item.usuario || item.id_tbl_usuario}
                                        </span>
                                    </div>
                                    {item.estado === 'activo' ? (
                                        <span className="text-green-600 text-[10px] font-medium px-2 py-0.5 bg-green-50 rounded">
                                            activo
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-[10px] font-medium px-2 py-0.5 bg-gray-50 rounded">
                                            inactivo
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </ClickAwayListener>
            )}
        </div>
    );
};

export default BuscadorUsuario;