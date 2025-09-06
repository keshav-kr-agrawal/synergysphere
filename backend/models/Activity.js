const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    enum: [
      'task_created',
      'task_updated',
      'task_completed',
      'task_assigned',
      'milestone_created',
      'milestone_completed',
      'project_joined',
      'project_left',
      'comment_added',
      'note_updated'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone'
    },
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
activitySchema.index({ project: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
