import { join, extname } from 'path';
import denodeify from 'denodeify';
import fs from 'fs';

const absPath = relPath => join(ROOT_DIR, relPath);

const readFile = denodeify(fs.readFile);
const readDir = denodeify(fs.readdir);

let collection;
export function init(db) {
  collection = db.collection('sectores');
  return collection.stats().then((stats) => {
    if (stats.count === 0) {
      return readDir(absPath('webServer/data')).then(files =>
        Promise.all(
          files.map((file) => {
            if (extname(file) === '.json') {
              return readFile(absPath(`webServer/data/${file}`))
                .then(JSON.parse)
                .then(data => collection.insertOne(Object.assign(data, { _id: data.idSector })));
            }
            return null;
          })
        )
      );
    }
    return null;
  });
}

export function getSectores() {
  return collection
    .find({}, { idSector: 1, descrCorta: 1, _id: 0 })
    .toArray()
    .then(list => ({ list }));
}

export function getSector(o) {
  return collection.find({ _id: o.keys.idSector }).toArray().then(arr => arr[0]);
}
export default db =>
  init(db).then(() => ({
    '/:idSector': { read: [getSector] },
    '/': {
      read: [getSectores],
    },
  }));
