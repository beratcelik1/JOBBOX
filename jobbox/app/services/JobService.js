import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobService = {
  async fetchJobs() {
    try {
      // Fetch the token from the async storage
      const token = await AsyncStorage.getItem('token');

      // Decode the token to get the user ID
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      // Fetch the jobs from your server
      const response = await fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // Filter jobs into 'active' and 'archived'
      const activeJobs = data.filter((job) => job.status !== 'in_progress');
      const archivedJobs = data.filter((job) => job.status === 'in_progress');

      // Return the jobs
      return {
        activeJobs,
        archivedJobs,
      };
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  },
};

export default JobService;
