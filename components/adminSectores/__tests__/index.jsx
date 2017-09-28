import React from 'react';
import enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import AdminSectoresComponent, { Sector } from '../';

enzyme.configure({ adapter: new EnzymeAdapter() });

describe('Sector', () => {
  const sampleSector = {
    idSector: 'sampleSector',
    descr: 'descripción',
    descrCorta: 'descripción corta',
  };
  describe('snapshot testing', () => {
    // it('with no properties', () => {
    //   const wrapper = shallow(<Sector />);
    //   expect(toJson(wrapper)).toMatchSnapshot();
    // });
    it('with sector, checked', () => {
      const wrapper = shallow(<Sector sector={sampleSector} checked onChange={() => {}} />);
      expect(wrapper).toMatchSnapshot();
    });
    it('with sector, not checked', () => {
      const wrapper = shallow(<Sector sector={sampleSector} onChange={() => {}} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('event handling checking', () => {
    it('when unchecked and clicked, it should turn true', () => {
      const onChange = jest.fn();
      const preventDefault = jest.fn();
      const wrapper = mount(
        <Sector
          sector={{
            idSector: 'sampleSector',
            descr: 'descripción',
            descrCorta: 'descripción corta',
          }}
          onChange={onChange}
        />
      );
      wrapper.find('input').simulate('click', { preventDefault });
      expect(onChange.mock.calls).toEqual([['sampleSector', true]]);
      expect(preventDefault.mock.calls).toEqual([]);
    });
    it('when checked and clicked, it should turn false', () => {
      const onChange = jest.fn();
      const preventDefault = jest.fn();
      const wrapper = mount(
        <Sector
          sector={{
            idSector: 'sampleSector',
            descr: 'descripción',
            descrCorta: 'descripción corta',
          }}
          checked
          onChange={onChange}
        />
      );
      wrapper.find('input').simulate('click', { preventDefault });
      expect(onChange.mock.calls).toEqual([['sampleSector', false]]);
      expect(preventDefault.mock.calls).toEqual([]);
    });
  });
});

describe('AdminSectoresComponent', () => {
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
  describe('snapshot testing', () => {
    it('with no properties', () => {
      const wrapper = shallow(<AdminSectoresComponent />);
      expect(wrapper).toMatchSnapshot();
    });
    it('with two sectors', () => {
      const wrapper = shallow(<AdminSectoresComponent sectores={listSectores} status={[]} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
