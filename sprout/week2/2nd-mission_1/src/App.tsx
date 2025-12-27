import React, { useState } from 'react';
import type { TTodo } from './types/todo';
import { useTodo } from './context/TodoContext'; // useTodo 훅만 import

// ======================================================
// 4. 컴포넌트: TodoItem (Props Drilling 없이 Context 사용)
// ======================================================
interface TodoItemProps {
  task: TTodo;
  isDone: boolean;
}

const TodoItem: React.FC<TodoItemProps> = React.memo(({ task, isDone }) => {
  // Context에서 함수 직접 가져옴 (Props Drilling 해결)
  const { completeTask, deleteTask } = useTodo();

  const buttonText = isDone ? '삭제' : '완료';

  // index.css의 색상과 클래스명 사용
  const buttonStyle = {
    backgroundColor: isDone ? '#dc3545' : '#28a745', // 삭제(빨강) vs 완료(초록)
  };

  const actionHandler = isDone ? deleteTask : completeTask;

  return (
    // index.css의 클래스명 사용
    <li className="render-container__item">
      <span className="render-container__item-text">{task.text}</span>
      <button
        onClick={() => actionHandler(task)}
        className="render-container__item-button"
        style={buttonStyle} // 동적 색상 적용
      >
        {buttonText}
      </button>
    </li>
  );
});

// ======================================================
// 5. 컴포넌트: ListSection (Props Drilling 없이 Context 사용)
// ======================================================
interface ListSectionProps {
  title: string;
  isDoneList: boolean;
}

const ListSection: React.FC<ListSectionProps> = ({ title, isDoneList }) => {
  // Context에서 상태 직접 가져옴 (Props Drilling 해결)
  const { todos, doneTasks } = useTodo();
  const tasks = isDoneList ? doneTasks : todos;

  return (
    // index.css의 클래스명 사용
    <section className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {/* tasks.length > 0 조건이 참일 때만 목록을 렌더링하고,
             거짓일 때는 아무것도 렌더링하지 않습니다. */}
        {tasks.length > 0 &&
          tasks.map((task) => (
            <TodoItem key={task.id} task={task} isDone={isDoneList} />
          ))}
      </ul>
    </section>
  );
};

// ======================================================
// 6. 컴포넌트: TodoForm (Props Drilling 없이 Context 사용)
// ======================================================
const TodoForm: React.FC = () => {
  const [newTodoText, setNewTodoText] = useState('');
  // Context에서 함수 직접 가져옴 (Props Drilling 해결)
  const { addTodo } = useTodo();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = newTodoText.trim();
    if (text) {
      addTodo(text);
      setNewTodoText('');
    }
  };

  return (
    // index.css의 클래스명 사용
    <form onSubmit={handleSubmit} className="todo-container__form">
      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="할 일 입력"
        className="todo-container__input"
        required
      />
      <button
        type="submit"
        // disabled={!newTodoText.trim()} <- 버튼 비활성화는 유지
        className="todo-container__button"
        style={{ backgroundColor: '#28a745' }} // **항상 초록색으로 설정**
      >
        할 일 추가
      </button>
    </form>
  );
};

// ======================================================
// 7. App 컴포넌트 (최종 UI 레이아웃)
// ======================================================
function App() {
  return (
    // index.css의 클래스명 사용
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>

      <TodoForm />

      <div className="render-container">
        <ListSection title="할 일" isDoneList={false} />

        <ListSection title="완료" isDoneList={true} />
      </div>
    </div>
  );
}

export default App;
