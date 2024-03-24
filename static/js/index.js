//load from mongodb
const token = localStorage.getItem("token");
let profilePicture;
async function writeLeftContainer(result) {
  //name information

  profilePicture = result.profilePicture;
  console.log(profilePicture);

  document.querySelector(
    ".add-post-picture "
  ).innerHTML = `<img src="${profilePicture}" alt="User Background" />
  `;

  document.querySelector(
    ".header-profile-picture "
  ).innerHTML = `<img src="${profilePicture}" alt="User Background" />
  `;

  document.querySelector(
    ".user-profile-picture"
  ).innerHTML = `<img src="${profilePicture}" alt="User Background" />
  `;

  document.querySelector(
    ".user-name"
  ).innerHTML = `<h4 class="redirect-profile" user-id="${result.id}">${result.name} ${result.lastName}</h4>
                <p>${result.email} </p>
`;

  //numbers information
  document.querySelector(
    ".user-information"
  ).innerHTML = ` <div class="container">
  <div class="user-post-information">
    <h6>${result.postsNumber}</h6>
    <p>Posts</p>
  </div>

  <div class="user-followers-information">
    <h6>${result.friendsNumber}</h6>
    <p>Friends</p>
  </div>

  <div class="user-following-information">
    <h6>${result.reactionsNumber}</h6>
    <p>Reactions</p>
  </div>
</div>`;

  //recomended profile information
  for (let i = 3; i >= 0; i--) {
    document.querySelector(
      ".user-recommended"
    ).innerHTML += `<div class="redirect-profile recommended-people people-ifnormation-container" user-id="${result.allIds[i]}" >
      <div class="recommended-profile-picture people-info-img">
        <img
          src="${result.base64Images[i]}"
          alt="Nenad Spremic profile picture"
        />
      </div>

      <div class="recommended-profile-information people-info">
        <div class="recommended-profile-name people-info-name">
          <h4>${result.allName[i]} ${result.allLastName[i]}</h4>
        </div>
        <div class="recommended-profile-status people-info-status">
          <p>Objava na profilu ${result.allPostNumber[i]}</p>
        </div>
      </div>
    </div>
`;
  }

  //friends list
  for (let i = 0; i < result.friendsNumber; i++) {
    document.querySelector(".message-list-container").innerHTML += `
  <div class="friends-container ${result.friendsId[i]}">
          <div class="img">
            <img src="/Screenshot_1.png" alt="${result.friendsNames[i]} ${result.friendsLastName[i]}" />
          </div>
          <div class="txt">
            <h6>${result.friendsNames[i]} ${result.friendsLastName[i]} </h6>
            <span>offline</span>
          </div>
        </div>


  `;
  }
}

