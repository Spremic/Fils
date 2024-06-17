async function writeLeftContainer(leftInfo) {
  //name information
  document.querySelector(
    ".user-profile-picture"
  ).innerHTML = `<img src="${profilePicture}" alt="User Background" />
  `;

  document.querySelector(
    ".user-name"
  ).innerHTML = `<h4 class="redirect-profile" user-id="${leftInfo.id}">${leftInfo.name} ${leftInfo.lastName}</h4>
                <p>${leftInfo.email} </p>
`;

  //numbers information
  document.querySelector(
    ".user-information"
  ).innerHTML = ` <div class="container">
  <div class="user-post-information">
    <h6>${leftInfo.postsNumber}</h6>
    <p>Posts</p>
  </div>

  <div class="user-followers-information">
    <h6>${leftInfo.friendsNumber}</h6>
    <p>Friends</p>
  </div>

  <div class="user-following-information">
    <h6>${leftInfo.reactionsNumber}</h6>
    <p>Reactions</p>
  </div>
</div>`;

  //recomended profile information
  for (let i = 0; i < leftInfo.lastFourLastNames.length; i++) {
    document.querySelector(
      ".user-recommended"
    ).innerHTML += `<div class="redirect-profile recommended-people people-ifnormation-container" user-id="${leftInfo.lastFourIds[i]}" >
      <div class="recommended-profile-picture people-info-img">
        <img
          src="${leftInfo.lastFourPictures[i]}"
          alt="Nenad Spremic profile picture"
        />
      </div>

      <div class="recommended-profile-information people-info">
        <div class="recommended-profile-name people-info-name">
          <h4>${leftInfo.lastFourNames[i]} ${leftInfo.lastFourLastNames[i]}</h4>
        </div>
        <div class="recommended-profile-status people-info-status">
          <p>Objava na profilu ${leftInfo.lastFourPostNumber[i]}</p>
        </div>
      </div>
    </div>
`;
  }
}
