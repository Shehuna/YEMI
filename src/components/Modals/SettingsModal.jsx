import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from './Modal';
import './SettingsModal.css';
import AddUser from '../Users/AddUser';
import UserManagement from '../Users/UserManagement';
import WorkspaceManagement from '../Workspaces/WorkspaceManagement';

const SettingsModal = ({ isOpen, onClose, onLogout }) => { 
    const [activeTab, setActiveTab] = useState(null);
    const [projects, setProjects] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [users, setUsers] = useState([]);
    const [databases, setDatabases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');

    const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
    const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false);

    const [selectedProject, setSelectedProject] = useState('');
    const [selectedJob, setSelectedJob] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(1);
    const [newProjectName, setNewProjectName] = useState('');
    const [newJobName, setNewJobName] = useState('');

    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
    const [isAddJobOpen, setIsAddJobOpen] = useState(false);
    const [isEditJobOpen, setIsEditJobOpen] = useState(false);
    const [newJobStatus, setNewJobStatus] = useState(1);
    const [newProjectStatus, setNewProjectStatus] = useState(1);
    const navigate = useNavigate();
   /*  const [formData, setFormData] =useState({
        //Role: 'Admin' 
    }) */
    // const [newUser, setNewUser] = useState({
    //     Fname: '',
    //     Lname: '',
    //     UserName: '',
    //     Email: '',
    //     Password: '',
    //     Role: 'Admin'
    //     });

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
        }
    }, [isOpen]);
    
    const [selectedWorkspace, setSelectedWorkspace] = useState('');
    const [workspaces, setWorkspaces] = useState([]);
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [newJobDescription, setNewJobDescription] = useState('');


