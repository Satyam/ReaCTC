const { schema } = require('normalizr');

const senal = new schema.Entity(
  'senales',
  {},
  { idAttribute: (value, parent) => `${parent.idSector}:${parent.coords}:${value.dir}` }
);
const enclavamiento = new schema.Entity(
  'enclavamientos',
  {},
  {
    idAttribute: (value, parent) =>
      `${parent.idSector}:${parent.coords}>${value.celda || value.senal}`,
  }
);
const celda = new schema.Entity(
  'celdas',
  {
    senales: [senal],
    enclavamientos: [enclavamiento],
  },
  {
    processStrategy: (value, parent) => Object.assign(value, { idSector: parent.idSector }),
    idAttribute: (value, parent) => `${parent.idSector}:${value.coords}`,
  }
);

const sector = new schema.Entity(
  'sectores',
  {
    celdas: [celda],
  },
  { idAttribute: 'idSector' }
);

module.exports = sector;
