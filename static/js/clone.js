//header
document.querySelector("#logout").addEventListener("click", async () => {
  await localStorage.clear("token");
  window.location = "/login";
});

//full image
let imageContainer = document.querySelector(".full-image-container");
window.addEventListener("click", (e) => {
  let target = e.target;
  //open fullimage
  if (target.classList.contains("w-100")) {
    let imageUrl = target.getAttribute("src");
    imageContainer.style.display = "flex";
    imageContainer.innerHTML = `  <div class="close">
    <span class="material-symbols-outlined closed-button"> close </span>
  </div>
  <div class="img">
    <img src="${imageUrl}" alt="image" />
  </div>`;
  }

  //close fullImage
  if (target.classList.contains("closed-button")) {
    imageContainer.style.display = "none";
  }
});

// popup for  add felling
let popupFellingContainer = document.querySelector("#addFellingFromPopup");
let formFellingContainer = document.querySelector(".submit-reaction-container");
let closeFormFellingContainer = document.querySelector(
  "#closeAddFelingModal span"
);
function setFellingContent(icon, message) {
  formFellingContainer.innerHTML = `<p><span>${icon}</span> ${message}</p>`;
  closeFormFellingContainer.click();
}

popupFellingContainer.addEventListener("click", (e) => {
  let target = e.target;

  if (
    target.classList.contains("felling-happy") ||
    target.closest(".felling-happy")
  ) {
    setFellingContent("&#128540;", "It feels happy");
  }

  if (
    target.classList.contains("felling-satisfied") ||
    target.closest(".felling-satisfied")
  ) {
    setFellingContent("&#128513;", "It feels satisfied");
  }
  if (
    target.classList.contains("felling-sad") ||
    target.closest(".felling-sad")
  ) {
    setFellingContent("&#128531;", "It feels sad");
  }
});
