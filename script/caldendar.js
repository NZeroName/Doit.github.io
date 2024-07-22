function getFormattedDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  document.querySelector(
    ".profile__calendar_date"
  ).innerHTML = `${day} ${month}`;
}
getFormattedDate();
