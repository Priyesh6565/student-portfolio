const express = require("express");

const app = express();
const PORT = 5000;


// ======================================================
// 1. Built-in Middleware
// ======================================================

// Parse incoming JSON data
app.use(express.json());

// Serve frontend files from "public" folder
app.use(express.static("public"));


// ======================================================
// 2. In-Memory Task Data
// ======================================================

let tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Learn Express.js",
        completed: true
    }
];


// ======================================================
// 3. Logging Middleware
// ======================================================

app.use((req, res, next) => {

    console.log(
        `${req.method} ${req.url} - ${new Date().toISOString()}`
    );

    next();
});


// ======================================================
// 4. Content-Type Validation Middleware
// ======================================================

// POST and PUT requests must contain:
// Content-Type: application/json

function validateJSONContentType(req, res, next) {

    if (req.method === "POST" || req.method === "PUT") {

        if (!req.is("application/json")) {

            return res.status(400).json({
                error: "Content-Type must be application/json"
            });

        }
    }

    next();
}

app.use(validateJSONContentType);


// ======================================================
// 5. Task ID Validation Middleware
// ======================================================

// Used for routes containing :id

function validateTaskId(req, res, next) {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {

        return res.status(400).json({
            error: "Task ID must be a positive integer"
        });

    }

    next();
}


// ======================================================
// 6. GET /tasks
// Get all tasks
// ======================================================

app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});


// ======================================================
// 7. GET /tasks/:id
// Get a single task
// ======================================================

app.get("/tasks/:id", validateTaskId, (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    // Task does not exist
    if (!task) {

        return res.status(404).json({
            error: "Task not found"
        });

    }

    res.status(200).json(task);

});


// ======================================================
// 8. POST /tasks
// Create a new task
// ======================================================

app.post("/tasks", (req, res) => {

    const { title, completed = false } = req.body;


    // ----------------------------------------------
    // Validate title
    // ----------------------------------------------

    if (
        title === undefined ||
        typeof title !== "string" ||
        title.trim() === ""
    ) {

        return res.status(400).json({
            error: "Title is required and must be a non-empty string"
        });

    }


    // ----------------------------------------------
    // Validate completed
    // ----------------------------------------------

    if (typeof completed !== "boolean") {

        return res.status(400).json({
            error: "Completed must be a boolean"
        });

    }


    // ----------------------------------------------
    // Generate new ID
    // ----------------------------------------------

    const newId =
        tasks.length > 0
            ? Math.max(...tasks.map(task => task.id)) + 1
            : 1;


    // ----------------------------------------------
    // Create new task
    // ----------------------------------------------

    const newTask = {

        id: newId,

        title: title.trim(),

        completed: completed

    };


    // ----------------------------------------------
    // Add task
    // ----------------------------------------------

    tasks.push(newTask);


    // ----------------------------------------------
    // Send response
    // ----------------------------------------------

    res.status(201).json(newTask);

});


// ======================================================
// 9. PUT /tasks/:id
// Update an existing task
// ======================================================

app.put("/tasks/:id", validateTaskId, (req, res) => {

    const id = Number(req.params.id);


    // ----------------------------------------------
    // Find task
    // ----------------------------------------------

    const task = tasks.find(task => task.id === id);


    // ----------------------------------------------
    // Check if task exists
    // ----------------------------------------------

    if (!task) {

        return res.status(404).json({
            error: "Task not found"
        });

    }


    // ----------------------------------------------
    // Get data from request
    // ----------------------------------------------

    const { title, completed } = req.body;


    // ----------------------------------------------
    // Validate title
    // ----------------------------------------------

    if (title !== undefined) {

        if (
            typeof title !== "string" ||
            title.trim() === ""
        ) {

            return res.status(400).json({
                error: "Title must be a non-empty string"
            });

        }

        task.title = title.trim();

    }


    // ----------------------------------------------
    // Validate completed
    // ----------------------------------------------

    if (completed !== undefined) {

        if (typeof completed !== "boolean") {

            return res.status(400).json({
                error: "Completed must be a boolean"
            });

        }

        task.completed = completed;

    }


    // ----------------------------------------------
    // Send updated task
    // ----------------------------------------------

    res.status(200).json(task);

});


// ======================================================
// 10. DELETE /tasks/:id
// Delete a task
// ======================================================

app.delete("/tasks/:id", validateTaskId, (req, res) => {

    const id = Number(req.params.id);


    // ----------------------------------------------
    // Find task index
    // ----------------------------------------------

    const taskIndex = tasks.findIndex(
        task => task.id === id
    );


    // ----------------------------------------------
    // Check if task exists
    // ----------------------------------------------

    if (taskIndex === -1) {

        return res.status(404).json({
            error: "Task not found"
        });

    }


    // ----------------------------------------------
    // Delete task
    // ----------------------------------------------

    const deletedTask = tasks.splice(taskIndex, 1);


    // ----------------------------------------------
    // Send response
    // ----------------------------------------------

    res.status(200).json({

        message: "Task deleted successfully",

        task: deletedTask[0]

    });

});


// ======================================================
// 11. Custom 404 Handler
// Handles undefined routes
// ======================================================

app.use((req, res) => {

    res.status(404).json({

        error: "Route not found",

        path: req.originalUrl

    });

});


// ======================================================
// 12. Global Error Handler
// ======================================================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({

        error: "Something went wrong"

    });

});


// ======================================================
// 13. Start Server
// ======================================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});

