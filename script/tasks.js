// Находим элементы на странице
let currentMenu = null;
let currentTask = null;
let tasks = document.querySelectorAll(".taskList__task");

// Инициализация событий для задач
function taskEvent() {
  tasks.forEach((task) => {
    let menuActive = task.querySelector(".task__menu_toggle");

    // Обработчик клика для открытия/закрытия меню задачи
    task.querySelector(".task__menu").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu(menuActive, task);
    });

    // Проверка задачи (отметка как выполненная)
    task.addEventListener("click", () => checkedTask(task));

    // Инициализация событий для элементов меню задачи
    menuEvent(menuActive, task);
  });
}

// Функция для обработки событий элементов меню задачи
function menuEvent(menu, task) {
  let menuItems = menu.querySelectorAll(".task__menu_item");
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if (item.classList.contains("dublicate")) {
        cloneTask(task);
        counterTask();
      } else if (item.classList.contains("delete")) {
        confirmDelete(item, task);
      } else if (item.classList.contains("rename")) {
        if (
          task.querySelector(".task__name").tagName.toLowerCase() !== "input"
        ) {
          renameTask(task, menu);
        }
      }
    });
  });
}

// Функция подтверждения удаления задачи
function confirmDelete(item, task) {
  item.innerHTML = `<p>Sure?</p><button class='delete_yes'>Yes</button><button class='delete_no'>Cancel</button>`;
  item.style.paddingRight = "18px";
  item.querySelector(".delete_yes").addEventListener("click", () => {
    task.remove();
    counterTask();
  });
  item.querySelector(".delete_no").addEventListener("click", (e) => {
    e.stopPropagation();
    item.style.removeProperty("padding-right");
    item.innerHTML = `<img src="img/delete.svg" alt="" />Delete`;
  });
}

// Функция для переименования задачи
function renameTask(task, menu) {
  let input = document.createElement("input");
  let nameTask = task.querySelector(".task__name");
  input.type = "text";
  input.value = nameTask.textContent;
  input.className = nameTask.className;
  nameTask.replaceWith(input);
  input.focus();
  menu.classList.toggle("menu_hide");

  // События которые преобразуют input обратно в p
  function watchInput(event) {
    if (event.key === "Enter" || event.target !== input) {
      replaceInputWithParagraph(task);
      task.classList.remove("task_active");
      // Если задача закрыта и мы ее переименовываем, убираем значение чекбокса
      if (task.querySelector(".check__input").checked) {
        task.querySelector(".check__input").checked = false;
      }

      input.removeEventListener("keydown", watchInput);
      document.removeEventListener("click", watchInput);
    }
  }

  input.addEventListener("keydown", watchInput);
  document.addEventListener("click", watchInput);
}

// Функция для замены input на параграф после переименования
function replaceInputWithParagraph(task) {
  let newPElement = document.createElement("p");
  let nameTask = task.querySelector(".task__name");
  newPElement.textContent = nameTask.value;
  newPElement.className = nameTask.className;
  nameTask.replaceWith(newPElement);
}

// Функция для отметки задачи как выполненной
function checkedTask(task) {
  if (task.querySelector(".check__input").checked) {
    task.querySelector(".task__name").style.textDecoration = "line-through";
  } else
    task.querySelector(".task__name").style.removeProperty("text-decoration");
}

// Функция для закрытия текущего открытого меню
function closeCurrentMenu() {
  if (currentMenu) {
    if (currentMenu.querySelector(".delete").querySelector(".delete_yes")) {
      currentMenu.querySelector(
        ".delete"
      ).innerHTML = `<img src="img/delete.svg" alt="" />Delete`;
    }
    currentMenu.classList.add("menu_hide");
    currentTask.classList.remove("task_active");
    currentMenu = null;
    currentTask = null;
  }
}

// Функция для переключения видимости меню задачи
function toggleMenu(menu, task) {
  tasks.forEach((item) => {
    let menuWatcher = item.querySelector(".task__menu_toggle");
    if (menuWatcher !== menu) {
      menuWatcher.classList.add("menu_hide");
      item.classList.remove("task_active");
    }
  });
  menu.classList.toggle("menu_hide");
  task.classList.toggle("task_active");

  currentMenu = menu.classList.contains("menu_hide") ? null : menu;
  currentTask = menu.classList.contains("menu_hide") ? null : task;
}

// Функция для обновления счетчика задач
function counterTask() {
  const counter = document.querySelector(".profile__task_header p");
  const taskCount = document.querySelector(".taskList").children.length;
  counter.innerHTML = `<span>Today</span> you have ${taskCount} points`;
}

// Функция для клонирования задачи
function cloneTask(task) {
  let taskCopy = task.cloneNode(true);
  taskCopy.classList.remove("task_active");
  task.insertAdjacentElement("afterend", taskCopy);
  task.querySelector(".task__menu_toggle").classList.add("menu_hide");
  task.classList.remove("task_active");
  taskCopy.querySelector(".task__menu_toggle").classList.add("menu_hide");
  initTaskEvents(taskCopy);
}

// Функция для добавления событий у клонированной задачи
function initTaskEvents(task) {
  let menuActive = task.querySelector(".task__menu_toggle");
  task.querySelector(".task__menu").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu(menuActive, task);
  });
  // Проверка задачи (отметка как выполненная)
  task.addEventListener("click", () => checkedTask(task));
  menuEvent(menuActive, task);
}

// Инициализация событий при загрузке документа
document.addEventListener("DOMContentLoaded", () => {
  taskEvent();
  counterTask();
});

// Закрытие текущего меню при клике вне задач
document.addEventListener("click", closeCurrentMenu);
