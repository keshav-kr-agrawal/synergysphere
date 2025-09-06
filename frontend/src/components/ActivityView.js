import React, { useState, useEffect } from 'react';
import { Activity, User, CheckCircle, Plus, MessageSquare, Target } from 'lucide-react';
import axios from 'axios';

const ActivityView = ({ project }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [project._id]);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`/api/activities/project/${project._id}`);
      setActivities(res.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
      case 'task_updated':
      case 'task_completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'milestone_created':
      case 'milestone_completed':
        return <Target className="h-4 w-4" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4" />;
      case 'project_joined':
        return <User className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_created':
      case 'milestone_created':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'task_completed':
      case 'milestone_completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'task_updated':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'comment_added':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900';
      case 'project_joined':
        return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Activity</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Activity className="h-4 w-4" />
          <span>{activities.length} activities</span>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No activity yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Project activity will appear here as team members work on tasks and milestones.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity._id} className="card p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {activity.user?.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                    <span className="capitalize">
                      {activity.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityView;
