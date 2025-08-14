import '../css/manage.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getReportByID } from '../lib/get-reports';
import { delReport, updateReport } from '../lib/update-report';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';
import { checkDelClearance } from '../lib/check-del-clearance';
import { popUp, popupActions } from '../components/popup';
import { getTechnicians } from '../lib/get-technicians';

const managePage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonAdmin = localStorage.getItem("admin") as string;

if (!jsonAdmin) {
  localStorage.clear();
  window.location.href = "/"
}

const adminDetails = JSON.parse(jsonAdmin);
const urlSearch = window.location.search.split("+")
const id = urlSearch[0].split("=")[1];
let tokenID = "";

export const loadManagePage = () => {
  return (
    container.innerHTML = `
<div class="container">
  <div class="wrapper">
    <div class="panel">
      <div class="panel-header">
        <h1>Manage Ticket</h1>
        <button id="btn-close"> &lt; Home</button>
      </div>
      <div class="panel-info">
        <h2>[ Admin: ${adminDetails.email} ]</h2>
      </div>
    </div>
    <div class="details-container">
      <div class="ticket-info">
      </div>
      <div class="ticket-solved"></div>
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
          <button class="action-btns btn-update" id="btn-update">Update Status</button>
        </div>
        <div class="content-body">
            <h2 id="report-status"></h2>
        </div>
      </div>
      <div class="about-content">
        <div class="content-header">
          <p>Notes</p>
          <button class="action-btns btn-add" id="btn-add">Add Notes</button>
        </div>
          <div class="content-body">
            <p id="report-notes"></p>
          </div>
      </div>
      <div class="about-content">
        <div class="content-header">
          <p>Assigned Tech</p>
          <button class="action-btns btn-assign" id="btn-assign">Assign A Tech</button>
        </div>
          <div class="content-body">
            <h2 id="report-assigned-tech"></h2>
          </div>
      </div>
      <div class="about-content">
        <button class="action-btns btn-delete" id="btn-delete">Delete Report</button>
      </div>
    </div>
  </div>
</div>
`
  )
}

