// DOM elements
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

// Local Storage
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads")) || [];
let myLeads = leadsFromLocalStorage;

// Topics
const inputEl2 = document.getElementById("input-el2");
const tabBtn2 = document.getElementById("yourTabButtonId");
const ulEl2 = document.getElementById("ul-el2");
const delBtn2 = document.getElementById("yourDelButtonId");

// Modal elements
const noteModal = document.getElementById("noteModal");
const noteInput = document.getElementById("note-input");
const saveNoteBtn = document.getElementById("save-note-btn");
const span = document.getElementsByClassName("close")[0];

let currentNoteIndex = null;

// Load existing data from local storage
let myTopics = JSON.parse(localStorage.getItem("myTopics")) || [];
tabBtn2.innerHTML = "SHOW";

// Event listeners for topics
tabBtn2.addEventListener("click", toggleTopics);
delBtn2.addEventListener("click", deleteLastTopic);

if (leadsFromLocalStorage) {
  render(myLeads);
}

tabBtn.addEventListener("click", extractTabURL);
deleteBtn.addEventListener("dblclick", clearLocalStorage);
inputBtn.addEventListener("click", addLead);
saveNoteBtn.addEventListener("click",saveNote);
function toggleTopics() {
  if (tabBtn2.innerHTML === "SHOW") {
    renderTopics(myTopics);
    tabBtn2.innerHTML = "ADD";
    return;
  }

  const topicVal = inputEl2.value.toLowerCase();

  if (topicVal === "") {
    alert("Please enter a valid topic name.");
    return;
  }

  updateTopics(topicVal);
}

function renderTopics(topics) {
  let listItems = "";
  for (let i = 0; i < topics.length; i++) {
    listItems += `
      <li>
        ${topics[i].name} - ${topics[i].questionsSolved} questions solved
      </li>
    `;
  }
  ulEl2.innerHTML = listItems;
}

function updateTopics(topicVal) {
  const existingSentence = myTopics.find((topic) => topic.name === topicVal);
  const firstName = inputEl2.value.trim().split(' ')[0];
  const existingTopic = myTopics.find((topic) => topic.name === firstName);

  if (existingTopic && existingSentence) {
    if (existingTopic === existingSentence) {
      existingTopic.questionsSolved++;
    } else {
      existingTopic.questionsSolved++;
      existingSentence.questionsSolved++;
    }
  } else {
    if (existingTopic && !existingSentence) {
      existingTopic.questionsSolved++;
    }
    myTopics.push({ name: topicVal, questionsSolved: 1 });
  }

  myTopics.sort((a, b) => b.questionsSolved - a.questionsSolved);
  localStorage.setItem("myTopics", JSON.stringify(myTopics));
  inputEl2.value = "";
  renderTopics(myTopics);
}

function deleteLastTopic() {
  myTopics.pop();
  renderTopics(myTopics);
}

function extractMainName(url) {
  try {
    const parsedUrl = new URL(url);
    // Use the hostname as the main name
    const mainName = parsedUrl.hostname;
    return mainName;
  } catch (error) {
    console.log(error);
    console.error("Invalid URL:", url);
    return url;
  }
}

// Function to render the list of leads
function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    let mainName = extractMainName(leads[i].url);

    // Conditionally modify mainName based on the last character of leads[i].url
    if (leads[i].url && leads[i].url.charAt(leads[i].url.length - 1) === '$') {
      mainName = leads[i].url.slice(0, -1); // Remove the last character
    }

    listItems += `
      <li>
        <a target='_blank' href='${leads[i].url}'>
          ${mainName}
        </a>
        <span>   </span>
        <button onclick="openNoteModal(${i})">+</button>
        <button onclick="deleteEntry(${i})">DEL</button>
      </li>
    `;
  }
  ulEl.innerHTML = listItems;
}

// Function to extract current tab's URL
function extractTabURL() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    console.log(url);
    myLeads.push({ url: url, note: "" });
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
}

// Function to clear local storage
function clearLocalStorage() {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
}

// Function to add lead from input
function addLead() {
  myLeads.push({ url: inputEl.value + '$', note: "" });
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
}
function deleteEntry(index) {
  myLeads = myLeads.filter((_, i) => i !== index);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
}
// Function to open the modal
function openNoteModal(index) {
  currentNoteIndex = index;
  console.log(currentNoteIndex);
  noteInput.value = myLeads[index].note || '';
  noteModal.style.display = "block";
  // saveNote();
}

// Function to save a note
function saveNote() {
  if (currentNoteIndex !== null) {
    myLeads[currentNoteIndex].note = noteInput.value;
    console.log(noteInput.value);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
    noteModal.style.display = "none";
  }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  noteModal.style.display = "None"
}
// Initial render
document.addEventListener("DOMContentLoaded", () => {
  render(myLeads);
});
