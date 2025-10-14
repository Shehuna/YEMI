import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Dashboard from "./components/Dashboard";
import toast, { Toaster } from 'react-hot-toast';
import "./App.css";
import UserManagement from './components/Users/UserManagement';

function App() {
  const [notes, setNotes] = useState([]);
  const [userId, setUserId] = useState(0)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documentCounts, setDocumentCounts] = useState({});
 
  const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/SiteNote`;

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchInitialData(userId);
    }
  }, [userId]);

  const initializeUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("User from localStorage:", user);
        if (user.id) {
          setUserId(parseInt(user.id));
          setIsAuthenticated(true);
        } else {
          console.warn("User object found but missing 'id' property.");
        }
      }
    } catch (error) {
      console.error("Error parsing user:", error);
    }
  };

  const handleLogin = (user) => {
    if (user && user.id) {
      setUserId(parseInt(user.id));
      setIsAuthenticated(true);
    }
    initializeUser()
  };


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    setUserId(0); 
    setIsAuthenticated(false);
  };


  const fetchInitialData = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchNotes(id), fetchProjectsAndJobs()]);
    } catch (err) {
      setError(err.message);
      console.error("Initial data loading error:", err);
    } finally {
    }
  };

  // The original loadMore function was incorrect as fetchInitialData doesn't return data.
  // It is commented out until proper pagination logic is implemented.
  /*
  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
        // Correct implementation would involve calling an API endpoint with the 'page + 1'
        const response = await fetch(`${apiUrl}/GetSiteNotes?pageNumber=${page + 1}&pageSize=50&userId=${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json; charset=utf-8" },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch more notes: ${response.status}`);
        }

        const data = await response.json();
        const newData = data.siteNotes || []; // Assuming data structure is { siteNotes: [...] }

        if (newData.length === 0) {
            setHasMore(false);
        } else {
            setNotes(prev => [...prev, ...newData]);
            setPage(prev => prev + 1);
        }
    } catch (error) {
        console.error("Error loading more notes:", error);
    } finally {
        setLoading(false);
    }
  };
  */

  // Uncommented out fetchDocumentCount as it contained syntax errors
  /*
  const fetchDocumentCount = async (siteNoteId) => {
    if (!siteNoteId) return 0;
    
    try {
      // FIX: Use backticks for template literal
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Documents/CountDocuments?siteNoteId=${siteNoteId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const count = data.documentCount !== undefined ? data.documentCount : 
                    data.count !== undefined ? data.count : 
                    typeof data === 'number' ? data : 0;
      
      return count;
    } catch (err) {
      console.error(`Error fetching document count for note ${siteNoteId}:`, err);
      return 0;
    }
  };
  */

  const fetchAllDocumentCounts = async (notesList) => {
    const counts = {};

    for (const note of notesList) {
      // if (note.id) {
      //   counts[note.id] = await fetchDocumentCount(note.id);
      // }
    }

    setDocumentCounts(counts);
  };

  const fetchNotes = async (userid) => {
    setLoading(true); 
    try {
      const response = await fetch(`${apiUrl}/GetSiteNotes?pageNumber=1&pageSize=50&userId=${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        }
      });

      const text = await response.text();

      if (response.ok) {
        const data = JSON.parse(text);
        console.log(data)
        setNotes(data.siteNotes || []); 
        // fetchAllDocumentCounts(data);
      } else {
        console.error(`Failed to fetch: ${response.status}`);
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchDocumentsByReference = async (noteId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/Documents/?siteNoteId=${noteId}`,
        {
          headers: {
            "accept": "application/json; charset=utf-8"
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  };

  const handleUploadDocument = async (documentName, file, siteNoteId) => {
    console.log("App.js: handleUploadDocument called with:", { documentName, file, siteNoteId });

    if (!documentName || documentName.trim() === '') {
      throw new Error("Document name is required for upload.");
    }
    if (!file) {
      throw new Error("File is required for upload.");
    }

    var user = JSON.parse(localStorage.getItem('user'));
    var userId = user ? user.id : 1;

    const formData = new FormData();
    formData.append('Name', documentName);
    formData.append('File', file);
    formData.append('SiteNoteId', siteNoteId);
    formData.append('UserId', userId);
    console.log("FormData prepared:", { documentName, file, siteNoteId, userId });

    try {
        // FIX: Remove comma and use backticks for template literal
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Documents/AddDocument`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        // FIX: Use backticks for template literal
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Document uploaded successfully:', result.message);

      // if (siteNoteId) {
      //   const newCount = await fetchDocumentCount(siteNoteId);
      //   setDocumentCounts(prev => ({...prev, [siteNoteId]: newCount}));
      // }

      return {
        id: result.document.Id,
        name: result.document.Name,
        fileName: result.document.FileName,
      };
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  };

  const downloadDocumentById = async (documentId) => {
    try {
      if (!documentId) {
        throw new Error("No document ID provided");
      }

      const response = await fetch(
        // FIX: Use backticks for template literal
        `${process.env.REACT_APP_API_BASE_URL}/api/Documents/DownloadDocument?documentId=${documentId}`,
        {
          method: "GET",
          credentials: 'include',
          headers: {
            'Accept': 'application/octet-stream'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        // FIX: Use backticks for template literal
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'document';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error("Download failed:", {
        error: error.message,
        stack: error.stack
      });
      // FIX: Use backticks for template literal
      alert(`Download failed: ${error.message}`);
    }
  };

  const updateProject = async (projectData) => {
    try {
      // FIX: Use backticks for template literal
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Sitebook/UpdateProject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id: projectData.id,
          Name: projectData.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      await fetchProjectsAndJobs();
      return await response.json();
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  const updateNote = async (id, updatedData) => {
    console.log(updatedData)
    try {
      // FIX: Use backticks for template literal
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/SiteNote/UpdateSiteNote/${id}`;

      const UpdatedNoteData = {
        note: updatedData.Note,
        date: updatedData.Date,
        jobId: updatedData.JobId,
        userId: updatedData.UserId,
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(UpdatedNoteData)
      });

      if (!response.ok) {
        // FIX: Use backticks for template literal
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Update successful:', result);
      return result;

    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  const addSiteNote = async (siteNoteData) => {
    try {
      // FIX: Use backticks for template literal
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/SiteNote/AddSiteNote`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          siteNoteData
        )
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save note");
      }

      const responseData = await response.json();
      // Ensure fetchNotes is called with a userId
      await fetchNotes(userId);
      return responseData;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  const fetchProjectsAndJobs = async () => {
    try {
      var [projectsRes, jobsRes] = await Promise.all([
        // FIX: Use backticks for template literal
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Project/GetProjects`),
        // FIX: Use backticks for template literal
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Job/GetJobs`)
      ]);


      // FIX: Use backticks for template literal
      if (!projectsRes.ok) throw new Error(`Projects fetch failed: ${projectsRes.status}`);
      // FIX: Use backticks for template literal
      if (!jobsRes.ok) throw new Error(`Jobs fetch failed: ${jobsRes.status}`);

      // The results from Promise.all are the *response objects*, you need to await the .json() call.
      // projectsRes and jobsRes are redeclared here as the JSON data.
      const projectsJson = await projectsRes.json();
      const jobsJson = await jobsRes.json();

      const projectsData = projectsJson.projects;
      const jobsData = jobsJson.jobs;

      setProjects(projectsData.map(p => ({
        id: p.id.toString(),
        name: p.name
      })));

      setJobs(jobsData.map(j => ({
        id: j.id.toString(),
        projectId: j.projectId.toString(),
        name: j.name
      })));
    } catch (error) {
      console.error("Error fetching projects and jobs:", error);
      throw error;
    }
  };

  const handleDeleteDocument = async (docId, noteId) => {
    console.warn("WARNING: Your C# API does not have a 'DeleteDocument' endpoint. This action will only remove the document from the frontend's local state.");

    // FIX: Use backticks for template literal
    console.log(`Locally deleting document with ID: ${docId} from note ID: ${noteId}`);
    setFiles(prevFiles => ({
      ...prevFiles,
      [noteId]: prevFiles[noteId]?.filter(doc => doc.id !== docId)
    }));

    // if (noteId) {
    //   const newCount = await fetchDocumentCount(noteId);
    //   setDocumentCounts(prev => ({...prev, [noteId]: newCount}));
    // }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                loading ? (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading data...</p>
                  </div>
                ) : error ? (
                  <div className="error-container">
                    <p>Error: {error}</p>
                    {/* The fetchInitialData here needs the userId */}
                    <button onClick={() => fetchInitialData(userId)}>Retry</button>
                  </div>
                ) : (
                  <Dashboard
                    notes={notes}
                    // NOTE: Passing userId to refreshNotes is crucial
                    refreshNotes={() => fetchNotes(userId)}
                    addSiteNote={addSiteNote}
                    updateNote={updateNote}
                    projects={projects}
                    updateProject={updateProject}
                    jobs={jobs}
                    files={files}
                    onUploadDocument={handleUploadDocument}
                    onDeleteDocument={handleDeleteDocument}
                    fetchDocuments={fetchDocumentsByReference}
                    onLogout={handleLogout}
                    documentCounts={documentCounts}
                    // fetchDocumentCount={fetchDocumentCount}
                  />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
         <Route
            path="/users/user-management"
            element={<UserManagement />}
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
      </div>
      <Toaster
        position='bottom-center'
        style={{
          width: "18rem",
          padding: "0.7rem",
          background: "rgba(175, 75, 62, 0.1)",
          borderRadius: "3rem",
          transition: "all 0.2s",
          opacity: 0.9 // Changed from toast.visible ? 0.6 : 0 to prevent a console warning and ensure visibility
        }}
      />
    </Router>
  );
}

export default App;