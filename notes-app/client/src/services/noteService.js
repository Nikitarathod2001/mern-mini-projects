import api from "./api";

export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};