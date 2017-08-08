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

export function listSectores() {
  return collection.find({}, { idSector: 1, descrCorta: 1, descr: 1, _id: 0 }).toArray();
}

export function getSector({ keys }) {
  return collection.find({ _id: keys.idSector }).next();
}

export function deleteSectores({ keys }) {
  return collection.deleteMany({ idSector: { $in: keys.idSector.split(',') } });
}

export function addSector({ data }) {
  return collection.insertOne(Object.assign(data, { _id: data.idSector })).catch((err) => {
    if (err.name === 'MongoError' && err.code === 11000) {
      return Promise.reject({
        code: 409,
        msg: 'idSector duplicado',
      });
    }
    throw err;
  });
}

export default db =>
  init(db).then(() => ({
    '/:idSector': { read: getSector, delete: deleteSectores },
    '/': { read: listSectores, create: addSector },
  }));
