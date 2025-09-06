const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  type: {
    type: String,
    enum: [
      'task_assigned',
      'task_due_soon',
      'task_overdue',
      'milestone_due_soon',
      'milestone_overdue',
      'mentioned',
      'project_invite',
      'task_updated',
      'milestone_completed'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
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
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
