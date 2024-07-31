document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('task-title');
    const taskDetailsInput = document.getElementById('task-details');
    const taskDateInput = document.getElementById('task-date');
    const taskTimeInput = document.getElementById('task-time');
    const taskRepeatSelect = document.getElementById('task-repeat');
    const addTaskButton = document.getElementById('add-task');
    const tasksList = document.getElementById('tasks');

    function createTaskItem(title, details, date, time, repeat) {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${title}</strong>
            <p>${details}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Repeat:</strong> ${repeat}</p>
            <button class="delete-task" title="Delete this task">Delete</button>
        `;
        return li;
    }

    function addTask() {
        const title = taskTitleInput.value.trim();
        const details = taskDetailsInput.value.trim();
        const date = taskDateInput.value;
        const time = taskTimeInput.value;
        const repeat = taskRepeatSelect.value;

        if (title && date && time) {
            const taskItem = createTaskItem(title, details, date, time, repeat);
            tasksList.appendChild(taskItem);

            // Clear input fields
            taskTitleInput.value = '';
            taskDetailsInput.value = '';
            taskDateInput.value = '';
            taskTimeInput.value = '';
            taskRepeatSelect.value = 'none';
        } else {
            alert('Please fill in all required fields: Title, Date, and Time.');
        }
    }

    function deleteTask(event) {
        if (event.target.classList.contains('delete-task')) {
            event.target.parentElement.remove();
        }
    }

    addTaskButton.addEventListener('click', addTask);

    taskDetailsInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            addTask();
        }
    });

    tasksList.addEventListener('click', deleteTask);
});
