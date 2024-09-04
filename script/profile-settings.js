// Находим элементы на странице
const sidebar = document.querySelector(".profile__sidebar");
const userIcon = document.querySelector(".profile__user_photo");
const showBtn = document.querySelector(".profile__sidebar_show");
const userName = document.querySelector(".profile__user_name");
const taskWrapper = document.querySelector('.profile__main');

let nameUser, emailUser, passwordUser; // Переменные для хранения данных пользователя

// Получение и инициализация данных пользователей из localStorage
let users = JSON.parse(localStorage.getItem("userData")) || [];

document.addEventListener("DOMContentLoaded", () => {
  // Получаем ID текущего пользователя из localStorage
  const currentUserId = localStorage.getItem("currentUserId");
  if (currentUserId) {
    const currentUser = getUserById(currentUserId);
    if (currentUser) {
      // Инициализация переменных данными текущего пользователя
      nameUser = currentUser.name;
      emailUser = currentUser.email;
      passwordUser = currentUser.password;
      
      // Отображение имени и иконки пользователя на боковой панели
      sidebar.querySelector(".profile__user_name").innerHTML = nameUser;
      sidebar.querySelector(".profile__user_photo").innerHTML = nameUser[0];
    }
  }
  // Инициализация событий для боковой панели
  sidebarEvents();
});

// Функция для получения пользователя по его ID
function getUserById(userId) {
  return users.find((user) => user.id === parseInt(userId));
}

// Функция для переключения боковой панели
function sidebarEvents() {
  showBtn.addEventListener("click", toggleSidebar);  // Переключение видимости боковой панели
  userIcon.addEventListener("click", toggleUserMenu);  // Открытие/закрытие меню пользователя
}

// Открытие - закрытие сайдбара
function toggleSidebar() {
  sidebar.classList.toggle("showSidebar");
  userName.classList.toggle("showName");
  
  // Переключение направления стрелки
  showBtn.style.rotate = sidebar.classList.contains("showSidebar")
    ? "180deg"
    : "360deg";
}

// Открытие/закрытие меню пользователя
function toggleUserMenu() {
  // Функция для удаления меню настроек при клике вне его области
  let removeSettingsMenu = function (e) {
    if (
      e.target !== userIcon &&
      userIcon.querySelector(".profile__settings-menu")
    ) {
      userIcon.querySelector(".profile__settings-menu").remove();
      document.removeEventListener("click", removeSettingsMenu);
      userIcon.removeEventListener('click', settingsProfile);
    }
  };

  // Если меню не существует, создаем его
  if (!userIcon.querySelector(".profile__settings-menu")) {
    userIcon.insertAdjacentHTML(
      "beforeend",
      `<ul class="profile__settings-menu">
                <li class="profile__settings-menu_item settings">
                  <img src="img/settings.svg" alt="" />Settings
                </li>
                <li class="profile__settings-menu_item changeTag">
                  <img src="img/logout.svg" alt="" />Log out
                </li>
              </ul>`
    );
    menuItemEvents(); // Инициализация событий для элементов меню
  }
  document.addEventListener("click", removeSettingsMenu); // Удаление меню при клике вне области
}

// Инициализация событий для элементов меню
function menuItemEvents() {
  let menuItems = document
    .querySelector(".profile__settings-menu")
    .querySelectorAll("li");
  menuItems.forEach((element) => {
    element.addEventListener("click", function (e)  {
      e.stopPropagation();
      if (this.classList.contains('settings')) {
        this.parentNode.remove(); // Удаление меню после клика на элемент
        settingsProfile(); // Открытие настроек профиля
      }
    }, {once: true});  // Событие срабатывает только один раз
  });
}

// Настройки профиля
function settingsProfile() {
  // Проверка открыты ли настройки, если нет, то отрисовываем
  let settings = document.querySelector('.profile__settings');
  if (!settings) {
    taskWrapper.insertAdjacentHTML('beforeend', templateSettings());
    
    // Перезаписываем переменную, добавляя туда созданный элемент
    settings = document.querySelector('.profile__settings');
    let settingsItem = settings.querySelectorAll('.settings__item');
    changeSettings(settingsItem);  // Инициализация событий для изменения настроек

    // Кнопка для закрытия настроек
    let hideSettings = document.querySelector('.profile__back-to-tusk');
    hideSettings.addEventListener('click', () => {
      settings.remove();  // Удаление настроек
      taskWrapper.querySelector('.profile__task').removeAttribute('style');  // Восстановление отображения задач
      taskWrapper.querySelector('.taskList').removeAttribute('style');
    });
  }
}

