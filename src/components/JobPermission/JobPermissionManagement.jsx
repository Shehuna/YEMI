import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const JobPermissionManagement = ({userid}) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedJob, setSelectedJob] = useState('');
    const [users, setUsers] = useState([]);
    const [databases, setDatabases] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(1);
    const [projects, setProjects] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    const API_URL = process.env.REACT_APP_API_BASE_URL
    
   useEffect(() => {
        fetchInitialData();
      }, []);

  const handleGrantPermission = async() => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/api/UserJobAuth/AddUserJob`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser,
                    jobId: selectedJob,
                    userIDScreen: user.id
                })
            })
            if (!response.ok) throw new Error('Failed to update workspace');
            toast.success("Job Granted Successfully")
            setSelectedUser('');
            setSelectedProject('');
            setSelectedJob('');
            setLoading(false)
        } catch (error) {
             setError(error.message);
             toast.error('Error updating workspace')
        }finally{
            setLoading(false)
        }
        
    };

   const handleDenyPermission = () => {
        setLoading(true)
        setSelectedUser('');
        setSelectedProject('');
        setSelectedJob('');
    };

  const fetchInitialData = async () => {
        setLoading(true);
        setError(null);

        try {
          const projectsUrl = `${process.env.REACT_APP_API_BASE_URL}/api/Project/GetProjects`;
          const jobsUrl = `${process.env.REACT_APP_API_BASE_URL}/api/Job/GetJobs`;
          const usersURL = `${process.env.REACT_APP_API_BASE_URL}/api/UserManagement/GetUsers`;

            console.log('Fetching from:', projectsUrl, jobsUrl);

            const [projectsRes, jobsRes, userRes] = await Promise.all([
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
                }),
                fetch(usersURL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ]);

            if (!projectsRes.ok) throw new Error(`Projects API error: ${projectsRes.status}`);
            if (!jobsRes.ok) throw new Error(`Jobs API error: ${jobsRes.status}`);
            if (!userRes.ok) throw new Error(`Jobs API error: ${userRes.status}`);

            var projectsData = await projectsRes.json();
            var jobsData = await jobsRes.json();
            var userData = await userRes.json()

            projectsData = projectsData.projects || [];
            jobsData = jobsData.jobs || [];
            userData = userData.users || []

            console.log('Received data:', { projectsData, jobsData });

            setProjects(projectsData);
            setJobs(jobsData);
            setUsers(userData)
        } catch (err) {
            setError(err.message);
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }

  
  return (
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
                            <option key={user.id} value={user.id}>{user.userName}</option>
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
  )
}

export default JobPermissionManagement