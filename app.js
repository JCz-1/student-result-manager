'use strict';

// Loading screen
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 2000);
});


//Grade function

const getGrade = (score) => {
  return score >= 70 ? "A" :
    score >= 60 ? "B" :
      score >= 50 ? "C" :
        score >= 40 ? "D" : "F";
}
/* console.log(getGrade(55)) */

class Student {
  constructor(name, score) {
    this.name = name;
    this.score = Number(score);
    this.grade = getGrade(this.score);
  }
}

/* let student = new Student('John', 47);
console.log(student); */

const students = [];

const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('nameInput');
const scoreInput = document.getElementById('scoreInput');
const errorMessage = document.getElementById('errorMessage');
const summary = document.getElementById('summary');
const studentList = document.getElementById('studentList');


function renderStudents() {
  studentList.innerHTML = "";

  if (students.length === 0) {
    studentList.innerHTML = "<p>No information</p>";
    return;
  }
  students.forEach((student, index) => {
    const card = document.createElement('div');
    card.className = `student-card grade-${student.grade}`;
    card.innerHTML = `
      <div class="student-info">
        <strong>${student.name}</strong>
        <span>Score: ${student.score}</span>
        <span>Grade: ${student.grade}</span>
      </div>
      <button class="delete-btn" onclick="deleteStudent(${index})">
        Delete:
      </button>
    `;

    studentList.appendChild(card);
  });
}

function renderSummary() {
  if (students.length === 0) {
    summary.innerHTML = "<p>No Students Record</p>";
    return;
  }

  const total = students.length;
  const average = (students.reduce((prev, student) => prev + student.score, 0) / total).toFixed(1);
  const highest = students.reduce((max, student) => student.score > max.score ? student : max, students[0]);
  const lowest = students.reduce((min, student) => student.score < min.score ? student : min, students[0]);

  summary.innerHTML = `
    <p>Total Students: <strong>${total}</strong></p>
    <p>Class Average: <strong>${average}</strong></p>
    <p>Highest Score: <strong>${highest.name} — ${highest.score}</strong></p>
    <p>Lowest Score: <strong>${lowest.name} — ${lowest.score}</strong></p>
  `;
}

//Delete Student and update the list
function deleteStudent(index) {
  students.splice(index, 1);
  renderStudents();
  renderSummary();
}


// function test(students) {
//   return students.reduce((prev, student) => prev + student.score, 0);
// }
// console.log(test(students));


studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  errorMessage.textContent = "";

  //Validate name and score input
  try {
    const name = nameInput.value.trim();
    const score = Number(scoreInput.value);

    //Validate name
    if (!name || /[^a-zA-Z\s]/.test(name)) throw new Error("Please enter a valid student name");

    //validate score
    //triggers if name is empty or it contains invalid chars.
    if (isNaN(score) || score < 0 || score > 100) {
      throw new Error("Please enter a valid score between 0 and 100");
    }

    //if successfull add the student to array
    const student = new Student(name, score);
    students.push(student);

    nameInput.value = "";
    scoreInput.value = "";

    //updates list
    renderStudents();
    renderSummary();

  } catch(error) {
    errorMessage.textContent = error.message;
  }
});


// Nav Toggle
const toggleBtn = document.getElementById("toggleBtn");
const mainView = document.getElementById("mainView");
const resultsView = document.getElementById("resultsView");
const resultsBody = document.getElementById("resultsBody");

//Results table
function renderResultsTable() {
  resultsBody.innerHTML = "";

  if (students.length === 0) {
    resultsBody.innerHTML = `
      <tr>
        <td colspan="2">No students yet</td>
      </tr>`;
    return;
  }

  students.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>
        <span class="grade-badge grade-${student.grade}">
          ${student.grade}
        </span>
      </td>
    `;
    resultsBody.appendChild(row);
  });
}

// Toggle between views
let isResultsView = false;

toggleBtn.addEventListener("click", () => {
  isResultsView = !isResultsView;

  if (isResultsView) {
    mainView.classList.add("hidden");
    resultsView.classList.remove("hidden");
    toggleBtn.textContent = "Back";
    renderResultsTable();
  } else {
    resultsView.classList.add("hidden");
    mainView.classList.remove("hidden");
    toggleBtn.textContent = "View Results";
  }
});

// Initial render
renderStudents();
renderSummary();

//:O