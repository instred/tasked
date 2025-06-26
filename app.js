const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (text !== '') {
    addTask(text);
    input.value = '';
  }
});

function addTask(text) {
  const li = document.createElement('li');
  li.textContent = text;

  const btn = document.createElement('button');
  btn.textContent = 'Usuń';
  btn.onclick = () => li.remove();

  li.appendChild(btn);
  list.appendChild(li);
}

// Rejestracja service workera
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
