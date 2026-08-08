/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL = "https://gnniwmasinmrfcivbtew.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_mrkorRd3NQ0iCuKGE0HN7A_XZnv-ySe";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


/* =========================================================
   LOCAL STORAGE - TASKS
========================================================= */

const getTasks = () => {
  return JSON.parse(localStorage.getItem("taskflowTasks")) || [];
};

const saveTasks = (tasks) => {
  localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
};


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function showMessage(element, message, isError = true) {
  if (!element) return;

  element.textContent = message;
  element.style.color = isError ? "#dc2626" : "#16a34a";
}


function formatDate(dateValue) {
  if (!dateValue) return "No deadline";

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


function isToday(dateValue) {
  if (!dateValue) return false;

  return dateValue ===
    new Date().toISOString().split("T")[0];
}


function isOverdue(dateValue) {
  if (!dateValue) return false;

  return (
    dateValue <
    new Date().toISOString().split("T")[0]
  );
}


function escapeHtml(text) {
  const element = document.createElement("div");

  element.textContent = text;

  return element.innerHTML;
}


/* =========================================================
   REGISTER
========================================================= */

const registerForm =
  document.getElementById("registerForm");


if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const name =
        document
          .getElementById("registerName")
          .value
          .trim();


      const email =
        document
          .getElementById("registerEmail")
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById("registerPassword")
          .value;


      const confirmPassword =
        document
          .getElementById("confirmPassword")
          .value;


      const message =
        document.getElementById(
          "registerMessage"
        );


      if (password !== confirmPassword) {

        showMessage(
          message,
          "Passwords do not match."
        );

        return;
      }


      if (password.length < 6) {

        showMessage(
          message,
          "Password must be at least 6 characters."
        );

        return;
      }


      const { data, error } =
        await supabaseClient.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {
              display_name: name,
            },

          },

        });


      if (error) {

        showMessage(
          message,
          error.message
        );

        return;
      }


      /*
        If Supabase automatically creates
        a session, the account can be used
        immediately.

        Otherwise email confirmation is required.
      */

      if (data.session) {

        showMessage(
          message,
          "Account created successfully.",
          false
        );

      } else {

        showMessage(
          message,
          "Account created. Please check your email to confirm your account.",
          false
        );

      }


      setTimeout(() => {

        window.location.href =
          "login.html";

      }, 1500);

    }
  );

}


/* =========================================================
   LOGIN
========================================================= */

const loginForm =
  document.getElementById("loginForm");


if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const email =
        document
          .getElementById("loginEmail")
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById("loginPassword")
          .value;


      const message =
        document.getElementById(
          "loginMessage"
        );


      const { data, error } =
        await supabaseClient.auth
          .signInWithPassword({

            email: email,

            password: password,

          });


      if (error) {

        showMessage(
          message,
          error.message
        );

        return;
      }


      if (!data.session) {

        showMessage(
          message,
          "Login failed. Please try again."
        );

        return;
      }


      showMessage(
        message,
        "Login successful. Redirecting...",
        false
      );


      setTimeout(() => {

        window.location.href =
          "index.html";

      }, 500);

    }
  );

}


/* =========================================================
   DASHBOARD
========================================================= */

const taskForm =
  document.getElementById("taskForm");


