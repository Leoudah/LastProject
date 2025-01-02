document.querySelectorAll('.next-day-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const plantId = button.getAttribute('data-id');
    const currentTime = parseInt(document.getElementById(`time-${plantId}`).textContent);
    const maxDays = parseInt(button.getAttribute('data-plant-duration'));
    const todoSection = document.getElementById(`todo-${plantId}`);

    if (todoSection) {
      const checkboxes = todoSection.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }

    if (currentTime >= maxDays) {
      alert('Mission Success');
      return;
    }

    try {
      const [timeResponse, tasksResponse] = await Promise.all([
        fetch('/increment-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: plantId })
        }),
        fetch(`/get-tasks/${plantId}`, { method: 'GET' })
      ]);

      const [timeData, tasksData] = await Promise.all([
        timeResponse.json(),
        tasksResponse.json()
      ]);

      if (timeData.success && tasksData.success) {
        const timeElement = document.getElementById(`time-${plantId}`);
        const plantTaskElement = document.getElementById(`todo-${plantId}`);
        
        // Update the current time
        timeElement.textContent = `${timeData.newTime}/${maxDays}`;
        
        // Clear and update the task list
        plantTaskElement.innerHTML = `
          <div class="todo-item">
            <input type="checkbox">
            Main Task: Water The plant
          </div>
        `;
        if (tasksData.tasks.length > 0) {
          tasksData.tasks.forEach(task => {
            let taskHTML = '';
            if(task.day-1 !== currentTime){
              taskHTML = `
              <div class="todo-item">
              </div>
            `;
            }else{
              taskHTML = `
              <div class="todo-item">
                <input type="checkbox">
                Day ${task.day}: ${task.task}
              </div>
            `;
            }
            plantTaskElement.insertAdjacentHTML('beforeend', taskHTML);
          });
        }
      } else {
        alert('Failed to update data');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Load checkbox states from localStorage
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    const taskId = checkbox.getAttribute('data-id');
    const isChecked = localStorage.getItem(taskId) === 'true'; // Retrieve state
    checkbox.checked = isChecked;

    // Save state to localStorage on change
    checkbox.addEventListener('change', () => {
      localStorage.setItem(taskId, checkbox.checked);
    });
  });
});


document.querySelectorAll('.delete-plant-btn').forEach(button => {
  button.addEventListener('click', () => {
    const plantId = button.getAttribute('data-id');
    
    if (confirm('Are you sure you want to delete this plant?')) {
      fetch('/delete-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: plantId }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const row = button.closest('tr');
          row.remove();
          
          const tbody = document.querySelector('tbody');
          if (!tbody.querySelectorAll('tr').length) {
            tbody.innerHTML = `
              <tr>
                <td colspan="3" class="text-center">No plants found</td>
              </tr>
            `;
          }
        } else {
          alert('Failed to Delete The Plant');
        }
      })
      .catch(console.error);
    }
  });
});


// toggle Sidebar
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const mainMenu = document.getElementById("mainMenu");
const icon = toggleSidebar?.querySelector("i");

if (toggleSidebar && sidebar && mainMenu && icon) {
  toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
      icon.classList.replace("bi-list", "bi-arrow-right");
    } else {
      icon.classList.replace("bi-arrow-right", "bi-list");
    }

    mainMenu.style.marginLeft = sidebar.classList.contains("collapsed")
      ? "60px"
      : "200px";
    mainMenu.style.transition = "margin-left 0.3s ease";
  });
} else {
  console.warn("Sidebar toggle elements are missing or not loaded.");
}

// Toggle addPlantBtn

const addPlantBtn = document.getElementById("addPlantBtn");
const addPlantPopup = document.getElementById('addPlantPopup');
const closeBtn = document.querySelector('.close-btn');

document.addEventListener('DOMContentLoaded', () => {
    // Show popup
    addPlantBtn.addEventListener('click', () => {
        addPlantPopup.style.display = 'flex';
    });
  
    // Close popup when clicking close button
    closeBtn.addEventListener('click', () => {
      addPlantPopup.style.display = 'none';
    });
  
    // Close popup when clicking outside the popup
    addPlantPopup.addEventListener('click', (event) => {
      if (event.target === addPlantPopup) {
        addPlantPopup.style.display = 'none';
      }
    });
  });
