let tasks = [];

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");
    const priorityInput = document.getElementById("priorityInput");

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        text: taskText,
        deadline: deadlineInput.value,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(task);

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

    const searchText = searchInput.value.trim().toLowerCase();
    const filteredTasks = tasks.filter(function (task) {
        return task.text.toLowerCase().includes(searchText);
    });

    taskList.innerHTML = "";
    taskCount.textContent = `${filteredTasks.length} task${filteredTasks.length === 1 ? "" : "s"}`;

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
        emptyMessage.textContent = tasks.length === 0
            ? "No tasks yet. Add your first task above."
            : "No tasks match your search.";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(function (task) {
        const originalIndex = tasks.indexOf(task);
        const li = document.createElement("li");

        li.className = task.completed ? "task-item completed" : "task-item";

        const reminder = isDueToday(task.deadline)
            ? `<p class="reminder">Due today — Reminder</p>`
            : "";

        const deadlineText = task.deadline
            ? formatDeadline(task.deadline)
            : "No deadline";

        li.innerHTML = `
            <div class="task-details">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-meta">
                    <span class="deadline">Deadline: ${deadlineText}</span>
                    <span class="priority priority-${task.priority.toLowerCase()}">
                        ${task.priority} Priority
                    </span>
                </div>
                ${reminder}
            </div>

            <div class="task-actions">
                <button class="complete-btn" onclick="completeTask(${originalIndex})">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn" onclick="editTask(${originalIndex})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteTask(${originalIndex})">
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
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
    updateSummary();
}

function editTask(index) {
    const newTaskText = prompt("Edit task:", tasks[index].text);

    if (newTaskText === null) {
        return;
    }

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
    const confirmed = confirm(`Delete "${tasks[index].text}"?`);

    if (confirmed) {
        tasks.splice(index, 1);
        displayTasks();
        updateSummary();
    }
}

function updateSummary() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const remainingTasks = totalTasks - completedTasks;

    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("remainingTasks").textContent = remainingTasks;
}

function isDueToday(deadline) {
    if (!deadline) {
        return false;
    }

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

displayTasks();
updateSummary();
