"use strict";
const todoInput = document.getElementById('todo-input');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
let todos = [];
let doneTasks = [];
const getTodoText = () => {
    return todoInput.value.trim();
};
const createTodoElement = (todo, isDone) => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    const textSpan = document.createElement('span');
    textSpan.classList.add('render-container__item-text');
    textSpan.textContent = todo.text;
    const buttonContainer = document.createElement('div');
    if (!isDone) {
        const completeButton = document.createElement('button');
        completeButton.classList.add('todo-complete-btn');
        completeButton.textContent = '완료';
        completeButton.addEventListener('click', () => completeTask(todo));
        buttonContainer.appendChild(completeButton);
    }
    else {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('render-container__item-button');
        deleteButton.textContent = '삭제';
        deleteButton.addEventListener('click', () => deleteTodoFromDone(todo));
        buttonContainer.appendChild(deleteButton);
    }
    li.appendChild(textSpan);
    li.appendChild(buttonContainer);
    return li;
};
const renderTasks = () => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach((todo) => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });
    doneTasks.forEach((todo) => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};
const addTodo = (text) => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTasks();
};
const completeTask = (todo) => {
    todos = todos.filter((t) => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};
const deleteTodoFromDone = (todo) => {
    doneTasks = doneTasks.filter((t) => t.id !== todo.id);
    renderTasks();
};
todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
renderTasks();
