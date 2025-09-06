# 🚀 SynergySphere Frontend MVP

A modern, responsive team collaboration platform built with **HTML, CSS, and vanilla JavaScript** only.

## ✨ Features

### 🎨 Design & UX
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Modern UI**: Clean, professional design with smooth animations
- **Mobile-First**: Optimized for mobile with bottom navigation

### 📊 Enhanced Project Management
- **Project Dashboard**: View all projects with progress indicators and quick stats
- **Health Status**: Visual indicators for project status (On Track, At Risk, Behind)
- **Language Indicators**: GitHub-style language dots for each project
- **Member Avatars**: Show team members with initials (up to 5, then "+X more")
- **Progress Tracking**: Visual progress bars with task counts
- **Quick Stats**: Dashboard shows total projects, completed tasks, due today, and team members

### 👥 Team Management
- **Team Members Section**: Dedicated section showing all project members
- **Add Members**: Modal to add new team members by email with role assignment
- **Remove Members**: Remove team members with confirmation
- **Role Management**: Assign roles (Admin, Member, Viewer) to team members
- **Member Info**: Display member name, role, and avatar

### 📈 Project Statistics
- **Contribution Graph**: GitHub-style contribution heatmap showing activity levels
- **Activity Timeline**: Weekly activity bars showing daily contributions
- **Language Stats**: Primary programming language with color-coded indicators
- **Project Metrics**: Progress percentage and task counts

### 📋 Enhanced Task Management
- **Kanban Board**: Drag-and-drop task management with 3 columns (To Do, In Progress, Done)
- **Task Creation**: Add new tasks with title, description, assignee, and due date
- **Task Details**: View and edit task information with threaded comments
- **Real-time Updates**: Drag tasks between columns to update status
- **Task Comments**: Add comments to individual tasks with @mention support

### 💬 Advanced Collaboration
- **Project Discussions**: Threaded discussions for each project
- **Project Comments**: Dedicated comment section at the bottom of project views
- **Reactions**: Add emoji reactions to discussion posts
- **Pin Messages**: Pin important decisions as "Decision Snapshots"
- **@Mentions**: Mention team members in comments and discussions with visual highlighting
- **Real-time Updates**: Comments and discussions update dynamically

### 🔔 Enhanced Notifications
- **Notification Center**: View all notifications in a dropdown with icons
- **Rich Notifications**: Icons and detailed messages for different notification types
- **Real-time Updates**: Mock notifications for task due dates, mentions, member changes, etc.
- **Mark as Read**: Mark individual or all notifications as read
- **Latest 5**: Show only the 5 most recent notifications

### 👤 User Management
- **Profile Settings**: View and edit user profile
- **Theme Preferences**: Choose between light, dark, or auto theme
- **Notification Settings**: Toggle email and push notifications
- **Secure Login**: Mock authentication system

## 🛠️ Technical Stack

- **HTML5**: Semantic markup with accessibility in mind
- **CSS3**: Modern CSS with custom properties, Grid, and Flexbox
- **Vanilla JavaScript**: No external frameworks, pure ES6+ JavaScript
- **Local Storage**: Persistent theme and user preferences
- **Drag & Drop API**: Native HTML5 drag and drop for Kanban board

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Sign Up** with any email and password (mock authentication)
4. **Explore** the features and start collaborating!

## 📱 Demo Flow

1. **Login/Signup** → Enter any email and password
2. **Dashboard** → View project cards with language indicators, member avatars, and quick stats
3. **Open Project** → Click on any project card
4. **Team Members** → View team members, add new members, or remove existing ones
5. **Project Stats** → See contribution heatmap and activity timeline
6. **Task Board** → Drag tasks between columns (To Do, In Progress, Done)
7. **Add Task** → Click the floating "+" button to create new tasks
8. **Discussions** → Switch to discussions tab, post with @mentions
9. **Project Comments** → Scroll down to see project-wide comments section
10. **Notifications** → Click the bell icon to see rich notifications with icons
11. **Profile** → Access settings, theme toggle, and notification preferences

## 🎯 Key Features Demonstrated

### Responsive Design
- Desktop: Top navigation with sidebar
- Mobile: Bottom navigation with collapsible menu
- Adaptive layouts for all screen sizes

### Theme System
- CSS custom properties for easy theme switching
- Persistent theme preference in localStorage
- Smooth transitions between themes

### State Management
- Centralized app state with JavaScript class
- Mock data for users, projects, tasks, and discussions
- Real-time UI updates based on state changes

### Drag & Drop
- Native HTML5 drag and drop API
- Visual feedback during drag operations
- Automatic status updates when dropping tasks

## 🔧 Customization

### Adding New Features
- Extend the `AppState` class for new functionality
- Add new screens by creating HTML templates and CSS
- Update the navigation system for new pages

### Styling
- Modify CSS custom properties in `:root` for global changes
- Add new component styles following the existing pattern
- Update theme variables for new color schemes

### Data Management
- Replace mock data with real API calls
- Implement proper authentication
- Add data persistence with backend integration

## 📁 File Structure

```
SynergySphere/
├── index.html          # Main HTML file
├── style.css           # All CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🌟 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 Notes

This is a **frontend-only MVP** designed to demonstrate the user interface and basic functionality. In a production environment, you would need to:

- Implement real authentication
- Connect to a backend API
- Add data persistence
- Implement real-time updates
- Add proper error handling
- Include unit tests

## 🎉 Enjoy!

The SynergySphere frontend is now ready to use! Start collaborating with your team and experience the power of modern web technologies without any external dependencies.
