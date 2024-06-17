//header
const cloneToken = localStorage.getItem("token");
if (!cloneToken) {
  window.location = "/login";
}

const currentWindowLocation = window.location.pathname;
let dynmicLoadApi;
let profilePicture;

window.addEventListener("load", async () => {
  if (currentWindowLocation === "/profile") {
    dynmicLoadApi = "/api/profileDynmicLoad";
  } else if (currentWindowLocation === "/") {
    dynmicLoadApi = "/api/dynmicLoad";
  }

  const result = await fetch(dynmicLoadApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cloneToken,
    }),
  }).then((response) => response.json());
  if (result.status === "ok") {
    profilePicture = result.profilePicture;
    const writeFreindsData = {
      friendsNumber: result.friendsNumber,
      friendsId: result.friendsId,
      friendsImg: result.friendsImg,
      friendsNames: result.friendsNames,
      friendsLastName: result.friendsLastName,
    };
    writeProfilePictures();
    loadStatus(result);
    writeFriends(writeFreindsData);

    if (currentWindowLocation === "/profile") {
      const userInfo = {
        top: {
          id: result.id,
          name: result.name,
          lastName: result.lastName,
          profilePicture: profilePicture,
          postsNumber: result.postsNumber,
          friendsNumber: result.friendsNumber,
          reactionsNumber: result.reactionsNumber,
        },

        left: {
          description: result.description,
          joined: result.joined,
          email: result.email,
          country: result.country,
          phone: result.phone,
        },

        popupInfo: {
          name: result.name,
          lastName: result.lastName,
          email: result.email,
          country: result.country,
          phone: result.phone,
          description: result.description,
        },
      };

      const headerInfo = userInfo.top;
      const leftInfo = userInfo.left;
      const popupInfo = userInfo.popupInfo;
      writeHeaderProfile(headerInfo);
      writeLeftProfile(leftInfo);
      writeEditPopup(popupInfo);
    } else if (currentWindowLocation === "/") {
      const leftInfo = {
        id: result.id,
        name: result.name,
        lastName: result.lastName,
        email: result.email,
        postsNumber: result.postsNumber,
        friendsNumber: result.friendsNumber,
        reactionsNumber: result.reactionsNumber,
        lastFourIds: result.lastFourIds,
        lastFourPictures: result.lastFourPictures,
        lastFourNames: result.lastFourNames,
        lastFourLastNames: result.lastFourLastNames,
        lastFourPostNumber: result.lastFourPostNumber,
        friendsId: result.friendsId,
        friendsImg: result.friendsImg,
        friendsNames: result.friendsNames,
        friendsLastName: result.friendsLastName,
      };
      writeLeftContainer(leftInfo);
    }
  }
});

//write user profiles pictures
function writeProfilePictures() {
  document.querySelector(
    ".header-profile-picture"
  ).innerHTML = `<img src="${profilePicture}" alt="User Background" />
`;
  document.querySelector(
    ".add-post-picture "
  ).innerHTML = `<img src="${profilePicture}" alt="User Background" />
`;
}

