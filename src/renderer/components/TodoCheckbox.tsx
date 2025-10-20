import React from 'react';
import '../styles/TodoCheckbox.css';

interface TodoCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const TodoCheckbox: React.FC<TodoCheckboxProps> = ({ checked, onChange }) => {
  return (
    <label className="todo-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="todo-checkbox-input"
      />
      <span className="todo-checkbox-custom">
        {checked && (
          <svg viewBox="0 0 24 24" className="todo-checkbox-icon">
            <path
              fill="currentColor"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            />
          </svg>
        )}
      </span>
    </label>
  );
};

export default TodoCheckbox;

