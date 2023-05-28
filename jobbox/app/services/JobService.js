// app/services/JobService.js

export async function editJob(jobId, updatedJob) {
    const response = await fetch(`http://localhost:5001/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedJob),
    });
  
    if (!response.ok) {
      throw new Error('Failed to edit job');
    }
  
    const data = await response.json();
  
    return data;
  }

 // app/services/JobService.js

export async function deleteJob(jobId) {
    const response = await fetch(`http://localhost:5001/jobs/${jobId}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete job');
    }
  }
  
  