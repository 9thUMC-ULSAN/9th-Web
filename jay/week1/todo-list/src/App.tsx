import { useState } from 'react'
import './App.css'

// 할 일 항목의 타입 정의
interface TodoItem {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputValue, setInputValue] = useState('')
  const [nextId, setNextId] = useState(1)

  // 할 일 추가 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inputValue.trim()) {
      const newTodo: TodoItem = {
        id: nextId,
        text: inputValue.trim(),
        completed: false
      }
      
      setTodos([...todos, newTodo])
      setNextId(nextId + 1)
      setInputValue('')
    }
  }

  // 할 일 완료 처리 함수
  const handleComplete = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: true } : todo
    ))
  }

  // 할 일 삭제 함수
  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // 해야 할 일과 완료한 일 필터링
  const activeTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)

  return (
    <div className="todo">
      <div className="todo__container">
        {/* 헤더 */}
        <header className="todo__header">
          <h1 className="todo__title">YONG TODO</h1>
        </header>

        {/* 할 일 입력 폼 */}
        <section className="todo__input-section">
          <form className="todo__form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__input"
              placeholder=""
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="todo__button todo__button--add">
              할일 추가
            </button>
          </form>
        </section>

        {/* 메인 콘텐츠 */}
        <main className="todo__content">
          {/* 해야 할 일 목록 */}
          <section className="todo__section">
            <h2 className="todo__section-title">할 일</h2>
            <ul className="todo__list">
              {activeTodos.length === 0 ? (
                <div className="todo__empty">할 일이 없습니다</div>
              ) : (
                activeTodos.map(todo => (
                  <li key={todo.id} className="todo__item">
                    <span className="todo__item-text">{todo.text}</span>
                    <div className="todo__item-actions">
                      <button
                        className="todo__button todo__button--complete"
                        onClick={() => handleComplete(todo.id)}
                      >
                        완료
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* 완료한 일 목록 */}
          <section className="todo__section">
            <h2 className="todo__section-title">완료</h2>
            <ul className="todo__list todo__list--done">
              {completedTodos.length === 0 ? (
                <div className="todo__empty">완료한 일이 없습니다</div>
              ) : (
                completedTodos.map(todo => (
                  <li key={todo.id} className="todo__item todo__item--done">
                    <span className="todo__item-text">{todo.text}</span>
                    <div className="todo__item-actions">
                      <button
                        className="todo__button todo__button--delete"
                        onClick={() => handleDelete(todo.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
