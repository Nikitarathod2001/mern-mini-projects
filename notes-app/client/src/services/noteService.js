import api from "./api";

export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};


export const getNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};