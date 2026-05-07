<div align="center">

# TallerApp — Frontend

**Sistema web de gestión para taller de reparación de celulares**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![CSS](https://img.shields.io/badge/CSS-Design%20System-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)](LICENSE)

> Proyecto académico — Gestión y Configuración del Software · Universidad de Guayaquil

</div>

---

## Descripción

TallerApp es una SPA (Single Page Application) desarrollada en React que digitaliza la gestión del taller de Juan, eliminando el uso de cuadernos y planillas manuales. Permite a administradores, técnicos y clientes interactuar con el sistema desde un navegador web.

El diseño usa un sistema CSS propio con variables de diseño (tokens), sin frameworks de utilidades. Paleta principal: azul oscuro `#0f1d3f` + naranja `#ff6a1a`.

---

## Módulos

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| Autenticación | Login, registro, recuperación de contraseña, roles | Pendiente |
| Reparaciones | Recepción, diagnóstico, seguimiento, entrega | Pendiente |
| Inventario | Repuestos, stock, alertas de stock mínimo | Pendiente |
| Facturación | Generación y descarga de facturas en PDF | Pendiente |
| Reportes | Reparaciones, ingresos e inventario por período | Pendiente |

---

## Actores del Sistema

```
+-----------------+    +-----------------+
| Administrador   |    |    Tecnico      |
| Acceso total    |    |  Reparaciones   |
| + Reportes      |    |  + Inventario   |
+-----------------+    +-----------------+

+-----------------+    +-----------------+
| Cliente Regist. |    | Cliente Invitado|
| Historial propio|    | Solo busqueda   |
| completo        |    | por codigo      |
+-----------------+    +-----------------+
```

---

## Arquitectura de Carpetas

```
Frontend/
├── public/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   └── ui/             # Botones, inputs, modales
│   ├── pages/              # Vistas por rol
│   │   ├── admin/
│   │   ├── tecnico/
│   │   └── cliente/
│   ├── services/           # Llamadas a la API (axios)
│   ├── context/            # Estado global (AuthContext)
│   ├── routes/             # PrivateRoute, RoleGuard
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Instalación y Uso

### Prerrequisitos

- Node.js 20.x o superior
- npm 10.x o superior
- Backend de TallerApp corriendo en `localhost:3000`

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/tallerapp-frontend.git
cd tallerapp-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# 4. Iniciar servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Variables de Entorno

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Flujo de Ramas

```
main          <- Solo version estable y lista para produccion
 └── develop  <- Integracion de todas las features
      ├── feature/auth
      ├── feature/reparaciones
      ├── feature/inventario
      ├── feature/facturacion
      └── feature/reportes
```

### Convención de Commits

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
style:    Cambios de UI/CSS
refactor: Reestructura de código
chore:    Configuración, dependencias
```

---

## Repositorio Backend

Este frontend consume la API REST de:
[TallerApp — Backend](https://github.com/tu-usuario/tallerapp-backend)

---

## Equipo

Desarrollado por estudiantes de la **Universidad de Guayaquil**
Asignatura: Gestión y Configuración del Software
