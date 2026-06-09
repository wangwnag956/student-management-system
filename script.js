function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task name.");
    return;
  }

  const taskList = document.getElementById("taskList");

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const span = document.createElement("span");
  span.textContent = taskText;

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      span.classList.add("completed");
    } else {
      span.classList.remove("completed");
    }
  });

  li.appendChild(checkbox);
  li.appendChild(span);

  taskList.appendChild(li);

  taskInput.value = "";
}
