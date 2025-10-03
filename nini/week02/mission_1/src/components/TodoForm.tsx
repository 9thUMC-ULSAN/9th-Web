import {type FormEvent, useState} from 'react';
import type { TTodo } from '../types/todo';
import { TodoContext, useTodo } from '../context/TodoContext';

const TodoForm = () => {
  const {addTodo} = useTodo()
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();   // 새로고침 방지 위함
    const text = input.trim();

    if (text) {
      addTodo(text)
      setInput('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className='todo-container__form'>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type='text'
        className='todo-container__input'
        placeholder="할 일 입력"
        required
      />
      <button type='submit' className='todo-container__button'>
        할 일 추가
      </button>
    </form>
  )
}

export default TodoForm