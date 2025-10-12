import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import './App.css'

type Task = {
  id: number
  text: string
}

type Theme = 'light' | 'dark'

function App() {
  const [input, setInput] = useState<string>('')
  const [todos, setTodos] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [theme, setTheme] = useState<Theme>('light')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const newTask: Task = { id: Date.now(), text }
    setTodos(prev => [...prev, newTask])
    setInput('')
  }

  const completeTask = (task: Task) => {
    setTodos(prev => prev.filter(t => t.id !== task.id))
    setDoneTasks(prev => [...prev, task])
  }

  const deleteTask = (task: Task) => {
    setDoneTasks(prev => prev.filter(t => t.id !== task.id))
  }

  return (
    <div className={`todo-page ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <style>{`
        /* ===== 기본 스타일 ===== */
        .todo-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #ffffff;
        }

        /* ===== Dark Theme Overrides ===== */
        .theme-dark { 
          background-color: #111827; 
        }
        .theme-dark .todo-container { background: #111827; color: #e5e7eb; }
        .theme-dark .todo-container__input { background:#0b1220; color:#e5e7eb; border:1px solid #334155; }
        .theme-dark .render-container__item { background:#0f172a; border:1px solid #334155; }
        .theme-dark .render-container__title { color:#e5e7eb; }
        .theme-dark .render-container__item-text { color:#e5e7eb; }

        /* ===== Todo 컨테이너 ===== */
        .todo-container {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 680px;
          max-width: calc(100% - 32px);
          text-align: center;
        }

        /* ===== 제목 ===== */
        .todo-container__header {
          font-size: 42px;
          font-weight: 800;
          margin: 8px 0 24px;
        }

        /* ===== Theme Switch ===== */
        .theme-switch { display:flex; gap:8px; justify-content:flex-end; margin-bottom: 12px; }
        .theme-switch__btn {
          background:#111827; color:#fff; border:none; padding:8px 12px; border-radius:10px; cursor:pointer; font-weight:700;
        }
        .theme-switch__btn--light { background:#3b82f6; }
        .theme-dark .theme-switch__btn--light { background:#334155; }
        .theme-switch__btn--dark { background:#111827; border:1px solid #1f2937; }

        /* ===== 입력 폼 ===== */
        .todo-container__form {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
        }

        .todo-container__input {
          flex: 1;
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-size: 16px;
          outline: none;
        }

        .todo-container__button {
          background-color: #28a745;
          color: #ffffff;
          border: none;
          padding: 12px 18px;
          cursor: pointer;
          border-radius: 10px;
          font-weight: 700;
          transition: background-color 0.2s ease;
        }

        .todo-container__button:hover { background-color: #218838; }

        /* ===== 리스트 컨테이너 ===== */
        .render-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .render-container__section { width: 100%; text-align: left; }

        .render-container__title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 12px;
          display: flex;
          justify-content: center;
        }

        .render-container__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        /* ===== 리스트 아이템 ===== */
        .render-container__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: #f9f9f9;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .render-container__item-text {
          flex: 1;
          font-size: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-right: 12px;
        }

        .render-container__item-button {
          border: none;
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-complete { background-color: #28a745; }
        .btn-delete { background-color: #dc3545; }
      `}</style>

      <div className="todo-container">
        <h1 className="todo-container__header">YONG TODO</h1>

        <div className="theme-switch">
          <button type="button" className="theme-switch__btn theme-switch__btn--light" onClick={() => setTheme('light')}>라이트 모드</button>
          <button type="button" className="theme-switch__btn theme-switch__btn--dark" onClick={() => setTheme('dark')}>다크 모드</button>
        </div>

        <form className="todo-container__form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="할 일 입력"
              required
              className="todo-container__input"
            />
            <button type="submit" className="todo-container__button">할 일 추가</button>
          </form>

        <div className="render-container">
          <div className="render-container__section">
            <h2 className="render-container__title">할 일</h2>
            <ul className="render-container__list">
              {todos.map(task => (
                <li key={task.id} className="render-container__item">
                  <span className="render-container__item-text">{task.text}</span>
                  <button
                    className="render-container__item-button btn-complete"
                    onClick={() => completeTask(task)}
                  >
                    완료
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="render-container__section">
            <h2 className="render-container__title">완료</h2>
            <ul className="render-container__list">
              {doneTasks.map(task => (
                <li key={task.id} className="render-container__item">
                  <span className="render-container__item-text">{task.text}</span>
                  <button
                    className="render-container__item-button btn-delete"
                    onClick={() => deleteTask(task)}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
export default App