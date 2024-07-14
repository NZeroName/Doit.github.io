// Получение и инициализация данных
let users = JSON.parse(localStorage.getItem("userData")) || [];
console.log("Загруженные данные из localStorage:", users);

fetch("users.json")
  .then((response) => response.json())
  .then((data) => {
    users = data.users;
    console.log("Данные пользователей загружены:", users);
  })
  .catch((error) => console.error("Ошибка загрузки данных:", error));

// Функции для обработки задач
let currentMenu = null;
let currentTask = null;
let sidebar = document.querySelector(".profile__sidebar");
const menubtn = document.querySelectorAll(".task__menu");
const taskInfo = document.querySelectorAll(".task");

menubtn.forEach((elem) => {
  let settings = elem.querySelector(".task__menu_toggle");
  let task = elem.parentNode;

  elem.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu(settings, task);
  });
  settings.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

document.addEventListener("click", () => {
  closeCurrentMenu();
});

function toggleMenu(settings, task) {
  menubtn.forEach((el) => {
    let setting = el.querySelector(".task__menu_toggle");
    let parentTask = el.parentNode;
    if (setting !== settings) {
      setting.classList.add("menu_hide");
      parentTask.classList.remove("task_active");
    }
  });

  task.classList.toggle("task_active");
  settings.classList.toggle("menu_hide");

  currentMenu = settings.classList.contains("menu_hide") ? null : settings;
  currentTask = settings.classList.contains("menu_hide") ? null : task;
  menu(settings);
}

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

function closeTask(elem) {
  elem.forEach((task) => {
    let taskWatcher = task.querySelector("[name=taskDone]");
    let taskText = task.querySelector(".task__name");
    taskWatcher.addEventListener("input", () => {
      taskText.style.textDecoration = taskWatcher.checked
        ? "line-through"
        : "none";
    });
  });
}

function menu(elem) {
  let itemMenu = elem.querySelectorAll("li");
  itemMenu.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if (item.classList.contains("delete")) {
        item.innerHTML = `<p>Sure?</p><button class='delete_yes'>Yes</button><button class='delete_no'>Cancel</button>`;
        item.style.paddingRight = "18px";
        if (e.target.textContent === "Cancel") {
          item.style.removeProperty("padding-right");
          return (item.innerHTML = `<img src="img/delete.svg" alt="" />Delete`);
        } else if (e.target.textContent === "Yes") {
          elem.parentNode.parentNode.remove();
          counterTask();
        }
      }
    });
  });
}

function counterTask() {
  const counter = document.querySelector(".profile__task_header p");
  const tasks = document.querySelector(".taskList").children.length;
  counter.innerHTML = `<span>Today</span> you have ${tasks} points`;
}

function toggleSidebar() {
  const showBtn = document.querySelector(".profile__user_more");
  const userName = document.querySelector(".profile__user_name");
  showBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("showSidebar");
    userName.classList.toggle("showName");
    showBtn.style.rotate = sidebar.classList.contains("showSidebar")
      ? "180deg"
      : "360deg";
  });
}

function getFormattedDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  document.querySelector(
    ".profile__calendar_date"
  ).innerHTML = `${day} ${month}`;
}

function getUserById(userId) {
  return users.find((user) => user.id === parseInt(userId));
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUserId = localStorage.getItem("currentUserId");
  if (currentUserId) {
    const currentUser = getUserById(currentUserId);
    if (currentUser) {
      const nameUser = currentUser.name;
      sidebar.querySelector(".profile__user_name").innerHTML = nameUser;
      sidebar.querySelector(".profile__user_photo").innerHTML = nameUser[0];
    }
  }

  getFormattedDate();
  closeTask(taskInfo);
  counterTask();
  toggleSidebar();
});
