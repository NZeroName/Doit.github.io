// Находим элементы на странице
const sidebar = document.querySelector(".profile__sidebar");
const userIcon = document.querySelector(".profile__user_photo");
const showBtn = document.querySelector(".profile__sidebar_show");
const userName = document.querySelector(".profile__user_name");
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
      if (this.classList.contains('settings')) settingsProfile()
    });
  });
}
function settingsProfile() {
    document.querySelector('.profile__main').insertAdjacentHTML('beforeend', templateSettings())
}
function templateSettings() {
  return `
      <div class="profile__settings">
          <div class="profile__settings_title">
          Settings
          </div>
          <div>
            <div class='profile__settings_photo'>${nameUser[0]}</div>
            <div class='profile__settings_name'>${nameUser}</div>
          </div>
            <div>
              <div>
                <span>Name</span><span>Edit<div>
              </div>
              <input class="entryForm__input" name="Name" type="text" placeholder="${nameUser}" />
            </div>
            <div>
                <span>E-mail</span><span>Edit<div>
              </div>
              <input class="entryForm__input" name="email" type="email" placeholder="${emailUser}" />
            </div>
            <div>
                <span>Password</span><span>Edit<div>
              </div>
              <input class="entryForm__input" name="password" type="password" placeholder="${passwordUser}" />
            </div>
          </div>
        </div>
  `;
}