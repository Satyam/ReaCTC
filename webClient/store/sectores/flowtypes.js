// @flow
import type { Reducer } from '_store/flowtypes';

// States of sub-stores:
export type AdminStatusState = AdminStatusItem[];
export type ListState = {
  list: SectorListEntry[],
  requested: boolean,
};
export type HashState = {
  [IdType]: SectorType,
};

export type SectoresState = {
  list: ListState,
  hash: HashState,
  adminStatus: AdminStatusState,
};

export type GetSectorAction = AsyncAction<
  'sectores / get sector',
  {
    idSector: IdType,
  },
  {
    idSector: IdType,
    sectores: SectorType[],
    celdas: CeldaType[],
    senales: SenalType[],
    enclavamientos: EnclavamientoType[],
  },
>;

export type ListSectoresAction = AsyncAction<
  'sectores / list sectores',
  void,
  {
    list: SectorListEntry[],
  },
>;
export type AddStatusAdminAction = PlainAction<
  'sectores / add status admin',
  AdminStatusItem,
>;

export type ClearStatusAdminAction = PlainAction<
  'sectores / clear status admin',
  void,
>;

export type DeleteSectoresAction = AsyncAction<
  'sectores / delete sector',
  {
    idSectores: IdType[],
  },
>;

export type AddSectorAction = AsyncAction<'sectores / add sector', SectorType>;

export type SectoresAction =
  | AddSectorAction
  | DeleteSectoresAction
  | ClearStatusAdminAction
  | AddStatusAdminAction
  | ListSectoresAction
  | GetSectorAction;

export type AdminStatusReducer = Reducer<
  AdminStatusState,
  AddStatusAdminAction | ClearStatusAdminAction,
>;
export type SectoresListReducer = Reducer<ListState, ListSectoresAction>;
export type SectoresHashReducer = Reducer<HashState, GetSectorAction>;
