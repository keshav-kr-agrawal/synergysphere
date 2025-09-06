import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BoardView = ({ project, onUpdate }) => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'gray' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'done', title: 'Done', color: 'green' },
  ];

  const getTasksByStatus = (status) => {
    return project.tasks?.filter(task => task.status === status) || [];
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', {
        ...newTask,
        project: project._id,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : undefined,
      });
      await onUpdate();
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        dueDate: '',
      });
      setShowCreateTask(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    try {
      await axios.put(`/api/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
      await onUpdate();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Board</h3>
        <button
          onClick={() => setShowCreateTask(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full bg-${column.color}-500`}></div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {column.title}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({getTasksByStatus(column.id).length})
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                      snapshot.isDraggingOver
                        ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`card p-4 mb-3 cursor-move hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                {task.title}
                              </h5>
                              <div className="flex items-center space-x-1">
                                {isOverdue(task.dueDate) && (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>

                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-3">
                                {task.assignee && (
                                  <div className="flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span>{task.assignee.name}</span>
                                  </div>
                                )}
                                {task.dueDate && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span className={isOverdue(task.dueDate) ? 'text-red-500' : ''}>
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {task.tags && task.tags.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Tag className="h-3 w-3" />
                                  <span>{task.tags.length}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateTask(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="input"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignee
                </label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="input"
                >
                  <option value="">Unassigned</option>
                  {project.members?.map((member) => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTask(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardView;
