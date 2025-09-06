import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';

const Navbar = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  const { connected } = useSocket();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications?limit=10');
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/api/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname.startsWith('/project/')) return 'Project';
    if (location.pathname === '/profile') return 'Profile';
    return 'SynergySphere';
  };

  return (
    <div className="bg-white dark:bg-secondary-900 shadow-soft border-b border-gray-200 dark:border-secondary-700 sticky top-0 z-40 w-full">
      <div className="px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 -mt-1 font-medium">
                {connected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-80 pl-12 pr-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-xl leading-5 bg-white dark:bg-secondary-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm shadow-sm"
                placeholder="Search projects, tasks..."
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-secondary-700 relative transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-secondary-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors duration-200">
                  <Bell className="h-5 w-5 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-error-500 to-error-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-secondary-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-secondary-700 z-50">
                  <div className="p-6 border-b border-gray-200 dark:border-secondary-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                          <Bell className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Notifications
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            {unreadCount} unread
                          </p>
                        </div>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Bell className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-bold">No notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 border-b border-gray-100 dark:border-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-800 cursor-pointer transition-colors duration-200 ${
                            !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/20' : ''
                          }`}
                          onClick={() => markAsRead(notification._id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mt-2 shadow-sm"></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-secondary-700">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
