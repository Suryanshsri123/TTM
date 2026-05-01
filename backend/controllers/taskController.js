const Task = require("../models/task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo } = req.body;

    const taskData = {
      title,
      description,
      createdBy: req.user.id,
    };

    if (project) taskData.project = project;
    if (assignedTo) taskData.assignedTo = assignedTo;

    const task = await Task.create(taskData);

    res.status(201).json(task);
  } catch (error) {
    console.log("CREATE TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, project, assignedTo, search, page = 1, limit = 5 } = req.query;

    let query = {
      $or: [
        { assignedTo: req.user.id },
        { createdBy: req.user.id }
      ]
    };

    if (status) query.status = status;
    if (project) query.project = project;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(query)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "name email");

    // ❗ Step 1: Check if task exists
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ❗ Step 2: ADD AUTHORIZATION CHECK HERE
    if (
      task.createdBy.toString() !== req.user.id &&
      (!task.assignedTo || task.assignedTo._id.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ❗ Step 3: Send response
    res.json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { assignedTo: req.user.id },
          { createdBy: req.user.id }
        ]
      },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};