// Fetch workspaces when the modal opens
useEffect(() => {
if (isOpen) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Workspace/GetWorkspaces`)
    .then(response => response.json())
    .then(data => {
        if (data.message === 'workspaces retrieved successfully') {
        setWorkspaces(data.workspaces);
        // Set default workspace if available
        if (data.workspaces.length > 0) {
            setSelectedWorkspace(data.workspaces[0].id);
        }
        }
    })
    .catch(error => console.error('Error fetching workspaces:', error));
}
  }, [isOpen]);


useEffect(() => {
    if (isEditProjectOpen && selectedProject) {
        const project = projects.find(p => p.id === parseInt(selectedProject));
        if (project) {
            setNewProjectName(project.name || '');
            setNewProjectStatus(project.status || 1);
            setNewProjectDescription(project.description || '');
        }
    } else if (!isEditProjectOpen) {
        setNewProjectName('');
        setNewProjectStatus(1);
        setNewProjectDescription('');
    }
}, [isEditProjectOpen, selectedProject, projects]);

useEffect(() => {
    if (isEditJobOpen && selectedJob) {
        const job = jobs.find(j => j.id === parseInt(selectedJob));
        if (job) {
            setNewJobName(job.name || '');
            setNewJobStatus(job.status || 1);
            setSelectedProject(job.projectId ? job.projectId.toString() : '');
            setNewJobDescription(job.description || '');
        }
    } else if (!isEditJobOpen) {
        setNewJobName(''); 
        setNewJobStatus(1);
        setSelectedProject(''); 
        setNewJobDescription('');
    }
}, [isEditJobOpen, selectedJob, jobs]);

    const handleLogout = () => {
        onLogout();
    };

    const fetchInitialData = async () => {
        setLoading(true);
        setError(null);

        try {
          const projectsUrl = `${process.env.REACT_APP_API_BASE_URL}/api/Project/GetProjects`;
          const jobsUrl = `${process.env.REACT_APP_API_BASE_URL}/api/Job/GetJobs`;


            console.log('Fetching from:', projectsUrl, jobsUrl);

            const [projectsRes, jobsRes] = await Promise.all([
                fetch(projectsUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(jobsUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ]);

            if (!projectsRes.ok) throw new Error(`Projects API error: ${projectsRes.status}`);
            if (!jobsRes.ok) throw new Error(`Jobs API error: ${jobsRes.status}`);

            var projectsData = await projectsRes.json();
            var jobsData = await jobsRes.json();

            projectsData = projectsData.projects || [];
            jobsData = jobsData.jobs || [];

            console.log('Received data:', { projectsData, jobsData });

            setProjects(projectsData);
            setJobs(jobsData);
        } catch (err) {
            setError(err.message);
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditWorkspace = async () => {
    if (!selectedWorkspace || !newWorkspaceName) {
        alert('Please select a workspace and enter a new name.');
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/UpdateWorkspace`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedWorkspace, name: newWorkspaceName }),
        });

        if (!response.ok) throw new Error('Failed to update workspace');

        fetchInitialData();
        setNewWorkspaceName('');
        setSelectedWorkspace('');
        setIsEditWorkspaceOpen(false);
    } catch (err) {
        setError(err.message);
        console.error('Error updating workspace:', err);
    }
};

    const handleAddWorkspace = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/AddWorkspace`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newWorkspaceName }),
        });

        if (!response.ok) throw new Error('Failed to add workspace');

        fetchInitialData(); 
        setNewWorkspaceName('');
        setIsAddWorkspaceOpen(false);
    } catch (err) {
        setError(err.message);
        console.error('Error adding workspace:', err);
    }
};

    const handleAddProject = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Project/AddProject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newProjectName, description: newProjectDescription, workspaceId: parseInt(selectedWorkspace) })
            });

            if (!response.ok) throw new Error('Failed to add project');

            fetchInitialData();
            setNewProjectName('');
            setNewProjectDescription('');
            setSelectedWorkspace('');
            setIsAddProjectOpen(false);
        } catch (err) {
            setError(err.message);
            console.error('Error adding project:', err);
        }
    };

    const handleEditProject = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Project/UpdateProject/${selectedProject}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedProject,
                name: newProjectName,
                description: newProjectDescription,
                status: newProjectStatus
            })
        });

        if (!response.ok) throw new Error('Failed to update project');

        fetchInitialData();
        setNewProjectName('');
        setNewProjectStatus(1);
        setNewProjectDescription('');
        setIsEditProjectOpen(false);
        } catch (err) {
            setError(err.message);
            console.error('Error updating project:', err);
        }
    };

    const handleDeleteProject = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Project/DeleteProject/${selectedProject}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete project');

            fetchInitialData();
            setSelectedProject('');
        } catch (err) {
            setError(err.message);
            console.error('Error deleting project:', err);
        }
    };

    const handleAddJob = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Job/AddJob`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newJobName,
                    description: newJobDescription,
                    projectId: selectedProject
                })
            });

            if (!response.ok) throw new Error('Failed to add job');

            fetchInitialData();
            setNewJobName('');
            setNewJobDescription('');
            setIsAddJobOpen(false);
        } catch (err) {
            setError(err.message);
            console.error('Error adding job:', err);
        }
    };

    const handleEditJob = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Job/UpdateJob/${selectedJob}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedJob,
                    name: newJobName,
                    description: newJobDescription,
                    status: newJobStatus
                })
            });

            if (!response.ok) throw new Error('Failed to update job');

            fetchInitialData();
            setNewJobName('');
            setNewJobStatus(1);
            setNewJobDescription('');
            setIsEditJobOpen(false);
        } catch (err) {
            setError(err.message);
            console.error('Error updating job:', err);
        }
    };
    const handleDeleteJob = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/DeleteJob/${selectedJob}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete job');

            fetchInitialData();
            setSelectedJob('');
        } catch (err) {
            setError(err.message);
            console.error('Error deleting job:', err);
        }
    };

    const handleAddUser = () => {
        alert(`User ${selectedUser} added to database ${selectedDatabase}`);
        setSelectedUser('');
        setSelectedDatabase('');
    };

    const handleRemoveUser = () => {
        alert(`User ${selectedUser} removed from database ${selectedDatabase}`);
        setSelectedUser('');
        setSelectedDatabase('');
    };

    const handleGrantPermission = () => {
        alert(`Permission granted to user ${selectedUser} for job ${selectedJob}`);
        setSelectedUser('');
        setSelectedProject('');
        setSelectedJob('');
    };

    const handleDenyPermission = () => {
        alert(`Permission denied to user ${selectedUser} for job ${selectedJob}`);
        setSelectedUser('');
        setSelectedProject('');
        setSelectedJob('');
    };

    const handleUpdateStatus = () => {
        alert(`Job ${selectedJob} status updated to ${selectedStatus}`);
        setSelectedProject('');
        setSelectedJob('');
        setSelectedStatus(1);
    };

    const renderProjectManagement = () => (
    <div className="settings-content">
        <div className="settings-action-buttons">
            <button className="btn-primary" onClick={() => setIsAddProjectOpen(true)}>
                Add Project
            </button>
            <button className="btn-secondary" onClick={() => setIsEditProjectOpen(true)} disabled={!selectedProject}>
                Edit Project
            </button>
            {/* <button className="btn-danger" onClick={handleDeleteProject} disabled={!selectedProject}>
                Delete Project
            </button> */}
        </div>

        <div className="settings-lookup-list">
            <h4>Project Lookups</h4>
            <select
                size="5"
                className="lookup-select"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
            >
                {projects.map(project => (
                    <option 
                        key={project.id} 
                        value={project.id}
                        className={project.status !== 1 ? 'inactive-project' : ''}
                    >
                        {project.name} {project.status !== 1 ? '(Inactive)' : ''}
                    </option>
                ))}
            </select>
        </div>
    </div>
  );

    
    const renderJobManagement = () => (
        <div className="settings-content">
            <div className="settings-action-buttons">
                <button className="btn-primary" onClick={() => setIsAddJobOpen(true)}>
                    Add Job
                </button>
                <button className="btn-secondary" onClick={() => setIsEditJobOpen(true)} disabled={!selectedJob}>
                    Edit Job
                </button>
                {/* <button className="btn-danger" onClick={handleDeleteJob} disabled={!selectedJob}>
                    Delete Job
                </button> */}
            </div>

            <div className="settings-lookup-list">
                <h4>Job Lookups</h4>
                <select
                    size="5"
                    className="lookup-select"
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                >
                    {jobs
                        .filter(job => {
                            const project = projects.find(p => p.id === job.projectId);
                            return project && project.status === 1; // Only include jobs from active projects
                        })
                        .map(job => {
                            const projectName = projects.find(p => p.id === job.projectId)?.name || 'Unknown';
                            const isInactive = job.status !== 1;
                            return (
                                <option 
                                    key={job.id} 
                                    value={job.id}
                                    className={isInactive ? 'inactive-job' : ''}
                                >
                                    {job.name} (Project: {projectName}) {isInactive ? '(Inactive)' : ''}
                                </option>
                            );
                        })}
                </select>
            </div>
        </div>
    );

