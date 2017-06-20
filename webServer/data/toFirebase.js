const denodeify = require('denodeify');
const { join, extname } = require('path');
const fs = require('fs');
const { normalize, schema } = require('normalizr');
const merge = require('lodash/merge');

const readDir = denodeify(fs.readdir);
const readFile = denodeify(fs.readFile);
const writeFile = denodeify(fs.writeFile);

const senal = new schema.Entity(
  'senales',
  {},
  { idAttribute: (value, parent) => `${parent.idSector}:${parent.coords}:${value.dir}` }
);
const enclavamiento = new schema.Entity(
  'enclavamientos',
  {},
  { idAttribute: (value, parent) => `${parent.idSector}:${parent.coords}` }
);
const celda = new schema.Entity(
  'celdas',
  {
    senales: [senal],
    enclavamientos: enclavamiento,
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

readDir(join(__dirname, 'sectores'))
  .then(files => files.filter(file => extname(file) === '.json'))
  .then(files => Promise.all(
    files.map(file =>
      readFile(join(__dirname, 'sectores', file))
        .then(JSON.parse)
        .then(contents => normalize(contents, sector).entities)
    )
  ))
  .then(sectores => sectores.reduce((accum, s) => merge(accum, s)))
  .then(data => writeFile(
    join(__dirname, 'sectores', 'firebase', 'data.json'),
    JSON.stringify(data)
  ));
