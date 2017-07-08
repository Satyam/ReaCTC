const denodeify = require('denodeify');
const { join, extname } = require('path');
const fs = require('fs');
const { normalize } = require('normalizr');
const merge = require('lodash/merge');

const readDir = denodeify(fs.readdir);
const readFile = denodeify(fs.readFile);
const writeFile = denodeify(fs.writeFile);

const sectorSchema = require(join(process.cwd(), 'utils/sectorSchema'));

readDir(join(__dirname, 'sectores'))
  .then(files => files.filter(file => extname(file) === '.json'))
  .then(files =>
    Promise.all(
      files.map(file =>
        readFile(join(__dirname, 'sectores', file))
          .then(JSON.parse)
          .then(contents => normalize(contents, sectorSchema).entities)
      )
    )
  )
  .then(sectores => sectores.reduce((accum, s) => merge(accum, s)))
  .then(data =>
    writeFile(join(__dirname, 'sectores', 'firebase', 'data.json'), JSON.stringify(data))
  );
