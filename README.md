# TaskFlow – Student Task Management System

## Project Overview

TaskFlow is a simple web-based task management system for students.  
It helps students create, organise, search, edit, complete, and delete tasks.  
Users can also register an account, log in, update their display name, and view task statistics.

## Project Members

| Name | Role | Main Responsibilities |
|---|---|---|
| Wang Zhiyuan | Front-end Developer | Dashboard page, task interface, responsive design, CSS styling |
| Wu Jiawei | JavaScript Developer | Task functions, local storage, search, task statistics, deadline reminder |
| Wang Xv | User Account Developer & Tester | Login, registration, settings, testing, documentation |

## Features

User registration
User login and logout
Create a new task
Set task deadline
Set task priority: Low, Medium, High
Edit a task
Delete a task
Mark task as completed or undo completion
Search tasks by task name
View total, completed, and remaining task numbers
Deadline reminder
Update display name in Settings
Responsive design for desktop and mobile devices

## User Stories

US1 – Create Task
US2 – Edit Task
US3 – Delete Task
US4 – Set Deadline
US5 – Deadline Reminder
US6 – Set Task Priority
US7 – View All Tasks
US8 – Search Task
US9 – User Login
US10 – View Task Summary
US11 – Mark Task as Completed
US12 – View Upcoming Tasks
US13 – Logout
US14 – User Registration
US15 – Update Settings

## Task Distribution

### Wang Zhiyuan

Design and build the Dashboard interface.  
Create the sidebar navigation and summary cards.  
Create the task form and task list layout.  
Write and improve `style.css`.  
Make the website responsive for mobile devices.  
Implement add task, edit task, delete task, and complete task functions.  
Implement task search and task statistics.  
Work on User Stories: US1, US2, US3, US6, US7, US8, US10, US11, US12.

### Wu Jiawei

Develop task functions in `script.js`.  
Implement task deadline and priority functions.  
Implement deadline display and deadline reminder.  
Save task data using Local Storage.  
Help implement task search and task statistics.  
Test task functions and fix simple JavaScript errors.  
Work on User Stories: US4, US5, US6, US8, US10, US11, US12.

### Wang Xv

Create `login.html` and `register.html`.  
Implement login, registration, logout, and Settings functions.  
Update the display name in Settings.  
Test user account functions.  
Write the README file and project documentation.  
Work on User Stories: US9, US13, US14, US15.

## Technologies Used

HTML5
CSS3
JavaScript
Local Storage
GitHub Pages
GitHub

## File Structure

```text  
TaskFlow/  
├── index.html  
├── login.html  
├── register.html  
├── style.css  
├── script.js  
└── README.md  
How to Use
Open register.html to create a new account.
Go to login.html and log in.
Add a task with a task name, due date, and priority.
Use the buttons to complete, edit, or delete tasks.
Use the search box to find tasks.
Click Settings to update the display name.
Click Log out to leave the dashboard.
Data Storage
This project uses browser Local Storage to save user accounts, display names, and task data.

Note: This project is made for coursework demonstration. Passwords stored in Local Storage are not suitable for a real production website.

Future Improvements
Separate tasks for different user accounts.
Add task category and subject.
Add dark mode.
Add calendar view.
Add real database support.
Add email notifications for deadlines.
GitHub Pages
The project can be deployed using GitHub Pages.
After deployment, users can open the website through the GitHub Pages link.

Conclusion
TaskFlow provides a simple and useful way for students to organise study tasks.
The project demonstrates HTML, CSS, JavaScript, Local Storage, teamwork, testing, and GitHub version control.
