const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate progress percentage
milestoneSchema.virtual('progress').get(function() {
  if (this.tasks.length === 0) return 0;
  const completedTasks = this.tasks.filter(task => task.status === 'done').length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Check if milestone is overdue
milestoneSchema.virtual('isOverdue').get(function() {
  return this.dueDate < new Date() && !this.completedAt;
});

// Check if milestone is completed
milestoneSchema.virtual('isCompleted').get(function() {
  return this.completedAt !== null || this.progress === 100;
});

module.exports = mongoose.model('Milestone', milestoneSchema);
