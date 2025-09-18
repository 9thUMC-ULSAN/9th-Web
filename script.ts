// 1. HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

// 2. 할 일 타입 정의
type Todo = {
    id: number;
    text: string;
};

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 3. 할 일 텍스트 입력 처리 함수
const getTodoText = (): string => {
    return todoInput.value.trim();
};

// 4. 할 일 아이템 생성 함수
const createTodoElement = (todo: Todo, isDone: boolean): HTMLElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    
    const textSpan = document.createElement('span');
    textSpan.classList.add('render-container__item-text');
    textSpan.textContent = todo.text;
    
    const buttonContainer = document.createElement('div');
    
    if (!isDone) {
        // 할 일 목록에서는 완료 버튼만 표시
        const completeButton = document.createElement('button');
        completeButton.classList.add('todo-complete-btn');
        completeButton.textContent = '완료';
        completeButton.addEventListener('click', () => completeTask(todo));
        
        buttonContainer.appendChild(completeButton);
    } else {
        // 완료된 목록에서는 삭제 버튼만 표시
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

// 5. 렌더링 함수
const renderTasks = (): void => {
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

// 6. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTasks();
};

// 7. 할 일 완료 처리 함수
const completeTask = (todo: Todo): void => {
    todos = todos.filter((t) => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};


// 8. 완료된 할 일에서 삭제
const deleteTodoFromDone = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t) => t.id !== todo.id);
    renderTasks();
};

// 9. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event: Event): void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

// 10. 초기 렌더링
renderTasks();
