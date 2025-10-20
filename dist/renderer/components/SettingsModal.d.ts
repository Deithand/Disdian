import React from 'react';
import { AppSettings } from '../../shared/types';
import '../styles/Modal.css';
interface SettingsModalProps {
    settings: AppSettings;
    onClose: () => void;
    onSave: (settings: AppSettings) => void;
}
declare const SettingsModal: React.FC<SettingsModalProps>;
export default SettingsModal;
//# sourceMappingURL=SettingsModal.d.ts.map