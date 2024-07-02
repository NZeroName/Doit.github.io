const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^[а-яёa-z'-]{2,50}$/i;
const pasRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function inputHint() {
  let inputs = document
    .querySelector(".entryForm__form")
    .getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    whatIsForm(inputs[i]);
    inputs[i].addEventListener("focus", (e) => {
      if (
        !e.target.parentNode.classList.contains("showHint") &&
        !e.target.classList.contains("check__input")
      ) {
        e.target.parentNode.classList.add("showHint");
        createHint(inputs[i]);
      }
    });

    inputs[i].addEventListener("blur", (e) => {
      if (document.querySelector(".entryForm__btn").textContent === "Log in") {
        whatIsForm(input[i]);
      } else if (
        inputs[i].value === "" &&
        inputs[i].classList.contains("notValid")
      ) {
        return false;
      } else if (inputs[i].value === "") {
        e.target.parentNode.classList.remove("showHint");
        e.target.parentNode.querySelector(".input__hint").remove();
      } else validaton(inputs[i]);
    });
  }
}
