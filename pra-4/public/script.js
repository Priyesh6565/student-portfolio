

// ======================================================
// Task Manager Frontend JavaScript
// ======================================================


// ======================================================
// Get HTML Elements
// ======================================================

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const completedInput = document.getElementById("completed");

const taskList = document.getElementById("taskList");

const refreshBtn = document.getElementById("refreshBtn");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");


// ======================================================
// 1. Get All Tasks
// GET /tasks
// ======================================================

async function loadTasks() {

    try {

        const response = await fetch("/tasks");

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        const tasks = await response.json();

        displayTasks(tasks);

        updateStatistics(tasks);

    } catch (error) {

        console.error("Error loading tasks:", error);

        taskList.innerHTML = `
            <div class="error-message">
                Failed to load tasks.
            </div>
        `;

    }
}


// ======================================================
// 2. Display Tasks
// ======================================================

function displayTasks(tasks) {

    // Clear previous tasks
    taskList.innerHTML = "";


    // If there are no tasks
    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-message">
                No tasks available. Add a new task!
            </div>
        `;

        return;
    }


    // Create HTML for every task
    tasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = "task-card";


        // Add completed class
        if (task.completed) {
            taskElement.classList.add("completed");
        }


        taskElement.innerHTML = `

            <div class="task-info">

                <h3>${escapeHTML(task.title)}</h3>

                <span class="task-id">
                    Task #${task.id}
                </span>

            </div>


            <div class="task-actions">

                <span class="task-status ${task.completed ? "completed-status" : "pending-status"}">
                    ${task.completed ? "Completed" : "Pending"}
                </span>


                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id}, ${task.completed})"
                >
                    ${task.completed ? "Undo" : "Complete"}
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(taskElement);

    });

}


// ======================================================
// 3. Add New Task
// POST /tasks
// ======================================================

taskForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const title = titleInput.value.trim();

    const completed = completedInput.value === "true";


    // Validate title
    if (title === "") {

        alert("Please enter a task title.");

        return;
    }


    try {

        const response = await fetch("/tasks", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title,
                completed: completed
            })

        });


        const data = await response.json();


        if (!response.ok) {

            alert(data.error || "Failed to add task.");

            return;
        }


        // Clear form
        taskForm.reset();


        // Reload tasks
        loadTasks();

    } catch (error) {

        console.error("Error adding task:", error);

        alert("Unable to connect to the server.");

    }

});


// ======================================================
// 4. Toggle Task Completion
// PUT /tasks/:id
// ======================================================

async function toggleTask(id, currentStatus) {

    try {

        const response = await fetch(`/tasks/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                completed: !currentStatus
            })

        });


        const data = await response.json();


        if (!response.ok) {

            alert(data.error || "Failed to update task.");

            return;
        }


        // Reload tasks
        loadTasks();

    } catch (error) {

        console.error("Error updating task:", error);

        alert("Unable to update task.");

    }

}


// ======================================================
// 5. Delete Task
// DELETE /tasks/:id
// ======================================================

async function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(`/tasks/${id}`, {

            method: "DELETE"

        });


        const data = await response.json();


        if (!response.ok) {

            alert(data.error || "Failed to delete task.");

            return;
        }


        // Reload tasks
        loadTasks();

    } catch (error) {

        console.error("Error deleting task:", error);

        alert("Unable to delete task.");

    }

}


// ======================================================
// 6. Update Statistics
// ======================================================

function updateStatistics(tasks) {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed === true
    ).length;

    const pending = total - completed;


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}


// ======================================================
// 7. Refresh Button
// ======================================================

refreshBtn.addEventListener("click", () => {

    loadTasks();

});


// ======================================================
// 8. Escape HTML
// Prevent HTML injection through task title
// ======================================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ======================================================
// 9. Load Tasks When Page Opens
// ======================================================

loadTasks();
