export async function editJob(id, data) {
  const token = localStorage.getItem('token');  // assuming you are storing token in local storage
  const response = await fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data)
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function deleteJob(id) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': 'Bearer ' + token
      }
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
