import api from "../config/api";

export const getProducts = async (page, limit) => {
  
  const response = await api.get("/products", {
    params: {page, limit}
  });

  return response.data;

};