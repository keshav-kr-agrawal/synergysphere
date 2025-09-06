// SynergySphere Frontend JavaScript
// State Management
class AppState {
  constructor() {
    this.currentUser = null;
    this.currentScreen = 'login';
    this.currentProject = null;
    this.theme = localStorage.getItem('theme') || 'light';
    this.notifications = [];
    this.projects = [];
    this.tasks = [];
    this.discussions = [];
    this.comments = [];
    this.users = [];
    
    this.init();
  }

  init() {
    this.loadMockData();
    this.setTheme(this.theme);
    this.bindEvents();
    this.render();
  }

  loadMockData() {
    // Mock users
    this.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', initials: 'JD', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', initials: 'JS', role: 'member' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', initials: 'MJ', role: 'member' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', initials: 'SW', role: 'member' },
      { id: 5, name: 'Alex Brown', email: 'alex@example.com', initials: 'AB', role: 'viewer' }
    ];

    // Mock projects with enhanced data
    this.projects = [
      {
        id: 1,
        title: 'Project Alpha',
        progress: 75,
        health: 'on-track',
        members: [1, 2, 3],
        language: 'javascript',
        createdAt: new Date('2024-01-15'),
        contributions: this.generateContributions(1),
        activity: this.generateActivity(1)
      },
      {
        id: 2,
        title: 'Project Beta',
        progress: 45,
        health: 'at-risk',
        members: [1, 3, 4],
        language: 'python',
        createdAt: new Date('2024-02-01'),
        contributions: this.generateContributions(2),
        activity: this.generateActivity(2)
      },
      {
        id: 3,
        title: 'Project Gamma',
        progress: 90,
        health: 'on-track',
        members: [2, 4, 5],
        language: 'typescript',
        createdAt: new Date('2024-01-20'),
        contributions: this.generateContributions(3),
        activity: this.generateActivity(3)
      }
    ];

    // Mock tasks with enhanced data
    this.tasks = [
      {
        id: 1,
        projectId: 1,
        title: 'Design user interface',
        description: 'Create wireframes and mockups for the main dashboard',
        assignee: 1,
        dueDate: '2024-12-30',
        status: 'todo',
        priority: 'high',
        tags: ['UI', 'Design'],
        dependencies: [],
        createdAt: new Date('2024-12-15')
      },
      {
        id: 2,
        projectId: 1,
        title: 'Implement authentication',
        description: 'Set up login and registration functionality',
        assignee: 2,
        dueDate: '2024-12-25',
        status: 'in-progress',
        priority: 'high',
        tags: ['Backend', 'Security'],
        dependencies: [1],
        createdAt: new Date('2024-12-15')
      },
      {
        id: 3,
        projectId: 1,
        title: 'Write documentation',
        description: 'Create API documentation and user guides',
        assignee: 3,
        dueDate: '2024-12-28',
        status: 'done',
        priority: 'medium',
        tags: ['Documentation'],
        dependencies: [2],
        createdAt: new Date('2024-12-15')
      },
      {
        id: 4,
        projectId: 2,
        title: 'Database optimization',
        description: 'Optimize database queries and indexes',
        assignee: 1,
        dueDate: '2024-12-31',
        status: 'todo',
        priority: 'medium',
        tags: ['Backend', 'Performance'],
        dependencies: [],
        createdAt: new Date('2024-12-12')
      },
      {
        id: 5,
        projectId: 1,
        title: 'Fix login bug',
        description: 'Resolve issue with password reset functionality',
        assignee: 2,
        dueDate: '2024-12-20',
        status: 'in-progress',
        priority: 'high',
        tags: ['Bug', 'Frontend'],
        dependencies: [],
        createdAt: new Date('2024-12-14')
      }
    ];

    // Mock milestones
    this.milestones = [
      {
        id: 1,
        projectId: 1,
        name: 'MVP Release',
        description: 'Complete core functionality for initial release',
        dueDate: '2024-12-31',
        completed: false,
        createdAt: new Date('2024-12-15')
      },
      {
        id: 2,
        projectId: 1,
        name: 'UI/UX Design',
        description: 'Complete all design mockups and prototypes',
        dueDate: '2024-12-15',
        completed: true,
        createdAt: new Date('2024-12-15')
      },
      {
        id: 3,
        projectId: 2,
        name: 'Backend API',
        description: 'Complete REST API development',
        dueDate: '2024-12-25',
        completed: false,
        createdAt: new Date('2024-12-12')
      }
    ];

    // Mock project notes
    this.projectNotes = {
      1: '# Project Alpha Notes\n\n## Overview\nThis project aims to build a modern team collaboration platform.\n\n## Key Features\n- User authentication\n- Task management\n- Team collaboration\n\n## Next Steps\n1. Complete UI design\n2. Implement authentication\n3. Add task management features',
      2: '# Project Beta Notes\n\n## Backend Development\nFocus on building robust APIs for the frontend.\n\n## Database Design\n- User tables\n- Project tables\n- Task tables',
      3: '# Project Gamma Notes\n\n## Frontend Development\nBuilding the user interface with modern technologies.'
    };

    // Mock discussions
    this.discussions = [
      {
        id: 1,
        projectId: 1,
        author: 1,
        content: 'We need to decide on the color scheme for the dashboard. I suggest using a blue and white theme.',
        createdAt: new Date('2024-12-14'),
        pinned: false,
        reactions: { '👍': [1, 2], '❤️': [3] }
      },
      {
        id: 2,
        projectId: 1,
        author: 2,
        content: 'The authentication system is ready for testing. Please review the implementation.',
        createdAt: new Date('2024-12-11'),
        pinned: true,
        reactions: { '👍': [1, 3, 4] }
      }
    ];

    // Mock comments
    this.comments = [
      {
        id: 1,
        taskId: 1,
        author: 2,
        content: 'Great work on the wireframes! I have some suggestions for the mobile layout.',
        createdAt: new Date('2024-12-12')
      },
      {
        id: 2,
        taskId: 1,
        author: 3,
        content: 'I agree with Jane. The mobile version needs some adjustments.',
        createdAt: new Date('2024-12-12')
      }
    ];

    // Mock notifications with enhanced data
    this.notifications = [
      {
        id: 1,
        type: 'task_due',
        message: '3 tasks due today',
        icon: '⏰',
        read: false,
        createdAt: new Date('2024-12-15')
      },
      {
        id: 2,
        type: 'mention',
        message: 'Sarah mentioned you in Project Alpha discussion',
        icon: '💬',
        read: false,
        createdAt: new Date('2024-12-14')
      },
      {
        id: 3,
        type: 'project_update',
        message: 'Project Beta status changed to At Risk',
        icon: '⚠️',
        read: true,
        createdAt: new Date('2024-12-13')
      },
      {
        id: 4,
        type: 'member_added',
        message: 'Alex Brown joined Project Gamma',
        icon: '👥',
        read: false,
        createdAt: new Date('2024-12-12')
      },
      {
        id: 5,
        type: 'task_completed',
        message: 'Jane completed "Design user interface" task',
        icon: '✅',
        read: true,
        createdAt: new Date('2024-12-11')
      }
    ];

    // Mock project comments
    this.projectComments = [
      {
        id: 1,
        projectId: 1,
        author: 2,
        content: 'Great progress on the authentication system! @john @mike',
        createdAt: new Date('2024-12-14')
      },
      {
        id: 2,
        projectId: 1,
        author: 3,
        content: 'I\'ll start working on the database optimization next week.',
        createdAt: new Date('2024-12-13')
      }
    ];
  }

  generateContributions(projectId) {
    const contributions = {};
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return contributions;

    // Get project tasks and activities for realistic data
    const projectTasks = this.tasks.filter(task => task.projectId === projectId);
    const projectDiscussions = this.discussions.filter(d => d.projectId === projectId);
    const projectComments = this.projectComments.filter(c => c.projectId === projectId);

    // Generate 28 days of contribution data
    for (let i = 0; i < 28; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get all activities for this date
      const tasksOnDate = projectTasks.filter(task => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskDate === dateStr;
      });
      
      const discussionsOnDate = projectDiscussions.filter(disc => {
        const discDate = new Date(disc.createdAt).toISOString().split('T')[0];
        return discDate === dateStr;
      });
      
      const commentsOnDate = projectComments.filter(comment => {
        const commentDate = new Date(comment.createdAt).toISOString().split('T')[0];
        return commentDate === dateStr;
      });
      
      // Group activities by member
      const memberActivities = {};
      
      // Process tasks
      tasksOnDate.forEach(task => {
        if (!memberActivities[task.assignee]) {
          memberActivities[task.assignee] = { tasks: 0, discussions: 0, comments: 0 };
        }
        memberActivities[task.assignee].tasks++;
      });
      
      // Process discussions
      discussionsOnDate.forEach(disc => {
        if (!memberActivities[disc.author]) {
          memberActivities[disc.author] = { tasks: 0, discussions: 0, comments: 0 };
        }
        memberActivities[disc.author].discussions++;
      });
      
      // Process comments
      commentsOnDate.forEach(comment => {
        if (!memberActivities[comment.author]) {
          memberActivities[comment.author] = { tasks: 0, discussions: 0, comments: 0 };
        }
        memberActivities[comment.author].comments++;
      });
      
      // Store contributions for this date
      contributions[dateStr] = [];
      Object.keys(memberActivities).forEach(memberId => {
        const activities = memberActivities[memberId];
        const totalActivities = activities.tasks + activities.discussions + activities.comments;
        
        let level = 0;
        if (totalActivities >= 4) level = 4;
        else if (totalActivities >= 3) level = 3;
        else if (totalActivities >= 2) level = 2;
        else if (totalActivities >= 1) level = 1;
        
        contributions[dateStr].push({
          date: dateStr,
          level: level,
          memberId: parseInt(memberId),
          tasks: activities.tasks,
          discussions: activities.discussions,
          comments: activities.comments,
          totalActivities: totalActivities
        });
      });
    }
    
    return contributions;
  }

  generateActivity(projectId) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activity = [];
    
    for (let i = 0; i < 7; i++) {
      const count = Math.floor(Math.random() * 20);
      activity.push({
        day: days[i],
        count: count,
        percentage: (count / 20) * 100
      });
    }
    return activity;
  }

  bindEvents() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Profile page events
    document.getElementById('editAbout').addEventListener('click', () => this.toggleEditAbout(true));
    document.getElementById('cancelEditAbout').addEventListener('click', () => this.toggleEditAbout(false));
    document.getElementById('saveAbout').addEventListener('click', () => this.saveAbout());
    
    document.getElementById('editContact').addEventListener('click', () => this.toggleEditContact(true));
    document.getElementById('cancelEditContact').addEventListener('click', () => this.toggleEditContact(false));
    document.getElementById('saveContact').addEventListener('click', () => this.saveContact());
    
    // Profile avatar upload
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
      avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e));
    }
    
    // Social links
    document.querySelectorAll('.social-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.dataset.platform;
        this.handleSocialLink(platform);
      });
    });
    
    // Account settings
    document.getElementById('changePasswordBtn').addEventListener('click', () => this.showChangePasswordModal());
    document.getElementById('notificationSettingsBtn').addEventListener('click', () => this.showNotificationSettings());
    document.getElementById('privacySettingsBtn').addEventListener('click', () => this.showPrivacySettings());

    // Navigation
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) {
          this.navigateTo(page);
        }
      });
    });

    // Login/Signup forms
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignup();
    });

    document.getElementById('showSignup').addEventListener('click', () => {
      this.showScreen('signup');
    });

    document.getElementById('showLogin').addEventListener('click', () => {
      this.showScreen('login');
    });

    // Notifications
    document.getElementById('notificationBtn').addEventListener('click', () => {
      this.toggleNotifications();
    });

    document.getElementById('markAllRead').addEventListener('click', () => {
      this.markAllNotificationsRead();
    });

    // Project actions
    document.getElementById('newProjectBtn').addEventListener('click', () => {
      this.createProject();
    });

    // Task actions
    document.getElementById('addTaskBtn').addEventListener('click', () => {
      this.showTaskModal();
    });

    document.getElementById('taskForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTaskSubmit();
    });

    // Modal controls
    document.getElementById('taskModalClose').addEventListener('click', () => {
      this.hideTaskModal();
    });

    document.getElementById('taskModalCancel').addEventListener('click', () => {
      this.hideTaskModal();
    });

    document.getElementById('taskDetailClose').addEventListener('click', () => {
      this.hideTaskDetailModal();
    });

    // Back button
    document.getElementById('backToDashboard').addEventListener('click', () => {
      this.navigateTo('dashboard');
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Discussion actions
    document.getElementById('postDiscussion').addEventListener('click', () => {
      this.postDiscussion();
    });

    document.getElementById('addComment').addEventListener('click', () => {
      this.addComment();
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.logout();
    });

    document.getElementById('logoutProfileBtn').addEventListener('click', () => {
      this.logout();
    });

    // Profile settings
    document.getElementById('themePreference').addEventListener('change', (e) => {
      this.setTheme(e.target.value);
    });

    // Team member management
    document.getElementById('addMemberBtn').addEventListener('click', () => {
      this.showAddMemberModal();
    });

    document.getElementById('addMemberForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddMember();
    });

    document.getElementById('addMemberClose').addEventListener('click', () => {
      this.hideAddMemberModal();
    });

    document.getElementById('addMemberCancel').addEventListener('click', () => {
      this.hideAddMemberModal();
    });

    // Project comments
    document.getElementById('postProjectComment').addEventListener('click', () => {
      this.postProjectComment();
    });

    // Task view controls
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTaskView(btn.dataset.view);
      });
    });

    // Milestones
    document.getElementById('addMilestoneBtn').addEventListener('click', () => {
      this.showAddMilestoneModal();
    });

    document.getElementById('addMilestoneForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddMilestone();
    });

    document.getElementById('addMilestoneClose').addEventListener('click', () => {
      this.hideAddMilestoneModal();
    });

    document.getElementById('addMilestoneCancel').addEventListener('click', () => {
      this.hideAddMilestoneModal();
    });

    // Notes
    document.getElementById('saveNotesBtn').addEventListener('click', () => {
      this.saveProjectNotes();
    });

    // Notes toolbar
    document.getElementById('boldBtn').addEventListener('click', () => {
      this.formatText('bold');
    });

    document.getElementById('italicBtn').addEventListener('click', () => {
      this.formatText('italic');
    });

    document.getElementById('listBtn').addEventListener('click', () => {
      this.formatText('insertUnorderedList');
    });

    // Close modals on outside click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.hideAllModals();
      }
    });

    // Initialize drag and drop
    this.initDragAndDrop();
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme icon
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  navigateTo(screen) {
    this.currentScreen = screen;
    this.render();
  }

  showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const screenId = screen === 'project-detail' ? 'projectDetailScreen' : screen + 'Screen';
    document.getElementById(screenId).classList.remove('hidden');
  }

  render() {
    this.showScreen(this.currentScreen);
    
    switch (this.currentScreen) {
      case 'login':
        this.renderLogin();
        break;
      case 'signup':
        this.renderSignup();
        break;
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'project-detail':
        this.renderProjectDetail();
        break;
      case 'profile':
        this.renderProfile();
        break;
    }
  }

  renderLogin() {
    // Login screen is already rendered in HTML
  }

  renderSignup() {
    // Signup screen is already rendered in HTML
  }

  renderDashboard() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';

    // Update dashboard stats
    this.updateDashboardStats();

    this.projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      projectsGrid.appendChild(projectCard);
    });
  }

  updateDashboardStats() {
    const totalProjects = this.projects.length;
    const completedTasks = this.tasks.filter(task => task.status === 'done').length;
    const dueToday = this.tasks.filter(task => {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate === today;
    }).length;
    const teamMembers = new Set(this.projects.flatMap(p => p.members)).size;

    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('dueToday').textContent = dueToday;
    document.getElementById('teamMembers').textContent = teamMembers;
  }

  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.addEventListener('click', () => {
      this.openProject(project);
    });

    const members = project.members.map(id => this.users.find(u => u.id === id));
    const maxVisibleMembers = 5;
    const visibleMembers = members.slice(0, maxVisibleMembers);
    const remainingCount = members.length - maxVisibleMembers;

    let memberAvatars = visibleMembers.map(member => 
      `<div class="member-avatar">${member.initials}</div>`
    ).join('');

    if (remainingCount > 0) {
      memberAvatars += `<div class="member-avatar more">+${remainingCount}</div>`;
    }

    const projectTasks = this.tasks.filter(task => task.projectId === project.id);
    const taskCount = projectTasks.length;
    const projectMilestones = this.milestones.filter(m => m.projectId === project.id);
    const completedMilestones = projectMilestones.filter(m => m.completed).length;
    const milestoneStatus = projectMilestones.length > 0 ? 
      `${completedMilestones}/${projectMilestones.length} milestones completed` : 'No milestones';

    card.innerHTML = `
      <div class="project-card-header">
        <div>
          <h3 class="project-title">${project.title}</h3>
          <div class="project-language">
            <span class="language-dot ${project.language}"></span>
            <span class="project-language-text">${project.language.charAt(0).toUpperCase() + project.language.slice(1)}</span>
          </div>
        </div>
        <div class="project-health ${project.health}">${project.health.replace('-', ' ')}</div>
      </div>
      <div class="project-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${project.progress}%"></div>
        </div>
        <div class="progress-text">${project.progress}% complete • ${taskCount} tasks</div>
        <div class="milestone-status">${milestoneStatus}</div>
      </div>
      <div class="project-members">
        ${memberAvatars}
      </div>
    `;

    return card;
  }

  openProject(project) {
    this.currentProject = project;
    this.currentScreen = 'project-detail';
    this.render();
  }

  renderProjectDetail() {
    if (!this.currentProject) return;

    // Update project title and meta info
    document.getElementById('projectTitle').textContent = this.currentProject.title;
    document.getElementById('projectLanguage').textContent = this.currentProject.language.charAt(0).toUpperCase() + this.currentProject.language.slice(1);
    document.getElementById('projectLanguageDot').className = `language-dot ${this.currentProject.language}`;
    document.getElementById('projectProgress').textContent = `${this.currentProject.progress}%`;
    
    const projectTasks = this.tasks.filter(task => task.projectId === this.currentProject.id);
    document.getElementById('projectTaskCount').textContent = projectTasks.length;

    // Regenerate contributions for real-time data
    this.currentProject.contributions = this.generateContributions(this.currentProject.id);
    this.currentProject.activity = this.generateActivity(this.currentProject.id);

    // Render team members
    this.renderTeamMembers();
    
    // Render project stats
    this.renderProjectStats();

    // Render tasks (both board and list views)
    this.renderKanbanBoard();
    this.renderTaskListView();
    
    // Render milestones
    this.renderMilestones();

    // Render notes
    this.renderProjectNotes();

    // Render workload
    this.renderWorkload();

    // Render discussions
    this.renderDiscussions();

    // Render project comments
    this.renderProjectComments();
  }

  renderTeamMembers() {
    const teamMembersContainer = document.getElementById('teamMembers');
    teamMembersContainer.innerHTML = '';

    this.currentProject.members.forEach(memberId => {
      const member = this.users.find(u => u.id === memberId);
      if (member) {
        const memberEl = this.createTeamMemberElement(member);
        teamMembersContainer.appendChild(memberEl);
      }
    });
  }

  createTeamMemberElement(member) {
    const memberEl = document.createElement('div');
    memberEl.className = 'team-member';
    memberEl.innerHTML = `
      <div class="member-avatar">${member.initials}</div>
      <div class="team-member-info">
        <div class="team-member-name">${member.name}</div>
        <div class="team-member-role">${member.role}</div>
      </div>
      <button class="member-remove" onclick="appState.removeMember(${member.id})">×</button>
    `;
    return memberEl;
  }

  renderProjectStats() {
    // Render contribution graph
    this.renderContributionGraph();
    
    // Render activity timeline
    this.renderActivityTimeline();
  }

  renderContributionGraph() {
    const graphContainer = document.getElementById('contributionGraph');
    graphContainer.innerHTML = '';

    if (!this.currentProject || !this.currentProject.contributions) {
      // Show empty state if no data
      graphContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-title">No contribution data</div>
          <div class="empty-state-description">Activity will appear as team members work on tasks</div>
        </div>
      `;
      return;
    }

    // Add week labels
    const weekLabels = document.createElement('div');
    weekLabels.className = 'contribution-graph-header';
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekLabels.innerHTML = weekDays.map(day => `<span>${day}</span>`).join('');
    graphContainer.appendChild(weekLabels);

    // Create contribution grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'contribution-grid';

    // Create a 4-week contribution grid (28 days)
    for (let i = 0; i < 28; i++) {
      const day = document.createElement('div');
      day.className = 'contribution-day';
      
      // Find contributions for this day
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayContributions = this.currentProject.contributions[dateStr] || [];
      const maxLevel = dayContributions.length > 0 ? Math.max(...dayContributions.map(c => c.level)) : 0;
      
      if (maxLevel > 0) {
        day.classList.add(`level-${maxLevel}`);
      }
      
      // Add tooltip with contribution details
      const tooltip = this.createContributionTooltip(dateStr, dayContributions);
      day.title = tooltip;
      
      gridContainer.appendChild(day);
    }

    graphContainer.appendChild(gridContainer);

    // Add contribution legend
    const legend = document.createElement('div');
    legend.className = 'contribution-legend';
    legend.innerHTML = `
      <div class="contribution-legend-item">
        <div class="contribution-legend-square"></div>
        <span>Less</span>
      </div>
      <div class="contribution-legend-item">
        <div class="contribution-legend-square level-1"></div>
        <span>1</span>
      </div>
      <div class="contribution-legend-item">
        <div class="contribution-legend-square level-2"></div>
        <span>2</span>
      </div>
      <div class="contribution-legend-item">
        <div class="contribution-legend-square level-3"></div>
        <span>3</span>
      </div>
      <div class="contribution-legend-item">
        <div class="contribution-legend-square level-4"></div>
        <span>4+</span>
      </div>
      <div class="contribution-legend-item">
        <span>More</span>
      </div>
    `;
    graphContainer.appendChild(legend);
  }

  createContributionTooltip(dateStr, contributions) {
    if (contributions.length === 0) return `No activity on ${dateStr}`;
    
    // Format date nicely
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    // Group contributions by member
    const memberContributions = {};
    contributions.forEach(contrib => {
      if (!memberContributions[contrib.memberId]) {
        memberContributions[contrib.memberId] = {
          tasks: 0,
          discussions: 0,
          comments: 0,
          total: 0
        };
      }
      memberContributions[contrib.memberId].tasks += contrib.tasks;
      memberContributions[contrib.memberId].discussions += contrib.discussions;
      memberContributions[contrib.memberId].comments += contrib.comments;
      memberContributions[contrib.memberId].total += contrib.totalActivities;
    });
    
    // Calculate totals
    const totalActivities = contributions.reduce((sum, contrib) => sum + contrib.totalActivities, 0);
    const totalTasks = contributions.reduce((sum, contrib) => sum + contrib.tasks, 0);
    const totalDiscussions = contributions.reduce((sum, contrib) => sum + contrib.discussions, 0);
    const totalComments = contributions.reduce((sum, contrib) => sum + contrib.comments, 0);
    
    // Build member details
    let memberDetails = '';
    Object.keys(memberContributions).forEach(memberId => {
      const member = this.users.find(u => u.id === parseInt(memberId));
      const contrib = memberContributions[memberId];
      const memberName = member ? member.name : `User ${memberId}`;
      memberDetails += `\n${memberName}: ${contrib.total} contributions\n  • ${contrib.tasks} tasks, ${contrib.discussions} discussions, ${contrib.comments} comments`;
    });
    
    return `${formattedDate}\n\nTotal: ${totalActivities} contributions from ${Object.keys(memberContributions).length} member(s)\n\nBreakdown:\n• ${totalTasks} tasks\n• ${totalDiscussions} discussions\n• ${totalComments} comments${memberDetails}`;
  }

  // Update contributions when activities happen
  updateProjectContributions(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      project.contributions = this.generateContributions(projectId);
      project.activity = this.generateActivity(projectId);
      
      // Re-render if this is the current project
      if (this.currentProject && this.currentProject.id === projectId) {
        this.renderProjectStats();
      }
    }
  }

  renderActivityTimeline() {
    const timelineContainer = document.getElementById('activityTimeline');
    timelineContainer.innerHTML = '';

    this.currentProject.activity.forEach(day => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      timelineItem.innerHTML = `
        <div class="timeline-day">${day.day}</div>
        <div class="timeline-activity">
          <div class="timeline-bar" style="width: ${day.percentage}%"></div>
          <div class="timeline-count">${day.count}</div>
        </div>
      `;
      timelineContainer.appendChild(timelineItem);
    });
  }

  renderProjectComments() {
    const commentsList = document.getElementById('projectCommentsList');
    const projectComments = this.projectComments.filter(c => c.projectId === this.currentProject.id);
    
    commentsList.innerHTML = '';

    projectComments.forEach(comment => {
      const commentEl = this.createProjectCommentElement(comment);
      commentsList.appendChild(commentEl);
    });
  }

  createProjectCommentElement(comment) {
    const author = this.users.find(u => u.id === comment.author);
    const timeAgo = this.getTimeAgo(comment.createdAt);
    const processedContent = this.processMentions(comment.content);

    const commentEl = document.createElement('div');
    commentEl.className = 'project-comment';
    commentEl.innerHTML = `
      <div class="project-comment-header">
        <div class="member-avatar">${author.initials}</div>
        <div>
          <div class="team-member-name">${author.name}</div>
          <div class="timeline-count">${timeAgo}</div>
        </div>
      </div>
      <div class="project-comment-content">${processedContent}</div>
    `;
    return commentEl;
  }

  renderKanbanBoard() {
    const projectTasks = this.tasks.filter(task => task.projectId === this.currentProject.id);
    
    // Clear existing tasks
    document.getElementById('todoList').innerHTML = '';
    document.getElementById('inProgressList').innerHTML = '';
    document.getElementById('doneList').innerHTML = '';

    // Group tasks by status
    const tasksByStatus = {
      'todo': projectTasks.filter(task => task.status === 'todo'),
      'in-progress': projectTasks.filter(task => task.status === 'in-progress'),
      'done': projectTasks.filter(task => task.status === 'done')
    };

    // Render tasks in each column
    Object.keys(tasksByStatus).forEach(status => {
      const list = document.getElementById(status.replace('-', '') + 'List');
      const count = document.getElementById(status.replace('-', '') + 'Count');
      
      count.textContent = tasksByStatus[status].length;
      
      tasksByStatus[status].forEach(task => {
        const taskCard = this.createTaskCard(task);
        list.appendChild(taskCard);
      });
    });
  }

  createTaskCard(task) {
    const assignee = this.users.find(u => u.id === task.assignee);
    const dueDate = new Date(task.dueDate).toLocaleDateString();
    const tags = task.tags ? task.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    const dependencies = task.dependencies && task.dependencies.length > 0 ? 
      `<div class="dependency">Blocked by ${task.dependencies.length} task(s)</div>` : '';

    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.taskId = task.id;

    card.innerHTML = `
      <div class="task-title">${task.title}</div>
      <div class="task-priority">
        <span class="priority-badge ${task.priority || 'medium'}">${(task.priority || 'medium').toUpperCase()}</span>
      </div>
      <div class="task-tags">${tags}</div>
      ${dependencies}
      <div class="task-meta">
        <div class="task-assignee">
          <div class="task-assignee-avatar">${assignee.initials}</div>
          <span>${assignee.name}</span>
        </div>
        <div class="task-due-date">${dueDate}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      this.showTaskDetail(task);
    });

    return card;
  }

  renderDiscussions() {
    const discussionsList = document.getElementById('discussionsList');
    const projectDiscussions = this.discussions.filter(d => d.projectId === this.currentProject.id);
    
    discussionsList.innerHTML = '';

    projectDiscussions.forEach(discussion => {
      const discussionEl = this.createDiscussionElement(discussion);
      discussionsList.appendChild(discussionEl);
    });
  }

  createDiscussionElement(discussion) {
    const author = this.users.find(u => u.id === discussion.author);
    const timeAgo = this.getTimeAgo(discussion.createdAt);

    const discussionEl = document.createElement('div');
    discussionEl.className = 'discussion';
    if (discussion.pinned) discussionEl.classList.add('pinned');

    discussionEl.innerHTML = `
      <div class="discussion-header">
        <div class="discussion-avatar">${author.initials}</div>
        <div>
          <div class="discussion-author">${author.name}</div>
          <div class="discussion-time">${timeAgo}</div>
        </div>
        ${discussion.pinned ? '<span class="pin-indicator">📌 Pinned</span>' : ''}
      </div>
      <div class="discussion-content">${discussion.content}</div>
      <div class="discussion-actions">
        <button class="reaction-btn" onclick="appState.toggleReaction(${discussion.id}, '👍')">
          👍 ${discussion.reactions['👍']?.length || 0}
        </button>
        <button class="reaction-btn" onclick="appState.toggleReaction(${discussion.id}, '❤️')">
          ❤️ ${discussion.reactions['❤️']?.length || 0}
        </button>
        <button class="pin-btn ${discussion.pinned ? 'pinned' : ''}" onclick="appState.togglePin(${discussion.id})">
          ${discussion.pinned ? 'Unpin' : 'Pin'}
        </button>
      </div>
    `;

    return discussionEl;
  }

  renderProfile() {
    if (!this.currentUser) return;

    document.getElementById('profileName').textContent = this.currentUser.name;
    document.getElementById('profileEmail').textContent = this.currentUser.email;
    document.getElementById('profileInitials').textContent = this.currentUser.initials;
    
    // Set theme preference
    document.getElementById('themePreference').value = this.theme;
  }

  handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Mock login - find user by email
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      this.navigateTo('dashboard');
    } else {
      alert('Invalid credentials');
    }
  }

  handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Mock signup - create new user
    const newUser = {
      id: this.users.length + 1,
      name,
      email,
      initials: name.split(' ').map(n => n[0]).join('')
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    this.navigateTo('dashboard');
  }

  createProject() {
    const title = prompt('Enter project name:');
    if (!title) return;

    const newProject = {
      id: this.projects.length + 1,
      title,
      progress: 0,
      health: 'on-track',
      members: [this.currentUser.id],
      createdAt: new Date()
    };

    this.projects.push(newProject);
    this.renderDashboard();
  }

  showTaskModal(task = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    
    if (task) {
      document.getElementById('taskModalTitle').textContent = 'Edit Task';
      document.getElementById('taskTitle').value = task.title;
      document.getElementById('taskDescription').value = task.description || '';
      document.getElementById('taskAssignee').value = task.assignee;
      document.getElementById('taskDueDate').value = task.dueDate;
      document.getElementById('taskStatus').value = task.status;
      document.getElementById('taskPriority').value = task.priority || 'medium';
      document.getElementById('taskTags').value = task.tags ? task.tags.join(', ') : '';
      form.dataset.taskId = task.id;
    } else {
      document.getElementById('taskModalTitle').textContent = 'Add Task';
      form.reset();
      form.dataset.taskId = '';
    }

    // Populate assignee dropdown
    const assigneeSelect = document.getElementById('taskAssignee');
    assigneeSelect.innerHTML = '';
    this.users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.name;
      assigneeSelect.appendChild(option);
    });

    // Populate dependencies dropdown
    const dependenciesSelect = document.getElementById('taskDependencies');
    dependenciesSelect.innerHTML = '';
    const projectTasks = this.tasks.filter(t => t.projectId === this.currentProject.id && t.id !== task?.id);
    projectTasks.forEach(task => {
      const option = document.createElement('option');
      option.value = task.id;
      option.textContent = task.title;
      if (task.dependencies && task.dependencies.includes(task.id)) {
        option.selected = true;
      }
      dependenciesSelect.appendChild(option);
    });

    modal.classList.add('show');
  }

  hideTaskModal() {
    document.getElementById('taskModal').classList.remove('show');
  }

  handleTaskSubmit() {
    const form = document.getElementById('taskForm');
    const formData = new FormData(form);
    const taskId = form.dataset.taskId;

    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      assignee: parseInt(formData.get('assignee')),
      dueDate: formData.get('dueDate'),
      status: formData.get('status'),
      priority: formData.get('priority'),
      tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      dependencies: Array.from(formData.getAll('dependencies')).map(id => parseInt(id))
    };

    if (!taskData.title) {
      alert('Please enter a task title');
      return;
    }

    if (taskId) {
      // Update existing task
      const task = this.tasks.find(t => t.id == taskId);
      Object.assign(task, taskData);
    } else {
      // Create new task
      const newTask = {
        id: this.tasks.length + 1,
        projectId: this.currentProject.id,
        ...taskData,
        createdAt: new Date()
      };
      this.tasks.push(newTask);
    }

    this.hideTaskModal();
    this.renderKanbanBoard();
    this.renderTaskListView();
    
    // Update contributions for real-time heatmap
    this.updateProjectContributions(this.currentProject.id);
  }

  showTaskDetail(task) {
    const modal = document.getElementById('taskDetailModal');
    const assignee = this.users.find(u => u.id === task.assignee);
    const dueDate = new Date(task.dueDate).toLocaleDateString();

    document.getElementById('taskDetailTitleText').textContent = task.title;
    document.getElementById('taskDetailDescription').textContent = task.description || 'No description provided';
    document.getElementById('taskDetailAssignee').textContent = assignee.name;
    document.getElementById('taskDetailDueDate').textContent = dueDate;
    document.getElementById('taskDetailStatus').textContent = task.status.replace('-', ' ').toUpperCase();
    document.getElementById('taskDetailStatus').className = `status-badge ${task.status}`;

    // Render comments
    this.renderTaskComments(task.id);

    modal.classList.add('show');
  }

  hideTaskDetailModal() {
    document.getElementById('taskDetailModal').classList.remove('show');
  }

  renderTaskComments(taskId) {
    const commentsList = document.getElementById('commentsList');
    const taskComments = this.comments.filter(c => c.taskId === taskId);
    
    commentsList.innerHTML = '';

    taskComments.forEach(comment => {
      const commentEl = this.createCommentElement(comment);
      commentsList.appendChild(commentEl);
    });
  }

  createCommentElement(comment) {
    const author = this.users.find(u => u.id === comment.author);
    const timeAgo = this.getTimeAgo(comment.createdAt);

    const commentEl = document.createElement('div');
    commentEl.className = 'comment';

    commentEl.innerHTML = `
      <div class="comment-header">
        <div class="comment-avatar">${author.initials}</div>
        <div class="comment-author">${author.name}</div>
        <div class="comment-time">${timeAgo}</div>
      </div>
      <div class="comment-text">${comment.content}</div>
    `;

    return commentEl;
  }

  addComment() {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();

    if (!content) return;

    const newComment = {
      id: this.comments.length + 1,
      taskId: this.getCurrentTaskId(), // You'll need to track this
      author: this.currentUser.id,
      content,
      createdAt: new Date()
    };

    this.comments.push(newComment);
    input.value = '';
    this.renderTaskComments(newComment.taskId);
  }

  postDiscussion() {
    const input = document.getElementById('discussionInput');
    const content = input.value.trim();

    if (!content) return;

    const newDiscussion = {
      id: this.discussions.length + 1,
      projectId: this.currentProject.id,
      author: this.currentUser.id,
      content,
      createdAt: new Date(),
      pinned: false,
      reactions: {}
    };

    this.discussions.push(newDiscussion);
    input.value = '';
    this.renderDiscussions();
    
    // Update contributions for real-time heatmap
    this.updateProjectContributions(this.currentProject.id);
  }

  toggleReaction(discussionId, emoji) {
    const discussion = this.discussions.find(d => d.id === discussionId);
    if (!discussion) return;

    if (!discussion.reactions[emoji]) {
      discussion.reactions[emoji] = [];
    }

    const userId = this.currentUser.id;
    const index = discussion.reactions[emoji].indexOf(userId);

    if (index > -1) {
      discussion.reactions[emoji].splice(index, 1);
    } else {
      discussion.reactions[emoji].push(userId);
    }

    this.renderDiscussions();
  }

  togglePin(discussionId) {
    const discussion = this.discussions.find(d => d.id === discussionId);
    if (discussion) {
      discussion.pinned = !discussion.pinned;
      this.renderDiscussions();
    }
  }

  switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(tab + 'Panel').classList.add('active');
  }

  toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('show');
    
    if (dropdown.classList.contains('show')) {
      this.renderNotifications();
    }
  }

  renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = '';

    this.notifications.forEach(notification => {
      const notificationEl = document.createElement('div');
      notificationEl.className = `notification-item ${notification.read ? 'read' : ''}`;
      
      const timeAgo = this.getTimeAgo(notification.createdAt);
      
      notificationEl.innerHTML = `
        <div class="notification-text">${notification.message}</div>
        <div class="notification-time">${timeAgo}</div>
      `;

      notificationEl.addEventListener('click', () => {
        notification.read = true;
        this.updateNotificationBadge();
        this.renderNotifications();
      });

      notificationList.appendChild(notificationEl);
    });
  }

  markAllNotificationsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateNotificationBadge();
    this.renderNotifications();
  }

  updateNotificationBadge() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'block' : 'none';
  }

  logout() {
    this.currentUser = null;
    this.currentScreen = 'login';
    this.render();
  }

  hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('show');
    });
  }

  initDragAndDrop() {
    // This is a simplified drag and drop implementation
    // In a real app, you'd want to use a proper library like SortableJS
    let draggedElement = null;

    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('task-card')) {
        draggedElement = e.target;
        e.target.classList.add('dragging');
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('task-card')) {
        e.target.classList.remove('dragging');
        draggedElement = null;
      }
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      const column = e.target.closest('.kanban-column');
      if (column) {
        column.classList.add('drag-over');
      }
    });

    document.addEventListener('dragleave', (e) => {
      const column = e.target.closest('.kanban-column');
      if (column) {
        column.classList.remove('drag-over');
      }
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      const column = e.target.closest('.kanban-column');
      if (column && draggedElement) {
        const newStatus = column.dataset.status;
        const taskId = parseInt(draggedElement.dataset.taskId);
        
        // Update task status
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = newStatus;
          this.renderKanbanBoard();
        }
        
        column.classList.remove('drag-over');
      }
    });
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  getCurrentTaskId() {
    // This would need to be implemented based on your current task tracking
    return 1; // Placeholder
  }

  // Team Member Management
  showAddMemberModal() {
    document.getElementById('addMemberModal').classList.add('show');
  }

  hideAddMemberModal() {
    document.getElementById('addMemberModal').classList.remove('show');
    document.getElementById('addMemberForm').reset();
  }

  handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      this.showToast('Please upload a valid image file (JPEG, PNG, etc.)', 'error');
      return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.showToast('Image size should be less than 5MB', 'error');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const avatar = document.getElementById('profileAvatar');
      const initials = document.getElementById('avatarInitials');
      
      // Hide initials
      if (initials) initials.style.display = 'none';
      
      // Set the new avatar image
      avatar.style.backgroundImage = `url(${e.target.result})`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.style.backgroundRepeat = 'no-repeat';
      
      // Show success message
      this.showToast('Profile picture updated successfully!', 'success');
      
      // Here you would typically upload to your server
      // this.uploadAvatarToServer(file);
    };
    
    reader.onerror = () => {
      this.showToast('Error reading the file', 'error');
    };
    
    reader.readAsDataURL(file);
  }

  handleAddMember() {
    const email = document.getElementById('memberEmail').value;
    const role = document.getElementById('memberRole').value;

    if (!email) {
      alert('Please enter an email address');
      return;
    }

    // Check if user already exists
    let user = this.users.find(u => u.email === email);
    if (!user) {
      // Create new user
      const name = email.split('@')[0];
      user = {
        id: this.users.length + 1,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        initials: name.substring(0, 2).toUpperCase(),
        role: role
      };
      this.users.push(user);
    }

    // Add to project if not already a member
    if (!this.currentProject.members.includes(user.id)) {
      this.currentProject.members.push(user.id);
      this.renderTeamMembers();
      
      // Add notification
      this.addNotification('member_added', `${user.name} joined ${this.currentProject.title}`);
    }

    this.hideAddMemberModal();
  }

  removeMember(memberId) {
    if (confirm('Are you sure you want to remove this member?')) {
      this.currentProject.members = this.currentProject.members.filter(id => id !== memberId);
      this.renderTeamMembers();
      
      const member = this.users.find(u => u.id === memberId);
      if (member) {
        this.addNotification('member_removed', `${member.name} was removed from ${this.currentProject.title}`);
      }
    }
  }

  // Project Comments
  postProjectComment() {
    const input = document.getElementById('projectCommentInput');
    const content = input.value.trim();

    if (!content) return;

    const newComment = {
      id: this.projectComments.length + 1,
      projectId: this.currentProject.id,
      author: this.currentUser.id,
      content,
      createdAt: new Date()
    };

    this.projectComments.push(newComment);
    input.value = '';
    this.renderProjectComments();
    
    // Update contributions for real-time heatmap
    this.updateProjectContributions(this.currentProject.id);
  }

  // Mention Processing
  processMentions(content) {
    return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
  }

  // Enhanced Notifications
  addNotification(type, message, icon = '📢') {
    const notification = {
      id: this.notifications.length + 1,
      type,
      message,
      icon,
      read: false,
      createdAt: new Date()
    };
    this.notifications.unshift(notification);
    this.updateNotificationBadge();
  }

  renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = '';

    // Show only latest 5 notifications
    const latestNotifications = this.notifications.slice(0, 5);

    latestNotifications.forEach(notification => {
      const notificationEl = document.createElement('div');
      notificationEl.className = `notification-item ${notification.read ? 'read' : ''}`;
      
      const timeAgo = this.getTimeAgo(notification.createdAt);
      
      notificationEl.innerHTML = `
        <div class="notification-icon">${notification.icon}</div>
        <div class="notification-content">
          <div class="notification-text">${notification.message}</div>
          <div class="notification-time">${timeAgo}</div>
        </div>
      `;

      notificationEl.addEventListener('click', () => {
        notification.read = true;
        this.updateNotificationBadge();
        this.renderNotifications();
      });

      notificationList.appendChild(notificationEl);
    });
  }

  // Task View Switching
  switchTaskView(view) {
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Update task views
    document.querySelectorAll('.task-view').forEach(viewEl => {
      viewEl.classList.remove('active');
    });
    document.getElementById(view + 'View').classList.add('active');
  }

  // List View Rendering
  renderTaskListView() {
    const tableBody = document.getElementById('taskTableBody');
    const projectTasks = this.tasks.filter(task => task.projectId === this.currentProject.id);
    
    tableBody.innerHTML = '';

    if (projectTasks.length === 0) {
      tableBody.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No tasks yet</div>
          <div class="empty-state-description">Click "Add Task" to get started</div>
        </div>
      `;
      return;
    }

    projectTasks.forEach(task => {
      const row = this.createTaskTableRow(task);
      tableBody.appendChild(row);
    });
  }

  createTaskTableRow(task) {
    const assignee = this.users.find(u => u.id === task.assignee);
    const dueDate = new Date(task.dueDate).toLocaleDateString();
    const tags = task.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    const dependencies = task.dependencies.length > 0 ? 
      `<span class="dependency">Blocked by ${task.dependencies.length} task(s)</span>` : '';

    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="table-cell">
        <div class="task-title">${task.title}</div>
        ${dependencies}
      </div>
      <div class="table-cell">
        <div class="task-assignee">
          <div class="task-assignee-avatar">${assignee.initials}</div>
          <span>${assignee.name}</span>
        </div>
      </div>
      <div class="table-cell">${dueDate}</div>
      <div class="table-cell">
        <span class="status-badge ${task.status}">${task.status.replace('-', ' ').toUpperCase()}</span>
      </div>
      <div class="table-cell">
        <span class="priority-badge ${task.priority}">${task.priority.toUpperCase()}</span>
      </div>
      <div class="table-cell">
        <div class="task-tags">${tags}</div>
      </div>
      <div class="table-cell">
        <button class="btn btn-sm" onclick="appState.showTaskDetail(${task.id})">View</button>
      </div>
    `;
    return row;
  }

  // Milestones
  renderMilestones() {
    const timelineContainer = document.getElementById('milestonesTimeline');
    const projectMilestones = this.milestones.filter(m => m.projectId === this.currentProject.id);
    
    timelineContainer.innerHTML = '';

    if (projectMilestones.length === 0) {
      timelineContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎯</div>
          <div class="empty-state-title">No milestones created yet</div>
          <div class="empty-state-description">Add your first milestone to track project progress</div>
        </div>
      `;
      return;
    }

    projectMilestones.forEach(milestone => {
      const milestoneEl = this.createMilestoneElement(milestone);
      timelineContainer.appendChild(milestoneEl);
    });
  }

  createMilestoneElement(milestone) {
    const dueDate = new Date(milestone.dueDate);
    const isOverdue = dueDate < new Date() && !milestone.completed;
    const timeAgo = this.getTimeAgo(dueDate);

    const milestoneEl = document.createElement('div');
    milestoneEl.className = `milestone-item ${isOverdue ? 'overdue' : ''}`;
    milestoneEl.innerHTML = `
      <div class="milestone-progress ${milestone.completed ? 'completed' : ''}">
        ${milestone.completed ? '✓' : '○'}
      </div>
      <div class="milestone-info">
        <div class="milestone-name">${milestone.name}</div>
        <div class="milestone-description">${milestone.description}</div>
        <div class="milestone-due-date ${isOverdue ? 'overdue' : ''}">
          Due ${timeAgo}
        </div>
      </div>
    `;
    return milestoneEl;
  }

  showAddMilestoneModal() {
    document.getElementById('addMilestoneModal').classList.add('show');
  }

  hideAddMilestoneModal() {
    document.getElementById('addMilestoneModal').classList.remove('show');
    document.getElementById('addMilestoneForm').reset();
  }

  handleAddMilestone() {
    const form = document.getElementById('addMilestoneForm');
    const formData = new FormData(form);

    const milestoneData = {
      name: formData.get('name'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate')
    };

    if (!milestoneData.name || !milestoneData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newMilestone = {
      id: this.milestones.length + 1,
      projectId: this.currentProject.id,
      ...milestoneData,
      completed: false,
      createdAt: new Date()
    };

    this.milestones.push(newMilestone);
    this.hideAddMilestoneModal();
    this.renderMilestones();
  }

  // Project Notes
  renderProjectNotes() {
    const notesEditor = document.getElementById('notesEditor');
    const projectId = this.currentProject.id;
    
    if (this.projectNotes[projectId]) {
      notesEditor.innerHTML = this.projectNotes[projectId];
    } else {
      notesEditor.innerHTML = '';
    }
  }

  saveProjectNotes() {
    const notesEditor = document.getElementById('notesEditor');
    const content = notesEditor.innerHTML;
    const projectId = this.currentProject.id;
    
    this.projectNotes[projectId] = content;
    
    // Show save confirmation
    const saveBtn = document.getElementById('saveNotesBtn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.backgroundColor = 'var(--accent-color)';
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.backgroundColor = '';
    }, 2000);
  }

  formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('notesEditor').focus();
  }

  // Workload
  renderWorkload() {
    const workloadGrid = document.getElementById('workloadGrid');
    const projectMembers = this.currentProject.members.map(id => this.users.find(u => u.id === id));
    
    workloadGrid.innerHTML = '';

    if (projectMembers.length === 0) {
      workloadGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <div class="empty-state-title">No team members</div>
          <div class="empty-state-description">Add team members to see workload distribution</div>
        </div>
      `;
      return;
    }

    projectMembers.forEach(member => {
      const workloadEl = this.createWorkloadElement(member);
      workloadGrid.appendChild(workloadEl);
    });
  }

  createWorkloadElement(member) {
    const projectTasks = this.tasks.filter(task => 
      task.projectId === this.currentProject.id && task.assignee === member.id
    );
    const taskCount = projectTasks.length;
    const isOverloaded = taskCount > 5; // Threshold for overloaded
    const percentage = Math.min((taskCount / 10) * 100, 100); // Max 10 tasks for 100%

    const workloadEl = document.createElement('div');
    workloadEl.className = `workload-member ${isOverloaded ? 'overloaded' : ''}`;
    workloadEl.innerHTML = `
      <div class="workload-avatar">${member.initials}</div>
      <div class="workload-name">${member.name}</div>
      <div class="workload-stats">
        <div class="workload-count">${taskCount}</div>
        <div class="workload-label">tasks</div>
      </div>
      <div class="workload-bar">
        <div class="workload-fill ${isOverloaded ? 'overloaded' : ''}" style="width: ${percentage}%"></div>
      </div>
    `;
    return workloadEl;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.appState = new AppState();
});
