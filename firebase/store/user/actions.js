export function login() {
  return (dispatch, getState, firebase) =>
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

export function logout() {
  return (dispatch, getState, firebase) => firebase.auth().signInAnonymously();
}
