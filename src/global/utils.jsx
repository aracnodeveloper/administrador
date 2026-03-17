import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function verificarPermiso(id) {
    var permisos = JSON.parse(localStorage.getItem('permisos'))
    if (permisos != null) {
        return permisos.some(obj => obj.id_tbl_permiso === String(id));
    } else {
        return false;
    }
}


export function formatDate(date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export function cx(...args) {
    return twMerge(clsx(...args));
}

export function capitalize(text) {
    if (typeof text !== 'string') return text;

    return text
        .toLowerCase() // Primero convierte todo el texto a minúsculas
        .split(' ') // Divide el texto en palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
        .join(' '); // Une las palabras nuevamente con espacios
}
