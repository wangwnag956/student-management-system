function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (!savedTasks) {
    return [];
  }

  try {
    return JSON.parse(savedTasks);
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let tasks = loadTasks();

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

  saveTasks();

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
    emptyMessage.innerHTML = `
      <div class="empty-icon">✓</div>
      <h3>${tasks.length === 0 ? "No tasks yet" : "No matching tasks"}</h3>
      <p>${
        tasks.length === 0
          ? "Add your first task above to begin organising your workload."
          : "Try searching for a different task name."
      }</p>
    `;
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
          <span class="deadline">Due: ${deadlineText}</span>
          <span class="priority priority-${task.priority.toLowerCase()}">
            ${task.priority}
          </span>
        </div>

        ${
          isDueToday(task.deadline)
            ? '<p class="reminder">Due today · Reminder</p>'
            : ""
        }
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

  saveTasks();
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
    "Edit deadline (YYYY-MM-DD). Leave blank for no deadline:",
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

  saveTasks();
  displayTasks();
  updateSummary();
}

function deleteTask(index) {
  if (!tasks[index]) return;

  const confirmed = confirm(`Delete "${tasks[index].text}"?`);

  if (!confirmed) return;

  tasks.splice(index, 1);

  saveTasks();
  displayTasks();
  updateSummary();
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

/* Register page */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const registerMessage = document.getElementById("registerMessage");

    if (password !== confirmPassword) {
      registerMessage.textContent = "Passwords do not match.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = users.some(function (user) {
      return user.username === username || user.email === email;
    });

    if (userExists) {
      registerMessage.textContent = "This username or email already exists.";
      return;
    }

    users.push({
      username: username,
      email: email,
      password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    registerMessage.style.color = "#1c7c54";
    registerMessage.textContent = "Account created successfully. Please log in.";

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1200);
  });
}

/* Login page */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameOrEmail = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(function (savedUser) {
      return (
        (savedUser.username === usernameOrEmail ||
          savedUser.email === usernameOrEmail) &&
        savedUser.password === password
      );
    });

    if (!user) {
      loginMessage.textContent = "Incorrect username, email, or password.";
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", user.username);

    window.location.href = "index.html";
  });
}

/* Dashboard authentication */
const logoutButton = document.getElementById("logoutButton");
const welcomeUser = document.getElementById("welcomeUser");
const isTaskPage = document.getElementById("taskList") !== null;

if (isTaskPage) {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
  } else if (welcomeUser) {
    welcomeUser.textContent =
      localStorage.getItem("currentUser") || "Student";
  }

  displayTasks();
  updateSummary();
}

/* Logout */
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
  });
}

/* Settings: change display name */
const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const displayNameInput = document.getElementById("displayNameInput");
const settingsMessage = document.getElementById("settingsMessage");

if (settingsButton) {
  settingsButton.addEventListener("click", function () {
    if (displayNameInput) {
      displayNameInput.value = localStorage.getItem("currentUser") || "";
    }

    if (settingsMessage) {
      settingsMessage.textContent = "";
      settingsMessage.style.color = "";
    }

    if (settingsModal) {
      settingsModal.style.display = "flex";
    }
  });
}

if (closeSettingsButton) {
  closeSettingsButton.addEventListener("click", function () {
    if (settingsModal) {
      settingsModal.style.display = "none";
    }
  });
}

if (saveSettingsButton) {
  saveSettingsButton.addEventListener("click", function () {
    if (!displayNameInput || !settingsMessage) return;

    const newName = displayNameInput.value.trim();

    if (newName === "") {
      settingsMessage.style.color = "#c0392b";
      settingsMessage.textContent = "Please enter a name.";
      return;
    }

    localStorage.setItem("currentUser", newName);

    if (welcomeUser) {
      welcomeUser.textContent = newName;
    }

    settingsMessage.style.color = "#1c7c54";
    settingsMessage.textContent = "Name updated successfully.";

    setTimeout(function () {
      if (settingsModal) {
        settingsModal.style.display = "none";
      }
    }, 800);
  });
}

if (settingsModal) {
  settingsModal.addEventListener("click", function (event) {
    if (event.target === settingsModal) {
      settingsModal.style.display = "none";
    }
  });
}
