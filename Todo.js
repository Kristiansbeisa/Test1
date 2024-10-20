function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('todoTasks');
    return tasks ? JSON.parse(tasks) : [];
}

function renderTasks(tasks) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.innerHTML = `
            <span class="todo-text">${task}</span>
            <button class="delete-btn">Dzēst</button>
        `;
        todoList.appendChild(li);

        li.querySelector('.delete-btn').addEventListener('click', function() {
            tasks.splice(tasks.indexOf(task), 1);
            saveTasksToLocalStorage(tasks);
            renderTasks(tasks);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const tasks = loadTasksFromLocalStorage();
    renderTasks(tasks);

    document.getElementById('add-btn').addEventListener('click', function() {
        const todoInput = document.getElementById('todo-input');
        const todoText = todoInput.value;

        if (todoText === '') {
            alert('Lūdzu, ievadi uzdevumu!');
            return;
        }

        tasks.push(todoText);
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks);

        todoInput.value = '';
    });
});
