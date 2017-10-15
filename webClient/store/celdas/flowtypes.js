// @flow

import type { GetSectorAction } from '_store/sectores/flowtypes';
import type { Reducer } from '_store/flowtypes';

export type ClickCeldaAction = {
  type: 'celdas / click celda',
  payload: {
    idCelda: IdType,
    tipo: ActiveCeldasTypeType,
  },
};

export type SetCambioAction = {
  type: 'celdas /  set cambio',
  payload: {
    idCelda: IdType,
    posicion: PosicionesType,
  },
};

export type SetCambioManualAction = {
  type: 'celdas /  set cambio',
  payload: {
    idCelda: IdType,
    manual: boolean,
  },
};
export type CeldasAction = GetSectorAction | SetCambioAction | SetCambioManualAction;

export type CeldasState = {
  [idCelda: IdType]: CeldaType,
};

export type CeldasReducer = Reducer<CeldasState, CeldasAction>;
