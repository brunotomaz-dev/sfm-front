// Definindo tipos
type GroupLevel = string[];
type GroupLevels = Record<number, GroupLevel>;

// Aplicando os tipos
export const groupLevels: GroupLevels = {
  1: ['Dev'],
  2: ['Dev', 'Gerentes'],
  3: ['Dev', 'Gerentes', 'Coordenadores'],
  4: ['Dev', 'Gerentes', 'Coordenadores', 'Supervisores'],
  5: ['Dev', 'Gerentes', 'Coordenadores', 'Supervisores', 'Líderes'],
};

export enum IndicatorType {
  PERFORMANCE = 'performance',
  REPAIR = 'reparo',
  EFFICIENCY = 'eficiencia'
}

export enum ColorsSTM {
  RED = "#E30613",
  LIGHT_GREY = "#E3E3E3",
  YELLOW = "#FFDD00",
  GREEN = "#00A13A"
}