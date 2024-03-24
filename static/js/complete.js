const token = localStorage.getItem("token");
const pictureForm = document.querySelector("#pictureForm");
const addProfilePictureContainer = document.querySelector(
  "#openProfilePicture"
);
const profilePictureInput = document.querySelector("#addProfilePicture");

let profilePictureUrl;
addProfilePictureContainer.addEventListener("click", () => {
  profilePictureInput.click();
});

async function getPictureFromLocalStorage() {
  const response = await fetch("/user.png");
  const blob = await response.blob();
  const file = new File([blob], "user.png", { type: "image/jpeg" });
  return file;
}

async function localStoragePicture() {
  const profilePictureUrl = await getPictureFromLocalStorage();
  const formData = new FormData();
  formData.append("picture", profilePictureUrl);
  formData.append("token", token);
  sendPictureToBack(formData);
}

document.querySelector("#laterSubmit").addEventListener("click", () => {
  localStoragePicture();
});

profilePictureInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  profilePictureUrl = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      addProfilePictureContainer.innerHTML = `<img src="${e.target.result}" alt="addedImages" /> `;
    };
    reader.readAsDataURL(file);
  }
});

pictureForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  if (profilePictureUrl) {
    formData.append("picture", profilePictureUrl);
    formData.append("token", token);
    sendPictureToBack(formData);
  } else {
    alert("Please chose image!");
    return;
  }
});

async function sendPictureToBack(formData) {
  const result = await fetch("/api/profilePicture", {
    method: "POST",
    body: formData,
  }).then((response) => response.json());
  if (result.status === "ok") {
    window.location = "/";
  }
}
