// Funkcija, kas saglabā uzdevumus localStorage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Funkcija, kas nolasa uzdevumus no localStorage
function loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('todoTasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Funkcija, kas renderē uzdevumu sarakstu no localStorage
function renderTasks(tasks) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Notīra iepriekšējo saturu
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.innerHTML = `
            <span class="todo-text">${task}</span>
            <button class="delete-btn">Dzēst</button>
        `;
        todoList.appendChild(li);

        // Pievieno dzēšanas funkcionalitāti
        li.querySelector('.delete-btn').addEventListener('click', function() {
            tasks.splice(tasks.indexOf(task), 1);
            saveTasksToLocalStorage(tasks); // Saglabā atjaunoto sarakstu
            renderTasks(tasks); // Atjauno saraksta attēlojumu
        });
    });
}

// Kad lapa tiek ielādēta, ielādē uzdevumus no localStorage un attēlo tos
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
        saveTasksToLocalStorage(tasks); // Saglabā uzdevumus localStorage
        renderTasks(tasks); // Atjauno saraksta attēlojumu

        // Notīra ievadlauku
        todoInput.value = '';
    });
});