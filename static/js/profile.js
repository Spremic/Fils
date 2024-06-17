function writeHeaderProfile(headerInfo) {
  const headerProfile = document.querySelector("#profile");
  headerProfile.innerHTML = ` <div class="profile-header-container">
      <div class="background-image">
        <img src="/planet-1702788_1920.jpg" alt="background-image" />
      </div>
  
      <div class="profile-information-container">
        <div class="left">
          <div class="img">
            <img src="${headerInfo.profilePicture}" alt="${headerInfo.name} ${headerInfo.lastName} profile picture" />
          </div>
          <div class="name">
            <h4>${headerInfo.name} ${headerInfo.lastName}</h4>
            <p>${headerInfo.friendsNumber} friends</p>
          </div>
        </div>
  
        <div class="right">
          <button
            type="button"
            data-toggle="modal"
            data-target="#editProfileModal"
          >
            Edit profile
            <span class="material-symbols-outlined"> edit_square </span>
          </button>
        </div>
      </div>
  
      <div class="profile-footer-container">
        <div>
          <span class="material-symbols-outlined"> image </span>
          <p>Posts <span>${headerInfo.postsNumber}</span></p>
        </div>
        <div>
          <span class="material-symbols-outlined"> group </span>
          <p>Friends <span>${headerInfo.friendsNumber}</span></p>
        </div>
        <div>
          <span class="material-symbols-outlined"> favorite </span>
          <p>Likes <span>${headerInfo.reactionsNumber}</span></p>
        </div>
      </div>
    </div>`;
}

function writeLeftProfile(leftInfo) {
  const leftContainer = document.querySelector("#aboutProfile");
  leftContainer.innerHTML = `<div class="container">
  <div class="title"><h5>About</h5></div>
  <div class="about">
    <p>
    ${leftInfo.description} 
    </p>
  </div>

  <div class="joined information">
    <h6>Joined</h6>
    <p>${leftInfo.joined}</p>
  </div>

  <div class="email information">
    <h6>Email:</h6>
    <p>${leftInfo.email}</p>
  </div>

  <div class="country information">
    <h6>Country:</h6>
    <p>${leftInfo.country}aaa</p>
  </div>

  <div class="phone information">
    <h6>Phone:</h6>
    <p>${leftInfo.phone}</p>
  </div>
</div>`;
}

//edit profile form
checkResult();
function checkResult() {
  if (localStorage.getItem("status")) {
    localStorage.removeItem("status");
    const background = "green";
    const bolder = "The new changes";
    const message = "are saved!";
    customAlert(background, bolder, message);
  }
}
function writeEditPopup(popupInfo) {
  const popup = document.querySelector("#editProfileModal .modal-body");
  popup.innerHTML = `<form id="editProfileForm">
<div class="container">
  <div class="input-container">
    <label for="editName">Name</label>
    <input
      type="text"
      id="editName"
      name="editName"
      value="${popupInfo.name}"
    />
  </div>

  <div class="input-container">
    <label for="editLastName">Last name</label>
    <input
      type="text"
      id="editLastName"
      name="editLastName"
      value="${popupInfo.lastName}"
    />
  </div>

  <div class="input-container">
    <label for="editMail">Email</label>
    <input
      type="mail"
      id="editMail"
      name="editMail"
      value="${popupInfo.email}"
    />
  </div>

  <div class="input-container">
    <label for="editPass">Password</label>
    <input
      type="password"
      id="editPass"
      name="editPass"
      value="******"
    />
  </div>

  <div class="input-container">
    <label for="editCountry">Country</label>
    <input
      type="text"
      id="editCountry"
      name="editCountry"
      value="${popupInfo.country}"
    />
  </div>

  <div class="input-container">
    <label for="editPhone">Phone </label>
    <input
      type="text"
      id="editPhone"
      name="editPhone"
      value="${popupInfo.phone}"
    />
  </div>

  <div class="textarea-container">
    <label for="editTextarea"> About me </label>
    <textarea
      name="editTextarea"
      id="editTextarea"
      cols="30"
      rows="10" 
      maxlength="255"
    >${popupInfo.description}</textarea>
    <p>Remaining number of letters: <span>255</span></p>
  </div>
  <button id="submitProfileChanges" type="submit"></button>
</div>
</form>`;

  editProfileFunctionContainer();
}

