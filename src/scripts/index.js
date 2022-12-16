const addTaskForm = document.querySelector(".header__add-task-form");
const addTaskButton = document.querySelector(".header__add-task-button");
const addTaskInput = document.querySelector(".header__add-task-input");
const tasksList = document.querySelector(".tasks__list");
const inputEmpty = document.querySelector(".header__input-empty");
const deleteAll = document.querySelector(".header__delete-all");
const deleteAllMobile = document.querySelector(".header__delete-all--mobile");
const showCompletedButton = document.querySelector(".header__show-completed");
const showAllButton = document.querySelector(".header__show-all");
const searchInput = document.querySelector(".header__search-input");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList(tasks, "List is empty");

addTaskForm.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);
deleteAll.addEventListener("click", deleteTasks);
deleteAllMobile.addEventListener("click", deleteTasks);
showCompletedButton.addEventListener("click", showCompleted);
showAllButton.addEventListener("click", showAll);
searchInput.addEventListener("input", search);

function addTask(event) {
  event.preventDefault();

  const inputValue = addTaskInput.value;

  inputEmpty.style.display = !inputValue ? "block" : "none";

  if (inputValue) {
    const textTask = inputValue;
    const newTask = {
      id: Date.now(),
      text: textTask,
      checked: false,
    };

    tasks.push(newTask);

    renderTask(newTask);

    addTaskInput.value = "";
    addTaskInput.focus();
    checkEmptyList(tasks, "List is empty");
    saveToLocalStorage();
  }
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".tasks__task-row");

  tasks = tasks.filter((task) => task.id !== +parentNode.id);

  parentNode.remove();
  checkEmptyList(tasks, "List is empty");
  saveToLocalStorage();
}

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".tasks__task-row");

  tasks.forEach((task) => {
    if (task.id === +parentNode.id) {
      return (task.checked = !task.checked);
    }
  });

  saveToLocalStorage();
}

function deleteTasks(event) {
  if (event.target.dataset.action !== "delete-all") return;

  tasks = [];

  tasksList.replaceChildren();
  checkEmptyList(tasks, "List is empty");
  saveToLocalStorage();
}

function showCompleted() {
  const completedTasks = tasks.filter((task) => task.checked === true);
  tasksList.replaceChildren();
  if (!!completedTasks.length) {
    completedTasks.forEach((task) => renderTask(task));
  } else {
    checkEmptyList(completedTasks, "No completed tasks");
  }
}

function showAll() {
  tasksList.replaceChildren();
  tasks.forEach((task) => renderTask(task));
}

function search() {
  const searchText = searchInput.value.toLowerCase();

  const searchTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchText)
  );

  tasksList.replaceChildren();

  if (!!searchTasks.length) {
    searchTasks.forEach((task) => renderTask(task));
  } else {
    checkEmptyList(searchTasks, "No such task was found");
  }
}

function checkEmptyList(array, message) {
  if (!array.length) {
    const emptyListHTML = `<li class="empty-list-element">${message}</p></li>`;
    tasksList.insertAdjacentHTML("beforeend", emptyListHTML);
  } else {
    const emptyListElement = document.querySelector(".empty-list-element");
    emptyListElement ? emptyListElement.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const taskHTML = `<li class="tasks__task-row" id="${task.id}">
 
  <input type="checkbox" id="label${task.id}+1" data-action=done ${
    task.checked ? `checked` : ``
  } class="tasks__checkbox"/> <label class="tasks__task" for="label${
    task.id
  }+1">${task.text}</label
>
<button class="tasks__button" data-action="delete">✖</button>
</li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
