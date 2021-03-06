export default (database) => {
  const celdas = database.ref('celdas');
  celdas.on(
    'child_removed',
    (sectorSnapshot) => {
      sectorSnapshot.child('senales').forEach((celdaSnapshot) => {
        celdaSnapshot.ref.remove((error) => {
          if (error) throw error;
        });
        return false;
      });
      sectorSnapshot.child('enclavamientos').forEach((celdaSnapshot) => {
        celdaSnapshot.ref.remove((error) => {
          if (error) throw error;
        });
        return false;
      });
    },
    (error) => {
      if (error) throw error;
    }
  );
};
