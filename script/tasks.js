// Находим элементы на странице
let currentMenu = null;
let currentTask = null;
let tasks = document.querySelectorAll(".taskList__task");
let tags = [];

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

// Функция создания новой задачи
function createTask() {
  document.querySelector(".profile__addTask").addEventListener("click", () => {
    document.body.style.backgroundColor = "#BEC0CA";

    // Вставляем HTML для модального окна
    document.body.insertAdjacentHTML("afterbegin", CreationModalTask());
    renderTags();
    // Добавляем обработчик события клика на модальное окно
    document.querySelector(".modal").addEventListener("click", (e) => {
      e.stopPropagation();
      // Проверяем, на какой элемент был совершен клик
      if (e.target.closest(".addTag__btn")) {
        if (!document.querySelector(".tag__name")) {
          document.querySelector(".add-tag").style.backgroundColor = "#F6F6F6";
          createTag(document.querySelector(".add-tag"));
        }
      }
      if (e.target.closest(".modal__colorTag")) {
        console.log("открываю меню");
      }
      if (e.target.closest(".remove-tag")) {
        e.target.parentNode.parentNode.remove();
      }
      if (e.target.closest(".modal__saveTastBtn")) {
        creationTemplateTask();
      }
    });
    // Удаление модального окна при клике на кнопку "remove"
    document.querySelector(".modal__remove").addEventListener("click", () => {
      document.querySelector(".overlay").remove();
      document.body.style.removeProperty("background-color");
    });
    // Вызываем что бы события на теги работали, после открытия и закрытия создания тасков
    chooseTag();
  });
}

// Отрисовка уже созданных тегов
function renderTags() {
  tags.forEach((tag) => {
    document.querySelector(".tag-list").insertAdjacentHTML(
      "beforeend",
      `<div class="modal__newTag">
        <img class='modal__colorTag' src='img/more.svg'/>
        <span class='tag' style='background-color: ${tag.color}'>${tag.name}</span>
      </div>`
    );
  });
}

// Создание нового тега
function createTag(elem) {
  // Вставляем HTML-код
  elem.insertAdjacentHTML(
    "beforeend",
    `<div class='create__tag'>
      <div class='tag__name'><input type="text" id='tagName'/></div>
      <span class='codeColor' hidden></span>
      <div id='previewBox'></div>
      <div class="tag__accept">
        <button class='delete_yes tag_save'>Save</button>
        <button class='delete_no tag_cancel'>Cancel</button>
      </div>
    </div>`
  );

  // Инициализация jscolor для элемента-превью
  new jscolor(document.getElementById("previewBox"), {
    preset: "dark",
    closeButton: true,
    closeText: "OK",
    value: "#D9D9D9",
    valueElement: ".codeColor", // Без связанного input
    styleElement: document.getElementById("previewBox"),
  });

  // Функционал кнопок при создании тега
  elem.querySelector(".tag__accept").addEventListener("click", (e) => {
    let colorTag = document.querySelector(".codeColor").textContent;
    let nameTag = document.getElementById("tagName").value;
    // Если нажали на сохранить тег, то проверяем что он не пустой и тег не дублируется, после чего добавляем
    if (e.target.closest(".tag_save")) {
      if (nameTag != "") {
        // Проверка на дубль тега
        if (!tags.find((elem) => elem.name.trim() === nameTag)) {
          tags.push({ name: nameTag, color: colorTag });
          addTag(colorTag, nameTag);
          document.querySelector(".create__tag").remove();
        }
      }
    }
    // Если нажали на закрыть, то закрываем создание тега
    if (e.target.closest(".tag_cancel")) {
      document
        .querySelector(".add-tag")
        .style.removeProperty("background-color");
      document.querySelector(".create__tag").remove();
    }
  });
}

// Добавление тегов
function addTag(color, name) {
  // Проверяем, есть ли совпадения в названии тега
  let searchTagMatch = Array.from(
    document.querySelectorAll(".modal__newTag")
  ).find((elem) => elem.textContent.trim() === name);
  // Если совпадения нет, то добавляем и отрисовываем тег
  if (!searchTagMatch) {
    document.querySelector(".tag-list").insertAdjacentHTML(
      "beforeend",
      `<div class="modal__newTag">
        <img class='modal__colorTag' src='img/more.svg'/>
        <span class='tag' style='background-color: ${color}'>${name}</span>
      </div>`
    );
    chooseTag();
  }
}

