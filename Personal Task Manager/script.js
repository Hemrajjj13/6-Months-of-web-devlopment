// Task list (10 total)
const tasks = [
  "6-hr Study / Skill Practice",
  "50 Push-ups",
  "1-hr Gym Workout",
  "10-min Meditation / Journaling",
  "Read 10 Pages",
  "Watch 1 Informative Video",
  "No Sugar & Junk Food",
  "Prayer / Gratitude",
  "Plan Next Day",
  "Extra Skill Practice / Project Work"
];

const totalDays = 100;
const headerRow = document.getElementById("headerRow");
const dayRows = document.getElementById("dayRows");

// Load saved data
let progress = JSON.parse(localStorage.getItem("challengeProgressVertical")) || {};

// --- Build header row ---
tasks.forEach(task => {
  const th = document.createElement("th");
  th.textContent = task;
  headerRow.appendChild(th);
});

// Add Score column
const scoreTh = document.createElement("th");
scoreTh.textContent = "✅ Score";
headerRow.appendChild(scoreTh);

// --- Build rows for days ---
for (let d = 1; d <= totalDays; d++) {
  const row = document.createElement("tr");

  // Day label
  const dayCell = document.createElement("td");
  dayCell.textContent = d;
  row.appendChild(dayCell);

  let score = 0;

  tasks.forEach((task, taskIndex) => {
    const cell = document.createElement("td");

    // Button toggle
    const btn = document.createElement("button");
    const saved = progress[`${d}-${taskIndex}`];
    btn.textContent = saved?.status || "-";
    if (btn.textContent === "✔") btn.classList.add("done");
    if (btn.textContent === "✘") btn.classList.add("missed");

    btn.onclick = () => {
      if (btn.classList.contains("done")) {
        btn.classList.remove("done");
        btn.classList.add("missed");
        btn.textContent = "✘";
      } else if (btn.classList.contains("missed")) {
        btn.classList.remove("missed");
        btn.textContent = "-";
      } else {
        btn.classList.add("done");
        btn.textContent = "✔";
      }
      saveProgress();
      updateScores();
    };
    cell.appendChild(btn);

    // Note button
    const noteBtn = document.createElement("span");
    noteBtn.textContent = "📝";
    noteBtn.classList.add("note");
    noteBtn.title = saved?.note || "";
    noteBtn.onclick = () => {
      const note = prompt("Enter your note:", noteBtn.title);
      if (note !== null) {
        noteBtn.title = note;
        saveProgress();
      }
    };
    cell.appendChild(noteBtn);

    row.appendChild(cell);
  });

  // Score cell
  const scoreCell = document.createElement("td");
  scoreCell.id = `score-${d}`;
  row.appendChild(scoreCell);

  dayRows.appendChild(row);
}

// Save progress
function saveProgress() {
  progress = {};
  document.querySelectorAll("#dayRows tr").forEach((row, dayIndex) => {
    const day = dayIndex + 1;
    row.querySelectorAll("td").forEach((cell, cellIndex) => {
      if (cellIndex === 0 || cell.id.startsWith("score")) return; // skip day & score
      const btn = cell.querySelector("button");
      const noteBtn = cell.querySelector(".note");
      progress[`${day}-${cellIndex-1}`] = {
        status: btn.textContent,
        note: noteBtn.title
      };
    });
  });
  localStorage.setItem("challengeProgressVertical", JSON.stringify(progress));
  updateScores();
}

// Update daily scores
function updateScores() {
  for (let d = 1; d <= totalDays; d++) {
    let count = 0;
    tasks.forEach((_, taskIndex) => {
      const record = progress[`${d}-${taskIndex}`];
      if (record && record.status === "✔") {
        count++;
      }
    });
    const scoreCell = document.getElementById(`score-${d}`);
    if (scoreCell) scoreCell.textContent = `${count}/10`;
  }
}

// Initial load
updateScores();
