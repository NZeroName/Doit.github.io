"use strict";
// localStorage.clear();
// Получение данных из localStorage
const savedData = localStorage.getItem("userData");
let users = JSON.parse(savedData);
if (savedData) {
  users;
} else {
  users = [];
}
console.log("Загруженные данные из localStorage:", users);

// Инициализация формы при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  updateForm(loginTemplate());
});

const formContainer = document.querySelector(".entryForm");

// Обработчики событий для переключения между формами регистрации и входа
formContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("registration")) {
    updateForm(SignupTemplate());
  } else if (e.target.classList.contains("login")) {
    updateForm(loginTemplate());
  }
});

// Обновление содержимого формы
function updateForm(template) {
  formContainer.innerHTML = template;
  whatIsForm();
}

// Определение типа формы и валидация
function whatIsForm() {
  const formName = document.querySelector(".formName").textContent;
  formValidation(formName);
}

// Проверка валидности формы
function isFormValid() {
  const inputs = document
    .querySelector(".entryForm__form")
    .getElementsByTagName("input");
  let valid = true;

  for (let input of inputs) {
    if (!input.classList.contains("isValid")) {
      valid = false;
    }
  }
  return valid;
}

// Перенаправление на другую страницу после успешного входа/регистрации
function redirectToPage(userId) {
  localStorage.setItem("currentUserId", userId); // Сохранение идентификатора текущего пользователя
  const submitBtn = document.querySelector(".entryForm__btn");
  if (submitBtn.textContent === "Log in") {
    window.location.href = "profile.html";
  } else if (submitBtn.textContent === "SignUp") {
    window.location.href = "index.html";
  }
}

// Шаблон формы регистрации
function SignupTemplate() {
  return `
    <div class="entryForm__wrapper">
      <p class='formName'>Sign up</p>
      <form class="entryForm__form" action="#">
        <div class='name'><input class="entryForm__input" name="Name" type="text" placeholder="Name" /></div>
        <div class='email'><input class="entryForm__input" name="E-mail" type="email" placeholder="Email" /></div>
        <div class='password'>
          <input class="entryForm__input" name="Password" type="password" id='password' placeholder="Password" />
          <img class="eye hidePas" src="img/eye.svg" alt="Toggle Password Visibility" />
        </div>
        <div class='repeatPassword'>
          <input class="entryForm__input" type="password" placeholder="Repeat password" name="Repeat password" id="confirm_password" />
        </div>
        <button class="entryForm__btn btnDisable" type="submit">SignUp</button>
        <label class='check'>
          <input type="checkbox" name="policyPrivacy" id="policy" class='check__input'/> I agree with the&nbsp;
          <span class='check__box'></span>
          <a href='#'>Policy Privacy</a>
        </label>
      </form>
      <div class="entryForm__signIn">
        <p>Do you have an account? <button class="login toggleForm">Log in</button></p>
      </div>
    </div>`;
}

// Шаблон формы входа
function loginTemplate() {
  return `
    <div class="entryForm__wrapper">
      <p class='formName'>Log in</p>
      <form class="entryForm__form" action="#">
        <div class="email">
          <input class="entryForm__input" type="email" name="E-mail" id="email" placeholder="E-mail" />
        </div>
        <div class="password">
          <input class="entryForm__input" type="password" placeholder="Password" id="password" name="Password" />
          <img class="eye hidePas" src="img/eye.svg" alt="Toggle Password Visibility" />
        </div>
        <button class="entryForm__btn" type="submit">Log in</button>
      </form>
      <div class="entryForm__signIn">
        <p>Do you have not an account? <button class="registration toggleForm">Sign in</button></p>
      </div>
    </div>`;
}

function formValidation(formName) {
  const inputs = document
    .querySelector(".entryForm__form")
    .getElementsByTagName("input");

  if (formName === "Log in") {
    Array.from(inputs).forEach((input) => {
      hint(input);
      hideHint(input);
    });

    document.querySelector(".entryForm__btn").addEventListener("click", (e) => {
      e.preventDefault();
      handleLoginForm(inputs);
    });
  } else if (formName === "Sign up") {
    Array.from(inputs).forEach((input) => {
      hint(input);
      hideHint(input);
      input.addEventListener("blur", () => {
        validateInput(input);
        toggleSubmitButtonState();
      });
    });

    document.querySelector(".entryForm__btn").addEventListener("click", (e) => {
      e.preventDefault();
      handleSignUpForm(inputs);
    });
  }

  const passwordImg = document.querySelector(".password img");
  passwordImg.addEventListener("click", () =>
    togglePasswordVisibility(passwordImg)
  );
}

// Обработка формы входа
function handleLoginForm(inputs) {
  Array.from(inputs).forEach((input) => {
    validateInput(input);
  });
  if (isFormValid()) {
    const user = authorization(); // Изменено для возврата пользователя
    if (user) {
      redirectToPage(user.id);
    }
  }
}

// Обработка формы регистрации
function handleSignUpForm(inputs) {
  Array.from(inputs).forEach((input) => {
    validateInput(input);
  });
  if (isFormValid()) {
    const newUser = getFormData();
    if (newUser) {
      storage();
    }
    redirectToPage();
  }
}

// Валидация каждого инпута
function validateInput(input) {
  validaton(input);
  formError(input);
}

