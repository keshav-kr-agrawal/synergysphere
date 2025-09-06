const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get user's projects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate('tasks')
    .populate('milestones')
    .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignee',
          select: 'name email avatar'
        }
      })
      .populate('milestones');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to project
    const hasAccess = project.owner._id.toString() === req.user.id ||
      project.members.some(member => member.user._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('description').optional().trim(),
  body('primaryLanguage').optional().trim(),
  body('color').optional().isHexColor().withMessage('Invalid color format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, primaryLanguage, color } = req.body;

    const project = new Project({
      name,
      description,
      primaryLanguage: primaryLanguage || 'JavaScript',
      color: color || '#3B82F6',
      owner: req.user.id,
      members: [{
        user: req.user.id,
        role: 'owner'
      }]
    });

    await project.save();

    // Add project to user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id }
    });

    // Create activity
    const activity = new Activity({
      user: req.user.id,
      project: project._id,
      type: 'project_created',
      description: `${req.user.name} created project "${name}"`
    });
    await activity.save();

    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    res.status(201).json(project);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Project name cannot be empty'),
  body('description').optional().trim(),
  body('primaryLanguage').optional().trim(),
  body('color').optional().isHexColor().withMessage('Invalid color format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, primaryLanguage, color, notes } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (primaryLanguage) updateData.primaryLanguage = primaryLanguage;
    if (color) updateData.color = color;
    if (notes !== undefined) updateData.notes = notes;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

    res.json(updatedProject);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/members
// @desc    Add member to project
// @access  Private
router.post('/:id/members', auth, [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { email, role = 'member' } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    const isAlreadyMember = project.members.some(member => 
      member.user.toString() === user._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Add member
    project.members.push({
      user: user._id,
      role
    });

    await project.save();

    // Add project to user's projects
    await User.findByIdAndUpdate(user._id, {
      $push: { projects: project._id }
    });

    // Create activity
    const activity = new Activity({
      user: req.user.id,
      project: project._id,
      type: 'project_joined',
      description: `${user.name} joined the project`
    });
    await activity.save();

    await project.populate('members.user', 'name email avatar');

    res.json(project);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can delete project' });
    }

    // Remove project from all members
    await User.updateMany(
      { projects: project._id },
      { $pull: { projects: project._id } }
    );

    // Delete related data
    await Task.deleteMany({ project: project._id });
    await Milestone.deleteMany({ project: project._id });
    await Activity.deleteMany({ project: project._id });

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
