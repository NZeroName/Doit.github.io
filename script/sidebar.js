// Находим элементы на странице
const sidebar = document.querySelector(".profile__sidebar");
const userIcon = document.querySelector(".profile__user_photo");
const showBtn = document.querySelector(".profile__sidebar_show");
const userName = document.querySelector(".profile__user_name");
// Получение и инициализация данных пользователей из localStorage
let users = JSON.parse(localStorage.getItem("userData")) || [];

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
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log(element.className);
    });
  });
}
function settingsProfile() {
  let userIcon = document.querySelector(".pofile__user_photo");
  userIcon.addEventListener("click", (e) => {
    console.log("Фото");
  });
}
