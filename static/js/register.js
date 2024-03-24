if (localStorage.getItem("token")) {
  document.location = "/";
}
const form = document.querySelector("#registerForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let nameInput = document.querySelector("#name").value.trim();
  let lastNameInput = document.querySelector("#lastName").value.trim();
  let email = document.querySelector("#mail").value.trim();
  let password = document.querySelector("#pass").value.trim();
  let country = document.querySelector("#country").value.trim();
  let phone = document.querySelector("#phone").value.trim();
  let description = document.querySelector("#textarea").value.trim();
  let allInputs = form.querySelectorAll("div input");
  allInputs.forEach((e) => {
    e.style.borderColor = "#33333360";
  });

  const result = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nameInput,
      lastNameInput,
      email,
      password,
      country,
      phone,
      description,
    }),
  }).then((response) => response.json());

  if (result.status === "ok") {
    localStorage.setItem("token", result.token);
    document.location = "/complete ";
  } else if (result.status === "validation") {
    let validateErrorsArray = result.validateErrors;

    validateErrorsArray.forEach((errorId) => {
      let inputElements = document.querySelector(`#${errorId}`);
      inputElements.style.borderColor = "red";
      inputElements.placeholder = "Invalid format";
      inputElements.value = "";
    });
  }

  if (result.status === "mail") {
    document.querySelector("#mail").style.borderColor = "red";
    document.querySelector("#mail").value = "";
    alert("Mail is already used");
  }
});
