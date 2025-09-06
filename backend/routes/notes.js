const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notes/project/:projectId
// @desc    Get project notes
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to project
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ notes: project.notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notes/project/:projectId
// @desc    Update project notes
// @access  Private
router.put('/project/:projectId', auth, [
  body('notes').isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to project
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(member => member.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { notes } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { notes },
      { new: true, runValidators: true }
    );

    // Create activity
    const activity = new Activity({
      user: req.user.id,
      project: req.params.projectId,
      type: 'note_updated',
      description: `${req.user.name} updated project notes`
    });
    await activity.save();

    res.json({ notes: updatedProject.notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
