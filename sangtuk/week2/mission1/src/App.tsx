import React from 'react';
import { TodoProvider } from './context/TodoContext';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';


// 메인 App 컴포넌트 - 전체 애플리케이션의 루트
const App: React.FC = () => {
  return (
    <div className="App">
      <TodoProvider>
        <div className="todo-container">
          {/* 헤더 영역 */}
          <h1 className="todo-container__header">YONG TODO</h1>

          {/* 할일 입력 섹션 */}
          <TodoInput />

          {/* 할일 목록 표시 */}
          <TodoList />
        </div>
      </TodoProvider>
    </div>
  );
};

export default App;
