import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const DiscussionView = ({ project }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, [project._id]);

  useEffect(() => {
    if (socket) {
      socket.emit('join-project', project._id);
      
      socket.on('new-message', (data) => {
        setMessages(prev => [...prev, data]);
      });

      return () => {
        socket.emit('leave-project', project._id);
        socket.off('new-message');
      };
    }
  }, [socket, project._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      // This would typically fetch from an API endpoint
      // For now, we'll use mock data
      setMessages([
        {
          id: 1,
          user: { name: 'John Doe', avatar: '' },
          message: 'Welcome to the project discussion!',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: 2,
          user: { name: 'Jane Smith', avatar: '' },
          message: 'Thanks for setting this up. Looking forward to working together!',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
        },
      ]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      user: user,
      message: newMessage.trim(),
      timestamp: new Date(),
      projectId: project._id,
    };

    // Send via socket
    if (socket) {
      socket.emit('send-message', messageData);
    }

    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Discussion</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <MessageSquare className="h-4 w-4" />
          <span>{messages.length} messages</span>
        </div>
      </div>

      <div className="card h-96 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No messages yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start the conversation by sending a message below.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {message.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {message.user.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {message.message}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiscussionView;
