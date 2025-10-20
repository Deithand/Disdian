import React from 'react';
import '../styles/Toolbar.css';
interface ToolbarProps {
    onNewNote: () => void;
    onTogglePreview: () => void;
    onToggleSidebar: () => void;
    onOpenSettings: () => void;
    onSearch: () => void;
    showPreview: boolean;
    showSidebar: boolean;
}
declare const Toolbar: React.FC<ToolbarProps>;
export default Toolbar;
//# sourceMappingURL=Toolbar.d.ts.map