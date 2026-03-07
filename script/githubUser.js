const openAndClosed = (id) => {
  if (id === "open") {
    document.getElementById("closedStatus").classList.add("hidden");
    document.getElementById("openStatus").classList.remove("hidden");
  }
  if (id === "closed") {
    document.getElementById("openStatus").classList.add("hidden");
    document.getElementById("closedStatus").classList.remove("hidden");
  }
  if (id === "all") {
    document.getElementById("openStatus").classList.remove("hidden");
    document.getElementById("closedStatus").classList.remove("hidden");
  }
};
// make the search input empty after search finished
const emptyInput = () => {
  const searchInput = document.getElementById("search");
  searchInput.value = "";
};

// snipper
const hideSpinnerOnly = () => {
  document.getElementById("snipper").classList.add("hidden");
};
// const showSpinnerOnly = () => {
//   document.getElementById("snipper").classList.remove("hidden");
// };
let allIssues = [];

const showLoading = () => {
  document.getElementById("heroSection").classList.add("hidden");
  document.getElementById("snipper").classList.remove("hidden");
};
const OffLoading = () => {
  document.getElementById("snipper").classList.add("hidden");
  document.getElementById("heroSection").classList.remove("hidden");
};
const loadAllIssues = async () => {
  try {
    showLoading();
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const data = await response.json();
    allIssues = Array.isArray(data.data) ? data.data : [];
    //   this function for render all data in website
    renderAllIssues(allIssues);
  } catch (error) {
    console.log(error);
  } finally {
    OffLoading();
  }
};
loadAllIssues();

