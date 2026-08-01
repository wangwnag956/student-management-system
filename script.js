let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const priorityInput = document.getElementById("priorityInput");

  if (!taskInput || !deadlineInput || !priorityInput) return;

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    taskInput.focus();
    return;
  }

  tasks.push({
    text: taskText,
    deadline: deadlineInput.value,
    priority: priorityInput.value,
    completed: false
  });

  taskInput.value = "";
  deadlineInput.value = "";
  priorityInput.value = "Medium";

  displayTasks();
  updateSummary();
}

function displayTasks() {
  const taskList = document.getElementById("taskList");
  const emptyMessage = document.getElementById("emptyMessage");
  const searchInput = document.getElementById("searchInput");
  const taskCount = document.getElementById("taskCount");

  if (!taskList || !emptyMessage || !searchInput || !taskCount) return;

  const searchText = searchInput.value.trim().toLowerCase();

  const filteredTasks = tasks.filter(function (task) {
    return task.text.toLowerCase().includes(searchText);
  });

  taskList.innerHTML = "";
  taskCount.textContent =
    `${filteredTasks.length} task${filteredTasks.length === 1 ? "" : "s"}`;

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";
    emptyMessage.textContent = tasks.length === 0
      ? "No tasks yet. Add your first task above."
      : "No tasks match your search.";
    return;
  }

  emptyMessage.style.display = "none";

  filteredTasks.forEach(function (task) {
    const originalIndex = tasks.indexOf(task);
    const li = document.createElement("li");
    const deadlineText = task.deadline
      ? formatDeadline(task.deadline)
      : "No deadline";

    li.className = task.completed
      ? "task-item completed"
      : "task-item";

    li.innerHTML = `
      <div class="task-details">
        <span class="task-text">${escapeHtml(task.text)}</span>

        <div class="task-meta">
          <span class="deadline">Deadline: ${deadlineText}</span>
          <span class="priority priority-${task.priority.toLowerCase()}">
            ${task.priority} Priority
          </span>
        </div>

        ${isDueToday(task.deadline)
          ? '<p class="reminder">Due today — Reminder</p>'
          : ""}
      </div>

      <div class="task-actions">
        <button class="complete-btn" type="button" onclick="completeTask(${originalIndex})">
          ${task.completed ? "Undo" : "Done"}
        </button>

        <button class="edit-btn" type="button" onclick="editTask(${originalIndex})">
          Edit
        </button>

        <button class="delete-btn" type="button" onclick="deleteTask(${originalIndex})">
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function searchTasks() {
  displayTasks();
}

function completeTask(index) {
  if (!tasks[index]) return;

  tasks[index].completed = !tasks[index].completed;
  displayTasks();
  updateSummary();
}

function editTask(index) {
  if (!tasks[index]) return;

  const newTaskText = prompt("Edit task:", tasks[index].text);

  if (newTaskText === null) return;

  const trimmedText = newTaskText.trim();

  if (trimmedText === "") {
    alert("Task name cannot be empty.");
    return;
  }

  tasks[index].text = trimmedText;

  const newDeadline = prompt(
    "Edit deadline (YYYY-MM-DD). Leave empty for no deadline:",
    tasks[index].deadline
  );

  if (newDeadline !== null) {
    tasks[index].deadline = newDeadline.trim();
  }

  const newPriority = prompt(
    "Edit priority: Low, Medium, or High",
    tasks[index].priority
  );

  if (newPriority !== null) {
    const formattedPriority =
      newPriority.charAt(0).toUpperCase() +
      newPriority.slice(1).toLowerCase();

    if (["Low", "Medium", "High"].includes(formattedPriority)) {
      tasks[index].priority = formattedPriority;
    } else {
      alert("Priority was not changed. Please use Low, Medium, or High.");
    }
  }

  displayTasks();
  updateSummary();
}

function deleteTask(index) {
  if (!tasks[index]) return;

  const confirmed = confirm(`Delete "${tasks[index].text}"?`);

  if (confirmed) {
    tasks.splice(index, 1);
    displayTasks();
    updateSummary();
  }
}

function updateSummary() {
  const totalTasksElement = document.getElementById("totalTasks");
  const completedTasksElement = document.getElementById("completedTasks");
  const remainingTasksElement = document.getElementById("remainingTasks");

  if (!totalTasksElement || !completedTasksElement || !remainingTasksElement) {
    return;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  }).length;

  totalTasksElement.textContent = totalTasks;
  completedTasksElement.textContent = completedTasks;
  remainingTasksElement.textContent = totalTasks - completedTasks;
}

function isDueToday(deadline) {
  if (!deadline) return false;

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  return deadline === localToday;
}

function formatDeadline(deadline) {
  const date = new Date(`${deadline}T00:00:00`);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function escapeHtml(text) {
  const temporaryElement = document.createElement("div");
  temporaryElement.textContent = text;
  return temporaryElement.innerHTML;
}

/* Login page */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");

    if (username !== "" && password !== "") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", username);
      window.location.href = "index.html";
    } else {
      loginMessage.textContent = "Please enter a username and password.";
    }
  });
}

/* Dashboard authentication and logout */
const logoutButton = document.getElementById("logoutButton");
const welcomeUser = document.getElementById("welcomeUser");
const isTaskPage = document.getElementById("taskList") !== null;

if (isTaskPage) {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
  } else if (welcomeUser) {
    welcomeUser.textContent =
      `Welcome, ${localStorage.getItem("currentUser") || "Student"}!`;
  }

  displayTasks();
  updateSummary();
}

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}
