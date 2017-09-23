import checkPropTypes from 'check-prop-types';
import fs from 'fs';
import shapes from '_components/shapes';

describe('Sectores data.json file', () => {
  it('should not produce messages', () => {
    const file = fs.readFileSync('data/sectores/firebase/data.json');
    const data = JSON.parse(file);
    expect(checkPropTypes(shapes, data, 'prop', 'data.json')).toBeUndefined();
  });
});
