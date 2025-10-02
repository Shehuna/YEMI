import React, { useEffect, useState } from 'react'
import Modal from '../Modals/Modal';
import toast from 'react-hot-toast';

const WorkspaceManagement = () => {

    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
    const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState('');
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_BASE_URL

      useEffect(() => {
            fetchWorkspaces();
        }, []);

        useEffect(() => {
                if (isEditWorkspaceOpen && selectedWorkspace) {
                    const workspace = workspaces.find(w => w.id === parseInt(selectedWorkspace));
                    if (workspace) {
                        setNewWorkspaceName(workspace.name)
                    }
                } else{
                    setNewWorkspaceName('')
                }
            }, [isEditWorkspaceOpen, selectedWorkspace, workspaces]);
    
    
       const fetchWorkspaces = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/Workspace/GetWorkspace`,{
            method: 'GET'
          });
          
          if (!response.ok) {
            throw new Error('Error fetching users data!');
          }
          
          const data = await response.json();
          setWorkspaces(data.workspaces || []);
        } catch (err) {
          setError(err.message);
          console.error('Error fetching Workspaces:', err);
        } finally {
          setLoading(false);
        }
      };

   
   const handleEditWorkspace = async () => {
    if (!selectedWorkspace || !newWorkspaceName) {
        toast.error('Please select a workspace and enter a new name.')
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/Workspace/${selectedWorkspace}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedWorkspace, name: newWorkspaceName }),
        });

        if (!response.ok) throw new Error('Failed to update workspace');

        fetchWorkspaces();
        setNewWorkspaceName('');
        setSelectedWorkspace('');
        setIsEditWorkspaceOpen(false);
        toast.success('Worksapce is updated successfully')
    } catch (err) {
        setError(err.message);
        toast.error('Error updating workspace')
    }
};

 const handleAddWorkspace = async () => {
    try {
        const response = await fetch(`${API_URL}/api/Workspace`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: newWorkspaceName }),
        
            });

        if (!response.ok) throw new Error('Failed to add workspace');
        
        toast.success('Workspace Created Successfully')
        fetchWorkspaces(); 
        setNewWorkspaceName('');
        setIsAddWorkspaceOpen(false);
    } catch (err) {
        setError(err.message);
        console.error('Error adding workspace:', err);
    }
};
  return (
     
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
         <Modal isOpen={isAddWorkspaceOpen} onClose={() => setIsAddWorkspaceOpen(false)} title="Add Workspace">
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
        </Modal>

        <Modal isOpen={isEditWorkspaceOpen} onClose={() => setIsEditWorkspaceOpen(false)} title="Edit Workspace">
        <div className="settings-form">
            <div className="form-group">
                <label>Workspace Name:</label>
                <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Enter new workspace name"
                    required
                />
            </div>
            <div className="modal-footer">
                <button className="btn-primary" onClick={handleEditWorkspace} disabled={!newWorkspaceName || !selectedWorkspace}>
                    Save
                </button>
                <button className="btn-close" onClick={() => setIsEditWorkspaceOpen(false)}>
                    Cancel
                </button>
            </div>
        </div>
    </Modal>
    </div>

    
  )
}

export default WorkspaceManagement