const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks/project/:projectId
// @desc    Get tasks for a project
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const { status, assignee, priority, milestone } = req.query;
    
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

    // Build query
    const query = { project: req.params.projectId };
    if (status) query.status = status;
    if (assignee) query.assignee = assignee;
    if (priority) query.priority = priority;
    if (milestone) query.milestone = milestone;

    const tasks = await Task.find(query)
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('milestone', 'title dueDate')
      .populate('dependencies', 'title status')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('project', 'name')
      .populate('milestone', 'title dueDate')
      .populate('dependencies', 'title status')
      .populate('comments.user', 'name email avatar');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(task.project._id);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Task title is required'),
  body('project').isMongoId().withMessage('Valid project ID is required'),
  body('description').optional().trim(),
  body('assignee').optional().isMongoId().withMessage('Valid assignee ID required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format'),
  body('milestone').optional().isMongoId().withMessage('Valid milestone ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project, assignee, priority, dueDate, milestone, tags, dependencies } = req.body;

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

    const task = new Task({
      title,
      description,
      project,
      assignee,
      creator: req.user.id,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      milestone,
      tags: tags || [],
      dependencies: dependencies || []
    });

    await task.save();

    // Add task to project
    await Project.findByIdAndUpdate(project, {
      $push: { tasks: task._id }
    });

    // Create activity
    const activity = new Activity({
      user: req.user.id,
      project,
      type: 'task_created',
      description: `${req.user.name} created task "${title}"`,
      metadata: { taskId: task._id }
    });
    await activity.save();

    // Create notification for assignee
    if (assignee && assignee !== req.user.id) {
      const notification = new Notification({
        user: assignee,
        project,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `${req.user.name} assigned you a new task: "${title}"`,
        metadata: { taskId: task._id, fromUser: req.user.id }
      });
      await notification.save();
    }

    await task.populate('assignee', 'name email avatar');
    await task.populate('creator', 'name email avatar');
    await task.populate('milestone', 'title dueDate');

    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Task title cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, assignee, status, priority, dueDate, milestone, tags, dependencies } = req.body;
    const oldStatus = task.status;
    const oldAssignee = task.assignee;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (assignee !== undefined) updateData.assignee = assignee;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (milestone !== undefined) updateData.milestone = milestone;
    if (tags) updateData.tags = tags;
    if (dependencies) updateData.dependencies = dependencies;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar')
    .populate('milestone', 'title dueDate');

    // Create activity for status change
    if (status && status !== oldStatus) {
      const activity = new Activity({
        user: req.user.id,
        project: task.project,
        type: status === 'done' ? 'task_completed' : 'task_updated',
        description: `${req.user.name} ${status === 'done' ? 'completed' : 'updated'} task "${updatedTask.title}"`,
        metadata: { 
          taskId: task._id,
          oldValue: oldStatus,
          newValue: status
        }
      });
      await activity.save();
    }

    // Create notification for new assignee
    if (assignee && assignee !== oldAssignee && assignee !== req.user.id) {
      const notification = new Notification({
        user: assignee,
        project: task.project,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `${req.user.name} assigned you task: "${updatedTask.title}"`,
        metadata: { taskId: task._id, fromUser: req.user.id }
      });
      await notification.save();
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add comment to task
// @access  Private
router.post('/:id/comments', auth, [
  body('content').trim().isLength({ min: 1 }).withMessage('Comment content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { content } = req.body;

    task.comments.push({
      user: req.user.id,
      content
    });

    await task.save();

    // Create activity
    const activity = new Activity({
      user: req.user.id,
      project: task.project,
      type: 'comment_added',
      description: `${req.user.name} commented on task "${task.title}"`,
      metadata: { taskId: task._id }
    });
    await activity.save();

    await task.populate('comments.user', 'name email avatar');

    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove task from project
    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: task._id }
    });

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
