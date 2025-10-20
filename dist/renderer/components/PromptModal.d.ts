import React from 'react';
import '../styles/Modal.css';
interface PromptModalProps {
    title: string;
    placeholder?: string;
    defaultValue?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}
declare const PromptModal: React.FC<PromptModalProps>;
export default PromptModal;
//# sourceMappingURL=PromptModal.d.ts.map