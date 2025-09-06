import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl animate-glow mb-6">
            <span className="text-white font-bold text-3xl">SS</span>
          </div>
          <h2 className="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-4">
            Welcome back!
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
            Sign in to continue to SynergySphere
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-12"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-12 pr-12"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button type="button" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200">
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary w-full hover-glow"
              >
                Sign in to SynergySphere
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Create one now
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">Trusted by teams worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-70">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-300">Project Management</div>
            <div className="w-1 h-1 bg-gray-500 dark:bg-gray-300 rounded-full"></div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-300">Team Collaboration</div>
            <div className="w-1 h-1 bg-gray-500 dark:bg-gray-300 rounded-full"></div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-300">Real-time Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
