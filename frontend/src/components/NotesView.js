import React, { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NotesView = ({ project, onUpdate }) => {
  const [notes, setNotes] = useState(project.notes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNotes(project.notes || '');
  }, [project.notes]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/notes/project/${project._id}`, { notes });
      await onUpdate();
      toast.success('Notes saved successfully');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Notes</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Notes'}</span>
        </button>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Collaborative notes for this project
            </span>
          </div>
          
          <textarea
            value={notes}
            onChange={handleChange}
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            placeholder="Start writing your project notes here...

You can use this space to:
- Document project requirements
- Keep meeting notes
- Track important decisions
- Share project updates
- Store useful links and resources

The notes are automatically saved when you click the Save button."
          />
        </div>
      </div>
    </div>
  );
};

export default NotesView;
