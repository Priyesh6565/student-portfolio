const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validationMiddleware");

const router = express.Router();


// GET ALL TASKS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        });

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// CREATE TASK
router.post(
    "/",
    authMiddleware,
    validateTask,
    async (req, res) => {
        try {
            const { title, description } = req.body;

            const task = await Task.create({
                title,
                description,
                user: req.user.id
            });

            res.status(201).json({
                message: "Task created successfully",
                task
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);


// UPDATE TASK
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;