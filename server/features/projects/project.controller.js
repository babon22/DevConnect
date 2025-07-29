import Project from './project.model.js';
import User from '../users/user.model.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate('author', 'name avatarUrl').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'name avatarUrl')
      .populate('comments.author', 'name avatarUrl');
    if (project) {
      res.json(project);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  const { title, description, projectUrl, repoUrl } = req.body;
  try {
    const project = new Project({
      title,
      description,
      projectUrl,
      repoUrl,
      author: req.user._id,
    });
    const createdProject = await project.save();
    
    // Also add project to user's list
    const user = await User.findById(req.user._id);
    user.projects.push(createdProject._id);
    await user.save();

    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  const { title, description, projectUrl, repoUrl } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    // Check if user is the author
    if (project.author.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }
    project.title = title || project.title;
    project.description = description || project.description;
    project.projectUrl = projectUrl || project.projectUrl;
    project.repoUrl = repoUrl || project.repoUrl;
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    if (project.author.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

export const createProjectComment = async (req, res, next) => {
  const { text } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    const comment = {
      text,
      author: req.user._id,
    };
    project.comments.push(comment);
    await project.save();
    // Populate the new comment before sending back
    const newComment = project.comments[project.comments.length - 1];
    await newComment.populate('author', 'name avatarUrl');
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const searchProjects = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Query parameter "q" is required' });

        const projects = await Project.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .populate('author', 'name avatarUrl');

        res.json(projects);
    } catch (error) {
        next(error);
    }
};