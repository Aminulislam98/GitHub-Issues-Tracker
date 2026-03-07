const loadAllIssues = async () => {
  const response = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await response.json();
  //   this function for render all data in website
  renderAllIssues(data.data);
  console.log(data.data);
};
loadAllIssues();

// renderAllIssues
const renderAllIssues = (data) => {
  // show allIssue
  document.getElementById("totalIssue").innerText = `${data.length} Issues`;
  // this dom is for rendering all card in side this container
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";
  //   this variable is for label rendering
  let html = "";
  //   looping for show all card separately
  data.forEach((element) => {
    // checking the labels
    const label = element.labels;
    let renderLabel = "";
    label.forEach((element) => {
      let icon = "";
      let style = "";
      //   checking the labels
      if (element === "bug") {
        icon = "bug-icon.png";
        style = "border-2 border-[#FECACA] bg-[#FEECEC] text-[#EF4444]";
      } else if (element == "help wanted") {
        icon = "help-wanted.png";
        style = "border-2 border-[#FDE68A] bg-[#FFF8DB] text-[#D97706]";
      } else if (element == "enhancement") {
        icon = "enhancement.png";
        style = "border-2 border-[#BBF7D0] bg-[#DEFCE8] text-[#00A96E]";
      } else if (element == "good first issue") {
        icon = "";
        style = "border-2 border-[#A855F7] bg-[#F0E2FF] text-[#A855F7]";
      } else if (element == "documentation") {
        icon = "";
        style = "border-2 border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]";
      }
      renderLabel += `
          <div
              class="${style} gap-1 px-2 py-0.5 flex flex-row justify-center items-center  lg:text-[14px] font-medium text-[12px] rounded-3xl space-x-1 cursor-pointer">
              ${icon ? `<img class="w-3" src="assets/${icon}" alt="" />` : ""}

              ${element}
          </div>
        `;
    });

    // checking element status if open it will give border top in card
    const borderColor =
      element.status === "open"
        ? "border-t-3 border-t-green-500 "
        : "border-t-3 border-t-purple-500";
    // checking the priority to apply different color
    let priority = "";
    if (element.priority === "high") {
      priority = "bg-[#FEECEC] text-[#EF4444] border border-[#EF4444]";
    } else if (element.priority === "medium") {
      priority = "bg-[#FFF8DB] text-[#D97706] border border-[#D97706]";
    } else if (element.priority === "low") {
      priority = "bg-[#EEEFF2] text-[#9CA3AF] border border-[#9CA3AF]";
    }
    // checking the status to show the proper icon
    const openOrClosed =
      element.status === "open" ? "Open-Status.png" : "closed.png";

    html += `
        <div onclick="modalCardNo(${element.id})"
    class="card w-full shadow-md rounded-md ${borderColor} cursor-pointer h-full"
    >
    <div class="p-4 h-full flex flex-col">
        <div class="flex flex-row justify-between items-center mb-3">
        <div>
            <img
            class="cursor-pointer"
            src="assets/${openOrClosed}"
            alt="Open-Status"
            />
        </div>
        <div
            class=" ${priority} py-0.5 px-3 flex flex-row justify-center items-center font-medium lg:text-[14px] text-[12px] rounded-3xl space-x-1 cursor-pointer"
        >
            ${element.priority}
        </div>
        </div>
        <h2 class="font-semibold text-[14px] mb-2">
        ${element.title}
        </h2>
        <p class="text-[12px] text-[#64748B] mb-3 line-clamp-2">
        ${element.description}
        </p>
        <div class="gap-2 flex flex-start items-center mt-auto flex-wrap">
        ${renderLabel}
        </div>
    </div>
    <hr class="text-gray-300 w-full" />
    <div class="text-[#64748B] text-[12px] p-4 ">
        <p class="mb-2">#1 by ${element.author}</p>
        <p>${element.updatedAt}</p>
    </div>
    </div>

    `;
  });
  cardContainer.innerHTML = html;
};
// load open data
const loadDataForAllOpenClosed = async () => {
  const response = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await response.json();
  showOpenData(data);
  showClosedData(data);
};
loadDataForAllOpenClosed();

// 3 buttons dom
let allButton = document.getElementById("allButton");
let openButton = document.getElementById("openButton");
let closedButton = document.getElementById("closedButton");

