import '../css/status.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import { getReportByID, getUserReports } from '../lib/get-reports';
import Endpoints from '../lib/endpoint';

const statusPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;

if (!jsonUser) {
  localStorage.clear();
  window.location.href = "/"
}

const userDetails = JSON.parse(jsonUser);
const urlSearch = window.location.search.split("+")
const id = urlSearch[0].split("=")[1];
let query = urlSearch[1].split("=")[1]

export const loadStatusPage = () => {
  return (
    container.innerHTML = `
<div class="container">
      <div class="wrapper">
        <div class="panel">
      <div class="panel-header">
          <h1>Report Status</h1>
        <button id="btn-close"> &lt; Home</button>
      </div>
          <div class="panel-info">
            <h2>[ Computer No.:${userDetails.pc} ]</h2>
            <h2>[ Room No.:${userDetails.room} ]</h2>
            <h2>[ Cosmos.:none ]</h2>
          </div>
        </div>
        <div>
          <form class="search-form">
            <input type="text" name="search" id="search" placeholder="Search Token ID (eg:7678)"/>
            <button type="submit" id="search-btn">Search </button>
          </form>

        </div>
        <div class="details-container">
          <div class="ticket-info"></div>
        </div>
      </div>
  <div class="side-wrapper">
    <div class="about-header">
      <h1 class="about-h1">About Report</h1>
      <div class="about-content">
        <div class="content-header">
          <div>
            <p>Computer No.</p>
          </div>
          <div class="action-btns btn-update"></div>
        </div>
        <div class="content-body">
            <h2 id="report-pc"></h2>
        </div>
      </div>

      <div class="about-content">
        <div class="content-header">
          <div>
            <p>Room No.</p>
          </div>
          <div class="action-btns btn-update"></div>
        </div>
        <div class="content-body">
            <h2 id="report-room"></h2>
        </div>
      </div>
    </div>
    <div class="about-wrapper">
      <div class="about-content">
        <div class="content-header">
          <p>Report Category</p>
          <div class="action-btns"></div>
        </div>
          <div class="content-body">
            <h2 id="report-category"></h2>
          </div>
      </div>
      <div class="about-content">
        <div class="content-header">
          <div>
            <p>Status</p>
          </div>
          <div class="action-btns btn-update"></div>
        </div>
        <div class="content-body">
            <h2 id="report-status"></h2>
        </div>
      </div>
      <div class="about-content">
        <div class="content-header">
          <p>Notes</p>
          <div class="action-btns btn-add"></div>
        </div>
          <div class="content-body">
            <p id="report-notes"></p>
          </div>
      </div>
      <div class="about-content">
        <div class="content-header">
          <p>Assigned Tech</p>
          <div class="action-btns btn-assign"></div>
        </div>
          <div class="content-body">
            <h2 id="report-assigned-tech"></h2>
          </div>
      </div>
    </div>
  </div>
</div>
    `
  )
}


const loadDetails = async (detailsID: string) => {
  spinnerActionsAdd()
  if (query == "track") {
    spinnerActionsRemove()
    return
  } else {
    const reportIdUrl = Endpoints.reportIdUrl(detailsID);
    const res = await getReportByID(reportIdUrl);
    if (!res?.ok) {
      return
    }
    const report = res?.content.report
    ticketInfoContainer.innerHTML = ` 
    <div class="info-header">
      <div>
        <div class="info-val">
          <p>Token ID:</p>
          <h1>${report?.tokenID}</h1> 
        </div>
        <div class="info-val">
          <p>Status:</p>
          <h1>${report?.status}</h1>
        </div>
      </div>
      <div>
        <div class="info-val">
          <p>Submitted On:</p>
          <h1>${report?.submittedOn}</h1>
        </div>
      </div>
    </div>
    <div class="info-body">
      <p>${report?.description}</p>
      <div class="info-image">
        <h1>Report Image</h1>
        <img src=${report.file}>
      </div>
    </div>
    `
    reportPcNo.innerHTML = report?.pc;
    reportRoomNo.innerHTML = report?.room;
    reportCategory.innerHTML = report?.category;
    reportStatus.innerHTML = report?.status;
    reportNotes.innerHTML = "- " + report?.notes;
    reportAssignedTech.innerHTML = report?.technician;
  }
  spinnerActionsRemove()
}

statusPage.innerHTML += loadHeader("Support Request Portal");
statusPage.innerHTML += loadSidebar();
statusPage.innerHTML += loadStatusPage();
statusPage.innerHTML += loadSpinner()
headerActions();
sidebarActions();
loadDetails(id);

const ticketInfoContainer = document.querySelector(".ticket-info") as HTMLDivElement;
const closeBtn = document.getElementById("btn-close");
const searchBtn = document.getElementById("search-btn");
const reportPcNo = document.getElementById("report-pc") as HTMLElement;
const reportRoomNo = document.getElementById("report-room") as HTMLElement;;
const reportCategory = document.getElementById("report-category") as HTMLElement;;
const reportStatus = document.getElementById("report-status") as HTMLElement;;
const reportNotes = document.getElementById("report-notes") as HTMLElement;;
const reportAssignedTech = document.getElementById("report-assigned-tech") as HTMLElement;;

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.user.html"
})

searchBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  search();
})

const search = async () => {
  spinnerActionsAdd()
  let userData = {
    pc: userDetails.pc,
    room: userDetails.room,
  }
  const searchField = document.getElementById("search") as HTMLInputElement;
  const searchKey = searchField.value;
  if (searchKey == " ") {
    return
  }
  const res = await getUserReports(Endpoints.userReportsUrl, userData);
  let userReports = []
  if (!res?.ok) {
    userReports = [];
  } else {
    userReports = res?.content
  }
  const report = userReports.find((rep: any) => rep.tokenID == searchKey);
  if (!report) {
    return
  }
  query = searchKey;
  let url = new URL(window.location.href)
  let newUrl = url.origin + url.pathname + `?id=${report._id}+q=${report.tokenID}`
  history.pushState({}, "", newUrl)
  ticketInfoContainer.innerHTML = ""
  loadDetails(report._id);
  spinnerActionsRemove()
}

