# Practical 7: Iteration 2 – Test-Driven Development

## 1. Testing Plan

The Student Task Management System will be tested using unit tests.

The tests will check whether each function gives the expected result for valid input, invalid input, and special cases.

The main areas to be tested are:

- Editing a task
- Deleting a task
- Setting a deadline
- Setting task priority
- Searching for a task

Automated tests will be written before or during the implementation of the functions. Each user story will have at least three test cases.

---

## 2. Selected User Stories

The following five user stories were selected for testing:

- US2: Edit Task
- US3: Delete Task
- US4: Set Deadline
- US6: Set Task Priority
- US8: Search Task

---

## 3. Test Cases

### US2: Edit Task

| Test Case | Input / Action | Expected Result |
|---|---|---|
| Edit task title | Change `Finish assignment` to `Finish Java assignment` | The task title is updated. |
| Edit task with empty title | Enter an empty title | The task title is not changed. |
| Edit a completed task | Edit a task marked as completed | The title is updated and its completed status remains completed. |

### US3: Delete Task

| Test Case | Input / Action | Expected Result |
|---|---|---|
| Delete one task | Delete `Study for exam` | The task is removed from the list. |
| Delete task from multiple tasks | Delete the second task from a list of three tasks | Only the selected task is removed. |
| Delete task with invalid index | Delete a task using an invalid index | The task list remains unchanged. |

### US4: Set Deadline

| Test Case | Input / Action | Expected Result |
|---|---|---|
| Set a valid deadline | Set deadline to `2026-07-20` | The deadline is stored for the task. |
| Set no deadline | Leave the deadline empty | The task has no deadline. |
| Change a deadline | Change `2026-07-20` to `2026-07-25` | The new deadline replaces the old deadline. |

### US6: Set Task Priority

| Test Case | Input / Action | Expected Result |
|---|---|---|
| Set high priority | Set priority to `High` | The task priority is High. |
| Set medium priority | Set priority to `Medium` | The task priority is Medium. |
| Set invalid priority | Set priority to `Urgent` | The priority is rejected or changed to a default value. |

### US8: Search Task

| Test Case | Input / Action | Expected Result |
|---|---|---|
| Search by full title | Search `assignment` | Matching task is displayed. |
| Search by partial title | Search `exam` | Tasks containing `exam` are displayed. |
| Search with no match | Search `holiday` | No tasks are returned. |
