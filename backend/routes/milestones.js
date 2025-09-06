const express = require('express');
const { body, validationResult } = require('express-validator');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/milestones/project/:projectId
// @desc    Get milestones for a project
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    // Check if user has access to project
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const milestones = await Milestone.find({ project: req.params.projectId })
      .populate('createdBy', 'name email avatar')
      .populate('tasks', 'title status assignee')
      .sort({ dueDate: 1 });

    res.json(milestones);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/milestones
// @desc    Create new milestone
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Milestone title is required'),
  body('project').isMongoId().withMessage('Valid project ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project, dueDate } = req.body;

    // Check if user has access to project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = projectDoc.owner.toString() === req.user.id ||
      projectDoc.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const milestone = new Milestone({
      title,
      description,
      project,
      dueDate: new Date(dueDate),
      createdBy: req.user.id
    });

    await milestone.save();

    // Add milestone to project
    await Project.findByIdAndUpdate(project, {
      $push: { milestones: milestone._id }
    });

    // Create activity
    const activity = new Activity({
      user: req.user.id,
      project,
      type: 'milestone_created',
      description: `${req.user.name} created milestone "${title}"`,
      metadata: { milestoneId: milestone._id }
    });
    await activity.save();

    await milestone.populate('createdBy', 'name email avatar');

    res.status(201).json(milestone);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/milestones/:id
// @desc    Update milestone
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Milestone title cannot be empty'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(milestone.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, dueDate } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate) updateData.dueDate = new Date(dueDate);

    const updatedMilestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email avatar')
    .populate('tasks', 'title status assignee');

    res.json(updatedMilestone);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/milestones/:id/tasks
// @desc    Add task to milestone
// @access  Private
router.post('/:id/tasks', auth, [
  body('taskId').isMongoId().withMessage('Valid task ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(milestone.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { taskId } = req.body;

    // Check if task exists and belongs to same project
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.project.toString() !== milestone.project.toString()) {
      return res.status(400).json({ message: 'Task does not belong to this project' });
    }

    // Add task to milestone
    if (!milestone.tasks.includes(taskId)) {
      milestone.tasks.push(taskId);
      await milestone.save();
    }

    // Update task milestone
    await Task.findByIdAndUpdate(taskId, { milestone: milestone._id });

    await milestone.populate('tasks', 'title status assignee');

    res.json(milestone);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/milestones/:id
// @desc    Delete milestone
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(milestone.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove milestone from project
    await Project.findByIdAndUpdate(milestone.project, {
      $pull: { milestones: milestone._id }
    });

    // Remove milestone from tasks
    await Task.updateMany(
      { milestone: milestone._id },
      { $unset: { milestone: 1 } }
    );

    await Milestone.findByIdAndDelete(req.params.id);

    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
