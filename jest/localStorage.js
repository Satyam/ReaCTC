const storage = {};

export default {
  setItem: (key, value) => {
    storage[key] = value || '';
  },
  getItem: key => storage[key] || null,
  removeItem: (key) => {
    delete storage[key];
  },
  get length() {
    return Object.keys(storage).length;
  },
  key: (i) => {
    const keys = Object.keys(storage);
    return keys[i] || null;
  },
};
