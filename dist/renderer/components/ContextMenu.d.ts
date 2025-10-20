import React from 'react';
import '../styles/ContextMenu.css';
interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onAction: (action: string) => void;
}
declare const ContextMenu: React.FC<ContextMenuProps>;
export default ContextMenu;
//# sourceMappingURL=ContextMenu.d.ts.map