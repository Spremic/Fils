//header
const userToekn = localStorage.getItem("token");

window.addEventListener("load", async () => {
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
    const allPost = result.allPost;
    const myReactionsID = result.myReactionsID;
    writeLeftContainer(result);
    searchPeople(result);
    loadStatus(allPost, myReactionsID);
  }
});

//search people
const collapseContainer = document.querySelector(".search-collapse");
async function searchPeople(result) {
  const searchInput = document.querySelector("#headerSearch");
  let name = result.allName;
  let lastName = result.allLastName;
  let ids = result.allIds;
  for (let i = name.length - 1; i >= 0; i--) {
    collapseContainer.innerHTML += `<div class="searched-people people-ifnormation-container">
    <div class="collapse-profile-picture people-info-img">
      <img
        src="/Screenshot_1.png"
        alt="${name[i]} ${lastName[i]} profile picture"
      />
    </div>

    <div class="redirect-profile collapse-profile-information people-info"  user-id="${ids[i]}">
      <div class="collapse-profile-name people-info-name">
        <h4 class="s-c-name-lastName">${name[i]} ${lastName[i]}</h4>
      </div>
      <div class="collapse-profile-status people-info-status">
        <p>Objava na profilu 20</p>
      </div>
    </div>

    <div class="collapse-add-friends">
      <span class="material-symbols-outlined" title="Add friend"> person_add </span>
    </div>
  </div>`;
  }

  paandingFriends();
  requestFriends();
  friends();
  function paandingFriends() {
    const response = result.panndingFriends;
    const newIcon = "remove_selection";
    const title = "Cancel the request";
    updateFriendStatus(response, newIcon, title);
  }

  function requestFriends() {
    const response = result.requestFriends;
    const newIcon = "person_check";
    const title = "Accept the request";
    updateFriendStatus(response, newIcon, title);
  }

  function friends() {
    const response = result.friends;
    const newIcon = "remove";
    const title = "Delete friend";
    updateFriendStatus(response, newIcon, title);
  }

  function updateFriendStatus(response, newIcon, title) {
    response.forEach((id) => {
      const elements = document.querySelectorAll(
        `.collapse-profile-information[user-id="${id}"]`
      );
      elements.forEach((element) => {
        const attribute = element.getAttribute("user-id");
        const parent = element.parentElement;
        const icon = parent.querySelector(".material-symbols-outlined");
        icon.innerHTML = newIcon;
        icon.title = title;
      });
    });
  }
  searchInput.addEventListener("input", () => {
    let value = searchInput.value.trim().toLowerCase();
    let collection = document.querySelectorAll(".s-c-name-lastName");
    let div = document.querySelectorAll(".searched-people");
    for (i = 0; i < collection.length; i++) {
      if (
        collection[i].innerHTML.toLowerCase().indexOf(value) > -1 &&
        value !== ""
      ) {
        div[i].style.display = "flex";
        collapseContainer.style.display = "block";
      } else {
        div[i].style.display = "none";
      }
    }
    if (value === "") {
      collapseContainer.style.display = "none";
    }
  });
}

//add friends with searchBar
collapseContainer.addEventListener("click", async (e) => {
  const target = e.target;
  const innerHTML = target.innerHTML.trim();
  const peopleInfo = target
    .closest(".searched-people")
    .querySelector(".people-info");
  const userID = peopleInfo.getAttribute("user-id");

  let endpoint, newHTML, newTitle;

  if (innerHTML === "person_add") {
    endpoint = "/api/addFriend";
    newHTML = "remove_selection";
    newTitle = "Cancel the request";
  } else if (innerHTML === "remove_selection") {
    endpoint = "/api/removePaddingFriend";
    newHTML = "person_add";
    newTitle = "Add friend";
  } else if (innerHTML === "person_check") {
    endpoint = "/api/acceptFriend";
    newHTML = "remove";
    newTitle = "Delete friend";
  } else if (innerHTML === "remove") {
    endpoint = "/api/deleteFriends";
    newHTML = "person_add";
    newTitle = "Add friend";
  }

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        userID,
      }),
    }).then((response) => response.json());

    if (response.status === "ok") {
      target.innerHTML = newHTML;
      target.title = newTitle;
    }
  }
});

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
  formFellingContainer.innerHTML = `<p>${icon} ${message}</p>`;
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

//add picture to form
let triggerAddPictureInput = document.querySelectorAll(
  ".triggerAddPictureInput"
);
let addPictureBtn = document.querySelector("#addImageInput");
let formPlaceForPicture = document.querySelector(
  ".submit-picture-container .flex .picture"
);
triggerAddPictureInput.forEach((e) => {
  e.addEventListener("click", (event) => {
    addPictureBtn.click();
  });
});

let pictureUrl;
addPictureBtn.addEventListener("change", (event) => {
  const file = event.target.files[0];
  pictureUrl = file;
  if (file) {
    document.querySelector(".submit-picture-container").style.display = "flex";
    const reader = new FileReader();
    reader.onload = function (e) {
      formPlaceForPicture.innerHTML = `<div>
      <img src="${e.target.result}" alt="addedImages" /> 
    </div>`;
    };
    reader.readAsDataURL(file);
  }
});

document
  .querySelector(".add-post-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    let description = document.querySelector("#addPostTextarea").value.trim();
    let felling = document.querySelector(".submit-reaction-container p");

    if (description === "") {
      alert("Please write message");
      return;
    }
    if (felling === null) {
      felling = "";
    } else {
      felling = felling.innerHTML;
    }

    const formData = new FormData();

    formData.append("description", description);
    formData.append("token", token);
    formData.append("felling", felling);
    if (pictureUrl) {
      formData.append("picture", pictureUrl);
    }

    const result = await fetch("/api/addPost", {
      method: "POST",
      body: formData,
    }).then((response) => response.json());
    if (result.status === "ok") {
      location.reload();
    }
  });
