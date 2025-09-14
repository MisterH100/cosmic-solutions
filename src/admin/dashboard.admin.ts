import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getReports } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import { getUsers } from '../lib/get-users';
import { io } from "socket.io-client";
import { popUp, popupActions } from '../components/popup';
import { getTechnicians } from '../lib/get-technicians';
import Endpoints from '../lib/endpoint';
const socket = io(Endpoints.socketUrl);

const dasboardPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonAdmin = localStorage.getItem("admin") as string;
let userReports: Array<any> = [];
let adminDetails: any = {};
if (!jsonAdmin) {
  localStorage.clear();
  window.location.href = "/"
}
adminDetails = JSON.parse(jsonAdmin);


export const loadAdminDash = () => {
  return (
    container.innerHTML = `
<div class="container">
  <div class="wrapper">
    <div class="panel">
      <h1>Welcome,</h1>
      <div class="panel-info">
        <h2>[ Admin: ${adminDetails.email} ]</h2>
      </div>
    </div>
    <div class="panel-cards">
      <div class="card">
        <div class="title">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" >
              <path d="M384 96l0 224L64 320 64 96l320 0zM64 32C28.7 32 0 60.7 0 96L0 320c0 35.3 28.7 64 64 64l117.3 0-10.7 32L96 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-74.7 0-10.7-32L384 384c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L64 32zm464 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0zm16 64l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-16 80c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm32 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
            </svg>
          </span>
          <p class="title-text">
           Computers 
          </p>
          <div class="percent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height="20" width="20">
              <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
              </path>
            </svg> 
            <p>100%<p>
          </div>
        </div>
        <div class="data">
          <p id="registered-pcs">
            0
          </p>
        </div>
      </div>

      <div class="card">
        <div class="title">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor">
              <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/>
            </svg>
          </span>
          <p class="title-text">
           Reports 
          </p>
          <div class="percent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height="20" width="20">
              <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
              </path>
            </svg>
            <p>100%</p>
          </div>
        </div>
        <div class="data">
          <p id="tot-reports">
            0
          </p>
        </div>
      </div>

      <div class="card" id="cosmos-card">
        <div class="title">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
              <path d="M384 96l0 224L64 320 64 96l320 0zM64 32C28.7 32 0 60.7 0 96L0 320c0 35.3 28.7 64 64 64l117.3 0-10.7 32L96 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-74.7 0-10.7-32L384 384c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L64 32zm464 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0zm16 64l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-16 80c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm32 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
            </svg>
          </span>
          <p class="title-text">
           Cosmos 
          </p>
        </div>
        <div class="data">
          <p>
            0 
          </p>

        </div>
      </div>
    </div>

    <div class="action-btns">
      <button class="btn-track" id="btn-reg">Register A Computer</button>
      <button class="btn-add-ticket" id="btn-add-ticket">New Report</button>
    </div>
    <div class="form-wrapper">
      <form class="search-form">
        <input type="text" name="search" id="search" placeholder="Search Token ID"/>
        <button type="submit" id="reset-btn">Reset </button>
        <button type="submit" id="search-btn">Search </button>
      </form>
    </div>
    <div class="table-container admin-table">
        <h1 id="caption">Select Ticket To Manage</h1>
      <div class="filter-container">
        <button class="filter-btn active" id="all-btn">All</button>
        <button class="filter-btn" id="open-btn">Open</button>
        <button class="filter-btn" id="inprogress-btn"active">In progress</button>
        <button class="filter-btn" id="resolved-btn">Resolved</button>
      </div>
      <table class="table">
        <thead class="table-head">
          <tr>
            <th>Token ID</th>
            <th>Category</th>
            <th>Status</th>
            <th>Submited On</th>
          </tr>
        </thead>
        <tbody class="table-body" id="tbody">
        </tbody>
      </table>
      <div class="placeholder"></div>
    </div>
  </div>
  <div class="side-wrapper">
    <div class="stats-container">
      <h1>Computer Overview</h1>
      <div class="pc-wrapper">
        <div class="pc-stat">
          <p><span class="status-indicator online"></span>Online</p>
          <h3 id="online-pcs">0</h3>
        </div>
        <div class="pc-stat">
          <p><span class="status-indicator offline"></span>Offline</p>
          <h3 id="offline-pcs">0</h3>
        </div>
      </div>
    </div>
    <div class="chart-wrapper">
      <h1>Report Overview</h1>
      <h2 class="chart-subheading"></h2>
      <div class="chart-container">
      <canvas id="grid"></canvas>
      <div class="chart-info">
        <div class="bar">
          <span id="bar-open"></span>
        </div>
        <p>Open</p>
      </div>
      <div class="chart-info">
        <div class="bar">
          <span id="bar-inprogress"></span>
        </div>
        <p>In progress</p>
      </div>
      <div class="chart-info">
        <div class="bar">
          <span id="bar-resolved"></span>
        </div>
        <p>Resolved</p>
      </div>

      </div>
    </div>
    <div class="techs-header">
      ${adminDetails.email.includes("tech") ? "" : `<h1>Registered Techs</h1>`}
    </div>
    <div class="tech-wrapper">
    </div>
  </div>
`
  )
}

