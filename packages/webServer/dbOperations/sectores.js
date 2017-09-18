import isArray from 'lodash/isArray';

let collection;

export function listSectores() {
  return collection
    .find({ entity: 'sector' }, { idSector: 1, descr: 1, descrCorta: 1, _id: 0 })
    .toArray();
}

export function getSector(idSector) {
  return Promise.all([
    collection.find({ idSector, entity: 'sector' }, { _id: 0, entity: 0 }).next(),
    collection.find({ idSector, entity: 'celda' }, { _id: 0, entity: 0, idSector: 0 }).toArray(),
    collection.find({ idSector, entity: 'senal' }, { _id: 0, entity: 0, idSector: 0 }).toArray(),
    collection
      .find({ idSector, entity: 'enclavamiento' }, { _id: 0, entity: 0, idSector: 0 })
      .toArray(),
  ]).then(([sectores, celdas, senales, enclavamientos]) => ({
    sectores,
    celdas,
    senales,
    enclavamientos,
  }));
}

export function deleteSectores(idSectores) {
  console.log('deleting', idSectores);
  return collection.deleteMany({ idSector: { $in: idSectores } });
}

export function addSector(sector) {
  const idSector = sector.idSector;

  return Promise.all(
    sector.celdas.map((celda) => {
      const idCelda = `${idSector}:${celda.coords}`;
      return Promise.all([
        isArray(celda.senales) &&
          Promise.all(
            celda.senales.map((senal) => {
              const idSenal = `${idCelda}:${senal.dir}`;
              return collection
                .insertOne(
                  Object.assign(senal, { idSector, entity: 'senal', _id: idSenal, idSenal })
                )
                .then(() => idSenal);
            })
          ),
        isArray(celda.enclavamientos) &&
          Promise.all(
            celda.enclavamientos.map((enclavamiento) => {
              const idEnclavamiento = `${idCelda}>${enclavamiento.celda || enclavamiento.senal}`;
              return collection
                .insertOne(
                  Object.assign(enclavamiento, {
                    idSector,
                    entity: 'enclavamiento',
                    _id: idEnclavamiento,
                    idEnclavamiento,
                  })
                )
                .then(() => idEnclavamiento);
            })
          ),
      ]).then(([senales, enclavamientos]) =>
        collection
          .insertOne(
            Object.assign(
              celda,
              {
                idSector,
                entity: 'celda',
                _id: idCelda,
                idCelda,
              },
              senales ? { senales } : {},
              enclavamientos ? { enclavamientos } : {}
            )
          )
          .then(() => idCelda)
      );
    })
  ).then(celdas =>
    collection.insertOne(Object.assign(sector, { _id: idSector, entity: 'sector', celdas }))
  );
}

export function init(db) {
  collection = collection || db.collection('sectores');
  return Promise.resolve();
}
