import axios from 'axios';
import {
  NO_RESPONSE_ERROR,
  REQUEST_SETUP_ERROR,
  SERVER_RESPONSE_ERROR,
} from 'constants/asyncErrors';

// create axios instance
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 20000,
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) =>
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    response.data,
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const normalizedError = {};
    if (error.response) {
      // client received an error response (5xx, 4xx)
      normalizedError.type = SERVER_RESPONSE_ERROR;
      normalizedError.data = error?.response?.data;
    } else if (error.request) {
      normalizedError.type = NO_RESPONSE_ERROR;
      // client never received a response, or request never left
    } else {
      normalizedError.type = REQUEST_SETUP_ERROR;
      // anything else
    }
    return Promise.reject(normalizedError);
  },
);

export async function getUsers(
  limit = 30,
  offset = 0,
  minSalary,
  maxSalary,
  sort,
) {
  const params = {
    limit,
    offset,
  };

  if (!Number.isNaN(minSalary)) {
    params.minSalary = minSalary;
  }

  if (!Number.isNaN(maxSalary)) {
    params.maxSalary = maxSalary;
  }

  if (sort) {
    params.sort = sort;
  }

  return axiosClient.get('/users', {
    params,
  });
}

export async function getUserUploads(userID) {
  return axiosClient.get(`/users/${userID}/upload`);
}

export async function uploadUserCSV(file, onProgressEvent) {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('userID', 'user1');

  return axiosClient.post('/users/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Content-Encoding': 'text/csv',
    },
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      if (onProgressEvent) {
        onProgressEvent(percentCompleted);
      }
    },
  });
}

export async function createUser(user) {
  return axiosClient.post('/users', user);
}

export async function updateUser(user) {
  return axiosClient.patch('/users', user);
}

export async function deleteUser(userID) {
  return axiosClient.delete(`/users/${userID}`);
}
