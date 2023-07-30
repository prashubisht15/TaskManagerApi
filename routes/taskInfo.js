const taskRoutes = require("express").Router();
const taskData = require("../tasks.json");
const bodyParser = require("body-parser");
const path = require("path");
const validator = require("../helpers/validator");
const fs = require("fs");

taskRoutes.use(bodyParser.json());

taskRoutes.get("/", (req, res) => {
    return res.status(200).json(taskData);
});

// get all the tasks with the id
taskRoutes.get("/:id", (req, res) => {
    const taskId = req.params.id;
    const filteredTask = taskData.allTasks.filter((task) => task.id === taskId);

    if (
        filteredTask.length === 0 ||
        filteredTask === undefined ||
        filteredTask === null
    ) {
        return res
            .status(404)
            .json({ message: "Task not found, please try with a different id" });
    }
    return res.status(200).json(filteredTask);
});

// create a new task
taskRoutes.post("/", (req, res) => {
    const taskDetails = req.body;
    if (!validator(taskDetails)) {
      res.status(400).json({ error: "Invalid task request" });
    }
    taskData.allTasks.push({
      ...taskDetails,
      createdAt: Date.now(),
      lastModified: Date.now(),
    });
    const wirtePath = path.join(__dirname, "..", "tasks.json");
    try {
      fs.writeFileSync(wirtePath, JSON.stringify(taskData), {
        encoding: "utf8",
        flags: "w",
      });
      return res.status(200).json({ message: "task data modified successfully" });
    } catch (err) {
      return res.status(500).json({ message: "failed creating new task" });
    }
  });
  
  // update the task details with id
  taskRoutes.put("/tasks/:id", (req, res) => {
    const { id, title, description, completed, priority, createdAt } = req.body;
    if (!validateTask(req.body)) {
      res.status(400).json({ error: "Invalid task request" });
    }
    const taskIndex = taskData.allTasks.findIndex((t) => t.id === id);
    console.log("idx",taskIndex)
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }
    taskData.allTasks[taskIndex] = {
      ...taskData.allTasks[taskIndex],
      title,
      description,
      completed,
      priority,
      createdAt,
      lastModified: Date.now(),
    };
    const wirtePath = path.join(__dirname, "..", "tasks.json");
    try {
      fs.writeFileSync(wirtePath, JSON.stringify(taskData), {
        encoding: "utf8",
        flags: "w",
      });
      return res.status(200).json({
        message: "task data modified successfully",
        data: taskData.allTasks[taskIndex],
      });
    } catch (err) {
      return res.status(500).json({ message: "failed creating new task" });
    }
  });
  

// delete task with the help of id
taskRoutes.delete("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
  
    // Find the task in the in-memory data store
    const taskIndex = taskData.allTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }
  
    // Remove the task from the in-memory data store
    const deletedTask = taskData.allTasks.splice(taskIndex, 1)[0];
  
    // Save the updated task data to the JSON file (Optional, for persisting data)
    const wirtePath = path.join(__dirname, "..", "tasks.json");
    try {
      fs.writeFileSync(wirtePath, JSON.stringify(taskData), {
        encoding: "utf8",
        flags: "w",
      });
    } catch (err) {
      // Handle the error if writing to file fails (you can choose to log the error or do something else)
      console.error("Failed to write to file:", err);
    }
  
    // Return the deleted task in the response
    res.status(200).json(deletedTask);
  });  

module.exports = taskRoutes;
