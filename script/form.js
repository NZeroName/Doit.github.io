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
              <div class='name'><input name=" Name" type="name" placeholder="Name" /></div>
              <div class='email'><input name="E-mail" type="email" placeholder="Email" /></div>
              <div class='password'><input name="Password" type="password" placeholder="Password" /></div>
              <div class='repeatPassword'><input
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
                  type="email"
                  name="E-mail"
                  id="email"
                  placeholder="E-mail"
                />
              </div>
              <div class="password">
                <input
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
    if (!inputs[i].classList.contains("check__input")) {
      inputs[i].addEventListener("focus", (e) => {
        return inputs[i].insertAdjacentHTML(
          "beforebegin",
          `<div class='input__hint'>${inputs[i].name}</div>`
        );
      });
    }
    inputs[i].addEventListener("blur", () => {
      if (inputs[i].value === "") {
        return document.querySelector(".input__hint").remove();
      }
    });
  }
}
inputHint();
