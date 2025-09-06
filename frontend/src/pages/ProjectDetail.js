import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Settings,
  MessageSquare,
  FileText,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BoardView from '../components/BoardView';
import ListView from '../components/ListView';
import MilestonesView from '../components/MilestonesView';
import NotesView from '../components/NotesView';
import WorkloadView from '../components/WorkloadView';
import ActivityView from '../components/ActivityView';
import DiscussionView from '../components/DiscussionView';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/projects/${id}/members`, {
        email: newMemberEmail,
        role: 'member'
      });
      await fetchProject();
      setNewMemberEmail('');
      setShowAddMember(false);
      toast.success('Member added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const getProgressPercentage = () => {
    if (!project?.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getOverdueTasks = () => {
    if (!project?.tasks) return 0;
    return project.tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;
  };

  const tabs = [
    { id: 'board', name: 'Board View', icon: BarChart3 },
    { id: 'list', name: 'List View', icon: FileText },
    { id: 'milestones', name: 'Milestones', icon: Target },
    { id: 'notes', name: 'Notes', icon: FileText },
    { id: 'workload', name: 'Workload', icon: Users },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'discussion', name: 'Discussion', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-6 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="card p-6 animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Project not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The project you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            ></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {project.description || 'No description provided'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: project.primaryLanguage === 'JavaScript' ? '#F7DF1E' : '#6B7280' }}
            >
              {project.primaryLanguage}
            </div>
            <button className="btn btn-secondary">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {project.tasks?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {project.tasks?.filter(task => task.status === 'done').length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {getOverdueTasks()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Members</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {project.members?.length || 1}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Members:</span>
            <div className="flex -space-x-2">
              {project.members?.slice(0, 5).map((member, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-800"
                >
                  {member.user?.name?.charAt(0).toUpperCase()}
                </div>
              ))}
              {project.members?.length > 5 && (
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-800">
                  +{project.members.length - 5}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowAddMember(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'board' && <BoardView project={project} onUpdate={fetchProject} />}
          {activeTab === 'list' && <ListView project={project} onUpdate={fetchProject} />}
          {activeTab === 'milestones' && <MilestonesView project={project} onUpdate={fetchProject} />}
          {activeTab === 'notes' && <NotesView project={project} onUpdate={fetchProject} />}
          {activeTab === 'workload' && <WorkloadView project={project} onUpdate={fetchProject} />}
          {activeTab === 'activity' && <ActivityView project={project} onUpdate={fetchProject} />}
          {activeTab === 'discussion' && <DiscussionView project={project} onUpdate={fetchProject} />}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddMember(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Team Member
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="input"
                  placeholder="Enter member's email"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
