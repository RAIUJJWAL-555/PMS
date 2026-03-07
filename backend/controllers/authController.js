const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with the role 'member'
// @route   GET /api/auth/members
// @access  Private/Admin
const getMembers = async (req, res) => {
  try {
    // Admin sees all members
    if (req.user.role === 'admin') {
      const users = await User.find({ role: 'member' }).select('name email points').sort({ points: -1 });
      return res.json(users);
    }

    // Member only sees members from their projects
    // 1. Find projects where they are leader OR have tasks
    const userTasks = await Task.find({ assigned_to: req.user._id });
    const projectIdsFromTasks = userTasks.map(t => t.project_id);
    
    const projects = await Project.find({
      $or: [
        { project_leader: req.user._id },
        { _id: { $in: projectIdsFromTasks } }
      ]
    });
    
    const relevantProjectIds = projects.map(p => p._id);

    // 2. Find all members working on these projects
    // Members from tasks
    const tasksInRelevantProjects = await Task.find({ project_id: { $in: relevantProjectIds } });
    const memberIdsFromTasks = tasksInRelevantProjects.map(t => t.assigned_to);
    
    // Leaders from projects
    const leaderIdsFromProjects = projects.map(p => p.project_leader).filter(id => id);

    const allRelevantUserIds = [...new Set([...memberIdsFromTasks, ...leaderIdsFromProjects])];

    const users = await User.find({
      _id: { $in: allRelevantUserIds },
      role: 'member'
    }).select('name email points').sort({ points: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMemberStats = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('name email points');
    
    // Find projects where this user is leader
    const ledProjects = await Project.find({ project_leader: userId }).select('project_name description createdAt');
    
    // Find projects where this user has tasks
    const userTasks = await Task.find({ assigned_to: userId });
    const projectIdsFromTasks = [...new Set(userTasks.map(t => t.project_id.toString()))];
    
    const taskProjects = await Project.find({ 
      _id: { $in: projectIdsFromTasks },
      project_leader: { $ne: userId } // Avoid duplicates if they are also the leader
    }).select('project_name description createdAt');

    res.json({
      name: user.name,
      email: user.email,
      points: user.points,
      ledProjects,
      taskProjects,
      totalProjects: ledProjects.length + taskProjects.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMembers,
  getMemberStats,
};
