import React from 'react';
import { Note, EditorStats } from '../../shared/types';
import '../styles/Preview.css';
import 'highlight.js/styles/github-dark.css';
interface PreviewProps {
    content: string;
    stats: EditorStats;
    note: Note;
    onContentChange?: (newContent: string) => void;
}
declare const Preview: React.FC<PreviewProps>;
export default Preview;
//# sourceMappingURL=Preview.d.ts.map