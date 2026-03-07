const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Admin Only
const createTask = async (req, res) => {
  try {
    const { title, description, project_id, assigned_to, deadline, exp_points } = req.body;

    // Check if project exists
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      project_id,
      assigned_to,
      deadline,
      exp_points: exp_points || 50,
      status: 'Pending', // Default status
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks of a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Access control: Admin, Leader, or Member with tasks in this project
    if (req.user.role !== 'admin') {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const isLeader = project.project_leader?.toString() === req.user._id.toString();
      const hasTask = await Task.findOne({ project_id: projectId, assigned_to: req.user._id });

      if (!isLeader && !hasTask) {
        return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
      }
    }

    const tasks = await Task.find({ project_id: projectId }).populate('assigned_to', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's assigned tasks
// @route   GET /api/tasks/my-tasks
// @access  Private (Member)
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assigned_to: req.user._id }).populate('project_id', 'project_name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign or reassign a task
// @route   PUT /api/tasks/:id/assign
// @access  Admin Only
const assignTask = async (req, res) => {
  try {
    const { assigned_to } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.assigned_to = assigned_to;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure user is the assigned member or an admin
    if (task.assigned_to.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this task status' });
    }

    const oldStatus = task.status;
    task.status = status;
    const updatedTask = await task.save();

    // Award points if status changed to 'Completed'
    if (status === 'Completed' && oldStatus !== 'Completed') {
      await User.findByIdAndUpdate(task.assigned_to, { $inc: { points: task.exp_points || 50 } });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Admin/Private
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('project_id', 'project_name')
      .populate('assigned_to', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getMyTasks,
  getAllTasks,
  assignTask,
  updateTaskStatus,
};
