import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const UpdatePassword = ({userid}) => {

    const [newPass, setNewPass] = useState('')
    const [confirmNewPass, setConfirmNewPass] = useState('')
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_BASE_URL
        
    const handlePasswordChange = async (e) =>{
        e.preventDefault()
        if(newPass === confirmNewPass){
            try {
         const response = await fetch(`${API_URL}/api/UserManagement/ChangePassword/${userid}`, 
            {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userid,
                newPassword: newPass,
            })
          }
        );

        if (!response.ok) {
            throw new Error('Error updating password');
            }

        toast.success("Password changed successfully")
            } catch (error) {
                setError(error.message);
                toast.error(error)
            }  
        }else{
            toast.error('Passwords do not match')
        }
    }
  return (
    <div className="settings-form">
        <div className="form-group">
            <label>New Password:</label>
            <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter New Password"
            />
        </div>
        <div className="form-group">
            <label>Confirm Password:</label>
            <input
                type="password"
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)} 
                placeholder="Confirm Password"
            />
        </div>
        
        <div className="modal-footer">
            <button
                className="btn-primary"
                onClick={handlePasswordChange}
            >
                OK
            </button>
            <button
                className="btn-close"
            >
                Cancel
            </button>
        </div>
    </div>
  )
}

export default UpdatePassword