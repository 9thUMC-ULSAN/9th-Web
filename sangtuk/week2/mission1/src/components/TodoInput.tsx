import React from 'react';
import { useTodo } from '../context/TodoContext';

// 할일 입력 컴포넌트
const TodoInput: React.FC = () => {
  const { inputValue, setInputValue, addTodo } = useTodo();

  // Enter 키 입력 시 할일 추가
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-container__form">
      {/* 할일 입력 필드 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="할 일 입력"
        className="todo-container__input"
      />

      {/* 할일 추가 버튼 */}
      <button
        onClick={addTodo}
        className="todo-container__button"
      >
        할 일 추가
      </button>
    </div>
  );
};

export default TodoInput;