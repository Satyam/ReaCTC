import firebaseConnect from '_utils/firebase/connect';

import Sector from '_components/sector';

export const firebaseDataMap = ({ match }) => ({
  $: `sectores/${match.params.idSector}`,
});

export default firebaseConnect(firebaseDataMap)(Sector);
