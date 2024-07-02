document.addEventListener("DOMContentLoaded", function () {
  updateForm(loginTemplate());
});

const formContainer = document.querySelector(".entryForm");

formContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("registration")) {
    updateForm(SignupTemplate());
  } else if (e.target.classList.contains("login")) {
    updateForm(loginTemplate());
  }
});

function updateForm(template) {
  formContainer.innerHTML = template;
  whatIsForm();
}

function whatIsForm() {
  const submitBtn = document.querySelector(".entryForm__btn");
  const formName = document
    .querySelector(".entryForm__wrapper")
    .querySelector(".formName").textContent;
  formValidation(formName);

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (isFormValid()) {
      redirectToPage();
    }
  });
}

function isFormValid() {
  const inputs = document
    .querySelector(".entryForm__form")
    .getElementsByTagName("input");
  let valid = true;

  for (let input of inputs) {
    if (!input.classList.contains("isValid")) {
      valid = false;
      formError(input);
    }
  }
  return valid;
}

function redirectToPage() {
  const submitBtn = document.querySelector(".entryForm__btn");
  if (submitBtn.textContent === "Log in") {
    window.location.href = "test.html";
  } else if (submitBtn.textContent === "SignUp") {
    window.location.href = "index.html";
  }
}

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
          <input type="checkbox" name="policyPrivacy" id="policy" class='check__input'/> I agree with the
          <span class='check__box'></span>
          <a href='#'>Policy Privacy</a>
        </label>
      </form>
      <div class="entryForm__signIn">
        <p>Do you have an account? <button class="login toggleForm">Log in</button></p>
      </div>
    </div>`;
}

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
    for (let input of inputs) {
      hint(input);
      hideHint(input);
      formError(input);
      document
        .querySelector(".entryForm__btn")
        .addEventListener("click", () => {
          validaton(input);
          formError(input);
        });
    }
  } else if (formName === "Sign up") {
    for (let input of inputs) {
      hint(input);
      hideHint(input);
      formError(input);
      input.addEventListener("blur", () => {
        validaton(input);
        formError(input);
        toggleSubmitButtonState();
      });
    }
  }
  const passwordImg = document.querySelector(".password img");
  passwordImg.addEventListener("click", () =>
    togglePasswordVisibility(passwordImg)
  );
}

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

function hideHint(elem) {
  elem.addEventListener("blur", (e) => {
    if (elem.value === "") {
      e.target.parentNode.classList.remove("showHint");
      const hintElem = e.target.parentNode.querySelector(".input__hint");
      if (hintElem) hintElem.remove();
    }
  });
}

function createHint(elem) {
  elem.insertAdjacentHTML(
    "beforebegin",
    `<div class='input__hint'>${elem.name}</div>`
  );
}

function formError(elem) {
  const inputName = elem.name.toLowerCase();
  const errorElement = elem.parentNode.querySelector(".entryForm__error");

  if (elem.classList.contains("notValid") && !errorElement) {
    elem.parentNode.insertAdjacentHTML(
      "beforeend",
      `<span class='entryForm__error'>Wrong ${inputName}</span>`
    );
  } else if (elem.classList.contains("isValid") && errorElement) {
    errorElement.remove();
  }
}

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
      input.value !== "" &&
      input.value === document.getElementById("password").value
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
      break;
    case "policyPrivacy":
      input.checked
        ? input.classList.add("isValid")
        : input.classList.add("notValid");
      break;
  }
}

function togglePasswordVisibility(img) {
  const input = img.previousElementSibling;
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  img.classList.toggle("hidePas", !isPassword);
  img.classList.toggle("showPas", isPassword);
}

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
