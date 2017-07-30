declare type IdType = string;

declare type TramoType = {
  dir: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW',
};

declare type EstilosTramo = 'tramo-normal' | 'tramo-muerto';

declare type SectorListEntry = {
  idSector: IdType,
  descrCorta?: string,
  descr?: string,
};

declare type SectorType = SectorListEntry & {
  alto: number,
  ancho: number,
  celdas: Array<IdType>,
};

declare type CeldaBase = {
  tipo: string,
  coords: string,
  descr?: string,
  manual?: boolean,
  enclavamientos?: Array<IdType>,
  senales?: Array<IdType>,
};

declare type CambioType = CeldaBase & {
  tipo: 'cambio',
  punta: TramoType,
  ramas: {
    normal: TramoType,
    desviado: TramoType,
  },
  posicion?: 'normal' | 'desviado',
};

declare type TripleType = CeldaBase & {
  tipo: 'triple',
  punta: TramoType,
  ramas: {
    izq: TramoType,
    centro: TramoType,
    der: TramoType,
  },
  posicion?: 'izq' | 'centro' | 'der',
};

declare type CruceType = CeldaBase & {
  tipo: 'cruce',
  l1: {
    desde: TramoType,
    hacia: TramoType,
    nivel?: number,
  },
  l2: {
    desde: TramoType,
    hacia: TramoType,
    nivel?: number,
  },
};

declare type ParagolpeType = CeldaBase & {
  tipo: 'paragolpe',
  desde: TramoType,
};

declare type LineaType = CeldaBase & {
  tipo: 'linea',
  desde: TramoType,
  hacia: TramoType,
};

declare type CeldaType = LineaType | ParagolpeType | CruceType | TripleType | CambioType;

declare type LuzType = {
  estado: 'libre' | 'precaucion' | 'alto',
};

declare type SenalType = TramoType & {
  izq?: LuzType,
  primaria?: LuzType,
  der?: LuzType,
  manual?: boolean,
};

declare type EnclavamientoType = {
  tipo: 'apareados' | 'senalCambio',
};

declare type ApareadoType = EnclavamientoType & {
  celda: IdType,
};

declare type CambioSenalType = EnclavamientoType & {
  senal: IdType,
};

declare type AdminStatusItem = {
  nivel: 'normal' | 'warn' | 'error',
  entity: string,
  message: string,
};
