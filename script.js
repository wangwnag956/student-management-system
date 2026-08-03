const getUsers = () => JSON.parse(localStorage.getItem("taskflowUsers")) || [];
const saveUsers = (users) =>
  localStorage.setItem("taskflowUsers", JSON.stringify(users));

const getCurrentUser = () =>
  JSON.parse(localStorage.getItem("taskflowCurrentUser")) || null;

const saveCurrentUser = (user) =>
  localStorage.setItem("taskflowCurrentUser", JSON.stringify(user));

const getTasks = () => JSON.parse(localStorage.getItem("taskflowTasks")) || [];
const saveTasks = (tasks) =>
  localStorage.setItem("taskflowTasks", JSON.stringify(tasks));

function showMessage(element, message, isError = true) {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? "#dc2626" : "#16a34a";
}

function formatDate(dateValue) {
  if (!dateValue) return "No deadline";

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isToday(dateValue) {
  if (!dateValue) return false;

  const today = new Date().toISOString().split("T")[0];
  return dateValue === today;
}

function isOverdue(dateValue) {
  if (!dateValue) return false;

  const today = new Date().toISOString().split("T")[0];
  return dateValue < today;
}

/* Register */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage");

    if (password !== confirmPassword) {
      showMessage(message, "Passwords do not match.");
      return;
    }

    const users = getUsers();

    if (users.some((user) => user.email === email)) {
      showMessage(message, "This email is already registered.");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    saveCurrentUser({ name, email });

    showMessage(message, "Account created. Redirecting...", false);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 700);
  });
}

/* Login */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");
    const users = getUsers();

    const user = users.find(
      (savedUser) =>
        savedUser.email === email && savedUser.password === password
    );

    if (!user) {
      showMessage(message, "Incorrect email or password.");
      return;
    }

    saveCurrentUser({ name: user.name, email: user.email });
    showMessage(message, "Login successful. Redirecting...", false);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}

/* Dashboard */
const taskForm = document.getElementById("taskForm");

if (taskForm) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
  } else {
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const taskPriority = document.getElementById("taskPriority");
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");
    const searchInput = document.getElementById("searchInput");
    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const remainingTasks = document.getElementById("remainingTasks");
    const userName = document.getElementById("userName");
    const profileInitial = document.getElementById("profileInitial");
    const logoutButton = document.getElementById("logoutButton");
    const settingsButton = document.getElementById("settingsButton");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const closeModal = document.getElementById("closeModal");
    const settingsForm = document.getElementById("settingsForm");
    const displayNameInput = document.getElementById("displayNameInput");

    let editingTaskId = null;

    function userTasks() {
      return getTasks().filter((task) => task.userEmail === currentUser.email);
    }

    function updateUserInformation() {
      if (userName) userName.textContent = currentUser.name;
      if (profileInitial) {
        profileInitial.textContent = currentUser.name.charAt(0).toUpperCase();
      }
    }

    function renderTasks() {
      const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
      const tasks = userTasks().filter((task) =>
        task.name.toLowerCase().includes(keyword)
      );

      const completed = userTasks().filter((task) => task.completed).length;
      const total = userTasks().length;

      totalTasks.textContent = total;
      completedTasks.textContent = completed;
      remainingTasks.textContent = total - completed;
      taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;

      if (tasks.length === 0) {
        taskList.innerHTML = `
          <div class="empty-state">
            <h3>No tasks found</h3>
            <p>Add a new task to get started.</p>
          </div>
        `;
        return;
      }

      taskList.innerHTML = tasks
        .sort((a, b) => Number(a.completed) - Number(b.completed))
        .map((task) => {
          const deadlineClass = isOverdue(task.date) && !task.completed
            ? "overdue"
            : isToday(task.date) && !task.completed
              ? "today"
              : "";

          return `
            <article class="task-item ${task.completed ? "completed" : ""}">
              <button class="complete-button" data-action="toggle" data-id="${task.id}" aria-label="Complete task">
                ${task.completed ? "✓" : ""}
              </button>

              <div class="task-details">
                <h3>${escapeHtml(task.name)}</h3>
                <div class="task-meta">
                  <span class="priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
                  <span class="deadline ${deadlineClass}">
                    ${task.date ? `Due: ${formatDate(task.date)}` : "No deadline"}
                  </span>
                </div>
              </div>

              <div class="task-actions">
                <button data-action="edit" data-id="${task.id}">Edit</button>
                <button class="delete-button" data-action="delete" data-id="${task.id}">Delete</button>
              </div>
            </article>
          `;
        })
        .join("");
    }

    function escapeHtml(text) {
      const element = document.createElement("div");
      element.textContent = text;
      return element.innerHTML;
    }

    taskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = taskInput.value.trim();

      if (!name) return;

      const tasks = getTasks();

      if (editingTaskId) {
        const task = tasks.find((item) => item.id === editingTaskId);

        if (task) {
          task.name = name;
          task.date = taskDate.value;
          task.priority = taskPriority.value;
        }

        editingTaskId = null;
        taskForm.querySelector("button[type='submit']").textContent = "Add Task";
      } else {
        tasks.push({
          id: Date.now().toString(),
          userEmail: currentUser.email,
          name,
          date: taskDate.value,
          priority: taskPriority.value,
          completed: false,
        });
      }

      saveTasks(tasks);
      taskForm.reset();
      renderTasks();
    });

    taskList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      const { action, id } = button.dataset;
      const tasks = getTasks();
      const task = tasks.find((item) => item.id === id);

      if (!task) return;

      if (action === "toggle") {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
      }

      if (action === "delete") {
        const updatedTasks = tasks.filter((item) => item.id !== id);
        saveTasks(updatedTasks);
        renderTasks();
      }

      if (action === "edit") {
        taskInput.value = task.name;
        taskDate.value = task.date || "";
        taskPriority.value = task.priority;
        editingTaskId = task.id;
        taskForm.querySelector("button[type='submit']").textContent = "Save Changes";
        taskInput.focus();
      }
    });

    if (searchInput) {
      searchInput.addEventListener("input", renderTasks);
    }

    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        localStorage.removeItem("taskflowCurrentUser");
        window.location.href = "login.html";
      });
    }

    function openSettings() {
      displayNameInput.value = currentUser.name;
      modalBackdrop.classList.add("show");
    }

    function closeSettings() {
      modalBackdrop.classList.remove("show");
    }

    if (settingsButton) settingsButton.addEventListener("click", openSettings);
    if (closeModal) closeModal.addEventListener("click", closeSettings);

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (event) => {
        if (event.target === modalBackdrop) closeSettings();
      });
    }

    if (settingsForm) {
      settingsForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newName = displayNameInput.value.trim();
        if (!newName) return;

        const users = getUsers();
        const user = users.find((item) => item.email === currentUser.email);

        if (user) {
          user.name = newName;
          saveUsers(users);
        }

        currentUser.name = newName;
        saveCurrentUser(currentUser);
        updateUserInformation();
        closeSettings();
      });
    }

    updateUserInformation();
    renderTasks();
  }
}
