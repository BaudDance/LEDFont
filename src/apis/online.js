import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_UAL;

export async function getOnline(userId) {
  return await axios.get(`${baseURL}/online/led/${userId}`, {
    params: {},
  });
}
