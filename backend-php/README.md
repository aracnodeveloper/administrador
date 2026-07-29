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

## 3. `AdminSuscripciones_listarSuscripciones.php`
Reemplazo completo del método `listarSuscripciones($post)` (el que ya existe en
`administrador/suscripcionesClass.php`), con los mismos campos de contacto que
`listarPorVencer()`: `email`, `telefono` y `ciudad`.

**Qué hacer:** reemplazar el método `listarSuscripciones(...) { ... }` completo dentro
de la clase `AdminSuscripciones` por el de este archivo (sin la etiqueta `<?php` ni el
comentario de cabecera). No toca la rama que busca por `id_tbl_usuario`
(`buscarUsuarioDetalle`), esa ya trae sus propios contactos desde `UsuarioClass`.

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

Cada fila también trae `email` (tipo de contacto 1) y `telefono` del cliente, tomados de `tbl_contacto_directorio` vía `tbl_directorio`. El teléfono prioriza WhatsApp (14), luego Celular Personal (4), Celular Trabajo (3) y Telefono (2) — el primero que exista. Pensado para alimentar la creación de leads en RIS/RISE sin pegar a otro endpoint.

También trae `ciudad` (`tbl_lugar.desc_lugar`, unido por `tbl_directorio.id_tbl_lugar`).

`listarSuscripciones` (listado general, no solo por vencer) devuelve los mismos tres campos —
`email`, `telefono`, `ciudad` — con el mismo criterio, una vez aplicado el reemplazo del punto 3.
