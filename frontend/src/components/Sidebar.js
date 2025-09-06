import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { connected } = useSocket();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    primaryLanguage: 'JavaScript',
    color: '#3B82F6'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/projects', newProject);
      setProjects([res.data, ...projects]);
      setNewProject({
        name: '',
        description: '',
        primaryLanguage: 'JavaScript',
        color: '#3B82F6'
      });
      setShowCreateProject(false);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
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

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-secondary-900 shadow-2xl border-r border-gray-200 dark:border-secondary-700 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0 lg:h-full
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-700 dark:text-primary-300">
                SynergySphere
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Team Collaboration</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
            <Link
              to="/"
              className={`sidebar-item group ${location.pathname === '/' ? 'active' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-secondary-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors duration-200">
                  <Home className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-200">Dashboard</span>
              </div>
            </Link>

            <div className="border-t border-gray-200 dark:border-secondary-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Projects
                </h3>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-200 group"
                >
                  <Plus className="h-4 w-4 text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-gray-200 dark:bg-secondary-700 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/project/${project._id}`}
                      className={`sidebar-item group hover-lift ${
                        location.pathname === `/project/${project._id}` ? 'active' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div 
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <span className="truncate font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-200 flex-1">{project.name}</span>
                        <div 
                          className="w-2 h-2 rounded-full shadow-sm"
                          style={{ backgroundColor: getLanguageColor(project.primaryLanguage) }}
                        ></div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 dark:border-secondary-700 p-6 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">
                  {user?.email}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success-500 animate-pulse' : 'bg-error-500'}`}></div>
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-secondary-700">
                  <Bell className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/profile"
                className="sidebar-item group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-secondary-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors duration-200">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  <span className="font-medium">Profile</span>
                </div>
              </Link>
              
              <button
                onClick={toggleTheme}
                className="sidebar-item group w-full"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-secondary-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors duration-200">
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    ) : (
                      <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    )}
                  </div>
                  <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </button>

              <button
                onClick={logout}
                className="sidebar-item group w-full text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-error-100 dark:bg-error-900/30 group-hover:bg-error-200 dark:group-hover:bg-error-800/50 transition-colors duration-200">
                    <Settings className="h-4 w-4 text-error-600 dark:text-error-400" />
                  </div>
                  <span className="font-medium">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateProject(false)}></div>
          <div className="relative bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-gray-200/50 dark:border-secondary-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create New Project
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start collaborating with your team
                </p>
              </div>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="input"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Enter project description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={newProject.primaryLanguage}
                    onChange={(e) => setNewProject({ ...newProject, primaryLanguage: e.target.value })}
                    className="input"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="C#">C#</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="PHP">PHP</option>
                    <option value="Ruby">Ruby</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newProject.color}
                    onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                    className="w-full h-12 rounded-xl border border-gray-200 dark:border-secondary-600 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
