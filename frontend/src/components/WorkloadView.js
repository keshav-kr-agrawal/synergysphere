import React from 'react';
import { Users, Activity, AlertCircle } from 'lucide-react';

const WorkloadView = ({ project }) => {
  const getMemberWorkload = () => {
    if (!project.members || !project.tasks) return [];

    return project.members.map(member => {
      const memberTasks = project.tasks.filter(task => 
        task.assignee && task.assignee._id === member.user._id
      );
      
      const completedTasks = memberTasks.filter(task => task.status === 'done').length;
      const inProgressTasks = memberTasks.filter(task => task.status === 'in-progress').length;
      const todoTasks = memberTasks.filter(task => task.status === 'todo').length;
      
      const overdueTasks = memberTasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
      ).length;

      return {
        ...member,
        totalTasks: memberTasks.length,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        completionRate: memberTasks.length > 0 ? Math.round((completedTasks / memberTasks.length) * 100) : 0,
        isOverloaded: memberTasks.length > 10 || overdueTasks > 3
      };
    });
  };

  const memberWorkloads = getMemberWorkload();

  const getWorkloadColor = (workload) => {
    if (workload.isOverloaded) return 'text-red-600 bg-red-100 dark:bg-red-900';
    if (workload.totalTasks > 5) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
    return 'text-green-600 bg-green-100 dark:bg-green-900';
  };

  const getWorkloadStatus = (workload) => {
    if (workload.isOverloaded) return 'Overloaded';
    if (workload.totalTasks > 5) return 'Busy';
    return 'Available';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Workload</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span>{memberWorkloads.length} team members</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {memberWorkloads.map((member) => (
          <div key={member.user._id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {member.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {member.user.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.user.email}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getWorkloadColor(member)}`}>
                {getWorkloadStatus(member)}
              </div>
            </div>

            {/* Workload Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {member.totalTasks}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="text-green-600 font-medium">{member.completedTasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                  <span className="text-blue-600 font-medium">{member.inProgressTasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">To Do</span>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{member.todoTasks}</span>
                </div>
                {member.overdueTasks > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-600 dark:text-red-400">Overdue</span>
                    <span className="text-red-600 font-medium flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{member.overdueTasks}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Completion Rate</span>
                  <span>{member.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="card p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Team Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {memberWorkloads.reduce((sum, member) => sum + member.totalTasks, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {memberWorkloads.reduce((sum, member) => sum + member.completedTasks, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {memberWorkloads.filter(member => member.isOverloaded).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overloaded</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkloadView;
