export async function editJob(id, data) {
  const token = localStorage.getItem('token');  // assuming you are storing token in local storage
  const response = await fetch(`https://yourapp.herokuapp.com/api/job/${id}`, {
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
  const response = await fetch(`https://yourapp.herokuapp.com/api/job/${id}`, {
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
