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

export type GetSectorAction = AsyncAction &
  (
    | {
        type: 'sectores / get sector',
        payload: {
          idSector: IdType,
        },
      }
    | {
        type: 'sectores / get sector',
        payload: SectorType,
        stage: stageReplyReceived,
      });

export type ListSectoresAction = AsyncAction &
  (
    | {
        type: 'sectores / list sectores',
        payload: void,
      }
    | {
        type: 'sectores / list sectores',
        payload: {
          list: SectorListEntry[],
        },
        stage: stageReplyReceived,
      });

export type AddStatusAdminAction = {
  type: 'sectores / add status admin',
  payload: AdminStatusItem,
};

export type ClearStatusAdminAction = {
  type: 'sectores / clear status admin',
};

export type DeleteSectoresAction = AsyncAction & {
  type: 'sectores / delete sector',
  payload: {
    idSectores: IdType[],
  },
};

export type AddSectorAction = AsyncAction &
  (
    | {
        type: 'sectores / add sector',
        payload: SectorType,
      }
    | {
        type: 'sectores / add sector',
        payload: SectorType,
        stage: stageReplyReceived,
      });

export type SectoresAction =
  | AddSectorAction
  | DeleteSectoresAction
  | ClearStatusAdminAction
  | AddStatusAdminAction
  | ListSectoresAction
  | GetSectorAction;

export type AdminStatusReducer = Reducer<AdminStatusState,
  AddStatusAdminAction | ClearStatusAdminAction>;
export type SectoresListReducer = Reducer<ListState, ListSectoresAction>;
export type SectoresHashReducer = Reducer<HashState, GetSectorAction>;
