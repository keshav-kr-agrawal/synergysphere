import React, { useState } from 'react';
import { User, Mail, Save, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUser(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Profile Picture
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload a new avatar or enter an image URL
              </p>
              <div className="mt-2">
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="input w-64"
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Theme</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred theme
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary flex items-center space-x-2"
              >
                {theme === 'dark' ? (
                  <>
                    <span>🌙</span>
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <span>☀️</span>
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">User ID</span>
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {user?.id}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Projects</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user?.projects?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
