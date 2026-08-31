
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const message = document.getElementById("message");

async function loadTasks() {

    try {

        const response = await fetch("/tasks");

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load tasks");
        }

        displayTasks(data);

    } catch (error) {

        console.error("Load tasks error:", error);

        showMessage("Unable to load tasks", "error");
    }
}



function displayTasks(tasks) {

    taskList.innerHTML = "";

    taskCount.textContent =
        `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;


    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty">
                <h3>No tasks yet</h3>
                <p>Add your first task above.</p>
            </div>
        `;

        return;
    }


    tasks.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-card";


        const completedClass =
            task.completed ? "completed" : "";


        card.innerHTML = `

            <div class="task-top">

                <div class="task-title ${completedClass}">
                    ${escapeHTML(task.title)}
                </div>

            </div>


            <div class="task-description">
                ${escapeHTML(task.description || "No description")}
            </div>


            <div class="task-status">

                Status:
                ${task.completed ? "Completed" : "Pending"}

            </div>


            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask('${task._id}')"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask('${task._id}')"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(card);

    });
}



taskForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const title =
        document.getElementById("title").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const completed =
        document.getElementById("completed").checked;


    if (!title) {

        showMessage(
            "Task title is required",
            "error"
        );

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
                description: description,
                completed: completed
            })

        });


        const data = await response.json();


        if (!response.ok) {

            if (data.errors) {

                const errors =
                    Object.values(data.errors).join(", ");

                showMessage(errors, "error");

            } else {

                showMessage(
                    data.message || "Failed to create task",
                    "error"
                );

            }

            return;
        }


        showMessage(
            "Task created successfully!",
            "success"
        );


        taskForm.reset();

        await loadTasks();


    } catch (error) {

        console.error("Create task error:", error);

        showMessage(
            "Unable to connect to server",
            "error"
        );

    }

});


// ======================================================
// Edit Task
// ======================================================

async function editTask(id) {

    const newTitle =
        prompt("Enter new task title");


    if (newTitle === null) {
        return;
    }


    if (newTitle.trim() === "") {

        alert("Title cannot be empty.");

        return;
    }


    const newDescription =
        prompt("Enter new description");


    try {

        const response =
            await fetch(`/tasks/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    title: newTitle.trim(),

                    description:
                        newDescription || ""

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message || "Update failed",
                "error"
            );

            return;
        }


        showMessage(
            "Task updated successfully!",
            "success"
        );


        await loadTasks();


    } catch (error) {

        console.error("Update task error:", error);

        showMessage(
            "Unable to connect to server",
            "error"
        );

    }
}


// ======================================================
// Delete Task
// ======================================================

async function deleteTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`/tasks/${id}`, {

                method: "DELETE"

            });


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message || "Delete failed",
                "error"
            );

            return;
        }


        showMessage(
            "Task deleted successfully!",
            "success"
        );


        await loadTasks();


    } catch (error) {

        console.error("Delete task error:", error);

        showMessage(
            "Unable to connect to server",
            "error"
        );

    }
}


// ======================================================
// Show Message
// ======================================================

function showMessage(text, type) {

    message.innerHTML = `
        <div class="${type}">
            ${escapeHTML(text)}
        </div>
    `;


    setTimeout(() => {

        message.innerHTML = "";

    }, 3000);

}


// ======================================================
// Escape HTML
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// ======================================================
// Load Tasks When Page Opens
// ======================================================

loadTasks();
