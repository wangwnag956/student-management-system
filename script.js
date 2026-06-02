function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task name.");
        return;
    }

    const listItem = document.createElement("li");
    listItem.textContent = taskText;

    taskList.appendChild(listItem);

    taskInput.value = "";
}