function editProfileFunctionContainer() {
  const editProfileForm = document.querySelector("#editProfileForm");
  const textarea = document.querySelector("#editTextarea");
  const editBtn = document.querySelector("#editConfrimBtn");

  let newName,
    newLastName,
    newEmail,
    newPassword,
    newCountry,
    newPhone,
    newAboutMe;

  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#editName");
    const lastName = document.querySelector("#editLastName");
    const email = document.querySelector("#editMail");
    const password = document.querySelector("#editPass");
    const country = document.querySelector("#editCountry");
    const phone = document.querySelector("#editPhone");
    const aboutMe = document.querySelector("#editTextarea");

    const allInputs = editProfileForm.querySelectorAll("input");
    allInputs.forEach((inputs) => {
      inputs.style.borderColor = "#ffffff4b";
      aboutMe.style.borderColor = "#ffffff4b";
    });

    const regMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regPhone = /^(\+3\d*)?$/;

    function setInvalidInput(element, message) {
      element.style.borderColor = "red";
      element.value = "";
      element.placeholder = message;
    }

    if (name.value.length < 3) {
      setInvalidInput(name, "");
    }
    if (lastName.value.length < 3) {
      setInvalidInput(lastName, "");
    }
    if (!regMail.test(email.value)) {
      setInvalidInput(email, "Incorrect format");
    }
    if (!regPhone.test(phone.value)) {
      setInvalidInput(phone, "Incorrect format");
    }
    if (password.value.trim().length === 0) {
      setInvalidInput(password, "Incorrect format");
    }

    let allInputsValid = true;

    allInputs.forEach((input) => {
      if (input.style.borderColor !== "rgba(255, 255, 255, 0.294)") {
        allInputsValid = false;
      }
    });

    if (allInputsValid) {
      newName = name.value;
      newLastName = lastName.value;
      newEmail = email.value;
      newPassword = password.value;
      newCountry = country.value;
      newPhone = phone.value;
      newAboutMe = aboutMe.value;
      document.querySelector("#closeEditModal").click();
      document.querySelector("#openConfrimPassModalBTN").click();
      editBtn.style.backgroundColor = "#0d6efd";
      editBtn.innerHTML = "Save";
    }
  });

  document.querySelector("#deleteProfile").addEventListener("click", () => {
    document.querySelector("#closeEditModal").click();
    document.querySelector("#openConfrimPassModalBTN").click();
    editBtn.style.backgroundColor = "red";
    editBtn.innerHTML = "Delete";
  });

  const confrimForm = document.querySelector("#confrimPassForm");
  let formValidation = false;
  confrimForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (formValidation) {
      return;
    }
    formValidation = true;

    const confrimPassInput = document.querySelector("#confrimPassInput");
    const confrimPassValue = confrimPassInput.value;
    let callApi;
    if (editBtn.innerHTML.trim() === "Save") {
      callApi = "/api/editProfileData";
    } else if (editBtn.innerHTML.trim() === "Delete") {
      callApi = "/api/deleteProfileData";
    }

    editBtn.innerHTML = `<span class="btnSpinner"></span> `;

    const result = await fetch(callApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cloneToken,
        newName,
        newLastName,
        newEmail,
        newPassword,
        newCountry,
        newPhone,
        newAboutMe,
        confrimPassValue,
      }),
    }).then((response) => response.json());
    if (result.status === "ok") {
      localStorage.setItem("status", "ok");
      location.reload();
    }

    if (result.status === "password") {
      confrimPassInput.style.borderColor = "red";
      confrimPassInput.placeholder = "Incorrect password";
      if (callApi === "/api/editProfileData") {
        editBtn.innerHTML = "Save";
      } else {
        editBtn.innerHTML = "Delete";
      }
      formValidation = false;
    }

    if (result.status === "mail") {
      const background = "red";
      const bolder = "Email addres";
      const message = "Is alerdy used!";
      customAlert(background, bolder, message);
      document.querySelector("#closeConfrimModal").click();
      document.querySelector("#editMail").style.borderColor = "red";
      formValidation = false;
    }

    if (result.status === "profileDeleted") {
      localStorage.removeItem("token");
      window.location = "/deleted";
    }
  });

  document.querySelector("#editConfrimBtn").addEventListener("click", () => {
    document.querySelector("#confrimPassBTN").click();
  });

  document.querySelector("#triggerSubmitBtn").addEventListener("click", () => {
    document.querySelector("#submitProfileChanges").click();
  });

  textarea.addEventListener("input", () => {
    const length = textarea.value.length;
    document.querySelector(
      ".textarea-container p"
    ).innerHTML = `Remaining number of letters: <span>${255 - length}</span>`;
  });
}
