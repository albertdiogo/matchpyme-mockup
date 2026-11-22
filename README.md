# MatchPyME – Mockup interactivo

Prototipo navegable de **MatchPyME**, plataforma web que conecta a estudiantes que buscan su práctica profesional con Pymes, mostrando un porcentaje de compatibilidad entre el perfil del estudiante y cada oferta.

Proyecto del curso **Ingeniería del Software I (PTEC105)**, Universidad Andrés Bello. Grupo 7: Sebastián Abarca, Albert Arellano, Christian Cerda y Gabriel Menares.

> Prototipo académico de frontend. Todos los datos son ficticios y no hay servidor ni base de datos: el estado vive en la pestaña del navegador y se reinicia al recargar la página o al presionar «Reiniciar demo».

## Pantallas

| ID | Pantalla | Caso de uso |
|---|---|---|
| MK-01 | Iniciar sesión | CU-02 |
| MK-02 | Registrar cuenta | CU-01 |
| MK-03 | Publicar oferta de práctica | CU-05 |
| MK-04 | Explorar ofertas | CU-06, CU-07, CU-08 |
| MK-05 | Detalle de oferta y postular | CU-09, CU-13 |
| MK-06 | Mis postulaciones | CU-10, CU-14 |
| MK-07 | Revisar postulantes | CU-11, CU-07, CU-14 |
| MK-08 | Actualizar estado de postulación | CU-12, CU-13 |

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Estudiante | camila.rojas@mail.com | Practica2026 |
| Pyme | contacto@andesdigital.cl | Pyme2026 |

## Recorrido sugerido

1. Ingresar como **Pyme** y publicar una oferta (MK-03).
2. Cerrar sesión, ingresar como **estudiante**, explorar ofertas (MK-04) y postular a «Desarrollador/a Frontend Jr.» (MK-05).
3. Cerrar sesión, ingresar como **Pyme**, revisar la notificación y los postulantes (MK-07) y aceptar la postulación de Camila Rojas (MK-08).
4. Cerrar sesión, ingresar como **estudiante** y revisar el resultado en «Mis postulaciones» (MK-06).

No recargues la página durante el recorrido: los cambios se mantienen solo mientras la pestaña esté abierta.

## Cálculo de compatibilidad (RN-07)

`js/compatibilidad.js` implementa la fórmula:

- 40 % × (habilidades coincidentes / habilidades requeridas)
- \+ 35 % si la disponibilidad coincide con el horario de la oferta
- \+ 25 % si la modalidad preferida coincide con la de la oferta

Pruebas unitarias del caso CP-03 (requiere Node.js):

```bash
node tests/compatibilidad.test.js
```

## Publicar con GitHub Pages

1. Sube el contenido de esta carpeta a un repositorio de GitHub (por ejemplo, `matchpyme-mockup`).
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
3. En uno o dos minutos el sitio queda disponible en `https://<tu-usuario>.github.io/matchpyme-mockup/`.

## Estructura

```
index.html                 Punto de entrada
styles.css                 Estilos
js/compatibilidad.js       Cálculo de compatibilidad (RN-07)
js/app.js                  Pantallas, navegación y datos simulados
tests/compatibilidad.test.js  Pruebas unitarias (CP-03)
```
