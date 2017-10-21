// @flow

import type { GetSectorAction } from '_store/sectores/flowtypes';
import type { Reducer } from '_store/flowtypes';

export type ClickCeldaAction = ActionCreator<'celdas / click celda',
  {
    idCelda: IdType,
    tipo: ActiveCeldasTypeType,
  }>;

export type SetCambioAction = ActionCreator<'celdas /  set cambio',
  {
    idCelda: IdType,
    posicion: PosicionesType,
  }>;

export type SetCambioManualAction = ActionCreator<'celdas /  set cambio',
  {
    idCelda: IdType,
    manual: boolean,
  }>;

export type CeldasAction = GetSectorAction | SetCambioAction | SetCambioManualAction;

export type CeldasState = {
  [idCelda: IdType]: CeldaType,
};

export type CeldasReducer = Reducer<CeldasState, CeldasAction>;
