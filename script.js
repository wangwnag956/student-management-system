const SUPABASE_URL = "https://gnniwmasinmrfcivbtew.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_mrkorRd3NQ0iCuKGE0HN7A_XZnv-ySe";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

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
  return dateValue === new Date().toISOString().split("T")[0];
}

function isOverdue(dateValue) {
  if (!dateValue) return false;
  return dateValue < new Date().toISOString().split("T")[0];
}

/* Register */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
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

    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if (error) {
      showMessage(message, error.message);
      return;
    }

    showMessage(
      message,
      "Account created. Please check your email to confirm your account.",
      false
    );

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
}

/* Login */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      showMessage(message, error.message);
      return;
    }

    showMessage(message, "Login successful. Redirecting...", false);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}

/* Dashboard */
const taskForm = document.getElementById("taskForm");

if (taskForm) {
  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error || !data.session) {
      window.location.href = "login.html";
      return;
    }

    const currentUser = {
      name:
        data.session.user.user_metadata.display_name ||
        data.session.user.email.split("@")[0],
      email: data.session.user.email,
    };

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
        profileInitial.textContent = currentUser.name
          ? currentUser.name.charAt(0).toUpperCase()
          : "S";
      }
    }

    function escapeHtml(text) {
      const element = document.createElement("div");
      element.textContent = text;
      return element.innerHTML;
    }

    function renderTasks() {
      const keyword = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

      const allTasks = userTasks();
      const tasks = allTasks.filter((task) =>
        task.name.toLowerCase().includes(keyword)
      );

      const completed = allTasks.filter((task) => task.completed).length;

      if (totalTasks) totalTasks.textContent = allTasks.length;
      if (completedTasks) completedTasks.textContent = completed;
      if (remainingTasks) remainingTasks.textContent = allTasks.length - completed;

      if (taskCount) {
        taskCount.textContent = `${tasks.length} task${
          tasks.length === 1 ? "" : "s"
        }`;
      }

      if (!taskList) return;

      if (tasks.length === 0) {
        taskList.innerHTML = `
          <div class="empty-state">
            <h3>No tasks found</h3>
            <p>Add a new task to get started.</p >
          </div>
        `;
        return;
      }

      taskList.innerHTML = tasks
        .sort((a, b) => Number(a.completed) - Number(b.completed))
        .map((task) => {
          const deadlineClass =
            isOverdue(task.date) && !task.completed
              ? "overdue"
              : isToday(task.date) && !task.completed
                ? "today"
                : "";

          return `
            <article class="task-item ${task.completed ? "completed" : ""}">
              <button
                class="complete-button"
                data-action="toggle"
                data-id="${task.id}"
                type="button"
              >
                ${task.completed ? "✓" : ""}
              </button>

              <div class="task-details">
                <h3>${escapeHtml(task.name)}</h3>
                <div class="task-meta">
                  <span class="priority priority-${task.priority.toLowerCase()}">
                    ${task.priority}
                  </span>
                  <span class="deadline ${deadlineClass}">
                    ${task.date ? `Due: ${formatDate(task.date)}` : "No deadline"}
                  </span>
                </div>
              </div>

              <div class="task-actions">
                <button data-action="edit" data-id="${task.id}" type="button">
                  Edit
                </button>
                <button
                  class="delete-button"
                  data-action="delete"
                  data-id="${task.id}"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </article>
          `;
        })
        .join("");
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
        taskForm.querySelector("button[type='submit']").textContent =
          "+ Add Task";
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

    if (taskList) {
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
          saveTasks(tasks.filter((item) => item.id !== id));
          renderTasks();
        }

        if (action === "edit") {
          taskInput.value = task.name;
          taskDate.value = task.date || "";
          taskPriority.value = task.priority;
          editingTaskId = task.id;

          taskForm.querySelector("button[type='submit']").textContent =
            "Save Changes";

          taskInput.focus();
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", renderTasks);
    }

    if (logoutButton) {
      logoutButton.addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        window.location.href = "login.html";
      });
    }

    /* Settings */
    function openSettings() {
      if (!modalBackdrop || !displayNameInput) return;

      displayNameInput.value = currentUser.name || "";
      modalBackdrop.classList.add("show");
    }

    function closeSettings() {
      if (modalBackdrop) {
        modalBackdrop.classList.remove("show");
      }
    }

    if (settingsButton) {
      settingsButton.addEventListener("click", openSettings);
    }

    if (closeModal) {
      closeModal.addEventListener("click", closeSettings);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (event) => {
        if (event.target === modalBackdrop) {
          closeSettings();
        }
      });
    }

    if (settingsForm) {
      settingsForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newName = displayNameInput.value.trim();
        if (!newName) return;

        const { error } = await supabaseClient.auth.updateUser({
          data: { display_name: newName },
        });

        if (error) {
          alert(error.message);
          return;
        }

        currentUser.name = newName;
        updateUserInformation();
        closeSettings();
      });
    }

    updateUserInformation();
    renderTasks();
  });
}


