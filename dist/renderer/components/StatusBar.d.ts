import React from 'react';
import { Note, EditorStats } from '../../shared/types';
import '../styles/StatusBar.css';
interface StatusBarProps {
    stats: EditorStats;
    currentNote: Note | null;
    theme: 'light' | 'dark';
}
declare const StatusBar: React.FC<StatusBarProps>;
export default StatusBar;
//# sourceMappingURL=StatusBar.d.ts.map