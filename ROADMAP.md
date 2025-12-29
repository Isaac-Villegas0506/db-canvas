# 🗺️ DBCanvas - Roadmap de Funcionalidades

## 📊 Estado Actual
- ✅ Canvas interactivo con Konva.js
- ✅ Creación de tablas, notas y textos
- ✅ Relaciones entre tablas
- ✅ Exportación a SQL
- ✅ Undo/Redo con atajos de teclado
- ✅ Detección de Brave Browser
- ✅ Zoom y pan del canvas
- ✅ Soporte multi-idioma (ES/EN)

---

## 🚀 Funcionalidades Prioritarias (MVP+)

### 1. 💾 Persistencia de Datos
- [ ] **Guardar proyecto en LocalStorage** - Auto-guardado cada 30 segundos
- [ ] **Exportar/Importar proyecto** como archivo JSON
- [ ] **Múltiples proyectos** - Lista de proyectos guardados
- [ ] **Sincronización con la nube** (opcional) - Google Drive, Dropbox

### 2. 🎨 Mejoras Visuales
- [ ] **Temas de color** - Modo oscuro, modo claro, personalizados
- [ ] **Colores personalizados** para tablas y notas
- [ ] **Iconos para columnas** según tipo de dato
- [ ] **Minimap** - Vista general del canvas en esquina
- [ ] **Grid configurable** - Tamaño, visibilidad, snap-to-grid

### 3. 📝 Edición Avanzada de Tablas
- [ ] **Arrastrar columnas** para reordenar
- [ ] **Copiar/Pegar tablas** (Ctrl+C, Ctrl+V)
- [ ] **Duplicar elementos** con un clic
- [ ] **Búsqueda de tablas/columnas** - Ctrl+F
- [ ] **Valores por defecto** para columnas
- [ ] **Comentarios/Descripciones** para tablas y columnas
- [ ] **Índices** - Definir índices simples y compuestos

### 4. 🔗 Relaciones Mejoradas
- [ ] **Tipos de relación visual** - 1:1, 1:N, N:M con iconos
- [ ] **Líneas curvas** para relaciones (estilo Figma)
- [ ] **Puntos de conexión múltiples** en cada tabla
- [ ] **Etiquetas en relaciones** - Mostrar nombre FK
- [ ] **auto-layout** - Organizar tablas automáticamente

---

## 🎯 Funcionalidades Intermedias

### 5. 📤 Exportación Avanzada
- [ ] **Exportar a múltiples dialectos SQL** - MySQL, PostgreSQL, SQLite, SQL Server, Oracle
- [ ] **Exportar como imagen** - PNG, SVG, PDF
- [ ] **Exportar diagrama ERD** - Formato estándar
- [ ] **Generar migraciones** - Laravel, Django, Prisma
- [ ] **Generar modelos ORM** - Eloquent, Sequelize, TypeORM

### 6. 📥 Importación
- [ ] **Importar desde SQL** - Crear diagrama desde script SQL existente
- [ ] **Importar desde base de datos** - Conectar a DB y generar diagrama
- [ ] **Importar desde JSON Schema**
- [ ] **Importar desde otros formatos** - dbdiagram.io, DrawSQL

### 7. 🛠️ Herramientas de Canvas
- [ ] **Selección múltiple** - Shift+Click o área de selección
- [ ] **Agrupación de elementos** - Crear grupos
- [ ] **Alineación automática** - Alinear elementos seleccionados
- [ ] **Distribución uniforme** - Espaciar elementos
- [ ] **Capas/Layers** - Enviar al frente/fondo
- [ ] **Bloquear elementos** - Prevenir movimiento accidental

### 8. 📐 Plantillas y Snippets
- [ ] **Plantillas predefinidas** - E-commerce, Blog, SaaS, etc.
- [ ] **Tabla rápida** - Crear tabla con columnas comunes (id, timestamps)
- [ ] **Snippets de columnas** - Columnas comunes pre-configuradas

---

## 🌟 Funcionalidades Avanzadas (Futuro)

### 9. 👥 Colaboración
- [ ] **Modo colaborativo en tiempo real** - WebSockets
- [ ] **Comentarios en elementos** 
- [ ] **Historial de cambios** con autor
- [ ] **Compartir proyecto** con link público

### 10. 🤖 Inteligencia Artificial
- [ ] **Generar esquema con AI** - Describir en texto, generar tablas
- [ ] **Sugerencias de normalización** 
- [ ] **Detectar problemas de diseño**
- [ ] **Generar datos de prueba** con AI

### 11. 📱 Accesibilidad y UX
- [ ] **Atajos de teclado completos** - Documentados
- [ ] **Tutorial interactivo** para nuevos usuarios
- [ ] **Modo presentación** - Ocultar UI, solo mostrar diagrama
- [ ] **Responsive** - Funcionar en tablets
- [ ] **PWA** - Instalar como app de escritorio

### 12. 🔌 Integraciones
- [ ] **VS Code Extension** - Abrir DBCanvas en el editor
- [ ] **CLI Tool** - Generar SQL desde terminal
- [ ] **API REST** - Para automatización
- [ ] **Webhooks** - Notificar cambios

---

## 🐛 Mejoras Técnicas

### Performance
- [ ] **Renderizado virtual** para muchas tablas (>100)
- [ ] **Lazy loading** de elementos fuera del viewport
- [ ] **Optimización de re-renders** con React.memo

### Código
- [ ] **Tests unitarios** - Jest + React Testing Library
- [ ] **Tests E2E** - Playwright o Cypress
- [ ] **Storybook** para componentes
- [ ] **Documentación técnica** completa

---

## 📋 Prioridad Sugerida

| Prioridad | Funcionalidad | Impacto | Esfuerzo |
|-----------|---------------|---------|----------|
| 🔴 Alta | Guardar en LocalStorage | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 🔴 Alta | Exportar/Importar JSON | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 🔴 Alta | Copiar/Pegar elementos | ⭐⭐⭐⭐ | ⭐⭐ |
| 🟠 Media | Modo oscuro | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 🟠 Media | Exportar como imagen | ⭐⭐⭐⭐ | ⭐⭐ |
| 🟠 Media | Selección múltiple | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 🟡 Baja | Importar desde SQL | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 🟡 Baja | Plantillas | ⭐⭐⭐ | ⭐⭐⭐ |
| 🟢 Futuro | Colaboración real-time | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 🟢 Futuro | AI Features | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 💡 Ideas Adicionales de la Comunidad

_Espacio para agregar sugerencias de usuarios_

1. ...
2. ...
3. ...

---

## 📅 Changelog

### v0.1.0 (Actual)
- Canvas básico con tablas, notas y textos
- Relaciones simples entre tablas
- Exportación SQL básica
- Sistema de undo/redo
- Soporte Español/Inglés
