import { firebaseConnect } from 'firebase-connect';

import Sector from '_components/sector';

export const firebaseDataMap = ({ match }) => ({
  sector: `sectores/${match.params.idSector}`,
});

export default firebaseConnect(firebaseDataMap)(Sector);
