if (localStorage.getItem("token")) {
  document.location = "/";
}

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let email = document.querySelector("#email").value.trim();
  let password = document.querySelector("#password").value.trim();
  const result = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((response) => response.json());

  if (result.status === "err") {
    document.querySelector(".writeErr").innerHTML =
      "Incorrect address or password";
  } else if (result.status === "ok") {
    await localStorage.setItem("token", result.token);
    document.location = "/";
  }
});