// show all issue
allButton.addEventListener("click", () => {
  toggle("all");
  loadAllIssues();
});
//show open data
const showOpenData = (dataForOpen) => {
  openButton.addEventListener("click", () => {
    toggle("open");
    let openArray = [];
    // checking the data of open
    dataForOpen.data.forEach((element) => {
      if (element.status === "open") {
        openArray.push(element);
      }
    });
    renderAllIssues(openArray);
    document.getElementById("totalIssue").innerText =
      `${openArray.length} Issues`;
  });
};
//show closed data
const showClosedData = (dataForClosed) => {
  closedButton.addEventListener("click", () => {
    toggle("closed");
    let closedArray = [];
    dataForClosed.data.forEach((element) => {
      if (element.status === "closed") {
        closedArray.push(element);
      }
    });
    renderAllIssues(closedArray);
    document.getElementById("totalIssue").innerText =
      `${closedArray.length} Issues`;
  });
};
// toggle
const toggle = (pass) => {
  if (pass === "all") {
    openButton.classList.remove("btn", "btn-primary");
    closedButton.classList.remove("btn", "btn-primary");
    allButton.classList.add("btn", "btn-primary");
  } else if (pass === "open") {
    allButton.classList.remove("btn", "btn-primary");
    closedButton.classList.remove("btn", "btn-primary");
    openButton.classList.add("btn", "btn-primary");
  } else if (pass === "closed") {
    openButton.classList.remove("btn", "btn-primary");
    allButton.classList.remove("btn", "btn-primary");
    closedButton.classList.add("btn", "btn-primary");
  }
};
// popUp modal when clicked in card
const modalCardNo = async (id) => {
  const modelContainer = document.getElementById("modelContainer");
  document.getElementById("renderModal").showModal();
  const card = document.getElementById(`modalCardNo${id}`);

  //   get data for single issue
  const response = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const data = await response.json();
  const modalData = data.data;
  const createdAt = modalData.createdAt.split("T")[0];
  //   looping the labels
  let labels = "";
  modalData.labels.forEach((element) => {
    let icon = "";
    let style = "";
    //   checking the labels
    if (element === "bug") {
      icon = "bug-icon.png";
      style = "border-2 border-[#FECACA] bg-[#FEECEC] text-[#EF4444]";
    } else if (element == "help wanted") {
      icon = "help-wanted.png";
      style = "border-2 border-[#FDE68A] bg-[#FFF8DB] text-[#D97706]";
    } else if (element == "enhancement") {
      icon = "enhancement.png";
      style = "border-2 border-[#BBF7D0] bg-[#DEFCE8] text-[#00A96E]";
    } else if (element == "good first issue") {
      icon = "";
      style = "border-2 border-[#A855F7] bg-[#F0E2FF] text-[#A855F7]";
    } else if (element == "documentation") {
      icon = "";
      style = "border-2 border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]";
    }
    labels += `
    <div
        class="${style} gap-1 px-2 py-0.5 flex flex-row justify-center items-center  lg:text-[14px] font-medium text-[12px] rounded-3xl space-x-1 cursor-pointer">
        ${icon ? `<img class="w-3" src="assets/${icon}" alt="" />` : ""}

        ${element}
    </div>
`;
  });
  //   checking the status
  let status = modalData.status === "open" ? "bg-green-600" : "bg-purple-600";
  //   checking priority
  let priority = "";
  if (modalData.priority === "high") {
    priority = "bg-[#FEECEC] text-[#EF4444] border border-[#EF4444]";
  } else if (modalData.priority === "medium") {
    priority = "bg-[#FFF8DB] text-[#D97706] border border-[#D97706]";
  } else if (modalData.priority === "low") {
    priority = "bg-[#EEEFF2] text-[#9CA3AF] border border-[#9CA3AF]";
  }
  let html = `
          <div class="">
          <h2 class="font-bold text-[24px] mb-2">${modalData.title}</h2>
          <div class="nb-6 flex flex-row justify-start items-center gap-7 mb-5">
            <div
              class="py-0.5 px-3 font-medium text-[14px] ${status} rounded-3xl text-white flex justify-center items-center"
            >
              ${modalData.status}
            </div>
            <div class="flex flex-row justify-start items-center space-x-7">
              <li>${modalData.author}</li>
              <li>${createdAt}</li>
            </div>
          </div>
          <!-- bug and help wanted section -->
          <div class="gap-2 flex justify-start items-center mb-6">
            ${labels}
          </div>
          <p class="mb-6">
            ${modalData.description}
          </p>
          <div
            class="bg-[#E4E4E7] p-6 flex flex-row justify-between items-center rounded-xl mt-2 w-full"
          >
            <!-- left section -->
            <div class="space-y-1">
              <p class="font-normal text-[16px] text-[#64748B]">Assignee:</p>
              <p class="font-semibold">${modalData.assignee ? modalData.assignee : "Not Assigned Yet"}</p>
            </div>
            <!-- right section -->
            <div class="flex flex-col justify-start items-center space-y-1">
              <p class="text-[#64748B]">Priority:</p>
              <button
                class="py-1 px-3 font-medium text-[12px] rounded-3xl ${priority} flex justify-center items-center"
              >
                ${modalData.priority}
              </button>
            </div>
          </div>
        </div>
    `;
  modelContainer.innerHTML = html;
};
