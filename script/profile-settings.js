// Находим элементы на странице
const sidebar = document.querySelector(".profile__sidebar");
const userIcon = document.querySelector(".profile__user_photo");
const showBtn = document.querySelector(".profile__sidebar_show");
const userName = document.querySelector(".profile__user_name");
const taskWrapper = document.querySelector('.profile__main')
let nameUser = undefined
let emailUser = undefined
let passwordUser = undefined
// Получение и инициализация данных пользователей из localStorage
let users = JSON.parse(localStorage.getItem("userData")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const currentUserId = localStorage.getItem("currentUserId");
  if (currentUserId) {
    const currentUser = getUserById(currentUserId);
    if (currentUser) {
      nameUser = currentUser.name;
      emailUser = currentUser.email;
      passwordUser = currentUser.password
      sidebar.querySelector(".profile__user_name").innerHTML = nameUser;
      sidebar.querySelector(".profile__user_photo").innerHTML = nameUser[0];
    }
  }
  sidebarEvents();
});

// Функция для получения пользователя по его ID
function getUserById(userId) {
  return users.find((user) => user.id === parseInt(userId));
}
// Функция для переключения боковой панели
function sidebarEvents() {
  showBtn.addEventListener("click", toggleSidebar);
  userIcon.addEventListener("click", toggleUserMenu);
  
}
// Открытие - закрытие сайдбара
function toggleSidebar() {
  sidebar.classList.toggle("showSidebar");
  userName.classList.toggle("showName");
  showBtn.style.rotate = sidebar.classList.contains("showSidebar")
    ? "180deg"
    : "360deg";
}
function toggleUserMenu() {
  let removeSettingsMenu = function (e) {
    if (
      e.target !== userIcon &&
      userIcon.querySelector(".profile__settings-menu")
    ) {
      userIcon.querySelector(".profile__settings-menu").remove();
      document.removeEventListener("click", removeSettingsMenu);
      userIcon.removeEventListener('click', settingsProfile)
    }
  };
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
    menuItemEvents();
    
  }
  document.addEventListener("click", removeSettingsMenu);
}
function menuItemEvents() {
  let menuItems = document
    .querySelector(".profile__settings-menu")
    .querySelectorAll("li");
  menuItems.forEach((element) => {
    element.addEventListener("click", function (e)  {
      e.stopPropagation();
      if (this.classList.contains('settings')) {
        this.parentNode.remove()
        settingsProfile()}
    }, {once: true});
  });
}
// Настройки профиля
function settingsProfile() {
  // Проверка открыты ли настройки, если нет, то отрисовываем
  let settings = document.querySelector('.profile__settings')
  if (!settings) {
    taskWrapper.insertAdjacentHTML('beforeend', templateSettings())
    // Перезаписываем переменнную, добавляя туда созданный элемент
    settings = document.querySelector('.profile__settings')
    let settingsItem = settings.querySelectorAll('.settings__item')
    changeSettings(settingsItem)
    // Кнопка для закрытия настроек
    let hideSettings = document.querySelector('.profile__back-to-tusk')
    hideSettings.addEventListener('click', () => {
      settings.remove()
      taskWrapper.querySelector('.profile__task').removeAttribute('style')
      taskWrapper.querySelector('.taskList').removeAttribute('style')
    })
  }
}
// Изменение профиля пользователя
function changeSettings(elems) {
  elems.forEach((setting) => {
    let changeValue = setting.querySelector('.setting__change')
    let settingValue = setting.querySelector('.settings__input')
      setting.addEventListener('click', function (e) {
        e.preventDefault()
        if(e.target === changeValue) {
          settingValue.removeAttribute('readonly')
        }
      })
    })
}


 // Отрисовка настроек профиля
function templateSettings() {
  // Прячем таски
  taskWrapper.querySelector('.profile__task').style.display = 'none'
  taskWrapper.querySelector('.taskList').style.display = 'none'
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
              <input class="settings__input" name="Name" type="text" placeholder="${nameUser}" id='name' readonly = 'true'/>
            </div>
            <div class='settings__item'>
            <div><span class='settings__name'>E-mail</span><label class='setting__change' for='email'>Edit</label></div>
              <input class="settings__input" name="email" type="email" placeholder="${emailUser}" id='email' readonly = 'true'/>
            </div>
            <div class='settings__item'>
            <div><span class='settings__name'>Password</span><label class='setting__change' for='password'>Create new</label></div>
              <input class="settings__input" name="password" type="password" placeholder="${passwordUser}" id='password' readonly = 'true'/>
            </div>
          </div>
        
  `;
}
