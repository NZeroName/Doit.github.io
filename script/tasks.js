// Получение и инициализация данных
let users = JSON.parse(localStorage.getItem("userData")) || [];

// Находим элементы на странице
let sidebar = document.querySelector(".profile__sidebar");
let currentMenu = null;
let currentTask = null;
let tasks = document.querySelectorAll(".taskList__task");

// Инициализация событий для задач
function taskEvent() {
  tasks.forEach((el) => {
    let menuActive = el.querySelector(".task__menu_toggle");
    // Обработчик клика для открытия/закрытия меню задачи
    el.querySelector(".task__menu").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu(menuActive, el);
    });
    // Инициализация событий для элементов меню задачи
    menuEvent(menuActive, el);
  });
}

// Функция для обработки событий элементов меню задачи
function menuEvent(menu, task) {
  let menuItem = menu.querySelectorAll(".task__menu_item");
  menuItem.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      // Клонируем задачу и обновляем счетчик задач
      if (item.classList.contains("dublicate")) {
        cloneTask(task);
        counterTask();
      } else if (item.classList.contains("delete")) {
        // Подтверждение удаления задачи
        item.innerHTML = `<p>Sure?</p><button class='delete_yes'>Yes</button><button class='delete_no'>Cancel</button>`;
        item.style.paddingRight = "18px";
        if (e.target.textContent === "Cancel") {
          item.style.removeProperty("padding-right");
          item.innerHTML = `<img src="img/delete.svg" alt="" />Delete`;
        } else if (e.target.textContent === "Yes") {
          task.remove();
          counterTask();
        }
      }
    });
  });
}

// Функция для закрытия текущего открытого меню
function closeCurrentMenu() {
  if (currentMenu) {
    // Сбрасываем состояние кнопки удаления
    if (currentMenu.querySelector(".delete").querySelector(".delete_yes")) {
      currentMenu.querySelector(
        ".delete"
      ).innerHTML = `<img src="img/delete.svg" alt="" />Delete`;
    }
    // Скрываем текущее меню и убираем активный класс у задачи
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
  // Переключаем видимость текущего меню и активного класса задачи
  menu.classList.toggle("menu_hide");
  task.classList.toggle("task_active");

  // Обновляем текущие открытые меню и задачи
  currentMenu = menu.classList.contains("menu_hide") ? null : menu;
  currentTask = menu.classList.contains("menu_hide") ? null : task;
}

// Функция для обновления счетчика задач
function counterTask() {
  const counter = document.querySelector(".profile__task_header p");
  const tasks = document.querySelector(".taskList").children.length;
  counter.innerHTML = `<span>Today</span> you have ${tasks} points`;
}

// Функция для клонирования задачи
function cloneTask(task) {
  let taskCopy = task.cloneNode(true);
  taskCopy.classList.remove("task_active"); // Убираем активный класс у клона
  task.insertAdjacentElement("afterend", taskCopy); // Вставляем клон после оригинала
  // Удаляем все активное с исходной задачи
  task.querySelector(".task__menu_toggle").classList.toggle("menu_hide");
  task.classList.toggle("task_active");
  taskCopy.querySelector(".task__menu_toggle").classList.toggle("menu_hide");
  // Добавление всех обработчиков событий
  initTaskEvents(taskCopy);
}

// Функция для добавления событий у клонированной задачи
function initTaskEvents(task) {
  let menuActive = task.querySelector(".task__menu_toggle");
  task.querySelector(".task__menu").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu(menuActive, task);
  });
  menuEvent(menuActive, task);
}

// Функция для переключения боковой панели
function toggleSidebar() {
  const showBtn = document.querySelector(".profile__user_more");
  const userName = document.querySelector(".profile__user_name");
  showBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("showSidebar");
    userName.classList.toggle("showName");
    // Меняем угол поворота кнопки в зависимости от состояния боковой панели
    showBtn.style.rotate = sidebar.classList.contains("showSidebar")
      ? "180deg"
      : "360deg";
  });
}

// Функция для получения пользователя по его ID
function getUserById(userId) {
  return users.find((user) => user.id === parseInt(userId));
}

// Инициализация событий при загрузке документа
document.addEventListener("DOMContentLoaded", () => {
  taskEvent(); // Инициализация событий для задач
  toggleSidebar(); // Инициализация событий для боковой панели
  counterTask(); // Обновление счетчика задач
  const currentUserId = localStorage.getItem("currentUserId");
  if (currentUserId) {
    const currentUser = getUserById(currentUserId);
    if (currentUser) {
      const nameUser = currentUser.name;
      // Устанавливаем имя пользователя в боковую панель
      sidebar.querySelector(".profile__user_name").innerHTML = nameUser;
      // Устанавливаем первую букву имени пользователя в фото профиля
      sidebar.querySelector(".profile__user_photo").innerHTML = nameUser[0];
    }
  }
});

// Закрытие текущего меню при клике вне задач
document.addEventListener("click", () => closeCurrentMenu());
