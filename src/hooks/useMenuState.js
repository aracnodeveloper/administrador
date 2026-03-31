import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook que persiste el índice de menú/submenú en los query params de la URL.
 * Al recargar la página, el estado se restaura automáticamente desde la URL.
 *
 * @param {string} paramName - Nombre del query param (ej: "menu", "subSmart")
 * @param {number} defaultIndex - Valor por defecto si no hay param en la URL
 * @returns {[number, Function]} - [índice actual, función para cambiarlo]
 */
const useMenuState = (paramName, defaultIndex = 0) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const rawValue = searchParams.get(paramName);
    const currentIndex = rawValue !== null ? parseInt(rawValue, 10) : defaultIndex;

    const setIndex = useCallback((newIndex) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set(paramName, String(newIndex));
            return next;
        }, { replace: true }); // replace:true para no llenar el historial del navegador
    }, [paramName, setSearchParams]);

    return [currentIndex, setIndex];
};

export default useMenuState;