let tasks = [];

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        text: taskText,
        completed: false
    };

    tasks.push(task);
    taskInput.value = "";

    displayTasks();
    updateSummary();
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    const emptyMessage = document.getElementById("emptyMessage");

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    tasks.forEach(function(task, index) {
        const li = document.createElement("li");

        if (task.completed) {
            li.className = "task-item completed";
        } else {
            li.className = "task-item";
        }

        li.innerHTML = `
            <span class="task-text">${task.text}</span>

            <div class="task-actions">
                <button class="complete-btn" onclick="completeTask(${index})">
                    Done
                </button>

                <button class="delete-btn" onclick="deleteTask(${index})">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;

    displayTasks();
    updateSummary();
}

function deleteTask(index) {
    tasks.splice(index, 1);

    displayTasks();
    updateSummary();
}

function updateSummary() {
    const totalTasks = tasks.length;
    let completedTasks = 0;

    tasks.forEach(function(task) {
        if (task.completed) {
            completedTasks++;
        }
    });

    const remainingTasks = totalTasks - completedTasks;

    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("remainingTasks").textContent = remainingTasks;
}