//search people
const collapseContainer = document.querySelector(".search-collapse");
async function writeSearchPeople(result) {
  let name = result.name;
  let lastName = result.lastNames;
  let ids = result.ids;
  const profilePicture = result.profilePictures;
  for (let i = name.length - 1; i >= 0; i--) {
    collapseContainer.innerHTML += `<div class="searched-people people-ifnormation-container">
    <div class="collapse-profile-picture people-info-img">
      <img
        src="${profilePicture[i]}"
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

  paandingFriends();
  requestFriends();
  friends();

  function updateFriendStatus(response, newIcon, title) {
    response.forEach((id) => {
      const elements = document.querySelectorAll(
        `.collapse-profile-information[user-id="${id}"]`
      );
      elements.forEach((element) => {
        const parent = element.parentElement;
        const icon = parent.querySelector(".material-symbols-outlined");
        icon.innerHTML = newIcon;
        icon.title = title;
      });
    });
  }
}

let searchedApiValidation = undefined;
const searchInput = document.querySelector("#headerSearch");
searchInput.addEventListener("input", searchPeople);
function searchPeople() {
  if (searchedApiValidation === undefined) {
    getAllPeopleInformation();
    searchedApiValidation = true;
  }
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
}

async function getAllPeopleInformation() {
  const result = await fetch("/api/sendAllUsersInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cloneToken,
    }),
  }).then((response) => response.json());
  if (result.status === "ok") {
    writeSearchPeople(result);
  }
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
        cloneToken,
        userID,
      }),
    }).then((response) => response.json());

    if (response.status === "ok") {
      target.innerHTML = newHTML;
      target.title = newTitle;
    }
    if (response.userNewValue) {
      document.querySelector(".user-followers-information h6").innerHTML =
        response.userNewValue;
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
    formData.append("cloneToken", cloneToken);
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

function loadStatus(result) {
  let currentLoopValue;
  let myReactionsID = result.myReactionsID;
  const postContainer = document.querySelector("#post");
  for (let i = result.postsIds.length - 1; i >= 0; i--) {
    if (currentWindowLocation === "/profile") {
      currentLoopValue = 0;
    } else if (currentWindowLocation === "/") {
      currentLoopValue = i;
    }

    postContainer.innerHTML += `<div class="post-container" id="${result.postsIds[i]}">
    <div class="post-status-container">
      <div class="post-status">
        <div class="post-status-header">
          <div class="img">
            <img src="${result.postOwnerImg[currentLoopValue]}" alt="Nenad spremic" />
          </div>
          <div class="name">
            <h4 class="redirect-profile" user-id="${result.postOwnerID[currentLoopValue]}">${result.postName[currentLoopValue]} ${result.postLastName[currentLoopValue]}</h4>
            <p>${result.postDate[i]}</p>
          </div>
        </div>
  
        <div class="post-status-content">
          <div class="post-status-felling">
            <p> ${result.postFelling[i]} </p>
          </div>
  
          <div class="post-status-text">
            <p>
            ${result.postDescription[i]}
            </p>
          </div>
  
          <div class="post-status-img" style="display:${result.postPictureStyle[i]}">
            <!-- Gallery -->
            <div
              class="ecommerce-gallery"
              data-mdb-zoom-effect="true"
              data-mdb-auto-height="true"
            >
              <div class="row py-3 shadow-5">
                <div class="col-12 mb-1">
                  <div class="lightbox">
                    <img
                      src="${result.postPicture[i]}"
                      alt="Gallery image 1"
                      class="ecommerce-gallery-main-img active w-100"
                      style="height: 450px"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- Gallery -->
          </div>
        </div>
  
        <div class="post-status-footer">
          <div class="post-likes-comments-info">
            <div class="post-likes-info">
              <i class="fa fa-heart" aria-hidden="true"></i>
              <span>${result.likesNumber[i]}</span>
            </div>
  
            <div class="comments-info open-all-comments"><span>Comments: ${result.commentsNumber[i]}</span></div>
          </div>
        </div>
  
        <div class="frist-status-border"></div>
  
        <div class="post-status-reactions">
          <div class="like">
            <span class="material-symbols-outlined"> favorite </span>
            <p>Like</p>
          </div>
          <div class="comment open-all-comments">
            <span class="material-symbols-outlined"> tooltip </span>
            <p>Comment</p>
          </div>
          <div class="message">
            <span class="material-symbols-outlined"> forum </span>
            <p>Message</p>
          </div>
        </div>
  
        <div class="second-status-border"></div>
  
        <div class="post-status-comments-container"></div>
  
          <div class="comment-form-container">
            <form>
              <div class="img">
                <img src="${profilePicture}" alt="Taj i taj" />
              </div>
  
              <div class="comment-input">
                <input
                  type="text"
                  placeholder="Write comment"
                />
              </div>
            </form>
          </div>
        </div>
      </div>  
    </div>
  </div>`;
  }

  // color likes status
  myReactionsID.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      const likes = element.querySelector(".like");
      likes.style.backgroundColor = "#2596be";
    }
  });

  writeComments();
  reactionFunctionContainer();
  addCommentFunctionContainer();
  redirectProfile();
}

function writeFriends(writeFreindsData) {
  console.log(writeFreindsData.friendsNumber);
  for (let i = 0; i < writeFreindsData.friendsNumber; i++) {
    document.querySelector(".message-list-container").innerHTML += `
  <div class="friends-container" user-id="${writeFreindsData.friendsNames[i]}">
          <div class="img">
            <img src="${writeFreindsData.friendsImg[i]}" alt="${writeFreindsData.friendsNames[i]} ${writeFreindsData.friendsLastName[i]}" />
          </div>
          <div class="txt">
            <h6>${writeFreindsData.friendsNames[i]} ${writeFreindsData.friendsLastName[i]} </h6>
            <span>offline</span>
          </div>
        </div>

  `;
  }
}

function checkDeleteProfiles() {
  const commentsArray = document.querySelectorAll(".comment-container h6");
  commentsArray.forEach((comments) => {
    if (comments.innerHTML === "undefined undefined") {
      comments.innerHTML = "Deleted profile";
      const parrent = comments.parentElement.parentElement.parentElement;
      const img = (parrent.querySelector("img").src = "/deletedUser.png");
      const userId = parrent.querySelector(".redirect-profile");
      userId.setAttribute("user-id", "/");
    }
  });
}

async function writeComments() {
  const openAllComments = document.querySelectorAll(".open-all-comments");
  openAllComments.forEach((element) => {
    element.addEventListener("click", async () => {
      let elementContainer = element.closest(".post-container");
      let postID = elementContainer.id;
      const result = await commentsApi(postID);
      const commentContainer = elementContainer.querySelector(
        ".post-status-comments-container"
      );
      const length = result.length;

      if (length > 0) {
        if (commentContainer.querySelectorAll(".container").length > 0) {
          commentContainer.innerHTML = "";
        } else {
          commentContainer.innerHTML = "";
          for (let i = length - 1; i >= 0; i--) {
            commentContainer.innerHTML += `
            <div class="container">
              <div class="comment-container">
                <div class="left">
                  <div class="img">
                    <img src="${result.profilePictures[i]}" alt="Profile picture" />
                  </div>
                </div>
                <div class="right">
                  <div class="comment">
                    <h6 class="redirect-profile" user-id="${result.usersIds[i]}" >${result.names[i]} ${result.lastNames[i]}</h6>
                    <p>${result.comments[i]}</p>
                  </div>
                  <div class="date"><span>${result.date[i]}</span></div>
                </div>
              </div>
            </div>`;
          }
          checkDeleteProfiles();
          redirectProfile();
        }
      }
    });
  });
}

async function commentsApi(postID) {
  const response = await fetch("/api/loadComments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postID,
    }),
  });
  return await response.json();
}

function addCommentFunctionContainer() {
  const commentForm = document.querySelectorAll(
    ".comment-form-container form "
  );

  commentForm.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputElement = form.querySelector("input");
      inputElement.disabled = true;
      const postContainer = form.closest(".post-container");
      const postID = postContainer.id;
      const input = form.querySelector("input").value.trim();

      const result = await fetch("/api/addComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postID, input, cloneToken }),
      }).then((response) => response.json());

      if (result.status === "ok") {
        const commentsNumberContainer =
          form.getElementsByClassName(".comments-info");
        commentsNumberContainer.innerHTML = `<span>Comments: ${result.newCommentsNumber}</span>`;
        inputElement.value = "";
        inputElement.disabled = false;
        postContainer.querySelector(
          ".post-status-comments-container"
        ).innerHTML += `
        <div class="container">
            <div class="comment-container">
              <div class="left">
                <div class="img">
                  <img src="${profilePicture}" alt="Nenad Spremic" />
                </div>
              </div>
              <div class="right">
                <div class="comment">
                  <h6>${result.commentsName} ${result.commentsLastName}</h6>
                  <p>${result.comments}</p>
                </div>
                <div class="date"><span>${result.commentsDate}</span></div>
              </div>
            </div>
          </div>`;
      } else if (result.status === "validation") {
        alert("This field cannot be empty");
        inputElement.disabled = false;
      }
    });
  });
}

// LIKE UNLIKE
let isProcessing = false;
function reactionFunctionContainer() {
  let allLikeBtns = document.querySelectorAll(".like");

  allLikeBtns.forEach((element) => {
    element.addEventListener("click", () => {
      if (isProcessing) {
        return;
      }

      isProcessing = true;

      const elementStyle = window.getComputedStyle(element);
      const backgroundColor = elementStyle.backgroundColor;
      const closestPostContainer = element.closest(".post-container").id;

      if (backgroundColor === "rgb(37, 150, 190)") {
        unlikePost(closestPostContainer);
      } else {
        likePost(closestPostContainer);
      }
    });
  });
}

async function likePost(id) {
  await interactWithPost("like", id);
}

async function unlikePost(id) {
  await interactWithPost("unlike", id);
}

async function interactWithPost(action, id) {
  const endpoint = action === "like" ? "/api/likePost" : "/api/unlikePost";

  const result = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, cloneToken }),
  }).then((response) => response.json());

  if (result.status === "ok") {
    if (currentWindowLocation === "/") {
      const userReactionNumber = document.querySelector(
        ".user-following-information h6"
      );
      userReactionNumber.innerHTML = result.newUserReactionNumber;
    }

    const idPosts = document.getElementById(id);
    const likeContainer = idPosts.querySelector(".like");
    likeContainer.style.backgroundColor =
      action === "like" ? "rgb(37, 150, 190)" : "rgb(40,36,36)";

    const likeNumberSpan = idPosts.querySelector(".post-likes-info span");
    likeNumberSpan.innerHTML = result.newPostReactionNumber;

    const interval = setInterval(() => {
      isProcessing = false;
      clearInterval(interval);
    }, 1000);
  }
}

//redirect to profile
function redirectProfile() {
  const redirectProfile = document.querySelectorAll(".redirect-profile");
  redirectProfile.forEach((btns) => {
    btns.addEventListener("click", () => {
      const userID = btns.getAttribute("user-id");
      window.location = `/${userID}`;
    });
  });
}

//alerts
function customAlert(background, bolder, message) {
  const alert = document.querySelector(".custom-alert");
  if (alert.classList.contains("animate__fadeOut")) {
    alert.classList.remove("animate__fadeOut");
    alert.classList.add("animate__fadeIn");
  }

  let backgroundColor;
  if (background === "red") {
    backgroundColor = "#ff4141";
  } else {
    backgroundColor = "green";
  }

  alert.innerHTML = `<div><p><strong>${bolder}</strong> ${message}</p></div>`;
  alert.style.backgroundColor = backgroundColor;
  alert.style.display = "block";

  const interval = setInterval(() => {
    alert.classList.remove("animate__fadeIn");
    alert.classList.add("animate__fadeOut");
    clearInterval(interval);
  }, 2000);
}
