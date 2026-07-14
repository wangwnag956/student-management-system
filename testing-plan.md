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


## 2. Selected User Stories

The following five user stories were selected for testing:

- US2: Edit Task
- US3: Delete Task
- US4: Set Deadline
- US6: Set Task Priority
- US8: Search Task

## 3. Test Cases

### US1: Add Task

**Test Case 1: Add a task with default values**  
- **Input / Action:** Add a task with the title `Finish assignment`.
- **Expected Result:** A new task is created with title `Finish assignment`, priority `Medium`, and completed status `false`.

**Test Case 2: Add a task with an empty title**  
- **Input / Action:** Try to add a task with an empty title.
- **Expected Result:** No task is created.

**Test Case 3: Add a task with deadline and priority**  
- **Input / Action:** Add a task with title `Study for exam`, deadline `2026-07-20`, and priority `High`.
- **Expected Result:** A new task is created with the selected deadline and priority.

---

### US2: Edit Task

**Test Case 1: Edit an existing task title**  
- **Input / Action:** Change `Finish assignment` to `Finish Java assignment`.
- **Expected Result:** The task title is updated.

**Test Case 2: Edit a task with an empty title**  
- **Input / Action:** Try to change a task title to an empty value.
- **Expected Result:** The task title is not changed.

**Test Case 3: Edit a task that does not exist**  
- **Input / Action:** Try to edit a task using an ID that does not exist.
- **Expected Result:** No task is changed.

---

### US3: Delete Task

**Test Case 1: Delete an existing task**  
- **Input / Action:** Delete the task `Study for exam`.
- **Expected Result:** The task is removed from the list.

**Test Case 2: Delete only the selected task**  
- **Input / Action:** Create three tasks and delete the second task.
- **Expected Result:** Only the selected task is removed. The other tasks remain in the list.

**Test Case 3: Delete a task that does not exist**  
- **Input / Action:** Try to delete a task using an ID that does not exist.
- **Expected Result:** The task list remains unchanged.

---

### US4: Set Deadline

**Test Case 1: Set a deadline for an existing task**  
- **Input / Action:** Set the deadline of a task to `2026-07-20`.
- **Expected Result:** The deadline is stored for the task.

**Test Case 2: Update an existing deadline**  
- **Input / Action:** Change a task deadline from `2026-07-20` to `2026-07-25`.
- **Expected Result:** The new deadline replaces the old deadline.

**Test Case 3: Set a deadline for a task that does not exist**  
- **Input / Action:** Try to set a deadline using an ID that does not exist.
- **Expected Result:** No task is changed.

---

### US6: Set Task Priority

**Test Case 1: Set a valid priority**  
- **Input / Action:** Set the priority of a task to `High`.
- **Expected Result:** The task priority is changed to `High`.

**Test Case 2: Set an invalid priority**  
- **Input / Action:** Try to set the priority to `Urgent`.
- **Expected Result:** The invalid priority is rejected and the task priority is not changed.

**Test Case 3: Set priority for a task that does not exist**  
- **Input / Action:** Try to set a priority using an ID that does not exist.
- **Expected Result:** No task is changed.

---

### US8: Search Task

**Test Case 1: Search tasks by keyword**  
- **Input / Action:** Search for `assignment`.
- **Expected Result:** Tasks containing `assignment` in the title are returned.

**Test Case 2: Search regardless of letter case**  
- **Input / Action:** Search for `EXAM` when a task title contains `exam`.
- **Expected Result:** Matching tasks are returned regardless of uppercase or lowercase letters.

**Test Case 3: Search with no matching task**  
- **Input / Action:** Search for `holiday` when no task contains that word.
- **Expected Result:** An empty array is returned.
