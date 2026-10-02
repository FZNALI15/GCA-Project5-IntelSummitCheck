// Intel Sustainability Summit Check-In App

// Attendance goal
const attendanceGoal = 50;

// Load saved data from localStorage, or start at zero
let attendeeCount = Number(localStorage.getItem("attendeeCount")) || 0;
let waterCount = Number(localStorage.getItem("waterCount")) || 0;
let zeroCount = Number(localStorage.getItem("zeroCount")) || 0;
let powerCount = Number(localStorage.getItem("powerCount")) || 0;

// Load saved attendee list
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// Get elements from the page
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCountDisplay = document.getElementById("attendeeCount");
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");

const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

const attendeeList = document.getElementById("attendeeList");
const emptyListMessage = document.getElementById("emptyListMessage");

// Return the full team name
function getTeamName(team) {
  if (team === "water") {
    return "Team Water Wise";
  } else if (team === "zero") {
    return "Team Net Zero";
  } else if (team === "power") {
    return "Team Renewables";
  }

  return "";
}

// Save current progress to localStorage
function saveProgress() {
  localStorage.setItem("attendeeCount", attendeeCount);
  localStorage.setItem("waterCount", waterCount);
  localStorage.setItem("zeroCount", zeroCount);
  localStorage.setItem("powerCount", powerCount);
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Update all numbers and the progress bar
function updateDisplay() {
  attendeeCountDisplay.textContent = attendeeCount;
  waterCountDisplay.textContent = waterCount;
  zeroCountDisplay.textContent = zeroCount;
  powerCountDisplay.textContent = powerCount;

  // Calculate attendance percentage
  let progressPercentage = (attendeeCount / attendanceGoal) * 100;

  // Do not let the visual progress bar go past 100%
  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

  progressBar.style.width = progressPercentage + "%";
}

// Display the attendee list
function displayAttendees() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    emptyListMessage.style.display = "block";
    return;
  }

  emptyListMessage.style.display = "none";

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.classList.add("attendee-item");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("attendee-name");
    nameSpan.textContent = attendee.name;

    const teamSpan = document.createElement("span");
    teamSpan.classList.add("attendee-team");
    teamSpan.textContent = attendee.teamName;

    listItem.appendChild(nameSpan);
    listItem.appendChild(teamSpan);

    attendeeList.appendChild(listItem);
  });
}

// Remove winner highlighting
function removeWinnerHighlight() {
  document.querySelector(".team-card.water").classList.remove("winner");
  document.querySelector(".team-card.zero").classList.remove("winner");
  document.querySelector(".team-card.power").classList.remove("winner");
}

// Find the winning team
function getWinningTeam() {
  const highestCount = Math.max(waterCount, zeroCount, powerCount);

  let winners = [];

  if (waterCount === highestCount) {
    winners.push("Team Water Wise");
  }

  if (zeroCount === highestCount) {
    winners.push("Team Net Zero");
  }

  if (powerCount === highestCount) {
    winners.push("Team Renewables");
  }

  // If multiple teams are tied
  if (winners.length > 1) {
    return {
      name: winners.join(" & "),
      teamClass: null,
    };
  }

  if (waterCount === highestCount) {
    return {
      name: "Team Water Wise",
      teamClass: "water",
    };
  }

  if (zeroCount === highestCount) {
    return {
      name: "Team Net Zero",
      teamClass: "zero",
    };
  }

  return {
    name: "Team Renewables",
    teamClass: "power",
  };
}

// Show celebration when goal is reached
function checkForCelebration() {
  removeWinnerHighlight();

  if (attendeeCount >= attendanceGoal) {
    const winner = getWinningTeam();

    greeting.textContent =
      "🎉 Attendance goal reached! " +
      winner.name +
      " has the strongest turnout!";

    greeting.className = "celebration-message";

    // Highlight winner if there is only one winning team
    if (winner.teamClass !== null) {
      document
        .querySelector(".team-card." + winner.teamClass)
        .classList.add("winner");
    }

    return true;
  }

  return false;
}

// Handle attendee check-in
checkInForm.addEventListener("submit", function (event) {
  // Stop the page from refreshing
  event.preventDefault();

  // Get entered information
  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  // Make sure a name and team were entered
  if (attendeeName === "" || selectedTeam === "") {
    return;
  }

  // Increase total attendance
  attendeeCount++;

  // Increase selected team's attendance
  if (selectedTeam === "water") {
    waterCount++;
  } else if (selectedTeam === "zero") {
    zeroCount++;
  } else if (selectedTeam === "power") {
    powerCount++;
  }

  const teamName = getTeamName(selectedTeam);

  // Add attendee to list
  attendees.push({
    name: attendeeName,
    team: selectedTeam,
    teamName: teamName,
  });

  // Update everything on screen
  updateDisplay();
  displayAttendees();

  // Save progress
  saveProgress();

  // Personalized greeting
  greeting.textContent =
    "Welcome, " + attendeeName + "! You've checked in with " + teamName + ".";

  greeting.className = "success-message";

  // Check if attendance goal has been reached
  checkForCelebration();

  // Clear form for the next attendee
  attendeeNameInput.value = "";
  teamSelect.value = "";

  // Put cursor back in name field
  attendeeNameInput.focus();
});

// Display saved progress when page first loads
updateDisplay();
displayAttendees();
checkForCelebration();