dasboardPage.innerHTML += loadHeader("Admin Dashboard");
dasboardPage.innerHTML += loadSidebar()
dasboardPage.innerHTML += loadAdminDash();
dasboardPage.innerHTML += loadSpinner();

const cosmosCard = document.getElementById("cosmos-card");
const tableBody = document.getElementById("tbody") as HTMLTableElement;
const regBtn = document.getElementById("btn-reg");
const addBtn = document.getElementById("btn-add-ticket");
const searchBtn = document.getElementById("search-btn");
const filterBtns = document.querySelectorAll(".filter-btn")
const placeholder = document.querySelector(".placeholder") as HTMLDivElement;

const registeredPcs = document.getElementById("registered-pcs") as HTMLElement;
const totalReports = document.getElementById("tot-reports") as HTMLElement;
const onlinePcs = document.getElementById("online-pcs") as HTMLElement;
const offlinePcs = document.getElementById("offline-pcs") as HTMLElement;
const barOpen = document.getElementById("bar-open") as HTMLElement;
const barInprogress = document.getElementById("bar-inprogress") as HTMLElement;
const barResolved = document.getElementById("bar-resolved") as HTMLElement;
const chartSubHeading = document.querySelector(".chart-subheading") as HTMLElement;
const techsWrapper = document.querySelector(".tech-wrapper") as HTMLElement;;
const gridCanvas = document.getElementById("grid") as HTMLCanvasElement;
const ctx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const drawGrid = () => {
  const cellSize = 10;
  const canvasWidth = gridCanvas.width;
  const canvasHeight = gridCanvas.height;

  for (let x = 0; x <= canvasWidth; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.lineWidth = 0.1
    ctx.stroke();
  }

  for (let y = 0; y <= canvasHeight; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.lineWidth = 0.1
    ctx.stroke();
  }
}

const loadReports = async (filter: string) => {
  tableBody?.replaceChildren("")
  spinnerActionsAdd();
  let reportsEndpoint = "";
  if (adminDetails.email.includes("tech")) {
    reportsEndpoint = Endpoints.assignedTechniciansReportsUrl(adminDetails.email);
  } else {
    reportsEndpoint = Endpoints.reportsUrl;
  }
  const res = await getReports(reportsEndpoint);
  if (!res?.ok) {
    if (res.abort) {
      popUp("Time Out", res.content.message)
      popupActions()
    }
    userReports = [];
  } else {
    userReports = res?.content
    totalReports.innerHTML = userReports.length.toString();
  }

  if (filter == "open") {
    userReports = userReports.filter((rep) => rep.status == "open");
  }
  if (filter == "inprogress") {
    userReports = userReports.filter((rep) => rep.status == "inprogress");
  }
  if (filter == "resolved") {
    userReports = userReports.filter((rep) => rep.status == "resolved");
  }

  if (userReports.length < 1) {
    placeholder.innerHTML = `<p class="plc-holder">No reports at the moment</p>`
  } else {
    placeholder.innerHTML = " ";
    userReports.map((report) => {
      tableBody.innerHTML += `
<tr class="ticket-row">
<td>${report.tokenID}</td>
<td>${report.category}</td>
<td id=${report.status}>${report.status} <br> ${report.technician == "" ? "" : `<span class="tag">${report.technician}</span>`}</td>
<td>${report.submittedOn} <br> ${report.submittedBy == "admin" ? `<span class="tag">By Admin</span>` : ""} ${report.submittedBy == "technician" ? `<span class="tag">By Technician</span>` : ""} </td>
</tr>`

    });
    const ticketRows = document.querySelectorAll(".ticket-row");
    ticketRows.forEach((ticketRow, key) => {
      ticketRow.addEventListener("click", () => {
        const reportToken = userReports[key].tokenID;
        const reportId = userReports[key]._id;
        window.location.href = `../pages/manage.admin.html?id=${reportId}+q=${reportToken}`
      })
    })
  }
  loadChart(res);
  spinnerActionsRemove()
}