// renderAllIssues
const renderAllIssues = (data) => {
  // show allIssue
  let finalData = Array.isArray(data) ? data : [];
  document.getElementById("totalIssue").innerText =
    `${finalData.length} Issues`;
  // this dom is for rendering all card in side this container
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";
  //   this variable is for label rendering
  let html = "";
  //   looping for show all card separately
  finalData.forEach((element) => {
    // checking the labels
    const label = Array.isArray(element.labels) ? element.labels : [];
    let category = "";
    label.forEach((elementItem) => {
      let icon = "";
      let style = "";
      //   checking the labels
      if (elementItem === "bug") {
        icon = "bug-icon.png";
        style = "border-2 border-[#FECACA] bg-[#FEECEC] text-[#EF4444]";
      } else if (elementItem == "help wanted") {
        icon = "help-wanted.png";
        style = "border-2 border-[#FDE68A] bg-[#FFF8DB] text-[#D97706]";
      } else if (elementItem == "enhancement") {
        icon = "enhancement.png";
        style = "border-2 border-[#BBF7D0] bg-[#DEFCE8] text-[#00A96E]";
      } else if (elementItem == "good first issue") {
        icon = "";
        style = "border-2 border-[#A855F7] bg-[#F0E2FF] text-[#A855F7]";
      } else if (elementItem == "documentation") {
        icon = "";
        style = "border-2 border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]";
      }
      category += `
          <div
              class="${style} gap-1 px-2 py-0.5 flex flex-row justify-center items-center  lg:text-[11px] font-medium text-[12px] rounded-3xl space-x-1 cursor-pointer">
              ${icon ? `<img class="w-3" src="assets/${icon}" alt="" />` : ""}

              ${elementItem.toUpperCase()}
          </div>
        `;
    });

    // removed the extra text except date
    const createdAt = element.createdAt
      ? element.createdAt.split("T")[0]
      : "No Date";

    // checking element status if open it will give border top in card
    const borderColor =
      element.status === "open"
        ? "border-t-4 border-t-green-500"
        : "border-t-4 border-t-purple-500";
    // checking the priority to apply different color
    let priority = "bg-gray-100 text-gray-500 border border-gray-300";
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
        <div title="Click to preview" onclick="modalCardNo('${element.id}')"
    class="card w-full shadow-md rounded-md ${borderColor} cursor-pointer h-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md relative"
    >
    <div id="snipperForCard${element.id}" class="absolute inset-0 flex justify-center items-center bg-black/10 hidden pointer-events-none">
    <span class="loading loading-spinner text-primary"></span>
    </div>
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
            class=" ${priority} py-0.5 px-3 flex flex-row justify-center items-center font-medium lg:text-[11px] text-[12px] rounded-3xl space-x-1 cursor-pointer"
        >
            ${element.priority.toUpperCase()}
        </div>
        </div>
        <h2 class="font-semibold text-[14px] mb-2">
        ${element.title}
        </h2>
        <p class="text-[12px] text-[#64748B] mb-3 line-clamp-2">
        ${element.description}
        </p>
        <div class="gap-2 flex justify-start items-center mt-auto flex-wrap">
        ${category}
        </div>
    </div>
    <hr class="text-gray-300 w-full" />
    <div class="text-[#64748B] text-[12px] p-4 ">
        <p class="mb-2">by ${element.author}</p>
        <p>${createdAt}</p>
    </div>
    </div>

    `;
  });
  cardContainer.innerHTML = html;
};

// 3 buttons dom
let allButton = document.getElementById("allButton");
let openButton = document.getElementById("openButton");
let closedButton = document.getElementById("closedButton");

// show all issue
openAndClosed("all");
allButton.addEventListener("click", () => {
  openAndClosed("all");
  removedClosed();
  toggle("all");
  loadAllIssues();
});
//show open data

openButton.addEventListener("click", () => {
  openAndClosed("open");
  showLoading();
  toggle("open");
  let openArray = [];
  // checking the data of open
  allIssues.forEach((element) => {
    if (element.status === "open") {
      openArray.push(element);
    }
  });
  renderAllIssues(openArray);
  OffLoading();
});

//show closed data
closedButton.addEventListener("click", () => {
  openAndClosed("closed");
  toggle("closed");
  let closedArray = [];
  allIssues.forEach((element) => {
    if (element.status === "closed") {
      closedArray.push(element);
    }
  });
  renderAllIssues(closedArray);
  OffLoading();
});

// toggle
const toggle = (pass) => {
  if (pass === "all") {
    openButton.classList.remove("btn-primary");
    closedButton.classList.remove("btn-primary");
    allButton.classList.add("btn", "btn-primary");
    emptyInput();
  } else if (pass === "open") {
    allButton.classList.remove("btn-primary");
    closedButton.classList.remove("btn-primary");
    openButton.classList.add("btn", "btn-primary");
    emptyInput();
  } else if (pass === "closed") {
    openButton.classList.remove("btn-primary");
    allButton.classList.remove("btn-primary");
    closedButton.classList.add("btn", "btn-primary");
    emptyInput();
  } else if (pass === "search") {
    openButton.classList.remove("btn-primary");
    allButton.classList.remove("btn-primary");
    closedButton.classList.remove("btn-primary");
    emptyInput();
  }
};
// popUp modal when clicked in card
const modalCardNo = async (id) => {
  // this snipper for when card is clicked for quick preview
  const snipperForCard = document.getElementById(`snipperForCard${id}`);
  const modelContainer = document.getElementById("modelContainer");
  let modalData;
  //   get data for single issue
  try {
    if (snipperForCard) {
      snipperForCard.classList.remove("hidden");
    }
    const response = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
    );
    const data = await response.json();
    // check the object if is not then it will return null
    modalData = data.data ? data.data : null;
  } catch (error) {
    console.log(error);
  } finally {
    if (snipperForCard) {
      snipperForCard.classList.add("hidden");
    }
  }
  if (!modalData) {
    return;
  }

  // checking if the createAt missing
  const createdAt = modalData.createdAt
    ? modalData.createdAt.split("T")[0]
    : "No Date";
  //   looping the category
  // checking the data tye as looping , if nor array it will give empty array to prevent bug
  let label = Array.isArray(modalData.labels) ? modalData.labels : [];
  let category = "";
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
    category += `
    <div
        class="${style} gap-1 px-2 py-0.5 flex flex-row justify-center items-center  lg:text-[14px] font-medium text-[12px] rounded-3xl space-x-1 cursor-pointer">
        ${icon ? `<img class="w-3" src="assets/${icon}" alt="" />` : ""}

        ${element.toUpperCase()}
    </div>
`;
  });
  //   checking the status
  let status = modalData.status === "open" ? "bg-green-600" : "bg-purple-600";
  //   checking priority and set default value if not found the data
  let priority = "bg-gray-100 text-gray-500 border border-gray-300";
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
          <div class="flex flex-row justify-start items-center gap-7 mb-5">
            <div
              class="py-0.5 px-3 font-medium text-[14px] ${status} rounded-3xl text-white flex justify-center items-center"
            >
              ${modalData.status.toUpperCase()}
            </div>
            <div class="flex flex-row justify-start items-center space-x-7">
              <li>${modalData.author}</li>
              <li>${createdAt}</li>
            </div>
          </div>
          <!-- bug and help wanted section -->
          <div class="gap-2 flex justify-start items-center mb-6">
            ${category}
          </div>
          <p class="mb-6">
            ${modalData.description}
          </p>
          <div
            class="bg-[#F8FAFC] p-6 flex flex-row justify-between items-center rounded-xl mt-2 w-full"
          >
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
                ${modalData.priority.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
    `;

  modelContainer.innerHTML = html;
  document.getElementById("renderModal").showModal();
};
// get issue by search
const searchIssue = () => {
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", () => {
    const searchInput = document.getElementById("search");
    let search = searchInput.value.trim().toUpperCase();
    if (search) {
      loadSearchData(search);
      toggle("search");
    } else {
      loadAllIssues();
      document.getElementById("removeAlert").classList.add("hidden");
      toggle("all");
      openAndClosed("all");
      return;
    }
  });
};
searchIssue();

const loadSearchData = async (searchWord) => {
  try {
    showLoading();
    const response = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchWord}`,
    );
    const data = await response.json();
    const finalData = Array.isArray(data.data) ? data.data : [];
    console.log(finalData.length);
    if (finalData.length === 0) {
      showSearchNotMatch();
      return;
    } else {
      document.getElementById("removeAlert").classList.add("hidden");
      document.getElementById("heroSection").classList.remove("hidden");
      renderAllIssues(finalData);
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinnerOnly();
  }
};
// closed button

const closed = () => {
  document.getElementById("removeAlert").classList.add("hidden");
  document.getElementById("heroSection").classList.remove("hidden");
  toggle("all");
};
const showSearchNotMatch = () => {
  document.getElementById("removeAlert").classList.remove("hidden");
  document.getElementById("heroSection").classList.add("hidden");
};
// this is for when no data found and clicked in view all issues
const removedClosed = () => {
  document.getElementById("removeAlert").classList.add("hidden");
  document.getElementById("heroSection").classList.remove("hidden");
  toggle("all");
  openAndClosed("all");
  loadAllIssues();
};
