import axios from 'axios';

const BASE_URL = 'https://shreyansh1807.bsite.net/api';

export const fetchJobs = async () => {
  const res = await axios.get(`${BASE_URL}/Job`);
  return res.data;
};

export const fetchJobById = async (id) => {
    const res = await axios.get(`${BASE_URL}/Job/${id}`);
    return res.data;
  };  