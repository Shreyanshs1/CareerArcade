// src/api/jobApi.js
import axios from 'axios';

const BASE_URL = 'https://localhost:7232/api';

export const fetchJobs = async () => {
  const res = await axios.get(`${BASE_URL}/Job`);
  return res.data;
};

// src/api/jobApi.js
export const fetchJobById = async (id) => {
    const res = await axios.get(`https://localhost:7232/api/Job/${id}`);
    return res.data;
  };  