# Practical 7: Iteration 2 – Test-Driven Development

## 1. Testing Plan

The Student Task Management System will be tested using unit tests.

The tests will check whether each function gives the expected result for valid input, invalid input, and special cases.

The main areas to be tested are:

Editing a task
Deleting a task
Setting a deadline
Setting task priority
Searching for a task

Automated tests will be written before or during the implementation of the functions. Each user story will have at least three test cases.


## 2. Selected User Stories

The following five user stories were selected for testing:

US2: Edit Task
US3: Delete Task
US4: Set Deadline
US6: Set Task Priority
US8: Search Task

## 3. Test Cases

### US1: Add Task
| Test Case | Input / Action | Expected Result |
|---|---|---|
| Add a task with a valid title | Add task: `Finish homework` | A new task is added with the title `Finish homework` |
| Add a task with an empty title | Add task: `` | The task is not added |
| Add multiple tasks | Add `Task 1`, then add `Task 2` | Both tasks appear in the task list |

### US2: Edit Task
| Test Case | Input / Action | Expected Result |
|---|---|---|
| Edit an existing task | Change `Old task` to `New task` | The task title is updated to `New task` |
| Edit a task with an empty title | Change an existing task title to `` | The task title is not changed |
| Edit a task that does not exist | Edit task with an invalid index | No task is changed |

### US3: Delete Task
| Test Case | Input / Action | Expected Result |
|---|---|---|
| Delete an existing task | Delete `Finish homework` | The selected task is removed |
| Delete one task from multiple tasks | Add two tasks, then delete the first task | Only the selected task is removed |
| Delete a task that does not exist | Delete task with an invalid index | The task list is not changed |

### US4: Set Deadline
| Test Case | Input / Action | Expected Result |
|---|---|---|
| Set a deadline for a task | Set deadline `2026-07-20` | The task deadline is saved as `2026-07-20` |
| Update an existing deadline | Change deadline from `2026-07-20` to `2026-07-25` | The deadline is updated to `2026-07-25` |
| Set a deadline for a task that does not exist | Use an invalid task index | No deadline is added |

### US6: Set Task Priority
| Test Case | Input / Action | Expected Result |
|---|---|---|
| Set a valid priority | Set priority to `High` | The task priority becomes `High` |
| Set an invalid priority | Set priority to `Urgent` | The priority is not changed |
| Set priority for a task that does not exist | Use an invalid task index | No task is changed |

### US8: Search Task
| Test Case | Input / Action | Expected Result |
|---|---|---|
| Search for an existing task | Search `homework` | Matching task(s) are returned |
| Search is case-insensitive | Search `HOMEWORK` for task `homework` | Matching task(s) are returned |
| Search for a task that does not exist | Search `shopping` | An empty result is returned |