const loadSearchedReports = (sr: any) => {
  if (sr.length < 1) {
    placeholder.innerHTML = `<p>No reports at the moment</p>`
  } else {
    placeholder.innerHTML = " ";
    sr.map((report: any) => {
      tableBody.innerHTML += `
<tr class="ticket-row">
<td>${report.tokenID}</td>
<td>${report.category}</td>
<td  id=${report.status}>${report.status} <br> <span>${report.status == "" ? "" : report.technician}</span></td>
<td>${report.submittedOn}</td>
</tr>`

    });

    const ticketRows = document.querySelectorAll(".ticket-row");
    ticketRows.forEach((ticketRow, key) => {
      ticketRow.addEventListener("click", () => {
        const reportToken = userReports[key].tokenID;
        const reportId = userReports[key]._id;
        window.location.href = `../pages/manage.admin.html?id=${reportId}+q=${reportToken}`
      })
    })
  }

}

const search = async () => {
  spinnerActionsAdd()
  const searchField = document.getElementById("search") as HTMLInputElement;
  const searchKey = searchField.value;
  if (searchKey == " ") {
    return
  }
  let reportsEndpoint = ""
  if (adminDetails.email.includes("tech")) {
    reportsEndpoint = Endpoints.assignedTechniciansReportsUrl(adminDetails.email);
  } else {
    reportsEndpoint = Endpoints.reportsUrl;
  }
  const res = await getReports(reportsEndpoint);
  let userReports = []
  if (!res?.ok) {
    if (res.abort) {
      popUp("Time Out", res.content.message)
      popupActions()
    }
    userReports = [];
  } else {
    userReports = res?.content
  }
  const report = userReports.find((rep: any) => rep.tokenID == searchKey);
  if (!report) {
    return
  }

  let searchedReports = [report];
  tableBody.innerHTML = " "
  loadSearchedReports(searchedReports);
  spinnerActionsRemove();
}

const loadComputers = async () => {
  let registered: any = [];
  let online: any = []
  let offline: any = []

  const res = await getUsers(Endpoints.usersUrl);
  if (!res?.ok) {
    registered = []
    online = []
    online = []
  } else {
    registered = res.content.users;
    online = res.content.users.filter((user: any) => user.logged_in == true)
    offline = res.content.users.filter((user: any) => user.logged_in == false)
    registeredPcs.innerHTML = registered.length
    onlinePcs.innerHTML = online.length;
    offlinePcs.innerHTML = offline.length
  }

}

const loadChart = (res: any) => {
  let totalReports = 0;
  let openReports = 0;
  let inprogressReports = 0;
  let resolvedReports = 0;

  let reports = res.content;
  if (reports.length < 1) {
    chartSubHeading.innerHTML = "No Chart Data"
    return;
  }
  totalReports = reports.length;
  openReports = reports.filter((report: any) => report.status == "open").length
  inprogressReports = reports.filter((report: any) => report.status == "inprogress").length
  resolvedReports = reports.filter((report: any) => report.status == "resolved").length
  let h = openReports / totalReports * 100;
  barOpen.style.height = `${h}%`
  barOpen.innerHTML = openReports.toString();
  h = inprogressReports / totalReports * 100;
  barInprogress.style.height = `${h}%`
  barInprogress.innerHTML = inprogressReports.toString();
  h = resolvedReports / totalReports * 100;
  barResolved.style.height = `${h}%`
  barResolved.innerHTML = resolvedReports.toString();
}

const loadTechs = async () => {
  if (adminDetails.email.includes("tech")) {
    return;
  }
  const res = await getTechnicians(Endpoints.techniciansUrl);
  if (!res?.ok) {
  } else {
    let techs = res.content;
    techs.map((tech: any) => {
      techsWrapper.innerHTML += `
  <div class="tech">
    ${tech.logged_in ? `<span class="badge online"></span>` : `<span class="badge offline"></span>`}
     <div class="tech-img">
      <img src="/technician.svg"/>
      </div>
      <div>
        <p> ${tech.email}</p>
      </div>
  </div>
`
    })
  }

}

const loadStats = async () => {
  loadComputers();
  loadReports("all");
  loadTechs()

}


searchBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  search();
})

if (adminDetails.clearance_level > 0) {
  regBtn?.setAttribute("disabled", "")
}

if (cosmosCard) {
  cosmosCard.style.cursor = "pointer"
  cosmosCard.addEventListener("click", (e) => {
    e.preventDefault()
    window.location.href = "../pages/cosmos.admin.html"
  })

}
regBtn?.addEventListener("click", () => {
  window.location.href = "../pages/register.admin.html"
})

addBtn?.addEventListener("click", () => {
  window.location.href = "../pages/report.admin.html"
})

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((btn) => {
      btn.classList.remove("active")
    })
    btn.classList.add("active");
    let filter = btn.id.split("-");
    loadReports(filter[0])
  })
})

headerActions();
sidebarActions();
loadStats();
drawGrid();

socket.on("updateReports", () => {
  loadReports("all");
});

socket.on("updateStats", () => {
  console.log("logged out")
  loadStats();
})
