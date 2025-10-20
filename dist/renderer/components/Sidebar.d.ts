import React from 'react';
import { FileTreeItem } from '../../shared/types';
import '../styles/Sidebar.css';
interface SidebarProps {
    fileTree: FileTreeItem[];
    currentNotePath?: string;
    onNoteSelect: (path: string) => void;
    onNoteDelete: (path: string) => void;
    onCreateFolder: (parentPath: string) => void;
    onRefresh: () => void;
}
declare const Sidebar: React.FC<SidebarProps>;
export default Sidebar;
//# sourceMappingURL=Sidebar.d.ts.map