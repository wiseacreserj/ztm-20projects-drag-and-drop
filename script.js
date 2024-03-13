const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem("backlogItems")) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);
    } else {
        backlogListArray = ["Release the course", "Sit back and relax"];
        progressListArray = ["Work on projects", "Listen to music"];
        completeListArray = ["Being cool", "Getting stuff done"];
        onHoldListArray = ["Being uncool"];
    }
}

// Set localStorage Arrays
function updateSavedColumns() {
    listArrays = [
        backlogListArray,
        progressListArray,
        completeListArray,
        onHoldListArray,
    ];
    const arrayNames = ["backlog", "progress", "complete", "onHold"];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(
            `${arrayName}Items`,
            JSON.stringify(listArrays[index])
        );
    });
}

//Filter Arrays to remove empty items
const filterArray = (array) => {
    const filteredArray = array.filter((item) => item !== null);

    return filteredArray;
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
    // List Item
    const listEl = document.createElement("li");
    listEl.classList.add("drag-item");
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute("ondragstart", "drag(event)");
    listEl.contentEditable = true;
    listEl.id = index;
    listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
    //Append
    columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    // Check localStorage once
    if (!updatedOnLoad) {
        getSavedColumns();
    }
    // Backlog Column
    backlogList.textContent = "";
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogList, 0, backlogItem, index);
    });
    backlogListArray = filterArray(backlogListArray);
    // Progress Column
    progressList.textContent = "";
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressList, 1, progressItem, index);
    });
    progressListArray = filterArray(progressListArray);
    // Complete Column
    completeList.textContent = "";
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeList, 2, completeItem, index);
    });
    completeListArray = filterArray(completeListArray);
    // On Hold Column
    onHoldList.textContent = "";
    onHoldListArray.forEach((onHoldItem, index) => {
        createItemEl(onHoldList, 3, onHoldItem, index);
    });
    onHoldListArray = filterArray(onHoldListArray);
    // Run getSavedColumns only once, Update Local Storage
    updatedOnLoad = true;
    updateSavedColumns();
}

//Update Item - delete if necessary, or update Array value
const updateItem = (id, column) => {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;
    if (!dragging) {
        if (!selectedColumnEl[id].textContent) {
            delete selectedArray[id];
        } else {
            selectedArray[id] = selectedColumnEl[id].textContent;
        }
        updateDOM();
    }
};

//Add to Column List, Reset Textbox
const addToColumn = (column) => {
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    addItems[column].textContent = "";
    updateDOM();
};

//Show Add Item Input Box
const showInputBox = (column) => {
    addBtns[column].style.visibility = "hidden";
    saveItemBtns[column].style.display = "flex";
    addItemContainers[column].style.display = "flex";
    console.log(column);
};

const hideInputBox = (column) => {
    addBtns[column].style.visibility = "visible";
    saveItemBtns[column].style.display = "none";
    addItemContainers[column].style.display = "none";
    addToColumn(column);
};

//Allows arrays to reflect Drag and Drop Items
const rebuildArrays = () => {
    backlogListArray = [];
    progressListArray = [];
    completeListArray = [];
    onHoldListArray = [];
    for (let i = 0; i < backlogList.children.length; i++) {
        backlogListArray.push(backlogList.children[i].textContent);
    }
    for (let i = 0; i < progressList.children.length; i++) {
        progressListArray.push(progressList.children[i].textContent);
    }
    for (let i = 0; i < completeList.children.length; i++) {
        completeListArray.push(completeList.children[i].textContent);
    }
    for (let i = 0; i < onHoldList.children.length; i++) {
        onHoldListArray.push(onHoldList.children[i].textContent);
    }
    updateDOM();
};

//When item start dragging
const drag = (event) => {
    draggedItem = event.target;
    dragging = true;
};

//Columg Allows for Item to Drop
const allowDrop = (event) => {
    event.preventDefault();
};

//When item Enters Column Area
const dragEnter = (column) => {
    listColumns[column].classList.add("over");
    currentColumn = column;
};

//Dropping Item in Column
const drop = (event) => {
    event.preventDefault();
    //Remove .over class
    listColumns.forEach((column) => {
        column.classList.remove("over");
    });
    //Add item to Column
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);
    dragging = false;
    rebuildArrays();
};

//On Load
updateDOM();