const loadDetails = async (detailsID: string) => {
  spinnerActionsAdd()
  const reportIdUrl = Endpoints.reportIdUrl(detailsID)
  const res = await getReportByID(reportIdUrl);
  if (!res?.ok) {
    return
  }
  spinnerActionsRemove();

  const report = res?.content.report
  tokenID = report?.tokenID;
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
        <img src="/paper.png"/>
      </div>
    </div>
`
  if (report?.status == "resolved" && !checkDelClearance(adminDetails.clearance_level)) {
    ticketSolvedContainer.innerHTML = `
      <p>This Report has been marked as SOLVED and can not be updated further.</p>
    `
  }

  reportPcNo.innerHTML = report?.pc;
  reportRoomNo.innerHTML = report?.room;
  reportCategory.innerHTML = report?.category;
  reportStatus.innerHTML = report?.status;
  reportNotes.innerHTML = "- " + report?.notes;
  reportAssignedTech.innerHTML = report?.technician;
}

managePage.innerHTML += loadHeader("Admin Dashboard");
managePage.innerHTML += loadSidebar();
managePage.innerHTML += loadManagePage();
managePage.innerHTML += loadSpinner()
headerActions()
sidebarActions()
loadDetails(id);

const ticketInfoContainer = document.querySelector(".ticket-info") as HTMLDivElement;
const ticketSolvedContainer = document.querySelector(".ticket-solved") as HTMLElement;
const closeBtn = document.getElementById("btn-close");
const updateBtn = document.getElementById("btn-update");
const addBtn = document.getElementById("btn-add");
const assignBtn = document.getElementById("btn-assign");
const deleteBtn = document.getElementById("btn-delete");
const reportPcNo = document.getElementById("report-pc") as HTMLElement;
const reportRoomNo = document.getElementById("report-room") as HTMLElement;;
const reportCategory = document.getElementById("report-category") as HTMLElement;;
const reportStatus = document.getElementById("report-status") as HTMLElement;;
const reportNotes = document.getElementById("report-notes") as HTMLElement;;
const reportAssignedTech = document.getElementById("report-assigned-tech") as HTMLElement;;

const updateStatus = () => {
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
<div>
  <div class="header">
    <h1>Update Report Status</h1>
    <h2>TokenID: ${tokenID}</h2>
  </div>
  <form>
    <div>
      <h3>Set Status To:</h3>
    </div>
    <div class="inputGroup">
      <input id="open" name="status" value="open" type="radio"/>
      <div class="labels">
        <label for="open">Open</label>
        <label for="open">Report has not been assigned a technician</label>
      </div>
    </div>
    <div class="inputGroup">
      <input id="inprogress" name="status" value="inprogress" type="radio"/>
      <div class="labels">
        <label for="inprogress">In Progress</label>
        <label for="inprogress">Report has been assigned a technician</label>
      </div>
    </div>
    <div class="inputGroup">
      <input id="resolved" name="status" value="resolved" type="radio"/>
      <div class="labels">
        <label for="resolved">Resolved</label>
        <label for="resolved">Report has been solved</label>
      </div>
    </div>
    <div class="modal-action-btns">
      <button class="btn-status" id="btn-status">Update</button>
      <button class="btn-close" id="btn-cancel">Cancel</button>
    </div>
  </form>
</div>
`
  managePage.appendChild(updateModal);
  const updateBtn = document.getElementById("btn-status");
  const cancelBtn = document.getElementById("btn-cancel");
  const statuses = document.getElementsByName("status");
  let statusValue = "open";

  statuses.forEach((status: any) => {
    status.addEventListener("click", () => {
      statusValue = status.value;
    })
  })

  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    spinnerActionsAdd()
    const updateReportUrl = Endpoints.updateReportStatusUrl(id)
    const res = await updateReport(updateReportUrl, { adminId: adminDetails._id, adminEmail: adminDetails.email, status: statusValue })
    if (!res?.ok) {
      console.log(res?.content)
    } else {
      console.log(res?.content)
    }
    spinnerActionsRemove();
    window.location.reload();
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })

}

const addNotes = () => {
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
<div>
  <div class="header">
    <h1>Update Report Notes</h1>
    <h2>TokenID: ${tokenID}</h2>
  </div>
  <form>
    <div>
      <h3>Add Notes to Status:</h3>
      <div class="notes">
        <textarea id="notes"></textarea>
      </div>
    </div>
    <div class="modal-action-btns">
      <button class="btn-status" id="btn-status">Update</button>
      <button class="btn-close" id="btn-cancel">Cancel</button>
    </div>
  </form>
</div>
`
  managePage.appendChild(updateModal);
  const updateBtn = document.getElementById("btn-status");
  const cancelBtn = document.getElementById("btn-cancel");
  const notes = document.getElementById("notes") as HTMLTextAreaElement;

  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    spinnerActionsAdd()
    const updateReportUrl = Endpoints.updateReportNotesUrl(id)
    const res = await updateReport(updateReportUrl, { adminId: adminDetails._id, adminEmail: adminDetails.email, notes: notes.value })
    if (!res?.ok) {
      console.log(res?.content)
    } else {
      console.log(res?.content)
    }
    spinnerActionsRemove()
    window.location.reload();
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })
}

const assignReport = async () => {
  const techs = await getTechnicians(Endpoints.techniciansUrl);
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
<div>
  <div class="header">
    <h1>Assign Report To A Technician</h1>
    <h2>TokenID: ${tokenID}</h2>
  </div>
  <div class="assign-container">
    <form>
    <div>
      <h3>Enter Technician Email</h3>
        <div class="assign">
          <input type="text" id="tech-email" name="tech-email" placeholder="Email" required>
        <!-- <ul id="autocomplete"></ul> -->
      </div>
     <div class="modal-action-btns">
       <button class="btn-status" id="btn-status">Update</button>
       <button class="btn-close" id="btn-cancel">Cancel</button>
     </div>
    </form>
    </div>
      <div class="techs-container" id="techs-container">
        <h3 class="select-header">Select an available technician</h3>
        <ul id="tech-list"></ul>
      </div>
  </div>
</div>
`
  managePage.appendChild(updateModal);
  const updateBtn = document.getElementById("btn-status");
  const cancelBtn = document.getElementById("btn-cancel");
  const email = document.getElementById("tech-email") as HTMLInputElement;
  // const autocomplete = document.getElementById("autocomplete") as HTMLUListElement;
  const techsList = document.getElementById("tech-list") as HTMLElement;

  techs?.content.forEach((t: any) => {
    techsList.innerHTML += `
     <li class="email" data-set-name=${t.email}>${t.email}</li>
`
  })
  const emails = document.querySelectorAll(".email");

  emails.forEach((m) => {
    m.addEventListener("click", () => {
      email.value = m.getAttribute("data-set-name") || " "
    })
  })

  const list = techs.content.map((t: any) => t.email)
  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    spinnerActionsAdd()
    if (!list.includes(email.value)) {
      popUp("Invalid Email", "Select or provide a valid email")
      popupActions()
      spinnerActionsAdd()
      return
    }
    const updateReportUrl = Endpoints.assignReportUrl(id)
    const res = await updateReport(updateReportUrl, { adminId: adminDetails._id, adminEmail: adminDetails.email, technician: email.value })
    if (!res?.ok) {
      console.log(res?.content)
    } else {
      console.log(res?.content)
    }
    spinnerActionsRemove()
    window.location.reload();
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })
}