function loadStatus(allPost, myReactionsID) {
  const postContainer = document.querySelector("#post");
  const postID = [];
  const postName = [];
  const postLastName = [];
  const postOwnerImg = [];
  const postOwnerID = [];
  const postDate = [];
  const postFelling = [];
  const postDescription = [];
  const postPictureUrl = [];
  const postPictureStyle = [];
  const postLikesNumber = [];
  const postCommentsNumber = [];
  const postCommentsName = [];
  const postCommentsLastName = [];
  const postCommentsID = [];
  const postComments = [];
  const postCommentsDate = [];
  for (let i = allPost.length - 1; i >= 0; i--) {
    const obj = allPost[i];
    postID.push(obj.id);
    postName.push(obj.name);
    postLastName.push(obj.lastName);
    postOwnerImg.push(obj.postOwnerImg);
    postOwnerID.push(obj.postOwnerID);
    postDate.push(obj.date);
    postFelling.push(obj.felling);
    postDescription.push(obj.description);
    postPictureUrl.push(obj.pictureUrl);
    postPictureStyle.push(obj.pictureStyle);
    postLikesNumber.push(obj.likesNumber);
    postCommentsNumber.push(obj.commentsNumber);
    postCommentsName.push(obj.commentsName);
    postCommentsLastName.push(obj.commentsLastName);
    postCommentsID.push(obj.commentsID);
    postComments.push(obj.comments);
    postCommentsDate.push(obj.commentsDate);
  }

  for (let i = 0; i < allPost.length; i++) {
    postContainer.innerHTML += `<div class="post-container" id="${postID[i]}">
      <div class="post-status-container">
        <div class="post-status">
          <div class="post-status-header">
            <div class="img">
              <img src="${postOwnerImg[i]}" alt="Nenad spremic" />
            </div>
            <div class="name">
              <h4 class="redirect-profile" user-id="${postOwnerID[i]}">${postName[i]} ${postLastName[i]}</h4>
              <p>${postDate[i]}</p>
            </div>
          </div>

          <div class="post-status-content">
            <div class="post-status-felling">
              <p> ${postFelling[i]} </p>
            </div>

            <div class="post-status-text">
              <p>
              ${postDescription[i]}
              </p>
            </div>

            <div class="post-status-img" style="display:${postPictureStyle[i]}">
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
                        src="${postPictureUrl[i]}"
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
                <span>${postLikesNumber[i]}</span>
              </div>

              <div class="comments-info open-all-comments"><span>Comments: ${postCommentsNumber[i]}</span></div>
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

  //color likes status
  myReactionsID.forEach((id) => {
    const element = document.getElementById(id);
    const likes = element.querySelector(".like");
    likes.style.backgroundColor = "#2596be";
  });

  loadComments(allPost);
  reactionFunctionContainer();
  addCommentFunctionContainer();
  redirectProfile();
}

//add comments and load comments
async function loadComments(allPost) {
  const backJSON = allPost;
  const openAllComments = document.querySelectorAll(".open-all-comments");
  backJSON.forEach((item) => {
    const element = document.getElementById(item.id);
    const commentContainer = element.querySelector(
      ".post-status-comments-container"
    );
    const commentsLength = item.comments;
    if (commentsLength.length > 0) {
      const lastCommentIndex = commentsLength.length - 1;
      const firstComment = item.comments[lastCommentIndex];
      const firstName = item.commentsName[lastCommentIndex];
      const lastName = item.commentsLastName[lastCommentIndex];
      const date = item.commentsDate[lastCommentIndex];
      const userID = item.commentsID[lastCommentIndex];
      const userProfilePicture = item.commentsProfilePicture[lastCommentIndex];
      console.log(item.commentsProfilePicture);
      commentContainer.innerHTML += `
        <div class="container">
          <div class="comment-container">
            <div class="left">
              <div class="img">
                <img src="${userProfilePicture}" alt="Nenad Spremic" />
              </div>
            </div>
            <div class="right">
              <div class="comment">
                <h6 class="redirect-profile" user-id="${userID}" >${firstName} ${lastName}</h6>
                <p>${firstComment}</p>
              </div>
              <div class="date"><span>${date}</span></div>
            </div>
          </div>
        </div>`;
    }
  });

  openAllComments.forEach((element) => {
    element.addEventListener("click", () => {
      let elementContainer = element.closest(".post-container");
      let postID = elementContainer.id;
      let desiredPost = backJSON.find((post) => post.id === postID);
      const commentContainer = elementContainer.querySelector(
        ".post-status-comments-container"
      );
      if (desiredPost.comments.length > 1) {
        if (commentContainer.querySelectorAll(".container").length > 1) {
          const lastCommentIndex = desiredPost.comments.length - 1;

          commentContainer.innerHTML = `
           <div class="container">
             <div class="comment-container">
               <div class="left">
                 <div class="img">
                   <img src="${desiredPost.commentsProfilePicture[lastCommentIndex]}" alt="Nenad Spremic" />
                 </div>
               </div>
               <div class="right">
                 <div class="comment">
                  <h6 class="redirect-profile" user-id="${desiredPost.commentsID[lastCommentIndex]}" >${desiredPost.commentsName[lastCommentIndex]} ${desiredPost.commentsLastName[lastCommentIndex]}</h6>
                    <p>${desiredPost.comments[lastCommentIndex]}</p>
                 </div>
                 <div class="date"><span>${desiredPost.commentsDate[lastCommentIndex]}</span></div>
               </div>
             </div>
           </div>`;
          redirectProfile();
        } else {
          commentContainer.innerHTML = "";
          for (let i = desiredPost.comments.length - 1; i >= 0; i--) {
            commentContainer.innerHTML += `
          <div class="container">
            <div class="comment-container">
              <div class="left">
                <div class="img">
                  <img src="${desiredPost.commentsProfilePicture[i]}" alt="Nenad Spremic" />
                </div>
              </div>
              <div class="right">
                <div class="comment">
                  <h6 class="redirect-profile" user-id="${desiredPost.commentsID[i]}" >${desiredPost.commentsName[i]} ${desiredPost.commentsLastName[i]}</h6>
                  <p>${desiredPost.comments[i]}</p>
                </div>
                <div class="date"><span>${desiredPost.commentsDate[i]}</span></div>
              </div>
            </div>
          </div>`;
          }
          redirectProfile();
        }
      }
    });
  });
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
        body: JSON.stringify({ postID, input, token }),
      }).then((response) => response.json());

      if (result.status === "ok") {
        const commentsNumberContainer = document.querySelector(
          ".comments-info span"
        );
        commentsNumberContainer.innerHTML = `Comments: ${result.newCommentsNumber}`;
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
    body: JSON.stringify({ id, token }),
  }).then((response) => response.json());

  if (result.status === "ok") {
    const userReactionNumber = document.querySelector(
      ".user-following-information h6"
    );
    userReactionNumber.innerHTML = result.newUserReactionNumber;

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
