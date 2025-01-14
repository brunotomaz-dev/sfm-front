import { iCartCount } from "../interfaces/Carrinhos.interface";
import api from "./axiosConfig";

interface iParams {
  data: string | string[];
  turno?: string;
  maquina_id?: string;
}

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

export const getProduction = async (data: string | string[]) => {
  // Define os parâmetros caso a data possua 2 valores
  const params = Array.isArray(data)
    ? { data_registro__gt: data[0], data_registro__lt: data[1] }
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
  // Define os parâmetros caso a data possua 2 valores
  const params = Array.isArray(data)
    ? { data_registro__gt: data[0], data_registro__lt: data[1] }
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
  // Define os parâmetros caso a data possua 2 valores
  const params = Array.isArray(data)
    ? { data_registro__gt: data[0], data_registro__lt: data[1], ...maquina_id && { maquina_id }, ...turno && { turno } }
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