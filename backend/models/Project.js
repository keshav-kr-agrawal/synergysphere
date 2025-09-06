const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  primaryLanguage: {
    type: String,
    default: 'JavaScript'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  milestones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone'
  }],
  notes: {
    type: String,
    default: ''
  },
  settings: {
    allowMemberInvites: {
      type: Boolean,
      default: true
    },
    defaultTaskPriority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }
}, {
  timestamps: true
});

// Calculate progress percentage
projectSchema.virtual('progress').get(function() {
  if (this.tasks.length === 0) return 0;
  const completedTasks = this.tasks.filter(task => task.status === 'done').length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

module.exports = mongoose.model('Project', projectSchema);