/* const renderUserManagement = () => (
  <div className="settings-content">
    <div className="settings-form user-form-grid">
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="Fname"
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
      </div>

      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="Lname"
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />
      </div>

      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          name="UserName"
          onChange={handleInputChange}
          placeholder="Username"
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="Email"
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="Password"
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
      </div>

      <div className="form-group">
        <label>Profile Picture:</label>
        <input
          type="file"
          name="ProfilePicture"
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
      </div>
    </div>
    
    <div className="settings-action-buttons">
      <button 
        className="btn-primary" 
        onClick={handleCreateUser}
        disabled={!Object.values(formData).every(field => field !== '')}>
        Create User
      </button>
    </div>
  </div>
); */

    const renderWorkspaceSettings = () => (
    <div className="settings-content">
        <div className="settings-action-buttons">
            <button className="btn-primary" onClick={() => setIsAddWorkspaceOpen(true)}>
                Add Workspace
            </button>
            <button className="btn-secondary" onClick={() => setIsEditWorkspaceOpen(true)} disabled={!selectedWorkspace}>
                Edit Workspace
            </button>
        </div>
        <div className="settings-lookup-list">
            <h4>Workspace Lookups</h4>
            <select
                size="5"
                className="lookup-select"
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
            >
                <option value="">Select a Workspace</option>
                {workspaces.map(workspace => (
                    <option key={workspace.id} value={workspace.id}>
                        {workspace.name}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

const renderJobPermissions = () => (
        <div className="settings-content">
            <div className="settings-form">
                <div className="form-group">
                    <label>Username:</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Project:</label>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Job:</label>
                    <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        disabled={!selectedProject}
                    >
                        <option value="">Select Job</option>
                        {jobs.filter(job => job.projectId === parseInt(selectedProject)).map(job => (
                            <option key={job.id} value={job.id}>{job.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="settings-action-buttons">
                <button className="btn-primary" onClick={handleGrantPermission} disabled={!selectedUser || !selectedProject || !selectedJob}>
                    Grant
                </button>
                <button className="btn-danger" onClick={handleDenyPermission} disabled={!selectedUser || !selectedProject || !selectedJob}>
                    Deny
                </button>
            </div>
        </div>
    );

    const renderJobStatusUpdate = () => (
        <div className="settings-content">
            <div className="settings-form">
                <div className="form-group">
                    <label>Project:</label>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Job:</label>
                    <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        disabled={!selectedProject}
                    >
                        <option value="">Select Job</option>
                        {jobs.filter(job => job.projectId === parseInt(selectedProject)).map(job => (
                            <option key={job.id} value={job.id}>{job.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="settings-action-buttons">
                <button className="btn-primary" onClick={handleUpdateStatus} disabled={!selectedProject || !selectedJob}>
                    Update
                </button>
            </div>
        </div>
    );

    const renderMainMenu = () => (
        <div className="settings-options-container">
            {[
                {
                    id: 'projectManagement',
                    icon: 'fa-project-diagram',
                    text: 'Project Management'
                },
                {
                    id: 'jobManagement',
                    icon: 'fa-tasks',
                    text: 'Job Management'
                },
                {
                    id: 'userManagement',
                    icon: 'fa-user-plus',
                    text: 'User Management'
                },
                {
                    id: 'jobPermissions',
                    icon: 'fa-user-shield',
                    text: 'Job Permissions'
                },
                {
                    id: 'jobStatus',
                    icon: 'fa-sync-alt',
                    text: 'Job Status Update'
                },
                {
                    id: 'workspaceSettings',
                    icon: 'fa-building', 
                    text: 'Workspace Settings'
                }
            ].map((option) => (
                <button
                    key={option.id}
                    className="settings-option"
                    onClick={() => setActiveTab(option.id)}
                    aria-label={`Open ${option.text} settings`}
                >
                    <div className="option-icon">
                        <i className={`fas ${option.icon}`} />
                    </div>
                    <div className="option-text">
                        <h4>{option.text}</h4>
                        <p>{option.description}</p>
                    </div>
                    <i className="fas fa-chevron-right option-arrow" />
                </button>
            ))}

            <button
                className="settings-option logout-option"
                onClick={handleLogout}
                aria-label="Logout"
            >
                <div className="option-icon">
                    <i className="fas fa-sign-out-alt" />
                </div>
                <div className="option-text">
                    <h4>Logout</h4>
                </div>
                <i className="fas fa-chevron-right option-arrow" />
            </button>
        </div>
    );

    const renderContent = () => {
        if (!activeTab) return renderMainMenu();

        switch (activeTab) {
            case 'projectManagement':
                return renderProjectManagement();
            case 'jobManagement':
                return renderJobManagement();
            case 'userManagement':
                return <UserManagement />;
            case 'jobPermissions':
                return renderJobPermissions();
            case 'jobStatus':
                return renderJobStatusUpdate();
            case 'workspaceSettings':
                return <WorkspaceManagement />;
            default:
                return <div>Unknown settings option</div>;
        }
    };

    const getTitle = () => {
        if (!activeTab) return 'Settings';

        switch (activeTab) {
            case 'projectManagement':
                return 'Project Management';
            case 'jobManagement':
                return 'Job Management';
            case 'userManagement':
                return 'User Management';
            case 'jobPermissions':
                return 'Job Permissions';
            case 'jobStatus':
                return 'Job Status Update';
            default:
                return 'Settings';
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={
                    <div className="settings-modal-title">
                        <i className="fas fa-sliders-h settings-icon" />
                        <span>{getTitle()}</span>
                        {activeTab && (
                            <button
                                className="back-button"
                                onClick={() => setActiveTab(null)}
                            >
                                <i className="fas fa-arrow-left" /> Back
                            </button>
                        )}
                    </div>
                }
                className="settings-modal" >
                {loading ? (
                    <div className="loading-message">Loading data...</div>
                ) : error ? (
                    <div className="error-message">
                        Error: {error}
                        <button onClick={fetchInitialData}>Retry</button>
                    </div>
                ) : (
                    renderContent()
                )}

                <div className="modal-footer">
                    <button className="btn-close" onClick={onClose}>
                        Close
                    </button>
                </div>
            </Modal>
            
            <Modal
                isOpen={isAddProjectOpen}
                onClose={() => {
                    setNewProjectName('');
                    setNewProjectDescription('');
                    setSelectedWorkspace('');
                    setIsAddProjectOpen(false);
                }}
                title="Add Project"
            >
                <div className="settings-form">
                    <div className="form-group">
                        <label>Workspace:</label>
                        <select
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            disabled={workspaces.length === 0}
                        >
                            {workspaces.length === 0 ? (
                                <option value="">No workspaces available</option>
                            ) : (
                                workspaces.map(workspace => (
                                    <option key={workspace.id} value={workspace.id}>
                                        {workspace.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Project Name:</label>
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Enter project name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Project Description:</label>
                        <textarea
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            placeholder="Enter project description"
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn-primary"
                            onClick={handleAddProject}
                            disabled={!newProjectName || !selectedWorkspace}
                        >
                            OK
                        </button>
                        <button
                            className="btn-close"
                            onClick={() => {
                                setNewProjectName('');
                                setNewProjectDescription('');
                                setSelectedWorkspace('');
                                setIsAddProjectOpen(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isEditProjectOpen}
                onClose={() => {
                    setNewProjectName('');
                    setNewProjectDescription('');
                    setNewProjectStatus(1);
                    setIsEditProjectOpen(false);
                }}
                title="Edit Project"
            >
                <div className="settings-form">
                    <div className="form-group">
                        <label>Project Name:</label>
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Enter project name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            value={newProjectStatus}
                            onChange={(e) => setNewProjectStatus(e.target.value)}
                        >
                            <option value="1">Active</option>
                            <option value="2">Inactive</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Project Description:</label>
                        <textarea
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            placeholder="Enter project description"
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn-primary" onClick={handleEditProject} disabled={!newProjectName}>
                            OK
                        </button>
                        <button className="btn-close" onClick={() => {
                            setNewProjectName('');
                            setNewProjectDescription('');
                            setNewProjectStatus(1);
                            setIsEditProjectOpen(false);
                        }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

    {/* <Modal isOpen={isAddWorkspaceOpen} onClose={() => setIsAddWorkspaceOpen(false)} title="Add Workspace">
        <div className="settings-form">
            <div className="form-group">
                <label>Workspace Name:</label>
                <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Enter workspace name"
                    required
                />
            </div>
            <div className="modal-footer">
                <button className="btn-primary" onClick={handleAddWorkspace} disabled={!newWorkspaceName}>
                    Add
                </button>
                <button className="btn-close" onClick={() => setIsAddWorkspaceOpen(false)}>
                    Cancel
                </button>
            </div>
        </div>
    </Modal> */}
           
            <Modal
                isOpen={isAddJobOpen}
                onClose={() => {
                    setNewJobName('');
                    setNewJobDescription('');
                    setSelectedProject('');
                    setIsAddJobOpen(false);
                }}
                title="Add Job"
            >
                <div className="settings-form">
                    <div className="form-group">
                        <label>Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <option value="">Select Project</option>
                            {projects
                                .filter(project => project.status === 1) // Only show active projects
                                .map(project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Job Name:</label>
                        <input
                            type="text"
                            value={newJobName}
                            onChange={(e) => setNewJobName(e.target.value)}
                            placeholder="Enter job name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Description:</label>
                        <textarea
                            value={newJobDescription}
                            onChange={(e) => setNewJobDescription(e.target.value)}
                            placeholder="Enter job description"
                        />
                    </div>

                    <div className="modal-footer">
                        <button className="btn-primary" onClick={handleAddJob} disabled={!selectedProject || !newJobName}>
                            OK
                        </button>
                        <button className="btn-close" onClick={() => {
                            setNewJobName('');
                            setNewJobDescription('');
                            setSelectedProject('');
                            setIsAddJobOpen(false);
                        }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
            isOpen={isAddJobOpen}
            onClose={() => {
                setNewJobName('');
                setNewJobDescription('');
                setSelectedProject('');
                setIsAddJobOpen(false);
            }}
            title="Add Job"
        >
            <div className="settings-form">
                <div className="form-group">
                    <label>Project:</label>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="">Select Project</option>
                        {projects
                            .filter(project => project.status === 1)
                            .map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Job Name:</label>
                    <input
                        type="text"
                        value={newJobName}
                        onChange={(e) => setNewJobName(e.target.value)}
                        placeholder="Enter job name"
                    />
                </div>

                <div className="form-group">
                    <label>Job Description:</label>
                    <textarea
                        value={newJobDescription}
                        onChange={(e) => setNewJobDescription(e.target.value)}
                        placeholder="Enter job description"
                    />
                </div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={handleAddJob} disabled={!selectedProject || !newJobName}>
                        OK
                    </button>
                    <button className="btn-close" onClick={() => {
                        setNewJobName('');
                        setNewJobDescription('');
                        setSelectedProject('');
                        setIsAddJobOpen(false);
                    }}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>

        <Modal
            isOpen={isEditJobOpen}
            onClose={() => {
                setNewJobName('');
                setNewJobDescription('');
                setNewJobStatus(1);
                setSelectedProject('');
                setIsEditJobOpen(false);
            }}
            title="Edit Job"
        >
            <div className="settings-form">
                <div className="form-group">
                    <label>Project:</label>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        disabled
                    >
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Job Name:</label>
                    <input
                        type="text"
                        value={newJobName}
                        onChange={(e) => setNewJobName(e.target.value)}
                        placeholder="Enter job name"
                    />
                </div>
                <div className="form-group">
                    <label>Job Description:</label>
                    <textarea
                        value={newJobDescription}
                        onChange={(e) => setNewJobDescription(e.target.value)}
                        placeholder="Enter job description"
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select
                        value={newJobStatus}
                        onChange={(e) => setNewJobStatus(e.target.value)}
                    >
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                    </select>
                </div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={handleEditJob} disabled={!newJobName}>
                        OK
                    </button>
                    <button className="btn-close" onClick={() => {
                        setNewJobName('');
                        setNewJobDescription('');
                        setNewJobStatus(1);
                        setSelectedProject('');
                        setIsEditJobOpen(false);
                    }}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
        </>
    );
};

SettingsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired, 
};

export default SettingsModal;