// Шаблон создания задачи
function creationTemplateTask() {
  const tags = Array.from(
    document.querySelector(".modal__tagList").querySelectorAll(".modal__tag")
  );
  const tagHTML = tags
    .map((tag) => {
      const removeTag = tag.querySelector("span").querySelector(".remove-tag");
      if (removeTag) {
        removeTag.remove();
      }
      return tag.querySelector("span").outerHTML;
    })
    .join("");
  const result = templateTask(tagHTML);

  document.querySelector(".taskList").insertAdjacentHTML("beforeend", result);
  let newTask = document.querySelector(".taskList__task:last-child");
  initTaskEvents(newTask);

  document.querySelector(".overlay").remove();
  document.body.style.removeProperty("background-color");
}
function templateTask(tagHTML) {
  let nameTask = document.getElementById("name_task").value;

  if (nameTask == "") {
    nameTask = "Untitled";
    return `<div class="taskList__task">
            <div class="task__menu">
              <button class="task__menu_change">
                <img src="img/more.svg" alt="" />
              </button>
              <ul class="task__menu_toggle menu_hide">
                <li class="task__menu_item rename">
                  <img src="img/rename.svg" alt="" />Rename
                </li>
                <li class="task__menu_item changeTag">
                  <img src="img/tag.svg" alt="" />Add/delete tag
                </li>
                <li class="task__menu_item dublicate">
                  <img src="img/dublicate.svg" alt="" />Dublicate
                </li>
                <li class="task__menu_item delete">
                  <img src="img/delete.svg" alt="" />Delete
                </li>
              </ul>
            </div>
            <label class="check task">
              <div>
                <input
                  type="checkbox"
                  name="taskDone"
                  class="check__input"
                /><span class="check__box"></span>
                <p class="task__name">${nameTask}</p>
              </div>
              <div class="task__tags">
                ${tagHTML}
              </div>
            </label>
          </div>`;
  } else {
    return `<div class="taskList__task">
            <div class="task__menu">
              <button class="task__menu_change">
                <img src="img/more.svg" alt="" />
              </button>
              <ul class="task__menu_toggle menu_hide">
                <li class="task__menu_item rename">
                  <img src="img/rename.svg" alt="" />Rename
                </li>
                <li class="task__menu_item changeTag">
                  <img src="img/tag.svg" alt="" />Add/delete tag
                </li>
                <li class="task__menu_item dublicate">
                  <img src="img/dublicate.svg" alt="" />Dublicate
                </li>
                <li class="task__menu_item delete">
                  <img src="img/delete.svg" alt="" />Delete
                </li>
              </ul>
            </div>
            <label class="check task">
              <div>
                <input
                  type="checkbox"
                  name="taskDone"
                  class="check__input"
                /><span class="check__box"></span>
                <p class="task__name">${nameTask}</p>
              </div>
              <div class="task__tags">
                ${tagHTML}
              </div>
            </label>
          </div>`;
  }
}
// Шаблон модального окна создания задачи
function CreationModalTask() {
  return `
    <div class="overlay">
      <div class="modal">
        <img class="modal__remove" src="img/remove.svg" />
        <div class="modal__header"><input type="text" name="" id="name_task" placeholder="Untitled"></div>
        <div class="modal__body">
          <div class="modal__tagList">
            <label for="modal__tag">Tag</label>
          </div>
          <div class="tag-list">
            <div class="add-tag">
              <button class="addTag__btn">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="000000" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13.498H13V18.498C13 18.7633 12.8946 19.0176 12.7071 19.2052C12.5196 19.3927 12.2652 19.498 12 19.498C11.7348 19.498 11.4804 19.3927 11.2929 19.2052C11.1054 19.0176 11 18.7633 11 18.498V13.498H6C5.73478 13.498 5.48043 13.3927 5.29289 13.2052C5.10536 13.0176 5 12.7633 5 12.498C5 12.2328 5.10536 11.9785 5.29289 11.7909C5.48043 11.6034 5.73478 11.498 6 11.498H11V6.49805C11 6.23283 11.1054 5.97848 11.2929 5.79094C11.4804 5.6034 11.7348 5.49805 12 5.49805C12.2652 5.49805 12.5196 5.6034 12.7071 5.79094C12.8946 5.97848 13 6.23283 13 6.49805V11.498H18C18.2652 11.498 18.5196 11.6034 18.7071 11.7909C18.8946 11.9785 19 12.2328 19 12.498C19 12.7633 18.8946 13.0176 18.7071 13.2052C18.5196 13.3927 18.2652 13.498 18 13.498Z" fill="000000"/>
                </svg> New tag
              </button>
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button class="modal__saveTastBtn">Save Task</button>
        </div>
      </div>
    </div>
  `;
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

// Выбор тега
function chooseTag() {
  let tagList = document.querySelectorAll(".modal__newTag");
  tagList.forEach((tag) => {
    tag.removeEventListener("click", tagClick);
    tag.addEventListener("click", tagClick);
  });
}
function tagClick(e) {
  let tagName = e.currentTarget.querySelector(".tag").textContent.trim();
  let tagColor = e.currentTarget.querySelector(".tag").style.backgroundColor;
  let activeTags = document.querySelector(".modal__tagList");
  let statusTag = Array.from(activeTags.querySelectorAll(".modal__tag")).find(
    (elem) => elem.textContent.trim() == tagName
  );
  if (!statusTag) {
    activeTags.insertAdjacentHTML(
      "beforeend",
      `
    <div class="modal__tag">
      <span class='tag tag--active' style = 'background-color: ${tagColor}'>
      ${tagName}<img class="remove-tag" src="img/remove.svg" />
      </span>
    </div>
    `
    );
  }
}
// Функция подтверждения удаления задачи
function confirmDelete(item, task) {
  item.innerHTML = `<p>Sure?</p><button class='delete_yes'>Yes</button><button class='delete_no'>Cancel</button> `;
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
    if (event.key === "Enter" || event.type === "click") {
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
  } else {
    task.querySelector(".task__name").style.removeProperty("text-decoration");
  }
}

// Функция для закрытия текущего открытого меню
function closeCurrentMenu() {
  if (currentMenu) {
    if (currentMenu.querySelector(".delete .delete_yes")) {
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
  counter.innerHTML = `<span>Today</span> you have ${taskCount} tasks`;
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
  counterTask();
}

// Инициализация событий при загрузке документа
document.addEventListener("DOMContentLoaded", () => {
  taskEvent();
  counterTask();
});

// Закрытие текущего меню при клике вне задач
document.addEventListener("click", closeCurrentMenu);

// Создание новой задачи
createTask();
