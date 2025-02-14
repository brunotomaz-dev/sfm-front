import { iCartCount } from "../interfaces/Carrinhos.interface";
import api from "./axiosConfig";

interface iParams {
  data: string | string[];
  turno?: string;
  maquina_id?: string;
}

export const getIndicator = async (indicator: string, data: string | string[], fields?: string[]) => {
  const dateFilter = Array.isArray(data) && data.length > 1 ? { data_registro__gte: data[0], data_registro__lte: data[1] } : { data_registro__gte: data[0] };
  // Define os parâmetros caso a data possua 2 valores
  const params = Array.isArray(data)
    ? { ...dateFilter, ...fields && { fields: fields.join(",") } }
    : { data_registro: data, ...fields && { fields: fields.join(",") } };
  
  try {
    const response = await api.get(`api/${indicator}/`, {params: params});
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar dados de ${indicator}`, error)
    throw error;
  }
};

export const getProduction = async (data: string | string[]) => {
  const dateFilter = Array.isArray(data) && data.length > 1 ? { data_registro__gte: data[0], data_registro__lte: data[1] } : { data_registro__gte: data[0] };
  // Define os parâmetros caso a data possua 2 valores
  const params = Array.isArray(data)
    ? { ...dateFilter }
    : { data_registro: data };

  try {
    const response = await api.get("api/qual_prod/", {params: params});
    return response.data
  } catch (error) {
    console.error("Erro ao buscar dados de produção", error)
    throw error;
  }
};

export const getInfoIHM = async (data: string | string[]) => {
  const dateFilter = Array.isArray(data) && data.length > 1 ? { data_registro__gte: data[0], data_registro__lte: data[1] } : { data_registro__gte: data[0] };
  // Define os parâmetros caso a data possua 2 valores
  const params = Array.isArray(data)
    ? { ...dateFilter }
    : { data_registro: data };

  try {
    const response = await api.get("api/info_ihm/", {params: params});
    return response.data
  } catch (error) {
    console.error("Erro ao buscar dados de máquina", error)
    throw error;
  }
};

export const getMaquinaInfo = async ({data, turno, maquina_id}: iParams) => {
  const dateFilter = Array.isArray(data) && data.length > 1 ? { data_registro__gte: data[0], data_registro__lte: data[1] } : { data_registro__gte: data[0] };
  // Define os parâmetros caso a data possua 2 valores
  const params = Array.isArray(data)
    ? { ...dateFilter, ...maquina_id && { maquina_id }, ...turno && { turno } }
    : { data_registro: data, ...maquina_id && { maquina_id }, ...turno && { turno } };

  try {
    const response = await api.get("api/maquinainfo/", {params: params});  // cSpell: disable-line
    return response.data
  } catch (error) {
    console.error("Erro ao buscar dados de máquina", error)
    throw error;
  }
}

export const getEstoqueAtual = async () => {
  try {
    const response = await api.get("api/caixas_cf/");
    return response.data
  } catch (error) {
    console.error("Erro ao buscar dados de estoque", error)
    throw error;
  }
};

export const getCarrinhosCount = async (data_inicial: string, data_final: string) => {
try {
  const period = `${data_inicial},${data_final}`;
  const response = await api.get("api/cart_count/", {
    params: { period }
  });
  return response.data.results as iCartCount[];
} catch (error) {
  console.error("Erro ao buscar contagem de carrinhos", error);
  throw error;
}
};

export const getHourProduction = async (data: string) => {
  try {
    const response = await api.get("api/maq_info_hour_prod/", {
      params: { data_registro: data }
    });

    // Verifica se a resposta foi bem sucedida e tem dados
    if (response.status === 200 && response.data) {
      return response.data;
    }

    throw new Error("Não há dados para a data selecionada");

  } catch (error: any) {
    // Verifica se é um erro de API com status 500
    if (error.response?.status === 500) {
      throw new Error("Não há dados para a data selecionada");
    }
    
    // Para outros erros, mantém a mensagem original
    console.error("Erro ao buscar produção por hora:", error);
    throw new Error("Erro ao buscar dados de produção");
  }
};