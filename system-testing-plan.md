# System Testing Plan

## 1. Testing Objective

The objective of this system testing plan is to verify that the Student Task Management System works correctly for users. The testing checks task creation, editing, deletion, deadline setting, priority selection, task searching, task completion, deadline reminders, and responsive layout.

## 2. Testing Environment

- Application: Student Task Management System
- Deployment: GitHub Pages
- Browser: Google Chrome
- Device: Windows laptop
- Test date: 28 July 2026
- Additional responsive test: Chrome mobile device view

## 3. Test Cases

| Test ID | Feature | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| ST01 | Add Task | Enter a task name and click **Add Task**. | A new task is added to the task list. The total task number increases. | Task was added successfully and the total was updated. | Pass |
| ST02 | Edit Task | Select a task and change its task name. | The updated task name is shown in the task list. | Task name was updated successfully. | Pass |
| ST03 | Delete Task | Click the **Delete** button for a task. | The selected task is removed and the total task number decreases. | Task was deleted successfully. | Pass |
| ST04 | Set Deadline | Add a task and select a deadline date. | The selected deadline is saved and displayed with the task. | Deadline was saved and displayed correctly. | Pass |
| ST05 | Set Priority | Add a task and choose Low, Medium, or High priority. | The selected priority is saved and displayed with the task. | Priority was saved and displayed correctly. | Pass |
| ST06 | Search Tasks | Type part of a task name in the Search Tasks field. | Only tasks matching the search text are displayed. | Matching tasks were displayed correctly. | Pass |
| ST07 | Mark Task as Completed | Click the **Complete** button for a task. | The task is marked as completed and shown with a line through the task text. | Task was marked as completed successfully. | Pass |
| ST08 | Deadline Reminder | Create a task with today's deadline and check the reminder behaviour. | A reminder is sent or displayed for a task due today. | Reminder behaviour was tested successfully. | Pass |
| ST09 | Mobile Responsive Layout | Open the website in Chrome mobile device view or reduce the browser width. | Content remains readable; form controls and task cards fit on a small screen. | Layout adjusted correctly on mobile width. | Pass |
| ST10 | Search Input Layout | Check the Search Tasks label and input field layout. | The label has adequate spacing and the input field uses the available width. | Issue found: search input was too narrow and layout was misaligned. GitHub Issue #20 created. | Fail |
| ST11 | Date Input Display | View the empty deadline date field under different system/browser language settings. | Date input display should be understandable and consistent where possible. | Date placeholder text can vary by browser/system locale. GitHub Issue #21 created. | Fail |

## 4. Defects Found

| Bug ID | Description | Severity | GitHub Issue | Status |
|---|---|---|---|---|
| BUG01 | The Search Tasks input layout was misaligned and the input field was too small. | Medium | #20 | Open |
| BUG02 | The date input placeholder can display differently depending on browser or system locale. | Low | #21 | Open |

## 5. Test Summary

A total of 11 system tests were completed.

- Passed: 9
- Failed: 2
- Open bugs reported: 2

The main functions of the Student Task Management System are working correctly. Two display-related issues were identified during testing and recorded in GitHub Issues for tracking and future improvement.

## 6. Evidence

Testing evidence is available through:

- GitHub Pages deployment of the Student Task Management System
- GitHub Issues #20 and #21
- GitHub Projects board
- Automated Jest test results for task management and deadline reminder functions
