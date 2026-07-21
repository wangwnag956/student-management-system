# Practical 8: Iteration 3 – Test-Driven Development

## Task Requirement

Use the UI design together with user stories as test specifications for the Test-Driven Development process in Iteration 3.

## UI Design Used as Test Specification

The Student Task Management System UI includes:

- A text input field for entering a new task.
- An **Add Task** button.
- A **Total Tasks** counter.
- A **Completed** tasks counter.
- A **Remaining** tasks counter.
- A **Task List** section for displaying tasks.

The UI design was used to identify the expected user actions and system behaviour. The user stories were then used to create test cases before implementing the features.

---

## User Stories and Test Specifications

| ID | User Story | UI Element | Test Specifications |
|---|---|---|---|
| US2 | As a user, I want to edit a task so that I can update task details. | Task item, Edit button, Save button | Edit an existing task; edit with an empty title; edit a task that does not exist. |
| US3 | As a user, I want to delete a task so that I can remove tasks that are no longer needed. | Task item, Delete button | Delete an existing task; delete one task without affecting others; delete a task that does not exist. |
| US4 | As a user, I want to set a deadline for a task so that I can manage due dates. | Deadline date input | Add a deadline; update an existing deadline; set a deadline for a task that does not exist. |
| US5 | As a user, I want to receive a deadline reminder so that I do not miss important tasks. | Reminder message or notification area | Send a reminder for an upcoming deadline; do not send a reminder when there is no deadline; send a reminder only once. |
| US6 | As a user, I want to set task priority so that I can identify important tasks. | Priority selector | Set high priority; update task priority; set priority for a task that does not exist. |
| US7 | As a user, I want to view all tasks so that I can see my work in one place. | Task List, Total Tasks counter | View an empty task list; view one task; view multiple tasks. |
| US8 | As a user, I want to search tasks so that I can find a task quickly. | Search input field and results list | Search for an existing task; search is case-insensitive; search for a task that does not exist. |

---

## Selected User Story for TDD

### US7: View All Tasks

**User Story:**  
As a user, I want to view all tasks so that I can see my work in one place.

**Related UI design:**  
The Task List section displays all tasks. The Total Tasks counter shows the number of tasks in the system.

### Acceptance Criteria

1. When there are no tasks, the system shows an empty task list.
2. When one task is added, the task appears in the Task List.
3. When multiple tasks are added, all tasks appear in the Task List.
4. The Total Tasks counter matches the number of tasks shown.

### Test Cases

| Test Case | Given | When | Then |
|---|---|---|---|
| TC-US7-01 | No tasks exist | The user views the Task List | An empty list is returned. |
| TC-US7-02 | One task exists | The user views the Task List | The task is displayed. |
| TC-US7-03 | Multiple tasks exist | The user views the Task List | All tasks are displayed. |
| TC-US7-04 | Three tasks exist | The user checks Total Tasks | The total is 3. |

---

## TDD Process

For US7, I followed the TDD cycle:

1. **Red:** Write a Jest test for viewing tasks before writing or changing implementation code.
2. **Green:** Run `npm test` and implement the minimum code required for the test to pass.
3. **Refactor:** Improve the code structure if necessary while keeping all tests passing.

The tests for viewing tasks are based on the Task List and Total Tasks elements shown in the UI design.

---

## Example Jest Tests for US7

```js  
test('should return an empty task list when there are no tasks', () => {  
  expect(getTasks()).toEqual([]);  
});  

test('should return one task when one task has been added', () => {  
  addTask('Finish programming assignment');  

  expect(getTasks()).toEqual([  
    expect.objectContaining({ title: 'Finish programming assignment' })  
  ]);  
});  

test('should return all tasks when multiple tasks have been added', () => {  
  addTask('Study for exam');  
  addTask('Complete assignment');  
  addTask('Read lecture notes');  

  expect(getTasks()).toHaveLength(3);  
  expect(getTasks().map(task => task.title)).toEqual([  
    'Study for exam',  
    'Complete assignment',  
    'Read lecture notes'  
  ]);  
});

## US5: Deadline Reminder — Mock Object Testing

A mock notification service was used to test the deadline reminder feature without sending a real notification.

```js  
const notificationService = {  
  sendReminder: jest.fn()  
};  
```

The tests verify that:

- `sendReminder()` is called once when a task deadline is today.
- `sendReminder()` is not called when a task deadline is in the future.

This mock object allows the deadline reminder behaviour to be tested independently from a real notification system.

## Iteration 2 Reflection and Velocity

Iteration 2 established the core task-management functions and their initial tests.

For Iteration 3, the plan was adjusted to use the existing UI design and user stories as testing specifications, with additional focus on TDD and mock object testing.

Iteration 2 velocity: 4 completed user stories.
