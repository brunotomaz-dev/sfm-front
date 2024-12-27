import api from "./axiosConfig";

export const getIndicator = async (indicator: string, data: string | string[]) => {
  // Define os parâmetros caso a data possua 2 valores
  const params = Array.isArray(data)
    ? { data_registro__gt: data[0], data_registro__lt: data[1] }
    : { data_registro: data };
  
  try {
    const response = await api.get(`api/${indicator}/`, {params: params});
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar dados de ${indicator}`, error)
    throw error;
  }
};
