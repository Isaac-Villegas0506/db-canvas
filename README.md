<div align="center">

# 🎨 DBCanvas Studio

### Visual Database Schema Designer

[![Made by Isaac Villegas](https://img.shields.io/badge/Made%20by-Isaac%20Villegas%20Dev-blueviolet?style=for-the-badge)](https://github.com/Isaac-Villegas0506)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br />

**Una aplicación web profesional para diseñar esquemas de bases de datos de forma visual e intuitiva.**

Arrastra, conecta y genera SQL automáticamente. Inspirado en la experiencia de Excalidraw y Figma.

[🚀 Demo en Vivo](#) • [📖 Documentación](#-arquitectura) • [💼 Sobre el Autor](#-autor)

<br />

<img src="https://raw.githubusercontent.com/isaacvillegasdev/dbcanvas/main/preview.gif" alt="DBCanvas Preview" width="800" />

</div>

---

## 🎯 ¿Por qué este proyecto?

Este proyecto demuestra competencias **senior-level** en desarrollo frontend:

| Competencia | Implementación |
|-------------|----------------|
| **Arquitectura Escalable** | Separación clara entre Canvas Engine, State Management y UI Layer |
| **State Management Avanzado** | Zustand con middleware `persist` para datos y stores separados para UI |
| **Canvas Rendering** | Motor gráfico optimizado con Konva.js para 60 FPS |
| **TypeScript Estricto** | Tipado completo en todo el proyecto |
| **UX/UI Profesional** | Diseño moderno con micro-interacciones y feedback visual |
| **Persistencia Local** | Auto-guardado con LocalStorage |

---

## ✨ Características

### 🖼️ Canvas Interactivo
- **Infinite Canvas** con zoom (scroll) y pan (arrastrar con mano)
- **Grid dinámico** que escala con el nivel de zoom
- **Drag & Drop** desde sidebar al canvas
- **Borrado rápido** con teclas `Delete` o `Backspace`

### 📊 Diseño de Base de Datos
- **Tablas** con columnas, tipos de datos y constraints (PK, FK, NULL, UNIQUE)
- **Relaciones** visuales (1:1, 1:N, N:1, N:M) con líneas bezier
- **Generación SQL** automática (MySQL, PostgreSQL, SQLite)
- **Panel de propiedades** para edición detallada

### 📝 Elementos Adicionales
- **Notas adhesivas** para documentación
- **Elementos de texto** personalizables
- **Colores personalizados** por elemento

### ⌨️ Atajos de Teclado
| Atajo | Acción |
|-------|--------|
| `Delete` / `Backspace` | Borrar selección |
| `Ctrl + Z` | Deshacer |
| `Ctrl + Y` | Rehacer |
| `Scroll` | Zoom in/out |

### 💾 Persistencia
- **Auto-guardado** automático en LocalStorage
- Los proyectos sobreviven al recargar la página
- Sin necesidad de backend

---

## 🏗️ Arquitectura

```
📦 src/
├── 🎨 canvas/           # Motor gráfico (Stage, Grid, renderizado)
│   ├── CanvasStage.tsx  # Orquestador principal del canvas
│   └── CanvasGrid.tsx   # Grid infinito con cálculos matemáticos
│
├── 🧩 nodes/            # Componentes visuales del canvas
│   ├── TableNode.tsx    # Nodo de tabla con columnas y puertos
│   ├── NoteNode.tsx     # Nota adhesiva
│   └── TextNode.tsx     # Elemento de texto
│
├── 📦 store/            # Gestión de estado (Zustand)
│   ├── useSchemaStore   # Estado del proyecto (tablas, relaciones)
│   ├── uiStore          # Estado de UI (herramientas, selección)
│   └── historyStore     # Undo/Redo stack
│
├── 🖥️ ui/               # Componentes de interfaz HTML
│   ├── Toolbar.tsx      # Barra de herramientas superior
│   ├── Sidebar.tsx      # Panel lateral de elementos
│   └── PropertiesPanel  # Editor de propiedades
│
├── 🔧 utils/            # Utilidades
│   └── sqlGenerator.ts  # Generador de SQL
│
└── 📐 types/            # Definiciones TypeScript
    └── schema.ts        # Tipos del dominio
```

### Patrones Implementados

- **Single Source of Truth**: Todo el estado vive en stores de Zustand
- **Separation of Concerns**: Canvas rendering vs UI vs State
- **Composition over Inheritance**: Componentes pequeños y reutilizables
- **Optimistic UI**: Respuesta instantánea en cada interacción

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Justificación |
|-----------|------------|---------------|
| **Framework** | React 18 | Concurrent features, hooks avanzados |
| **Lenguaje** | TypeScript 5.6 | Tipado estricto, mejor DX |
| **Canvas** | Konva.js + React-Konva | Rendering imperativo con sintaxis declarativa |
| **Estado** | Zustand + persist | Atómico, performante, persistencia integrada |
| **Estilos** | TailwindCSS | Utility-first, desarrollo rápido |
| **Iconos** | Lucide React | Consistentes, ligeros, tree-shakeable |
| **Build** | Vite 6 | HMR instantáneo, builds optimizados |

---

## 🚀 Quick Start

```bash
# 1. Clonar el repositorio
git clone https://github.com/Isaac-Villegas0506/dbcanvas.git

# 2. Instalar dependencias
cd dbcanvas
npm install

# 3. Iniciar desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

---

## 📸 Capturas

<div align="center">

| Diseño de Tablas | Conexión de Relaciones |
|------------------|------------------------|
| ![Tables](docs/tables.png) | ![Relations](docs/relations.png) |

| Panel de Propiedades | Generación SQL |
|----------------------|----------------|
| ![Properties](docs/properties.png) | ![SQL](docs/sql.png) |

</div>

---

## 🗺️ Roadmap

- [x] Motor de Canvas (Zoom/Pan/Grid infinito)
- [x] Drag & Drop de elementos
- [x] Sistema de nodos (Tablas, Notas, Texto)
- [x] Conexiones visuales entre columnas
- [x] Panel de propiedades dinámico
- [x] Generación de SQL (MySQL, PostgreSQL, SQLite)
- [x] Historial Undo/Redo
- [x] Persistencia en LocalStorage
- [x] Borrado con teclado (Delete/Backspace)
- [x] Paneles colapsables (Toolbar/Sidebar)
- [ ] Exportación a imagen (PNG/SVG)
- [ ] Importación desde SQL existente
- [ ] Temas (Dark mode)
- [ ] Colaboración en tiempo real

---

## 👨‍💻 Autor

<div align="center">

### Isaac Villegas Dev

[![GitHub](https://img.shields.io/badge/GitHub-isaacvillegasdev-181717?style=for-the-badge&logo=github)](https://github.com/Isaac-Villegas0506)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Isaac%20Villegas-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/isaacvillegasdev)
[![Portfolio](https://img.shields.io/badge/Portfolio-Ver%20Proyectos-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://isaacvillegasdev.com)

**Desarrollador Web Full Stack** especializado en React, TypeScript y arquitecturas frontend escalables.

*"El código limpio es mi pasión, la experiencia de usuario mi obsesión."*

</div>

---

## 📄 Licencia

```
MIT License

Copyright (c) 2024 Isaac Villegas Dev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

**⭐ Si este proyecto te parece útil, ¡dale una estrella!**

Hecho con ❤️ por **Isaac Villegas Dev**

</div>
