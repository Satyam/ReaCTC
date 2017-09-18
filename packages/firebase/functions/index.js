const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.onDeleteSector = functions.database.ref('/sectores/{idSector}').onDelete((event) => {
  const idCeldas = event.data.previous.child('celdas').val();
  const root = event.data.adminRef.root;
  if (idCeldas) {
    idCeldas.forEach(idCelda => root.child(`/celdas/${idCelda}`).remove());
  }
});

exports.onDeleteCelda = functions.database.ref('/celdas/{idCelda}').onDelete((event) => {
  const idSenales = event.data.previous.child('senales').val();
  const root = event.data.adminRef.root;
  if (idSenales) {
    idSenales.forEach(idSenal => root.child(`/senales/${idSenal}`).remove());
  }
  const idEnclavamientos = event.data.previous.child('enclavamientos').val();
  if (idEnclavamientos) {
    idEnclavamientos.forEach(idEnclavamiento =>
      root.child(`/enclavamientos/${idEnclavamiento}`).remove()
    );
  }
});
