let tasks = [];
let nextId = 1;

function resetTasks() {
  tasks = [];
  nextId = 1;
}

function addTask(title, deadline = "", priority = "Medium") {
  if (!title || title.trim() === "") return null;

  const task = {
    id: nextId++,
    title: title.trim(),
    deadline,
    priority,
    completed: false
  };

  tasks.push(task);
  return task;
}

function editTask(id, newTitle) {
  if (!newTitle || newTitle.trim() === "") return false;

  const task = tasks.find((task) => task.id === id);
  if (!task) return false;

  task.title = newTitle.trim();
  return true;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}

function setDeadline(id, deadline) {
  const task = tasks.find((task) => task.id === id);
  if (!task) return false;

  task.deadline = deadline;
  return true;
}

function setPriority(id, priority) {
  const validPriorities = ["High", "Medium", "Low"];
  const task = tasks.find((task) => task.id === id);

  if (!task || !validPriorities.includes(priority)) return false;

  task.priority = priority;
  return true;
}

function searchTasks(keyword) {
  const searchTerm = keyword.toLowerCase();

  return tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm)
  );
}

function getTasks() {
  return tasks;
}

function checkDeadlineReminders(notificationService, today = new Date()) {
  const todayDate = today.toISOString().split("T")[0];

  tasks.forEach(task => {
    if (task.deadline === todayDate) {
      notificationService.sendReminder(
        `Reminder: "${task.title}" is due today.`
      );
    }
  });
}

module.exports = {
  resetTasks,
  addTask,
  editTask,
  deleteTask,
  setDeadline,
  setPriority,
  searchTasks,
  getTasks,
  checkDeadlineReminders,
};