import { popUp, popupActions } from "../components/popup";
import { spinnerActionsAdd, spinnerActionsRemove } from "../components/spinner";
import "../css/sign-up.style.css"
import { countries } from "../lib/countries";
import Endpoints from "../lib/endpoint";
import { storeData } from "../lib/local-storage";
import { register } from "../lib/register";
const main = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");

const loadRegisterPage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="container">
          <div class="form-wrapper">
            <div class="content left">
                <div class="card">
                  <h2> USER REGISTER</h2>
                  <p class="title-left">Join the Cosmos</p>
                  <form id="user-form">
                    <input type="text" id="user-name" name="user-name" placeholder="Name" required>
                    <input type="text" id="user-lastName" name="user-lastName" placeholder="Last Name" required>
                    <input type="text" id="user-email" name="user-email" placeholder="Email" required>
                  <div class="country-wrapper">
                    <input type="text" id="user-country" name="user-country" placeholder="Country" required>
                    <ul id="autocomplete"></ul>
                  </div>
                    <input type="password" id="user-password" name="user-password" placeholder="Password" required>
                    <button type="submit" id="user-submit">Sign Up</button>
                  </form>
                  </div>
                <div class="signuptext">
                  <p>Already Signed Up?</p>
                  <p><a href="/">Log In Now</a> and Report your computer problem</p>
                </div>
            </div>
            <div class="content right">
              <img src="/galactic-tech.png"/>
            </div>

          </div>
      </div>
    `
  )
}
main.innerHTML += loadRegisterPage();

const userSubmitBtn = document.getElementById("user-submit");
const userName = document.getElementById("user-name") as HTMLInputElement;
const userLast = document.getElementById("user-lastName") as HTMLInputElement;
const userEmail = document.getElementById("user-email") as HTMLInputElement;
const userPass = document.getElementById("user-password") as HTMLInputElement;
const userCountry = document.getElementById("user-country") as HTMLInputElement;
const autocomplete = document.getElementById("autocomplete") as HTMLElement;

userCountry.addEventListener("keyup", (e) => {
  e.preventDefault()
  if (userCountry.value.length < 1) {
    autocomplete.replaceChildren("")
    return;
  }
  complete(userCountry.value)

});

const complete = (val: string) => {
  let searchList: any = [];
  countries.forEach((c) => {
    if (c.name.toLowerCase().includes(val.toLowerCase())) {
      searchList.push(c.name)
    }
  });

  autocomplete.replaceChildren("")
  searchList.forEach((l: string) => {
    autocomplete.innerHTML += `
      <li class="country" data-name=${joinString(l)}> ${l} </li>
    `
  })
  const country = document.querySelectorAll(".country");
  country.forEach((cou) => {
    cou.addEventListener("click", () => {
      userCountry.value = splitString(cou.getAttribute("data-name") || " ")
      autocomplete.replaceChildren("")
    })
  })
}


userSubmitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const form = document.getElementById("user-form") as HTMLFormElement;
  if (checkFormValidity(form)) {
    spinnerActionsAdd()
    const data = {
      username: userName.value,
      userlast: userLast.value,
      usercountry: userCountry.value,
      useremail: userEmail.value,
      password: userPass.value,
      pc: "cs" + "-" + getRandomIntInclusive(1, 99) + getRandomIntInclusive(1, 99),
      room: "0",
    }
    if (userCountry.value != "South Africa") {
      console.log("Only available in SA")
      return;
    }
    const res = await register(Endpoints.userSignupUrl, data)
    if (!res?.ok) {
      popUp("Sign Up Error", res?.content.message)
      popupActions();
      spinnerActionsRemove()
      return
    }
    const resData = {
      pc: res.content.user.pc,
      username: res.content.user.username,
      userlast: res.content.user.userlast,
      usercountry: res.content.user.usercountry,
      useremail: res.content.user.email,
      room: res.content.user.room
    }
    spinnerActionsRemove()
    storeData("user", resData)
    storeData("signup", { init: true })
    window.location.href = "./dashboard.user.html"
  }
})

const checkFormValidity = (form: HTMLFormElement) => {
  if (!form.checkValidity()) {
    let tmpSubmit = document.createElement("button");
    form.appendChild(tmpSubmit);
    tmpSubmit.click();
    form.removeChild(tmpSubmit);
    return false;
  } else {
    return true;
  }
};

const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}


const joinString = (s: string) => {
  if (s.includes(" ")) {
    return s.replace(/\s/g, "-");
  } else {
    return s;
  }
}

const splitString = (s: string) => {
  if (s.includes("-")) {
    return s.replace(/\-/g, " ");
  } else {
    return s;
  }
}
