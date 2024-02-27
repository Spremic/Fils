//load from mongodb
window.addEventListener("load", async () => {
  let token = localStorage.getItem("token");
  const result = await fetch("/api/dynmicLoad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  }).then((response) => response.json());
  if (result.status === "ok") {
    document.querySelector(
      ".user-name"
    ).innerHTML = `<h4>${result.name} ${result.lastName} </h4>
                    <p>${result.email} </p>
    `;
  }
});