// Изменение профиля пользователя
function changeSettings(elems) {
  elems.forEach((setting) => {
    let changeValue = setting.querySelector('.setting__change');
    let settingInput = setting.querySelector('.settings__input');
    let settingValue = settingInput.value;
    
    setting.addEventListener('click', function (e) {
      e.preventDefault();
      
      if(e.target === changeValue) {
        settingInput.toggleAttribute('readonly');  // Переключение режима редактирования
        settingInput.classList.toggle('settings__active');  // Изменение стиля инпута
        
        // Изменение кнопки Edit
        if (changeValue.textContent === 'Edit' || changeValue.textContent === 'Create new') {
          changeValue.style.color = '#AEAEAE';
          changeValue.textContent = 'Cancel';
          renderInput(setting, settingInput);  // Отрисовка подсказки и кнопки сохранения
          resetPositionHint(elems);
          settingValue = settingInput.value;
        } else {
          changeValue.textContent = 'Edit';
          changeValue.style.removeProperty('color');
          settingInput.value = settingValue;
          removeChangeSettings(setting);
          resetPositionHint(elems);
        }
        
      } else if (e.target === setting.querySelector('.save-change')) {
        changeValue.textContent = 'Edit';
        changeValue.style.removeProperty('color');
        
        // Обновление данных пользователя в массиве users
        if (settingInput.id === 'name') {
          nameUser = settingInput.value;
        } else if (settingInput.id === 'email') {
          emailUser = settingInput.value;
        } else if (settingInput.id === 'password') {
          passwordUser = settingInput.value;
        }
        
        // Сохранение изменений в массив users
        const currentUserId = localStorage.getItem("currentUserId");
        const currentUser = users.find(user => user.id === parseInt(currentUserId));
        if (currentUser) {
          currentUser.name = nameUser;
          currentUser.email = emailUser;
          currentUser.password = passwordUser;
        }
        
        // Сохранение обновленного массива пользователей в localStorage
        localStorage.setItem("userData", JSON.stringify(users));
        
        // Обновление отображения имени пользователя в интерфейсе
        document.querySelector('.profile__user_name').textContent = nameUser;
        document.querySelector('.profile__user_photo').textContent = nameUser[0];
        setting.parentNode.querySelector('.profile__user_name').textContent = nameUser;
        setting.parentNode.querySelector('.profile__user_photo').textContent = nameUser[0];

        removeChangeSettings(setting);
        resetPositionHint(elems);
        settingInput.toggleAttribute('readonly');  // Переключение режима редактирования
        settingInput.classList.toggle('settings__active');  // Изменение стиля инпута
      }
    });
  });
}
function removeChangeSettings (elem) {
          elem.querySelector('.save-change').remove();  // Удаление кнопки сохранения
          elem.querySelector('.settings__hint').remove();  // Удаление подсказки
          elem.querySelector('.input__hint').remove();  // Удаление инпута подсказки
}
// Функция для отображения кнопки сохранения и подсказки
function renderInput (elem, input) {
  let saveBtnTemplate = `<button class='save-change'>Save</button>`;
  let hint = `<div class='input__hint input__hint-${input.name}'>${input.name}</div>`;
  elem.insertAdjacentHTML('beforeend', `${saveBtnTemplate}`);
  elem.querySelector('div:first-child').insertAdjacentHTML('afterend', `<div class='settings__hint'>This will be used for logging in and account recovery</div>`);  
  input.insertAdjacentHTML('beforebegin', hint);

  const hintElement = elem.querySelector(`.input__hint-${input.name}`);
  const rect = input.getBoundingClientRect();
  const parentRect = elem.getBoundingClientRect();
  // Расчет и установка позиции подсказки

  hintElement.style.top = `${rect.top - parentRect.top - 6}px`;
  hintElement.style.left = `${rect.left - parentRect.left + 17}px`;
}
function resetPositionHint (elems) {
  elems.forEach((elem) => {
            const input = elem.querySelector('.settings__input');
            if (!input.hasAttribute('readonly')) {
              const hint = elem.querySelector(`.input__hint-${input.name}`);
              if (hint) {
                  const rect = input.getBoundingClientRect();
                  const parentRect = elem.getBoundingClientRect();
                  hint.style.top = `${rect.top - parentRect.top - 6}px`;
                  hint.style.left = `${rect.left - parentRect.left + 17}px`;
              }
            }
          });
}
// Отрисовка настроек профиля
function templateSettings() {
  // Прячем задачи
  taskWrapper.querySelector('.profile__task').style.display = 'none';
  taskWrapper.querySelector('.taskList').style.display = 'none';
  
  // Возвращаем HTML для отображения настроек
  return `
      <div class="profile__settings">
      <div><button class='profile__back-to-tusk'>Back to tasks</button></div>
          <div class="profile__settings_title">
          Settings
          </div>
          <div class='settings__profile-user'>
            <div class='profile__user_photo'>${nameUser[0]}</div>
            <div class='profile__user_name'>${nameUser}</div>
          </div>
            <div class='settings__item'>
              <div><span class='settings__name'>Name</span><label class='setting__change' for='name'>Edit</label></div>
              <input class="settings__input" name="Name" type="text" id='name' value="${nameUser}" readonly = 'true'/>
            </div>
            <div class='settings__item'>
            <div><span class='settings__name'>E-mail</span><label class='setting__change' for='email'>Edit</label></div>
              <input class="settings__input" name="email" type="email" value="${emailUser}" id='email' readonly = 'true'/>
            </div>
            <div class='settings__item'>
            <div><span class='settings__name'>Password</span><label class='setting__change' for='password'>Create new</label></div>
              <input class="settings__input" name="password" type="password" value="${passwordUser}" id='password' readonly = 'true'/>
            </div>
          </div>
  `;
}