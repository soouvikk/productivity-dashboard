 // ----- VIDEO SOURCES (Original & Cyberpunk only) -----
  const videoSources = [
    './19660176-hd_1920_1080_24fps (1) (1).mp4',  // Original
    './5372266-uhd_3840_2160_30fps (1) (1).mp4'  // Cyberpunk city
  ];
  let currentVideoIndex = 0;

  // ----- DOM Elements -----
  const taskListEl = document.getElementById('taskList');
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');
  const completedCountSpan = document.getElementById('completedCount');
  const remainingCountSpan = document.getElementById('remainingCount');
  const taskSummary = document.getElementById('taskSummary');
  const totalTaskBadge = document.getElementById('totalTaskBadge');
  const lastUpdateSpan = document.getElementById('lastUpdate');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const resetTasksBtn = document.getElementById('resetTasks');
  const darkToggle = document.getElementById('darkToggle');
  const videoToggle = document.getElementById('videoToggle');
  const dateText = document.getElementById('dateText');
  const timeText = document.getElementById('timeText');
  const datestamp = document.getElementById('datestamp');
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const video = document.getElementById('bg-video');

  // ----- DATE / TIME -----
  function updateDateTime() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    dateText.innerText = `${y}.${m}.${d}  ·  ${now.toLocaleDateString('en-US', { weekday: 'long' })}`;
    timeText.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    datestamp.innerText = `${y}-${m}-${d}`;
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  // ----- QUOTE ROTATION -----
  function setRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const q = quotes[randomIndex];
    quoteText.innerText = `“${q.text}”`;
    quoteAuthor.innerText = `— ${q.author}`;
  }
  setRandomQuote();
  setInterval(setRandomQuote, 8000);

  // ----- RENDER TASKS -----
  function renderTasks() {
    taskListEl.innerHTML = '';
    let completed = 0;

    tasks.forEach((task, idx) => {
      if (task.completed) completed++;
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" class="task-check" data-index="${idx}" ${task.completed ? 'checked' : ''}>
        <span class="task-label">${task.text}</span>
        <button class="delete-task" data-index="${idx}">✕</button>
      `;
      taskListEl.appendChild(li);
    });

    // Attach events
    document.querySelectorAll('.task-check').forEach(cb => {
      cb.addEventListener('change', function() {
        const idx = this.dataset.index;
        if (idx !== undefined) toggleTask(parseInt(idx));
      });
    });
    
    document.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.dataset.index;
        if (idx !== undefined) deleteTask(parseInt(idx));
      });
    });

    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    
    progressBar.style.width = percent + '%';
    progressPercentage.innerText = percent + '%';
    completedCountSpan.innerText = done + ' completed';
    remainingCountSpan.innerText = (total - done) + ' remaining';
    taskSummary.innerText = `${done} / ${total} tasks`;
    totalTaskBadge.innerText = total;
    lastUpdateSpan.innerText = `update ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  function toggleTask(index) {
    if (index >= 0 && index < tasks.length) {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
    }
  }

  function deleteTask(index) {
    if (index >= 0 && index < tasks.length) {
      tasks.splice(index, 1);
      renderTasks();
    }
  }

  function addTask() {
    const val = taskInput.value.trim();
    if (val === '') {
      taskInput.placeholder = 'enter task';
      return;
    }
    tasks.push({ text: val, completed: false });
    taskInput.value = '';
    renderTasks();
    taskInput.focus();
  }

  // ----- Event Listeners -----
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') addTask(); 
  });

  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
  });

  resetTasksBtn.addEventListener('click', () => {
    tasks = [
      { text: 'design video background', completed: false },
      { text: 'implement swinging quote', completed: true },
      { text: 'build by enixxwizard', completed: false },
      { text: 'add deep progress', completed: false }
    ];
    renderTasks();
  });

  // ----- Dark Mode Toggle -----
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Update button text
    darkToggle.innerText = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    
    // Save preference
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });

  // Load saved dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.innerText = 'light';
  }

  // ----- Video Toggle (Original <-> Cyberpunk) -----
  videoToggle.addEventListener('click', () => {
    // Toggle between 0 and 1
    currentVideoIndex = currentVideoIndex === 0 ? 1 : 0;
    const newVideoSrc = videoSources[currentVideoIndex];
    
    // Change video source
    const source = video.querySelector('source');
    source.src = newVideoSrc;
    video.load();
    video.play();
    
    // Update button text
    videoToggle.innerText = currentVideoIndex === 0 ? 'cyberpunk' : 'original';
  });

  // ----- Video Fallback -----
  video.addEventListener('error', () => {
    video.style.display = 'none';
    document.querySelector('.video-overlay').style.background = '#0c0f20';
  });

  // ----- Initial Render -----
  renderTasks();
})();
