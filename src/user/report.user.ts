import '../css/report.style.css'
import { headerActions, loadHeader } from '../components/header';
import { popUp, popupActions } from '../components/popup';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { createReport } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';

const reportPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;

if (!jsonUser) {
  localStorage.clear();
  window.location.href = "/"
}

const userDetails = JSON.parse(jsonUser);

export const loadUserReport = () => {
  return (
    container.innerHTML = `
  <div class="container">
      <div class="wrapper">
        <div class="panel">
        <div class="panel-header">
          <h1>Report A New Issue</h1>
          <button id="btn-close"> &lt; Home</button>
        </div>
          <div class="panel-info">
            <h2>[ Computer No.:${userDetails.pc} ]</h2>
            <h2>[ Room No.:${userDetails.room} ]</h2>
            <h2>[ Cosmos.:none ]</h2>
          </div>
        </div>
        <div class="form-container">
          <form>
            <div>
                <h2 class="label">Choose Issue Category</h2>
                <div class="radio-group">
                  <div>
                    <input type="radio" id="network" name="category" value="network">
                    <label for="network">Network</label><br>
                  </div>
                  <div>
                    <input type="radio" id="software" name="category" value="software">
                    <label for="software">Software</label><br>
                  </div>
                  <div>
                    <input type="radio" id="hardware" name="category" value="hardware">
                    <label for="hardware">Hardware</label>
                  </div>
                </div>
            </div>
            <div class="description-container">
              <h2 class="label">Describe The Issue</h2>
              <textarea id="description"></textarea>
            </div>

          <div class="file-input">
                <h2 class="label">Upload Image</h2>
            <div class="file-wrapper">
              <input type="file" id="report-image">
              <div class="file-preview">
                <img src="/paper.png" id="preview"/>
              </div>

            </div>
          </div>
            <div class="action-btns">
              <button class="btn-submit" id="btn-submit">Submit Report</button>
              <button class="btn-cancel" id="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
  <div class="side-wrapper">
    <div class="side-wrapper-header">
      <h1>Recent Reports</h1>
    </div>

  </div>
  </div>
    `
  )
}

reportPage.innerHTML += loadHeader("Support Request Portal");
reportPage.innerHTML += loadSidebar();
reportPage.innerHTML += loadUserReport();
reportPage.innerHTML += loadSpinner()
headerActions();
sidebarActions();

const submitBtn = document.getElementById("btn-submit");
const cancelBtn = document.getElementById("btn-cancel");
const closeBtn = document.getElementById("btn-close");
const cats = document.getElementsByName("category") as NodeListOf<HTMLInputElement>;
const description = document.getElementById("description") as HTMLTextAreaElement;
const reportImage = document.getElementById("report-image") as HTMLInputElement;
const preview = document.getElementById("preview") as HTMLImageElement;
let category = "";

const renderPreview = () => {
  if (preview.getAttribute("src") == "/paper.png") {
    preview.style.opacity = "0.3";
  } else {
    preview.style.opacity = "1";
  }

  let files = reportImage.files as FileList;
  if (files.length > 0) {
    let src = URL.createObjectURL(files[0]);
    preview.src = src
    preview.style.opacity = "1";
  }
}
renderPreview();

reportImage.addEventListener("change", (e) => {
  e.preventDefault();
  renderPreview()
});


submitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  spinnerActionsAdd()
  for (let i = 0; i < cats.length; i++) {
    if (cats[i].checked) {
      category = cats[i].value
    }
  }

  if (category == "" && description.value == "" || category == "" || description.value == "") {
    spinnerActionsRemove();
    popUp("Submittion Error", "Submittion failed. Fill in all the field and try again.");
    popupActions();
    return;
  }

  function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  let tokenNumber = getRandomIntInclusive(10, 99).toString() + getRandomIntInclusive(10, 99).toString()

  let formData = new FormData();
  let files = reportImage.files as FileList;

  const data = {
    tokenID: tokenNumber,
    category: category,
    description: description.value,
    file: files[0],
    status: "open",
    technician: "",
    submittedOn: new Date().toLocaleString("en-ZA", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase(),
    submittedBy: "user",
    notes: "",
    pc: userDetails.pc,
    room: userDetails.room
  }

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value)
  }

  const res = await createReport(Endpoints.createReportUrl, formData);
  if (!res?.ok) {
    spinnerActionsRemove()
    return
  } else {
    popUp("Success", `<p>TokenID: ${tokenNumber}</p>`)
    popupActions();

  }
  spinnerActionsRemove()
});

cancelBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  cats.forEach((c) => {
    c.checked = false;
  })
  description.value = ""
  preview.src = "/paper.png"
  preview.style.opacity = "0.3";
})

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.user.html"
});