const deleteReport = () => {
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
<div>
  <div class="header">
    <h1>Delete Report</h1>
    <h2>TokenID: ${tokenID}</h2>
  </div>
  <form>
    <div class="warning">
      <p>This Action Can't Be Undone</p>
      <p>Delete This Report</p>
    </div>
    <div class="modal-action-btns">
      <button class="btn-status" id="btn-status">Confirm</button>
      <button class="btn-close" id="btn-cancel">Cancel</button>
    </div>
  </form>
</div>
`
  managePage.appendChild(updateModal);
  const updateBtn = document.getElementById("btn-status");
  const cancelBtn = document.getElementById("btn-cancel");

  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    spinnerActionsAdd()
    const updateReportUrl = Endpoints.updateReportDeleteUrl(id)
    const res = await delReport(updateReportUrl, { adminID: adminDetails.email })

    if (!res?.ok) {
      console.log(res?.content)
    } else {
      console.log(res?.content)
    }
    spinnerActionsRemove()
    window.location.href = "../pages/dashboard.admin.html"
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })
}

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.admin.html"
});

const reportIdUrl = Endpoints.reportIdUrl(id)
const res = await getReportByID(reportIdUrl);
let closed = res?.content.report.status == "resolved";

if (closed && !checkDelClearance(adminDetails.clearance_level)) {
  updateBtn?.setAttribute("disabled", "")
  addBtn?.setAttribute("disabled", "")
}

console.log(closed, checkDelClearance(adminDetails.clearance_level))
if (!checkDelClearance(adminDetails.clearance_level)) {
  assignBtn?.setAttribute("disabled", "")
  deleteBtn?.setAttribute("disabled", "")
}


updateBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  if (closed && !checkDelClearance(adminDetails.clearance_level)) {
    popUp("Forbidden Operation", "This can only be done by admin")
    popupActions();
  } else {
    updateStatus();
  }
})

addBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  if (closed && !checkDelClearance(adminDetails.clearance_level)) {
    popUp("Forbidden Operation", "This can only be done by admin")
    popupActions();
  } else {
    addNotes();
  }
})

assignBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  if (checkDelClearance(adminDetails.clearance_level)) {
    assignReport()
  } else {
    popUp("Forbidden Operation", "This action can only be done by admin")
    popupActions();
  }
})

deleteBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  if (checkDelClearance(adminDetails.clearance_level)) {
    deleteReport()
  } else {
    popUp("Forbidden Operation", "This action can only be done by admin")
    popupActions();
  }
})


