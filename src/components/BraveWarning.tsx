import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, AlertOctagon, Lock } from 'lucide-react';

export const BraveWarning: React.FC = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
        const detectBrave = async () => {
            if (sessionStorage.getItem('braveWarningDismissed')) {
                return;
            }

            const isBrave = (navigator as any).brave !== undefined;

            if (isBrave) {
                try {
                    const result = await (navigator as any).brave.isBrave();
                    if (result) {
                        setShowWarning(true);
                    }
                } catch {
                    setShowWarning(true);
                }
            }
        };

        detectBrave();
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem('braveWarningDismissed', 'true');
        setTimeout(() => {
            setShowWarning(false);
            setShowOverlay(false);
        }, 300);
    };

    if (!showWarning) return null;

    return (
        <>
            {showOverlay && (
                <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${dismissed ? 'opacity-0' : 'opacity-100'
                        }`}
                />
            )}

            <div
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg z-[101] transition-all duration-300 ${dismissed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
            >
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-white rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25"></div>
                                <div className="relative bg-white rounded-full p-3 text-orange-500">
                                    <ShieldAlert size={32} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <AlertTriangle size={24} className="text-white" /> Acción Requerida
                                </h3>
                                <p className="text-orange-100 text-sm">
                                    Brave Browser detectado
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                                <p className="text-red-800 font-medium flex items-center gap-2">
                                    <AlertOctagon size={20} /> El canvas puede NO funcionar correctamente
                                </p>
                                <p className="text-red-700 text-sm mt-1">
                                    Brave Shields bloquea funciones esenciales de esta aplicación.
                                </p>
                            </div>

                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">?</span>
                                ¿Cómo solucionarlo?
                            </h4>

                            <ol className="space-y-3 mb-6">
                                <li className="flex items-start gap-3">
                                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                                    <span className="text-slate-700">
                                        Haz clic en el <strong className="text-orange-600">icono del león / escudo</strong> en la barra de direcciones (arriba a la derecha)
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                                    <span className="text-slate-700">
                                        Desactiva <strong className="text-orange-600">"Shields"</strong> para este sitio
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                                    <span className="text-slate-700">
                                        La página se <strong className="text-orange-600">recargará automáticamente</strong> y funcionará correctamente
                                    </span>
                                </li>
                            </ol>

                            <div className="bg-slate-50 rounded-lg p-3 mb-6">
                                <p className="text-xs text-slate-500 flex items-start gap-2">
                                    <Lock size={14} />
                                    <span>
                                        <strong>Tu privacidad está segura.</strong> DBCanvas es una aplicación 100% local que no envía datos a ningún servidor.
                                    </span>
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
                                >
                                    ✓ Ya lo desactivé, continuar
                                </button>
                            </div>

                            <button
                                onClick={handleDismiss}
                                className="w-full mt-3 text-slate-400 hover:text-slate-600 text-sm py-2 transition-colors"
                            >
                                Ignorar (puede causar problemas)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
