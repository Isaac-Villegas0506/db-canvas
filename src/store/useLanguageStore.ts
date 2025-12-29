import { create } from 'zustand';

type Language = 'es' | 'en';

type Translations = {
    [key in Language]: {
        [key: string]: string;
    }
};

const translations: Translations = {
    es: {
        'toolbar.select': 'Seleccionar (V)',
        'toolbar.hand': 'Mover (H)',
        'toolbar.relation': 'Conectar (C)',
        'toolbar.undo': 'Deshacer',
        'toolbar.redo': 'Rehacer',
        'toolbar.export': 'Exportar SQL',
        'toolbar.save': 'Guardar',
        'sidebar.table': 'Nueva Tabla',
        'sidebar.text': 'Texto',
        'sidebar.note': 'Nota',
        'sidebar.group': 'Grupo',
        'properties.project': 'Configuración del Proyecto',
        'properties.name': 'Nombre del Proyecto',
        'properties.engine': 'Motor de Base de Datos',
        'properties.table': 'Propiedades de Tabla',
        'properties.columns': 'Columnas',
        'properties.add_column': 'Agregar Columna',
        'properties.delete_table': 'Eliminar Tabla',
        'properties.table_name': 'Nombre de Tabla',
        'properties.color': 'Color',
        'properties.content': 'Contenido',
        'properties.font_size': 'Tamaño de Fuente',
        'properties.note': 'Nota',
        'properties.text': 'Texto',
        'properties.relation': 'Relación',
        'properties.source': 'Origen',
        'properties.target': 'Destino',
        'properties.cardinality': 'Cardinalidad',
    },
    en: {
        'toolbar.select': 'Select (V)',
        'toolbar.hand': 'Pan (H)',
        'toolbar.relation': 'Connect (C)',
        'toolbar.undo': 'Undo',
        'toolbar.redo': 'Redo',
        'toolbar.export': 'Export SQL',
        'toolbar.save': 'Save',
        'sidebar.table': 'New Table',
        'sidebar.text': 'Text',
        'sidebar.note': 'Sticky Note',
        'sidebar.group': 'Group',
        'properties.project': 'Project Settings',
        'properties.name': 'Project Name',
        'properties.engine': 'Database Engine',
        'properties.table': 'Table Properties',
        'properties.columns': 'Columns',
        'properties.add_column': 'Add Column',
        'properties.delete_table': 'Delete Table',
        'properties.table_name': 'Table Name',
        'properties.color': 'Color',
        'properties.content': 'Content',
        'properties.font_size': 'Font Size',
        'properties.note': 'Note',
        'properties.text': 'Text',
        'properties.relation': 'Relationship',
        'properties.source': 'Source',
        'properties.target': 'Target',
        'properties.cardinality': 'Cardinality',
    }
};

interface LanguageStore {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
    language: 'es',
    setLanguage: (lang) => set({ language: lang }),
    t: (key) => {
        const lang = get().language;
        return translations[lang][key] || key;
    }
}));
