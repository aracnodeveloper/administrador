# Módulo "Suscripciones por vencer" — parte backend (API PHP)

Estos archivos **no** pertenecen al proyecto React; van en el repositorio del **API**
(donde viven `listarSuscripciones.php` y `administrador/suscripcionesClass.php`).
Se dejan aquí solo para que los copies a su sitio.

## 1. `AdminSuscripciones_listarPorVencer.php`
Contiene el método `listarPorVencer($post)`.

**Qué hacer:** copiar SOLO la función `listarPorVencer(...) { ... }` (sin la etiqueta
`<?php` ni el comentario de cabecera) y pegarla **dentro de la clase
`AdminSuscripciones`**, en `administrador/suscripcionesClass.php`, junto al método
`listarSuscripciones()`.

## 2. `listarSuscripcionesPorVencer.php`
Es el endpoint, espejo de `listarSuscripciones.php`.

**Qué hacer:** copiarlo en la **misma carpeta** donde está `listarSuscripciones.php`
(la ruta que el front llama como `/adm/sus/...`). El front ya apunta a
`/adm/sus/listarSuscripcionesPorVencer/`.

## Por qué la fecha de caducidad ahora es correcta
- La caducidad real se toma de la renovación con la `fecha_fin` **más lejana y vigente**
  (no anulada=4, no bloqueada=8), no de la del id más alto. Eso evita el desfase que
  veíamos cuando se apilaban renovaciones.
- Se descartan fechas nulas y `'0000-00-00'`.
- El rango "le falta 1 mes" se calcula en SQL con `CURDATE()` (no depende de la zona
  horaria de PHP).

## Parámetros del endpoint
| Parámetro        | Req. | Default | Descripción                                                |
|------------------|------|---------|------------------------------------------------------------|
| `token`          | sí   | —       | Token de sesión (igual que los demás endpoints).           |
| `pagina`         | sí   | —       | Página (1-based).                                          |
| `cantidad`       | no   | 20000   | Filas por página.                                          |
| `dias`           | no   | 30      | Ventana hacia adelante (días para caducar).                |
| `dias_vencidas`  | no   | 30      | Ventana hacia atrás (ya vencidas). `0` = no incluir.       |
| `ci_cliente`     | no   | —       | Filtro por cédula/RUC.                                     |
| `nombre_cliente` | no   | —       | Filtro por nombre del cliente.                            |
| `cod_cliente`    | no   | —       | Filtro por usuario/email del cliente.                     |
| `cod_vendedor`   | no   | —       | Filtro por usuario/email del vendedor.                    |
| `nombre_vendedor`| no   | —       | Filtro por nombre del vendedor.                           |

Cada fila devuelve además `dias_restantes` (DATEDIFF con la caducidad real): negativo = ya vencida.
