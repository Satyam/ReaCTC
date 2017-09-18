import React from 'react';
import { mount } from 'enzyme';
import jestFetchMock from 'jest-fetch-mock';
import configureStore from 'redux-mock-store';
import reduxThunk from 'redux-thunk';
import promiseMiddleware from '_utils/promiseMiddleware';
import localStorage from '_jest/localStorage';

import HoC, { mapStateToProps, mapDispatchToProps, storeInitializer } from '..';

global.fetch = jestFetchMock;
global.localStorage = localStorage;

const listSectores = [
  {
    idSector: 'constitucion',
    descrCorta: 'Constitución',
    descr: 'Estación Constitución, Ciudad de Buenos Aires, Argentina',
  },
  {
    idSector: 'retiro',
    descrCorta: 'Retiro',
    descr: 'Mentira, apenas una línea',
  },
];

describe('mapStateToProps', () => {
  it('should be a function', () => {
    expect(mapStateToProps).toBeInstanceOf(Function);
  });
  it('with no data', () => {
    const state = {
      sectores: {
        list: {
          list: null,
        },
        adminStatus: null,
      },
    };
    const map = mapStateToProps(state);
    expect(map.sectores).toBeNull();
    expect(map.status).toBeNull();
  });
  it('with arbitrary data', () => {
    const state = {
      sectores: {
        list: {
          list: [1, 2],
        },
        adminStatus: [3, 4],
      },
    };
    const map = mapStateToProps(state);
    expect(map.sectores).toEqual([1, 2]);
    expect(map.status).toEqual([3, 4]);
  });
});
describe('mapDispatchToProps', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('should be a function', () => {
    expect(mapDispatchToProps).toBeInstanceOf(Function);
  });
  it('should return object with expected keys', () => {
    const dispatch = jest.fn();
    const map = mapDispatchToProps(dispatch);
    const keys = Object.keys(map);
    expect(keys).toContain('onDeleteSectores');
    expect(keys).toContain('onUploadSector');
    expect(keys).toContain('onClearStatusAdmin');
    expect(map.onDeleteSectores).toBeInstanceOf(Function);
    expect(map.onUploadSector).toBeInstanceOf(Function);
    expect(map.onClearStatusAdmin).toBeInstanceOf(Function);
  });
  it('mapDispatchToProps - onDeleteSectores', () => {
    const fetchMock = fetch.mockResponse(JSON.stringify({}), { status: 200 });
    const mockStore = configureStore([reduxThunk, promiseMiddleware]);
    const store = mockStore({ sectores: { list: { requested: [4, 5] } } });

    const map = mapDispatchToProps(store.dispatch);
    // This one is async
    return map.onDeleteSectores([1, 2, 3]).then((data) => {
      expect(data).toMatchSnapshot('mapDispatchToProps - onDeleteSectores - returned data');
      expect(fetchMock.mock.calls).toMatchSnapshot(
        'mapDispatchToProps - onDeleteSectores - fetchMock calls'
      );
      expect(store.getActions()).toMatchSnapshot(
        'mapDispatchToProps - onDeleteSectores - store getActions'
      );
    });
  });
  it('mapDispatchToProps - onClearStatusAdmin', () => {
    const fetchMock = fetch.mockResponse(JSON.stringify({}), { status: 200 });
    const mockStore = configureStore([reduxThunk, promiseMiddleware]);
    const store = mockStore({});

    const map = mapDispatchToProps(store.dispatch);
    // This one is synchronous
    const data = map.onClearStatusAdmin();
    expect(data).toMatchSnapshot('mapDispatchToProps - onClearStatusAdmin - returned data');
    expect(fetchMock.mock.calls).toMatchSnapshot(
      'mapDispatchToProps - onClearStatusAdmin - fetchMock calls'
    );
    expect(store.getActions()).toMatchSnapshot(
      'mapDispatchToProps - onClearStatusAdmin - store getActions'
    );
  });
});
describe('storeInitializer', () => {
  it('should be a function', () => {
    expect(storeInitializer).toBeInstanceOf(Function);
  });
  it('should return object with expected keys', () => {
    const fetchMock = fetch.mockResponse(JSON.stringify(listSectores), { status: 200 });
    const mockStore = configureStore([reduxThunk, promiseMiddleware]);
    const store = mockStore({ sectores: { list: { list: [], requested: false } } });

    return storeInitializer(store.dispatch).then((data) => {
      expect(data).toMatchSnapshot('storeInitializer - data');
      expect(fetchMock.mock.calls).toMatchSnapshot('storeInitializer - fetchMock calls');
      expect(store.getActions()).toMatchSnapshot('storeInitializer - store getActions');
    });
  });
});
describe('composition', () => {
  it('regular render', () => {
    const fetchMock = fetch.mockResponse(JSON.stringify(listSectores), { status: 200 });
    const mockStore = configureStore([reduxThunk, promiseMiddleware]);
    const store = mockStore({
      sectores: {
        list: { list: [], requested: false },
        adminStatus: [],
      },
    });
    const wrapper = mount(React.createElement(HoC), { context: { store } });
    expect(wrapper.find('initStore(Connect(AdminSectoresComponent))').exists()).toBeTruthy();
    expect(wrapper.find('Connect(AdminSectoresComponent)').exists()).toBeTruthy();
    expect(wrapper.find('AdminSectoresComponent').exists()).toBeTruthy();
    expect(fetchMock.mock.calls).toMatchSnapshot('composition - fetchMock calls');
    expect(store.getActions()).toMatchSnapshot('composition- store getActions');
  });
});
