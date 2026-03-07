const Project = require('../models/Project');
const Task = require('../models/Task');

const createProject = async (req, res) => {
  try {
    const { project_name, description, project_leader } = req.body;

    const projectExists = await Project.findOne({ project_name });

    if (projectExists) {
      return res.status(400).json({ message: 'Project already exists' });
    }

    const project = await Project.create({
      project_name,
      description,
      project_leader,
      created_by: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProjects = async (req, res) => {
  try {
    let query = {};
    
    // If user is not admin, show projects they lead OR projects where they have assigned tasks
    if (req.user.role !== 'admin') {
      // Find all tasks assigned to the current user
      const userTasks = await Task.find({ assigned_to: req.user._id });
      const projectIdsFromTasks = userTasks.map(task => task.project_id);
      
      query = {
        $or: [
          { project_leader: req.user._id },
          { _id: { $in: projectIdsFromTasks } }
        ]
      };
    }

    const projects = await Project.find(query)
      .populate('created_by', 'name email')
      .populate('project_leader', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('created_by', 'name email')
      .populate('project_leader', 'name email');

    if (project) {
      // Access control: Admin, Project Leader, or Member with tasks in this project
      if (req.user.role !== 'admin' && project.project_leader?._id.toString() !== req.user._id.toString()) {
        const hasTask = await Task.findOne({ project_id: req.params.id, assigned_to: req.user._id });
        if (!hasTask) {
          return res.status(403).json({ message: 'Not authorized to view this project' });
        }
      }
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.project_name = req.body.project_name || project.project_name;
      project.description = req.body.description || project.description;
      project.project_leader = req.body.project_leader || project.project_leader;

      const updatedProject = await project.save();
      const populatedProject = await Project.findById(updatedProject._id)
        .populate('created_by', 'name email')
        .populate('project_leader', 'name email');
        
      res.json(populatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  updateProject,
};
