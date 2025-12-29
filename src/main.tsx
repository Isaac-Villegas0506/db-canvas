/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   🎨 DBCanvas Studio v1.0.0                                   ║
 * ║   Visual Database Schema Designer                             ║
 * ║                                                               ║
 * ║   Desarrollado por: Isaac Villegas Dev                        ║
 * ║   GitHub: https://github.com/Isaac-Villegas0506                 ║
 * ║   Licencia: MIT                                               ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log(
    '%c🎨 DBCanvas Studio %cv1.0.0\n%cDesarrollado por Isaac Villegas Dev',
    'color: #3b82f6; font-size: 20px; font-weight: bold;',
    'color: #10b981; font-size: 14px;',
    'color: #64748b; font-size: 12px;'
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
