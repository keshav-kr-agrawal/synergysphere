import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, AlertCircle, Target } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MilestonesView = ({ project, onUpdate }) => {
  const [showCreateMilestone, setShowCreateMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/milestones', {
        ...newMilestone,
        project: project._id,
        dueDate: new Date(newMilestone.dueDate).toISOString(),
      });
      await onUpdate();
      setNewMilestone({
        title: '',
        description: '',
        dueDate: '',
      });
      setShowCreateMilestone(false);
      toast.success('Milestone created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create milestone');
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getProgressPercentage = (milestone) => {
    if (!milestone.tasks || milestone.tasks.length === 0) return 0;
    const completedTasks = milestone.tasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / milestone.tasks.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Milestones</h3>
        <button
          onClick={() => setShowCreateMilestone(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {project.milestones?.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No milestones</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new milestone.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {project.milestones?.map((milestone) => (
            <div key={milestone._id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <Target className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {milestone.title}
                    </h4>
                    {milestone.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {milestone.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isOverdue(milestone.dueDate) && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Overdue</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Due {new Date(milestone.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{getProgressPercentage(milestone)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isOverdue(milestone.dueDate) ? 'bg-red-500' : 'bg-primary-600'
                    }`}
                    style={{ width: `${getProgressPercentage(milestone)}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestone Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      {milestone.tasks?.filter(task => task.status === 'done').length || 0} of {milestone.tasks?.length || 0} tasks completed
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Milestone Modal */}
      {showCreateMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateMilestone(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Milestone
            </h3>
            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="input"
                  placeholder="Enter milestone title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Enter milestone description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateMilestone(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestonesView;