if (taskForm) {

  supabaseClient.auth
    .getSession()
    .then(async ({ data, error }) => {


      /* -----------------------------------------------------
         CHECK LOGIN SESSION
      ----------------------------------------------------- */

      if (error || !data.session) {

        window.location.href =
          "login.html";

        return;
      }


      /* -----------------------------------------------------
         CURRENT USER
      ----------------------------------------------------- */

      const currentUser = {

        name:
          data.session.user
            .user_metadata
            .display_name ||

          data.session.user.email
            .split("@")[0],

        email:
          data.session.user.email,

      };


      /* -----------------------------------------------------
         HTML ELEMENTS
      ----------------------------------------------------- */

      const taskInput =
        document.getElementById(
          "taskInput"
        );


      const taskDate =
        document.getElementById(
          "taskDate"
        );


      const taskPriority =
        document.getElementById(
          "taskPriority"
        );


      const taskList =
        document.getElementById(
          "taskList"
        );


      const taskCount =
        document.getElementById(
          "taskCount"
        );


      const searchInput =
        document.getElementById(
          "searchInput"
        );


      const totalTasks =
        document.getElementById(
          "totalTasks"
        );


      const completedTasks =
        document.getElementById(
          "completedTasks"
        );


      const remainingTasks =
        document.getElementById(
          "remainingTasks"
        );


      const userName =
        document.getElementById(
          "userName"
        );


      const profileInitial =
        document.getElementById(
          "profileInitial"
        );


      const logoutButton =
        document.getElementById(
          "logoutButton"
        );


      /* -----------------------------------------------------
         HISTORY ELEMENTS
      ----------------------------------------------------- */

      const historyList =
        document.getElementById(
          "historyList"
        );


      const historyCount =
        document.getElementById(
          "historyCount"
        );


      /* -----------------------------------------------------
         SETTINGS ELEMENTS
      ----------------------------------------------------- */

      const settingsButton =
        document.getElementById(
          "settingsButton"
        );


      const modalBackdrop =
        document.getElementById(
          "modalBackdrop"
        );


      const closeModal =
        document.getElementById(
          "closeModal"
        );


      const settingsForm =
        document.getElementById(
          "settingsForm"
        );


      const displayNameInput =
        document.getElementById(
          "displayNameInput"
        );


      let editingTaskId = null;


/* =========================================================
   CURRENT USER'S ACTIVE TASKS
========================================================= */

      function userTasks() {

        return getTasks().filter(
          (task) =>

            task.userEmail ===
              currentUser.email &&

            !task.deleted
        );

      }


/* =========================================================
   CURRENT USER'S DELETED TASKS
========================================================= */

      function deletedUserTasks() {

        return getTasks().filter(
          (task) =>

            task.userEmail ===
              currentUser.email &&

            task.deleted === true
        );

      }


/* =========================================================
   UPDATE USER INFORMATION
========================================================= */

      function updateUserInformation() {

        if (userName) {

          userName.textContent =
            currentUser.name;

        }


        if (profileInitial) {

          profileInitial.textContent =
            currentUser.name

              ? currentUser.name
                  .charAt(0)
                  .toUpperCase()

              : "S";

        }

      }


/* =========================================================
   RENDER ACTIVE TASKS
========================================================= */

      function renderTasks() {

        const keyword =
          searchInput

            ? searchInput.value
                .trim()
                .toLowerCase()

            : "";


        const allTasks =
          userTasks();


        const tasks =
          allTasks.filter(
            (task) =>

              task.name
                .toLowerCase()
                .includes(keyword)

          );


        const completed =
          allTasks.filter(
            (task) =>
              task.completed
          ).length;


        /* Dashboard statistics */

        if (totalTasks) {

          totalTasks.textContent =
            allTasks.length;

        }


        if (completedTasks) {

          completedTasks.textContent =
            completed;

        }


        if (remainingTasks) {

          remainingTasks.textContent =
            allTasks.length -
            completed;

        }


        /* Task count */

        if (taskCount) {

          taskCount.textContent =
            `${tasks.length} task${
              tasks.length === 1
                ? ""
                : "s"
            }`;

        }


        if (!taskList) return;


        /* Empty list */

        if (tasks.length === 0) {

          taskList.innerHTML = `
            <div class="empty-state">

              <h3>No tasks found</h3>

              <p>
                Add a new task to get started.
              </p>

            </div>
          `;

          return;
        }


        /* Render tasks */

        taskList.innerHTML =
          tasks

            .sort(
              (a, b) =>

                Number(a.completed) -
                Number(b.completed)

            )

            .map((task) => {


              const deadlineClass =

                isOverdue(task.date) &&
                !task.completed

                  ? "overdue"

                  : isToday(task.date) &&
                    !task.completed

                  ? "today"

                  : "";


              return `

                <article
                  class="task-item ${
                    task.completed
                      ? "completed"
                      : ""
                  }"
                >


                  <button
                    class="complete-button"
                    data-action="toggle"
                    data-id="${task.id}"
                    type="button"
                    title="${
                      task.completed
                        ? "Mark as incomplete"
                        : "Mark as completed"
                    }"
                  >

                    ${
                      task.completed
                        ? "✓"
                        : ""
                    }

                  </button>


                  <div class="task-details">

                    <h3>
                      ${escapeHtml(task.name)}
                    </h3>


                    <div class="task-meta">


                      <span
                        class="priority priority-${task.priority.toLowerCase()}"
                      >

                        ${task.priority}

                      </span>


                      <span
                        class="deadline ${deadlineClass}"
                      >

                        ${
                          task.date

                            ? `Due: ${formatDate(
                                task.date
                              )}`

                            : "No deadline"
                        }

                      </span>


                      ${
                        task.completed

                          ? `
                            <span>
                              Completed
                            </span>
                          `

                          : ""
                      }


                    </div>

                  </div>


                  <div class="task-actions">


                    <button
                      data-action="edit"
                      data-id="${task.id}"
                      type="button"
                    >

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


/* =========================================================
   RENDER HISTORY
========================================================= */

      function renderHistory() {

        if (!historyList) return;


        const deletedTasks =
          deletedUserTasks()

            .sort((a, b) => {

              return (

                new Date(
                  b.deletedAt || 0
                ) -

                new Date(
                  a.deletedAt || 0
                )

              );

            });


        if (historyCount) {

          historyCount.textContent =
            `${deletedTasks.length} deleted`;

        }


        /* No deleted tasks */

        if (
          deletedTasks.length === 0
        ) {

          historyList.innerHTML = `

            <div class="empty-state">

              <h3>
                No deleted tasks
              </h3>

              <p>
                Deleted tasks will appear here.
              </p>

            </div>

          `;

          return;
        }


        /* Show deleted tasks */

        historyList.innerHTML =
          deletedTasks

            .map((task) => {


              const deletedDate =
                task.deletedAt

                  ? new Date(
                      task.deletedAt
                    ).toLocaleString(
                      "en-GB"
                    )

                  : "Unknown";


              return `

                <article
                  class="task-item history-item"
                >


                  <div class="task-details">


                    <h3>
                      ${escapeHtml(task.name)}
                    </h3>


                    <div class="task-meta">


                      <span
                        class="priority priority-${task.priority.toLowerCase()}"
                      >

                        ${task.priority}

                      </span>


                      <span>

                        ${
                          task.completed
                            ? "Completed"
                            : "Not completed"
                        }

                      </span>


                      <span>

                        Deleted:
                        ${deletedDate}

                      </span>


                    </div>

                  </div>


                  <div class="task-actions">


                    <button
                      data-history-action="restore"
                      data-id="${task.id}"
                      type="button"
                    >

                      Restore

                    </button>


                    <button
                      class="delete-button"
                      data-history-action="permanent-delete"
                      data-id="${task.id}"
                      type="button"
                    >

                      Delete Forever

                    </button>


                  </div>


                </article>

              `;

            })

            .join("");

      }


/* =========================================================
   CREATE / EDIT TASK
========================================================= */

      taskForm.addEventListener(
        "submit",
        (event) => {

          event.preventDefault();


          const name =
            taskInput.value.trim();


          if (!name) return;


          const tasks =
            getTasks();


          /* Editing existing task */

          if (editingTaskId) {

            const task =
              tasks.find(
                (item) =>
                  item.id ===
                  editingTaskId
              );


            if (task) {

              task.name = name;

              task.date =
                taskDate.value;

              task.priority =
                taskPriority.value;

            }


            editingTaskId = null;


            const submitButton =
              taskForm.querySelector(
                "button[type='submit']"
              );


            if (submitButton) {

              submitButton.textContent =
                "+ Add Task";

            }

          }


          /* Creating new task */

          else {

            tasks.push({

              id:
                Date.now()
                  .toString(),

              userEmail:
                currentUser.email,

              name: name,

              date:
                taskDate.value,

              priority:
                taskPriority.value,

              completed:
                false,

              deleted:
                false,

              deletedAt:
                null,

              createdAt:
                new Date()
                  .toISOString(),

            });

          }


          saveTasks(tasks);


          taskForm.reset();


          renderTasks();

          renderHistory();

        }
      );


/* =========================================================
   TASK BUTTON ACTIONS
========================================================= */

      if (taskList) {

        taskList.addEventListener(
          "click",
          (event) => {


            const button =
              event.target.closest(
                "button[data-action]"
              );


            if (!button) return;


            const {
              action,
              id
            } = button.dataset;


            const tasks =
              getTasks();


            const task =
              tasks.find(
                (item) =>
                  item.id === id
              );


            if (!task) return;


            /* ---------------------------------------------
               COMPLETE / UNCOMPLETE TASK
            --------------------------------------------- */

            if (
              action === "toggle"
            ) {

              task.completed =
                !task.completed;


              task.completedAt =
                task.completed

                  ? new Date()
                      .toISOString()

                  : null;


              saveTasks(tasks);

              renderTasks();

              return;

            }


            /* ---------------------------------------------
               DELETE -> MOVE TO HISTORY
            --------------------------------------------- */

            if (
              action === "delete"
            ) {

              task.deleted = true;

              task.deletedAt =
                new Date()
                  .toISOString();


              saveTasks(tasks);


              /*
                If user was editing this task,
                cancel editing.
              */

              if (
                editingTaskId ===
                task.id
              ) {

                editingTaskId =
                  null;

                taskForm.reset();


                const submitButton =
                  taskForm.querySelector(
                    "button[type='submit']"
                  );


                if (submitButton) {

                  submitButton.textContent =
                    "+ Add Task";

                }

              }


              renderTasks();

              renderHistory();

              return;

            }


            /* ---------------------------------------------
               EDIT TASK
            --------------------------------------------- */

            if (
              action === "edit"
            ) {

              taskInput.value =
                task.name;


              taskDate.value =
                task.date || "";


              taskPriority.value =
                task.priority;


              editingTaskId =
                task.id;


              const submitButton =
                taskForm.querySelector(
                  "button[type='submit']"
                );


              if (submitButton) {

                submitButton.textContent =
                  "Save Changes";

              }


              taskInput.focus();

            }

          }
        );

      }


/* =========================================================
   HISTORY BUTTON ACTIONS
========================================================= */

      if (historyList) {

        historyList.addEventListener(
          "click",
          (event) => {


            const button =
              event.target.closest(
                "button[data-history-action]"
              );


            if (!button) return;


            const {
              historyAction,
              id
            } = button.dataset;


            const tasks =
              getTasks();


            const task =
              tasks.find(
                (item) =>
                  item.id === id
              );


            if (!task) return;


            /*
              Security check:
              make sure task belongs
              to current logged-in user.
            */

            if (
              task.userEmail !==
              currentUser.email
            ) {

              return;

            }


            /* ---------------------------------------------
               RESTORE TASK
            --------------------------------------------- */

            if (
              historyAction ===
              "restore"
            ) {

              task.deleted =
                false;

              task.deletedAt =
                null;


              saveTasks(tasks);


              renderTasks();

              renderHistory();

              return;

            }


            /* ---------------------------------------------
               DELETE FOREVER
            --------------------------------------------- */

            if (
              historyAction ===
              "permanent-delete"
            ) {


              const confirmed =
                confirm(

                  "Permanently delete this task? This cannot be undone."

                );


              if (!confirmed) return;


              const remaining =
                tasks.filter(
                  (item) =>
                    item.id !== id
                );


              saveTasks(
                remaining
              );


              renderTasks();

              renderHistory();

            }

          }
        );

      }


/* =========================================================
   SEARCH
========================================================= */

      if (searchInput) {

        searchInput.addEventListener(
          "input",
          renderTasks
        );

      }


/* =========================================================
   LOGOUT
========================================================= */

      if (logoutButton) {

        logoutButton.addEventListener(
          "click",
          async () => {


            await supabaseClient.auth
              .signOut();


            window.location.href =
              "login.html";

          }
        );

      }


/* =========================================================
   SETTINGS
========================================================= */

      function openSettings() {

        if (
          !modalBackdrop ||
          !displayNameInput
        ) {

          return;

        }


        displayNameInput.value =
          currentUser.name || "";


        modalBackdrop.classList.add(
          "show"
        );

      }


      function closeSettings() {

        if (modalBackdrop) {

          modalBackdrop.classList.remove(
            "show"
          );

        }

      }


      if (settingsButton) {

        settingsButton.addEventListener(
          "click",
          openSettings
        );

      }


      if (closeModal) {

        closeModal.addEventListener(
          "click",
          closeSettings
        );

      }


      if (modalBackdrop) {

        modalBackdrop.addEventListener(
          "click",
          (event) => {

            if (
              event.target ===
              modalBackdrop
            ) {

              closeSettings();

            }

          }
        );

      }


      if (settingsForm) {

        settingsForm.addEventListener(
          "submit",
          async (event) => {


            event.preventDefault();


            const newName =
              displayNameInput
                .value
                .trim();


            if (!newName) return;


            const { error } =
              await supabaseClient.auth
                .updateUser({

                  data: {
                    display_name:
                      newName,
                  },

                });


            if (error) {

              alert(
                error.message
              );

              return;

            }


            currentUser.name =
              newName;


            updateUserInformation();


            closeSettings();

          }
        );

      }


/* =========================================================
   INITIAL PAGE LOAD
========================================================= */

      updateUserInformation();

      renderTasks();

      renderHistory();

    });

}
