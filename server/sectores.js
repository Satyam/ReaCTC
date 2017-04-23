import { join } from 'path';
import denodeify from 'denodeify';
import fs from 'fs';

const absPath = relPath => join(ROOT_DIR, relPath);

const readFile = denodeify(fs.readFile);
const readDir = denodeify(fs.readdir);
const initFiles = 'webServer/data/sectores';

let collection;
export function init(db) {
  collection = db.collection('sectores');
  return collection.stats().then((stats) => {
    if (stats.count === 0) {
      return readDir(absPath(initFiles)).then(files =>
        Promise.all(
          files.map(file =>
            readFile(absPath(`${initFiles}/${file}`))
              .then(JSON.parse)
              .then(data => collection.insertOne(Object.assign(data, { _id: data.idSector })))
          )
        )
      );
    }
    return null;
  });
}

export function getSectores() {
  return collection.find({}, { idSector: 1, descrCorta: 1, _id: 0 }).toArray();
}

export function getSector({ keys }) {
  return collection.find({ _id: keys.idSector }).next();
}

export default db =>
  init(db).then(() => ({
    '/:idSector': { read: getSector },
    '/': { read: getSectores },
  }));
