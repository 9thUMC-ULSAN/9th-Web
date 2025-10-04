 // HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

// 할 일 및 완료된 작업을 저장할 배열
type Task = {
  id: number;
  text: string;
};

let todos: Task[] = [];
let doneTasks: Task[] = [];

// 할 일 텍스트 입력 처리 함수
const getTodoText = (): string => {
  return todoInput.value.trim();
};

// 할 일 추가 함수
const addTodo = (text: string): void => {
  todos.push({ id: Date.now(), text });
  console.log(todos);
  todoInput.value = '';
  renderTasks(); 
};

// 할 일 상태 변경 (완료로 이동)
const completeTask = (task: Task): void => {
  todos = todos.filter((t) => t.id !== task.id);
  // 배열에서 필터를 걸쳐 t.id에서 task.id 랑 비교해 일치하지 않는 것들을 남긴다.
  doneTasks.push(task);
  // 완료 버튼을 누르면 task로 이동함
  renderTasks();
};

// 완료된 할 일 삭제 함수
const deleteTask = (task: Task): void => {
  doneTasks = doneTasks.filter((t) => t.id !== task.id);
  renderTasks();
};

// 할 일 아이템 생성 함수
const createTaskElement = (task: Task, isDone: boolean): HTMLLIElement => {
  const li = document.createElement('li');
  li.classList.add('render-container__item');
  li.textContent = task.text;

  const button = document.createElement('button');
  button.classList.add('render-container__item-button');

  // 완료 여부에 따른 버튼 텍스트 및 색상 설정
  if (isDone) { // 완료 여부에 따라 버튼의 색상을 바꿔주기 위함
    button.textContent = '삭제';
    button.style.backgroundColor = '#dc3545'; // 빨간색 (삭제)
  } else {
    button.textContent = '완료';
    button.style.backgroundColor = '#28a745'; // 초록색 (완료)
  }

  button.addEventListener('click', () => {
    if (isDone) {
      deleteTask(task);
    } else {
      completeTask(task);
    }
  });

  li.appendChild(button);
  // li 옆에 버튼을 붙임
  return li;
	// li 반환
};

// 할 일 목록 렌더링 함수
const renderTasks = (): void => {
  // html 구조 상 빈칸을 초기화 해준다
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  todos.forEach((task) => { //forEach를 뿌려준다
    const li = createTaskElement(task, false);
    todoList.appendChild(li);
  });

  doneTasks.forEach((task) => {
    const li = createTaskElement(task, true);
    doneList.appendChild(li);
  });
};

// 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event: Event) => { // 이벤트 발생하면 
  event.preventDefault();
  const text = getTodoText();
  if (text) {
    addTodo(text);
  }
});

// 초기 렌더링
renderTasks();