// Подсказка при фокусе на элемент
function hint(elem) {
  elem.addEventListener("focus", (e) => {
    if (
      !e.target.parentNode.classList.contains("showHint") &&
      !e.target.classList.contains("check__input")
    ) {
      e.target.parentNode.classList.add("showHint");
      createHint(elem);
    }
  });
}

// Скрытие подсказки при потере фокуса
function hideHint(elem) {
  elem.addEventListener("blur", (e) => {
    if (elem.value === "") {
      e.target.parentNode.classList.remove("showHint");
      const hintElem = e.target.parentNode.querySelector(".input__hint");
      if (hintElem) hintElem.remove();
    }
  });
}

// Создание подсказки
function createHint(elem) {
  elem.insertAdjacentHTML(
    "beforebegin",
    `<div class='input__hint'>${elem.name}</div>`
  );
}

// Отображение ошибки формы
function formError(elem) {
  const inputName = elem.name.toLowerCase();
  const errorElement = elem.parentNode.querySelector(".entryForm__error");

  if (elem.classList.contains("notValid") && !errorElement) {
    elem.parentNode.insertAdjacentHTML(
      "beforeend",
      `<span class='entryForm__error'>Wrong ${inputName}</span>`
    );
  } else if (elem.classList.contains("isValid") && errorElement) {
    removeError(elem);
  }
}
function removeError(input) {
  const errorElement = input.parentNode.querySelector(".entryForm__error");
  if (errorElement) {
    errorElement.remove();
  }
}

// Валидация полей формы
function validaton(input) {
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  const nameRegex = /^[а-яёa-z'-]{2,50}$/i;
  const pasRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  input.classList.remove("isValid");
  input.classList.remove("notValid");

  switch (input.name) {
    case "E-mail":
      emailRegex.test(input.value)
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
      break;
    case "Password":
      pasRegex.test(input.value)
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
      break;
    case "Name":
      nameRegex.test(input.value)
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
      break;
    case "Repeat password":
      const password = document.querySelector('input[name="Password"]').value;
      input.value === password
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
      break;
    case "policyPrivacy":
      input.checked
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
      break;
    default:
      input.value
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
      break;
  }
}

// Переключение видимости пароля
function togglePasswordVisibility(img) {
  const input = img.previousElementSibling;
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  img.classList.toggle("hidePas", !isPassword);
  img.classList.toggle("showPas", isPassword);
}

// Переключение состояния кнопки отправки формы
function toggleSubmitButtonState() {
  const submitBtn = document.querySelector(".entryForm__btn");
  const isValidForm = isFormValid();
  if (isValidForm) {
    submitBtn.classList.remove("btnDisable");
    submitBtn.classList.add("btnEnable");
  } else {
    submitBtn.classList.remove("btnEnable");
    submitBtn.classList.add("btnDisable");
  }
}

// Получение данных формы
function getFormData() {
  const name = document.querySelector('input[name="Name"]').value;
  const email = document.querySelector('input[name="E-mail"]').value;
  const password = document.querySelector('input[name="Password"]').value;
  const id = users.length + 1;

  const formData = {
    id: id,
    name: name,
    email: email,
    password: password,
  };

  // Проверка уникальности почты на клиентской стороне
  if (!isEmailUnique(email)) {
    console.error("Пользователь с такой почтой уже существует.");
    document.querySelector('input[name="E-mail"]').classList.remove("isValid");
    document.querySelector('input[name="E-mail"]').classList.add("notValid");
    formError(document.querySelector('input[name="E-mail"]'));
    return null;
  }

  console.log("Проверка уникальности пройдена. Добавление пользователя...");
  users.push(formData);
  console.log("Текущий список пользователей:", users);
  return formData;
}

// Авторизация пользователя
function authorization() {
  const email = document.querySelector('input[name="E-mail"]');
  const password = document.querySelector('input[name="Password"]');
  const users = JSON.parse(localStorage.getItem("userData")) || [];
  let trueEmail = false;
  let truePassword = false;
  email.classList.remove("notValid");
  email.classList.remove("isValid");
  password.classList.remove("notValid");
  password.classList.remove("isValid");
  if (users.length === 0) {
    email.classList.remove("isValid");
    email.classList.add("notValid");
    formError(email);
    password.classList.remove("isValid");
    password.classList.add("notValid");
    formError(password);
    return;
  }

  users.forEach((user) => {
    for (const key in user) {
      if (!trueEmail && !truePassword) {
        if (user[key] === email.value) {
          trueEmail = true;
          email.classList.remove("notValid");
          email.classList.add("isValid");
          removeError(email);
          if (user.password === password.value) {
            truePassword = true;
            password.classList.remove("notValid");
            password.classList.add("isValid");
          } else {
            password.classList.add("notValid");
            password.classList.remove("isValid");
            formError(password);
            return;
          }
          if (trueEmail && truePassword) {
            removeError(email);
            removeError(password);
            return redirectToPage(user.id);
          }
        } else {
          email.classList.add("notValid");
          password.classList.add("notValid");
          formError(email);
          formError(password);
        }
      } else return;
    }
  });
}

// Сохранение данных в localStorage
function storage() {
  console.log("Сохранение данных в localStorage...");
  const jsonData = JSON.stringify(users);
  localStorage.setItem("userData", jsonData);
  console.log("Данные сохранены:", jsonData);
}

// Проверка уникальности почты
function isEmailUnique(email) {
  return !users.some((user) => user.email === email);
}
