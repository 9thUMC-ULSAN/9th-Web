import React from 'react';

// Todo 아이템의 타입 정의
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// TodoItem 컴포넌트의 props 타입 정의
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// 개별 할일 아이템을 표시하는 컴포넌트
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <li>
      <div className="render-container__item">
        {/* 할일 제목 */}
        <span className="render-container__item-text">
          {todo.text}
        </span>

        {/* 완료/삭제 버튼 */}
        <div className="todo-buttons">
          {/* 미완료 상태일 때는 '완료' 버튼만 표시 */}
          {!todo.completed && (
            <button
              onClick={() => onToggle(todo.id)}
              className="render-container__item-button complete"
            >
              완료
            </button>
          )}

          {/* 완료된 상태일 때는 '삭제' 버튼만 표시 */}
          {todo.completed && (
            <button
              onClick={() => onDelete(todo.id)}
              className="render-container__item-button"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;