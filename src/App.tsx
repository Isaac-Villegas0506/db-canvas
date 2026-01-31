import { useEffect } from 'react';
import { CanvasStage } from './canvas/CanvasStage';
import { Toolbar } from './ui/Toolbar';
import { Sidebar } from './ui/Sidebar';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { ImportSQLModal } from './ui/ImportSQLModal';
import { SQLEditorPanel } from './ui/SQLEditorPanel';
import { BraveWarning } from './components/BraveWarning';
import { AuthorBadge } from './components/AuthorBadge';
import { useThemeStore } from './store/themeStore';

function App() {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    return (
        <div className="w-screen h-screen relative overflow-hidden bg-canvas-bg transition-colors duration-200">
            <Toolbar />
            <Sidebar />
            <PropertiesPanel />
            <ImportSQLModal />
            <SQLEditorPanel />
            <CanvasStage />
            <BraveWarning />
            <AuthorBadge />
        </div>
    );
}

export default App;
