import React, { useState, useCallback, useContext } from 'react';
import type { TTodo } from '../types/todo'; // **수정됨: import type 사용**

// 1. Context 타입 정의
interface TodoContextType {
  todos: TTodo[];
  doneTasks: TTodo[];
  addTodo: (text: string) => void;
  completeTask: (task: TTodo) => void;
  deleteTask: (task: TTodo) => void;
}

// 2. Context 객체 생성
const TodoContext = React.createContext<TodoContextType | undefined>(undefined);

// 3. Custom Hook: useTodo (Props Drilling 해결의 핵심)
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    // Provider가 없는 경우 명확한 오류 발생
    throw new Error('useTodo는 반드시 TodoProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

// 4. TodoProvider (상태 및 로직 관리)
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // **수정된 부분:** 초기 목록을 빈 배열([])로 설정했습니다.
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTasks, setDoneTasks] = useState<TTodo[]>([]);

  // TodoBefore.tsx에서 가져온 로직 (useCallback으로 성능 최적화)
  const addTodo = useCallback((text: string) => {
    const newTask: TTodo = { id: Date.now(), text };
    setTodos((prevTodos) => [...prevTodos, newTask]);
  }, []);

  const completeTask = useCallback((taskToComplete: TTodo) => {
    setTodos((prevTodos) =>
      prevTodos.filter((t) => t.id !== taskToComplete.id)
    );
    setDoneTasks((prevDoneTasks) => [...prevDoneTasks, taskToComplete]);
  }, []);

  const deleteTask = useCallback((taskToDelete: TTodo) => {
    setDoneTasks((prevDoneTasks) =>
      prevDoneTasks.filter((t) => t.id !== taskToDelete.id)
    );
  }, []);

  const contextValue = { todos, doneTasks, addTodo, completeTask, deleteTask };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};
