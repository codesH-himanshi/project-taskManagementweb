document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDetailsInput = document.getElementById('task-details');
    const taskDateInput = document.getElementById('task-date');
    const taskTimeInput = document.getElementById('task-time');
    const taskRepeatSelect = document.getElementById('task-repeat');
    const tasksList = document.getElementById('tasks');
    const clearFormButton = document.getElementById('clear-form');
    const clearTasksButton = document.getElementById('clear-tasks');
    const filterSelect = document.getElementById('filter-select');
    const taskCountElement = document.getElementById('task-count');
    
    // Initialize
    loadTasks();
    updateTaskCount();
    checkDueDates();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    taskDateInput.min = today;
    
    // Event Listeners
    taskForm.addEventListener('submit', handleAddTask);
    clearFormButton.addEventListener('click', clearForm);
    clearTasksButton.addEventListener('click', clearAllTasks);
    filterSelect.addEventListener('change', filterTasks);
    tasksList.addEventListener('click', handleTaskActions);
    
    // Functions
    function createTaskItem({ title, details, date, time, repeat, id = Date.now().toString() }) {
        const li = document.createElement('li');
        li.dataset.id = id;
        li.dataset.dueDate = date;
        
        li.innerHTML = `
            <div class="task-content">
                <strong>${sanitizeInput(title)}</strong>
                ${details ? `<p>${sanitizeInput(details)}</p>` : ''}
                <div class="task-meta">
                    <span>📅 ${formatDate(date)}</span>
                    <span>⏰ ${time}</span>
                    ${repeat !== 'none' ? `<span>🔁 ${repeat}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-task" title="Edit this task">Edit</button>
                <button class="delete-task danger" title="Delete this task">Delete</button>
            </div>
        `;
        
        return li;
    }
    
    function handleAddTask(e) {
        e.preventDefault();
        
        const title = taskTitleInput.value.trim();
        const details = taskDetailsInput.value.trim();
        const date = taskDateInput.value;
        const time = taskTimeInput.value;
        const repeat = taskRepeatSelect.value;
        
        if (title && date && time) {
            const taskItem = createTaskItem({ title, details, date, time, repeat });
            tasksList.appendChild(taskItem);
            saveTasks();
            clearForm();
            updateTaskCount();
            checkDueDates();
        } else {
            alert('Please fill in all required fields: Title, Date, and Time.');
        }
    }
    
    function handleTaskActions(e) {
        const li = e.target.closest('li');
        if (!li) return;
        
        if (e.target.classList.contains('delete-task')) {
            li.remove();
            saveTasks();
            updateTaskCount();
        } else if (e.target.classList.contains('edit-task')) {
            enableEditMode(li);
        }
    }
    
    function enableEditMode(li) {
        const contentDiv = li.querySelector('.task-content');
        const title = contentDiv.querySelector('strong').textContent;
        const details = contentDiv.querySelector('p')?.textContent || '';
        const [date, time, repeat] = Array.from(contentDiv.querySelectorAll('span')).map(span => {
            const text = span.textContent;
            if (text.includes('📅')) return text.replace('📅 ', '');
            if (text.includes('⏰')) return text.replace('⏰ ', '');
            if (text.includes('🔁')) return text.replace('🔁 ', '');
            return '';
        });
        
        contentDiv.innerHTML = `
            <input type="text" class="edit-title" value="${sanitizeInput(title)}" required>
            <textarea class="edit-details">${sanitizeInput(details)}</textarea>
            <div class="edit-meta">
                <input type="date" class="edit-date" value="${date}" required>
                <input type="time" class="edit-time" value="${time}" required>
                <select class="edit-repeat">
                    <option value="none" ${repeat === '' ? 'selected' : ''}>Does not repeat</option>
                    <option value="daily" ${repeat === 'daily' ? 'selected' : ''}>Daily</option>
                    <option value="weekly" ${repeat === 'weekly' ? 'selected' : ''}>Weekly</option>
                    <option value="monthly" ${repeat === 'monthly' ? 'selected' : ''}>Monthly</option>
                </select>
            </div>
            <div class="edit-actions">
                <button class="save-edit">Save</button>
                <button class="cancel-edit secondary">Cancel</button>
            </div>
        `;
        
        const saveBtn = contentDiv.querySelector('.save-edit');
        const cancelBtn = contentDiv.querySelector('.cancel-edit');
        
        saveBtn.addEventListener('click', () => {
            const newTitle = contentDiv.querySelector('.edit-title').value.trim();
            const newDetails = contentDiv.querySelector('.edit-details').value.trim();
            const newDate = contentDiv.querySelector('.edit-date').value;
            const newTime = contentDiv.querySelector('.edit-time').value;
            const newRepeat = contentDiv.querySelector('.edit-repeat').value;
            
            if (newTitle && newDate && newTime) {
                li.replaceWith(createTaskItem({
                    title: newTitle,
                    details: newDetails,
                    date: newDate,
                    time: newTime,
                    repeat: newRepeat,
                    id: li.dataset.id
                }));
                saveTasks();
                checkDueDates();
            } else {
                alert('Please fill in all required fields: Title, Date, and Time.');
            }
        });
        
        cancelBtn.addEventListener('click', () => {
            li.replaceWith(createTaskItem({
                title,
                details,
                date,
                time,
                repeat: repeat || 'none',
                id: li.dataset.id
            }));
        });
    }
    
    function clearForm() {
        taskForm.reset();
        taskTitleInput.focus();
    }
    
    function clearAllTasks() {
        if (tasksList.children.length > 0 && confirm('Are you sure you want to delete all tasks?')) {
            tasksList.innerHTML = '';
            saveTasks();
            updateTaskCount();
        }
    }
    
    function filterTasks() {
        const filterValue = filterSelect.value;
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const weekEnd = new Date(now.setDate(now.getDate() + 7 - now.getDay())).toISOString().split('T')[0];
        
        Array.from(tasksList.children).forEach(li => {
            const dueDate = li.dataset.dueDate;
            const isOverdue = new Date(dueDate) < new Date(today);
            
            let shouldShow = true;
            
            switch (filterValue) {
                case 'today':
                    shouldShow = dueDate === today;
                    break;
                case 'week':
                    shouldShow = dueDate >= today && dueDate <= weekEnd;
                    break;
                case 'overdue':
                    shouldShow = isOverdue;
                    break;
            }
            
            li.style.display = shouldShow ? 'flex' : 'none';
        });
    }
    
    function saveTasks() {
        const tasks = Array.from(tasksList.children).map(li => ({
            id: li.dataset.id,
            title: li.querySelector('strong').textContent,
            details: li.querySelector('p')?.textContent || '',
            date: li.dataset.dueDate,
            time: li.querySelector('span:nth-of-type(2)').textContent.replace('⏰ ', ''),
            repeat: (li.querySelector('span:nth-of-type(3)')?.textContent.replace('🔁 ', '') || 'none')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            tasksList.appendChild(createTaskItem(task));
        });
    }
    
    function updateTaskCount() {
        const count = tasksList.children.length;
        taskCountElement.textContent = `${count} ${count === 1 ? 'task' : 'tasks'}`;
    }
    
    function checkDueDates() {
        const today = new Date().toISOString().split('T')[0];
        Array.from(tasksList.children).forEach(li => {
            li.classList.toggle('overdue', new Date(li.dataset.dueDate) < new Date(today));
        });
    }
    
    function formatDate(dateString) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function sanitizeInput(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});