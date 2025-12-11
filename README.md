# 🏥 Frontend – Sistema de Gestión para Guardia Médica

Este es el frontend del sistema de gestión para una guardia médica, desarrollado como parte del proyecto final de la materia Ingeniería de Software.
Construido con React, este cliente web permite a enfermeros y médicos interactuar con el backend del sistema para registrar pacientes, gestionar ingresos y visualizar información clínica.

## ✨ Características

- Interfaz intuitiva y moderna.

- Gestión de pacientes e ingresos.

- Validaciones con React Hook Form.

- Autenticación mediante JWT (decodificado con jwt-decode).

- Rutas protegidas basadas en rol (enfermero / médico).

- Gráficos dinámicos usando Chart.js + react-chartjs-2.

- Estilos con Bootstrap, React-Bootstrap y Styled-components.

- Alertas y diálogos con SweetAlert2.

- Consumo de API vía Axios.

## 🛠️ Tecnologías utilizadas

- React 18

- React Router DOM

- React Hook Form

- Axios

- Styled-components

- Bootstrap / React-Bootstrap
- Gráficos

- Chart.js

- react-chartjs-2

- Utilidades

- SweetAlert2

- jwt-decode


🚀 Instalación y ejecución
1.  Clonar el repositorio:
```bash
  git clone https://github.com/mauroarmas/IS-GuardiaTFI-Frontend
```

2. Instalar dependencias
```bash
  npm install
```


3. Configurar variables de entorno

Crear un archivo .env en la raíz:

VITE_BACKEND_URL=http://localhost:3000

4. Ejecutar el proyecto en desarrollo
```bash
npm run dev
```

5. Generar build de producción
```bash
npm run build
```

## 🔐 Autenticación y roles

El usuario inicia sesión → recibe un JWT.

El frontend lo decodifica con jwt-decode para obtener:

- rol
- email
- expiración

- id de progesional

Rutas protegidas verifican el rol antes de permitir acceso.

## 📊 Gráficos y estadísticas

Se incluye visualización de datos con Chart.js para representar:

- Distribución de triages en espera

## 📸 Capturas 

  <img width="500" height="350" alt="1" src="https://github.com/user-attachments/assets/4dbfb423-b012-426c-ba90-9a14977829f2" />
  <img width="500" height="350" alt="2" src="https://github.com/user-attachments/assets/dec18f69-dfdc-432a-8d34-4804f583ed6e" />
  <img width="500" height="350" alt="3" src="https://github.com/user-attachments/assets/e7a74f8a-4d50-4e2a-8265-57094b75bff9" />
  <img width="500" height="350" alt="Captura de pantalla 2025-12-11 101954" src="https://github.com/user-attachments/assets/90bfb8a7-0d5a-41e4-9494-700340c1da44" />




## 🤝 Contribuciones

Las contribuciones, issues y PRs son bienvenidos.

## 👤 Autor

Mauro Armas

Proyecto final – Ingeniería de Software

