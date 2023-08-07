import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_UAL;

export async function getLibraries() {
  return await axios.get(`${baseURL}/libs`, {
    params: {},
  });
}

export async function getLibraryDetail(id) {
  return await axios.get(`${baseURL}/lib/${id}`, {
    params: {},
  });
}

export async function downloadLibrary(id) {
  window.open(`${baseURL}/lib/${id}/download`);
}
