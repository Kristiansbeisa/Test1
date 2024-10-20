document.getElementById('add-btn').addEventListener('click', function() {
    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value;

    if (todoText === '') {
        alert('Lūdzu, ievadi uzdevumu!');
        return;
    }

    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.innerHTML = `
        <span class="todo-text">${todoText}</span>
        <button class="delete-btn">Dzēst</button>
    `;

    document.getElementById('todo-list').appendChild(li);

    // Notīra ievadlauku
    todoInput.value = '';

    // Pievieno dzēšanas funkcionalitāti
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
    });
});