// @flow

import type { GetSectorAction } from '_store/sectores/flowtypes';
import type { Reducer } from '_store/flowtypes';

export type ClickCeldaAction = PlainAction<
  'celdas / click celda',
  {
    idCelda: IdType,
    tipo: ActiveCeldasTypeType,
  },
>;

export type SetCambioAction = PlainAction<
  'celdas / set cambio',
  {
    idCelda: IdType,
    posicion: PosicionesType,
  },
>;

export type SetCambioManualAction = PlainAction<
  'celdas / set cambio manual',
  {
    idCelda: IdType,
    manual: boolean,
  },
>;

export type CeldasAction =
  | GetSectorAction
  | SetCambioAction
  | SetCambioManualAction;

export type CeldasState = {
  [idCelda: IdType]: CeldaType,
};

export type CeldasReducer = Reducer<CeldasState, CeldasAction>;
