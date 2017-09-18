export function login() {
  return () => firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

export function logout() {
  return () => firebase.auth().signInAnonymously();
}
