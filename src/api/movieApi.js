import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Change this to match your backend URL
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('Received response:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const movieApi = {
  getMovies: async (page = 1, pageSize = 10) => {
    try {
      const response = await apiClient.get('/movies', {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  getMovie: async (id) => {
    try {
      const response = await apiClient.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw error;
    }
  },

  createMovie: async (movieData) => {
    try {
      const response = await apiClient.post('/movies', movieData);
      return response.data;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  },

  addComment: async (movieId, commentData) => {
    try {
      const response = await apiClient.post(
        `/movies/${movieId}/comments`,
        commentData
      );
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
};