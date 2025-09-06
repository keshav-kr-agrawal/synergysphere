import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  CheckCircle, 
  AlertCircle,
  FolderOpen,
  Activity
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // This would typically come from a dedicated stats endpoint
      // For now, we'll calculate from projects data
      const res = await axios.get('/api/projects');
      const allProjects = res.data;
      
      let totalTasks = 0;
      let completedTasks = 0;
      let overdueTasks = 0;

      allProjects.forEach(project => {
        totalTasks += project.tasks?.length || 0;
        completedTasks += project.tasks?.filter(task => task.status === 'done').length || 0;
        overdueTasks += project.tasks?.filter(task => 
          task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
        ).length || 0;
      });

      setStats({
        totalProjects: allProjects.length,
        totalTasks,
        completedTasks,
        overdueTasks,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#F7DF1E',
      'TypeScript': '#3178C6',
      'Python': '#3776AB',
      'Java': '#ED8B00',
      'C++': '#00599C',
      'C#': '#239120',
      'Go': '#00ADD8',
      'Rust': '#DEA584',
      'PHP': '#777BB4',
      'Ruby': '#CC342D',
      'Swift': '#FA7343',
      'Kotlin': '#7F52FF',
      'Dart': '#0175C2',
      'HTML': '#E34F26',
      'CSS': '#1572B6',
      'Vue': '#4FC08D',
      'React': '#61DAFB',
      'Angular': '#DD0031',
      'Node.js': '#339933',
      'Express': '#000000',
    };
    return colors[language] || '#6B7280';
  };

  const getProgressPercentage = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getOverdueTasks = (project) => {
    if (!project.tasks) return 0;
    return project.tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-full p-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl animate-glow">
              <span className="text-white text-2xl font-bold">👋</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
                Welcome back!
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                Here's what's happening with your projects today.
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="btn btn-primary flex items-center space-x-2 hover-glow"
          >
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="card-hover p-8 group">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <FolderOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="card-hover p-8 group">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="card-hover p-8 group">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900 dark:to-success-800 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="card-hover p-8 group">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-error-100 to-error-200 dark:from-error-900 dark:to-error-800 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="h-8 w-8 text-error-600 dark:text-error-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Overdue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary-700 dark:text-primary-300">
            Your Projects
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{projects.length} projects</span>
          </div>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-secondary-700 dark:to-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No projects yet</h3>
            <p className="text-gray-600 dark:text-gray-200 mb-8 max-w-md mx-auto font-medium">
              Get started by creating your first project and start collaborating with your team.
            </p>
            <Link
              to="/"
              className="btn btn-primary hover-glow flex items-center justify-center space-x-2 px-8 py-4 text-lg font-semibold"
            >
              <Plus className="h-6 w-6" />
              <span>Create Your First Project</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/project/${project._id}`}
                className="card-hover p-8 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-5 h-5 rounded-full shadow-sm"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors duration-200">
                      {project.name}
                    </h3>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: getLanguageColor(project.primaryLanguage) }}
                  >
                    {project.primaryLanguage}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-200 mb-6 line-clamp-2 leading-relaxed font-medium">
                  {project.description || 'No description provided'}
                </p>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    <span>Progress</span>
                    <span className="text-primary-600 dark:text-primary-400">{getProgressPercentage(project)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${getProgressPercentage(project)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <div className="p-1.5 bg-gray-100 dark:bg-secondary-700 rounded-lg">
                        <Activity className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{project.tasks?.length || 0} tasks</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <div className="p-1.5 bg-gray-100 dark:bg-secondary-700 rounded-lg">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{project.members?.length || 1} members</span>
                    </div>
                  </div>
                  {getOverdueTasks(project) > 0 && (
                    <div className="flex items-center space-x-2 text-error-600 dark:text-error-400">
                      <div className="p-1.5 bg-error-100 dark:bg-error-900/30 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <span className="font-semibold">{getOverdueTasks(project)} overdue</span>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                {project.milestones && project.milestones.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Milestones</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {project.milestones.filter(m => m.isCompleted).length}/{project.milestones.length}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
