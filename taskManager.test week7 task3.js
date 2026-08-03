const {
  resetTasks,
  addTask,
  editTask,
  deleteTask,
  setDeadline,
  setPriority,
  searchTasks,
  getTasks,
  checkDeadlineReminders
} = require("./taskManager.js");

beforeEach(() => {
  resetTasks();
});

describe("Add Task", () => {
  test("adds a task with default values", () => {
    const task = addTask("Finish assignment");

    expect(task.title).toBe("Finish assignment");
    expect(task.priority).toBe("Medium");
    expect(task.completed).toBe(false);
  });

  test("does not add an empty task title", () => {
    const task = addTask("   ");

    expect(task).toBeNull();
    expect(getTasks()).toHaveLength(0);
  });

  test("adds deadline and priority when provided", () => {
    const task = addTask("Study", "2026-07-20", "High");

    expect(task.deadline).toBe("2026-07-20");
    expect(task.priority).toBe("High");
  });
});

describe("Edit Task", () => {
  test("edits an existing task title", () => {
    const task = addTask("Old title");

    expect(editTask(task.id, "New title")).toBe(true);
    expect(getTasks()[0].title).toBe("New title");
  });

  test("does not edit a task with an empty title", () => {
    const task = addTask("Original");

    expect(editTask(task.id, "")).toBe(false);
    expect(getTasks()[0].title).toBe("Original");
  });

  test("does not edit a task that does not exist", () => {
    expect(editTask(999, "New title")).toBe(false);
  });
});

describe("Delete Task", () => {
  test("deletes an existing task", () => {
    const task = addTask("Delete me");

    expect(deleteTask(task.id)).toBe(true);
    expect(getTasks()).toHaveLength(0);
  });

  test("does not delete a task that does not exist", () => {
    addTask("Keep me");

    expect(deleteTask(999)).toBe(false);
    expect(getTasks()).toHaveLength(1);
  });

  test("deletes only the selected task", () => {
    const firstTask = addTask("First task");
    addTask("Second task");

    deleteTask(firstTask.id);

    expect(getTasks()).toHaveLength(1);
    expect(getTasks()[0].title).toBe("Second task");
  });
});

describe("Set Deadline", () => {
  test("sets a deadline for an existing task", () => {
    const task = addTask("Submit report");

    expect(setDeadline(task.id, "2026-07-30")).toBe(true);
    expect(getTasks()[0].deadline).toBe("2026-07-30");
  });

  test("updates an existing deadline", () => {
    const task = addTask("Submit report", "2026-07-20");

    setDeadline(task.id, "2026-07-25");

    expect(getTasks()[0].deadline).toBe("2026-07-25");
  });

  test("does not set a deadline for a task that does not exist", () => {
    expect(setDeadline(999, "2026-07-30")).toBe(false);
  });
});

describe("Set Priority", () => {
  test("sets a valid priority", () => {
    const task = addTask("Important task");

    expect(setPriority(task.id, "High")).toBe(true);
    expect(getTasks()[0].priority).toBe("High");
  });

  test("does not accept an invalid priority", () => {
    const task = addTask("Task");

    expect(setPriority(task.id, "Urgent")).toBe(false);
    expect(getTasks()[0].priority).toBe("Medium");
  });

  test("does not set priority for a task that does not exist", () => {
    expect(setPriority(999, "Low")).toBe(false);
  });
});

describe("Search Tasks", () => {
  test("finds tasks by keyword regardless of letter case", () => {
    addTask("Complete JavaScript Assignment");
    addTask("Buy groceries");

    const result = searchTasks("javascript");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Complete JavaScript Assignment");
  });

  test("returns an empty array when no task matches", () => {
    addTask("Read notes");

    expect(searchTasks("meeting")).toEqual([]);
  });
});

describe("View All Tasks", () => {
  test("should return an empty task list when there are no tasks", () => {
    expect(getTasks()).toEqual([]);
  });

  test("should return one task when one task has been added", () => {
    addTask("Finish assignment");

    expect(getTasks()).toHaveLength(1);
    expect(getTasks()[0].title).toBe("Finish assignment");
  });

  test("should return all tasks when multiple tasks have been added", () => {
    addTask("Task 1");
    addTask("Task 2");
    addTask("Task 3");

    const tasks = getTasks();

    expect(tasks).toHaveLength(3);
    expect(tasks.map(task => task.title)).toEqual([
      "Task 1",
      "Task 2",
      "Task 3"
    ]);
  });
});

describe("Deadline Reminder", () => {
  test("should call sendReminder when a task is due today", () => {
    const notificationService = {
      sendReminder: jest.fn()
    };

    addTask("Submit Iteration 3");
    setDeadline(1, "2026-07-21");

    checkDeadlineReminders(
      notificationService,
      new Date("2026-07-21T12:00:00")
    );

    expect(notificationService.sendReminder).toHaveBeenCalledTimes(1);
    expect(notificationService.sendReminder).toHaveBeenCalledWith(
      'Reminder: "Submit Iteration 3" is due today.'
    );
  });

  test("should not call sendReminder when a task is not due today", () => {
    const notificationService = {
      sendReminder: jest.fn()
    };

    addTask("Future task");
    setDeadline(1, "2026-07-25");

    checkDeadlineReminders(
      notificationService,
      new Date("2026-07-21T12:00:00")
    );

    expect(notificationService.sendReminder).not.toHaveBeenCalled();
  });
});

