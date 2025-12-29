import { CanvasStage } from './canvas/CanvasStage';
import { Toolbar } from './ui/Toolbar';
import { Sidebar } from './ui/Sidebar';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { BraveWarning } from './components/BraveWarning';
import { AuthorBadge } from './components/AuthorBadge';

function App() {
    return (
        <div className="w-screen h-screen relative overflow-hidden bg-slate-50">
            <Toolbar />
            <Sidebar />
            <PropertiesPanel />
            <CanvasStage />
            <BraveWarning />
            <AuthorBadge />
        </div>
    );
}

export default App;
