// Funkcja do wyświetlenia powiadomienia
function showNotification(taskText) {
  if (Notification.permission === 'granted') {
    new Notification('Przypomnienie o zadaniu', {
      body: `Czas na zadanie: "${taskText}"`,
      icon: 'icons/reminder.png',
    });
  }
}

const categorySelect = document.getElementById('category-select');
const customCategoryInput = document.getElementById('custom-category-input');

categorySelect.addEventListener('change', () => {
  if (categorySelect.value === 'inna') {
    customCategoryInput.style.display = 'block';
    customCategoryInput.required = true;
  } else {
    customCategoryInput.style.display = 'none';
    customCategoryInput.required = false;
    customCategoryInput.value = '';
  }
});

// Obsługa formularza
document.getElementById('task-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const input = document.getElementById('task-input');
  const prioritySelect = document.getElementById('priority-select');
  const dueDatetimeInput = document.getElementById('due-datetime');

  let category = categorySelect.value;
  if (category === 'inna') {
    category = customCategoryInput.value.trim();
    if (!category) return;
  }

  const taskText = input.value.trim();
  const priority = prioritySelect.value;
  const dueDatetime = dueDatetimeInput.value;
  if (!taskText || !dueDatetime) return;

  const dueDate = new Date(dueDatetime);
  const now = new Date();

  const taskList = document.getElementById('task-list');
  const li = document.createElement('li');

  // Formatowanie daty do czytelnego formatu
  const dueDateString = dueDate.toLocaleString('pl-PL', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  li.innerHTML = `
    <span>
      ${taskText}
      <span class="category">[${category}]</span>
      <span class="priority ${priority}">${priority}</span>
      <br />
      <small>Przypomnienie: ${dueDateString}</small>
    </span>
    <button>Usuń</button>
  `;

  li.querySelector('button').addEventListener('click', () => {
    li.remove();
  });

  taskList.appendChild(li);

  // Ustaw powiadomienie na odpowiedni czas
  const timeout = dueDate.getTime() - now.getTime();

  if (timeout > 0) {
    setTimeout(() => {
      showNotification(taskText);
    }, timeout);
  }

  // Resetuj formularz
  input.value = '';
  categorySelect.value = 'praca';
  prioritySelect.value = 'sredni';
  dueDatetimeInput.value = '';
  customCategoryInput.value = '';
  customCategoryInput.style.display = 'none';
  customCategoryInput.required = false;
});

// Prośba o pozwolenie na powiadomienia
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Powiadomienia włączone');
    }
  });
}

// Rejestracja Service Workera (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(function (registration) {
      console.log('ServiceWorker zarejestrowany:', registration.scope);
    }, function (err) {
      console.log('Rejestracja ServiceWorkera nie powiodła się:', err);
    });
  });
}
