let formContainer = document.querySelector(".entryForm"); // Контейнер формы

formContainer.addEventListener("click", (e) => {
  e.preventDefault;
  // Форма регистрации
  if (e.target.classList.contains("registration")) {
    // Удаление первичного шаблона формы
    formContainer.querySelector(".entryForm__wrapper").remove();

    // Отрисовка формы регистрации и подсказки для полей
    formContainer.insertAdjacentHTML("beforeend", SignupTemplate());
    inputHint();
    // Форма входа
  } else if (e.target.classList.contains("login")) {
    // Удаление формы регистрации
    formContainer.querySelector(".entryForm__wrapper").remove();
    // Отрисовка формы входа
    formContainer.insertAdjacentHTML("beforeend", loginTemplate());
    inputHint();
  }
});
function SignupTemplate() {
  return `<div class="entryForm__wrapper">
            <p>Sign up</p>
            <form class="entryForm__form" action="#">
              <div class='name'><input class="entryForm__input" name="Name" type="name" placeholder="Name" /></div>
              <div class='email'><input class="entryForm__input" name="E-mail" type="email" placeholder="Email" /></div>
              <div class='password'><input class="entryForm__input" name="Password" type="password" id='password' placeholder="Password" /></div>
              <div class='repeatPassword'><input
              class="entryForm__input"
                type="password"
                placeholder="Repeat password"
                name="Repeat password"
                id="confirm_password"
              /></div>
              <button class="entryForm__btn" type="submit">SignUp</button>
                <label class='check'>
                  <input type="checkbox" name="policyPrivacy" id="policy" class='check__input'/>I agree with the&nbsp
                  <span class='check__box'></span>
                  <a href='#'>Policy Privacy</a>
                  </label>
            </form>
            <div class="entryForm__signIn">
              <p>
                Do you have an account? <button class="login toggleForm">Log in</button>
              </p>
            </div>
          </div>`;
}
function loginTemplate() {
  return `<div class="entryForm__wrapper">
            <p>Log in</p>
            <form class="entryForm__form" action="#">
              <div class="email">
                <input
                class="entryForm__input"
                  type="email"
                  name="E-mail"
                  id="email"
                  placeholder="E-mail"
                />
              </div>
              <div class="password">
                <input
                class="entryForm__input"
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="Password"
                />
              </div>
              <button class="entryForm__btn" type="submit">Log in</button>
            </form>
            <div class="entryForm__signIn">
              <p>
                Do you have not an account?
                <button class="registration toggleForm">Sign in</button>
              </p>
            </div>
          </div>`;
}
// отрисовка сносок в инпуте
function inputHint() {
  let inputs = document
    .querySelector(".entryForm__form")
    .getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("focus", (e) => {
      e.target.classList.remove("isValid");
      e.target.classList.remove("notValid");
      if (
        !e.target.parentNode.classList.contains("showHint") &&
        !e.target.classList.contains("check__input")
      ) {
        e.target.parentNode.classList.add("showHint");
        createHint(inputs[i]);
      }
    });

    inputs[i].addEventListener("blur", (e) => {
      // Проверка на то, что
      if (inputs[i].value === "" && inputs[i].classList.contains("notValid")) {
        return false;
      } else if (inputs[i].value === "") {
        e.target.parentNode.classList.remove("showHint");
        e.target.parentNode.querySelector(".input__hint").remove();
      } else validaton(inputs[i]);
    });
  }
}
inputHint();

function createHint(elem) {
  return elem.insertAdjacentHTML(
    "beforebegin",
    `<div class='input__hint'>${elem.name}</div>`
  );
}

// Валидация
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^[а-яёa-z'-]{2,50}$/i;
const pasRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function validaton(input) {
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
      input.value === document.getElementById("password").value
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
  }
}
