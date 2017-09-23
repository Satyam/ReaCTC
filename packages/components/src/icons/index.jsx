import React from 'react';
import styles from './styles.css';

export function CambioNormal() {
  return (
    <svg viewBox="0 0 32 32" className={styles.svg}>
      <path d="M 16 16 L 32 0" className={styles.alt} />
      <path d="M 16 0 V 16 32" className={styles.main} />
    </svg>
  );
}
export function CambioDesviado() {
  return (
    <svg viewBox="0 0 32 32" className={styles.svg}>
      <path d="M 16 0 V 16 16" className={styles.alt} />
      <path d="M 16 32 V 16 16 L 32 0" className={styles.main} />
    </svg>
  );
}

export function TripleIzq() {
  return (
    <svg viewBox="0 0 32 32" className={styles.svg}>
      <path d="M 16 16 V 16 0" className={styles.alt} />
      <path d="M 16 16 L 32 0" className={styles.alt} />
      <path d="M 16 32 V 16 16 L 0 0" className={styles.main} />
    </svg>
  );
}

export function TripleNormal() {
  return (
    <svg viewBox="0 0 32 32" className={styles.svg}>
      <path d="M 16 16 L 32 0" className={styles.alt} />
      <path d="M 16 16 L 0 0" className={styles.alt} />
      <path d="M 16 32 V 16 0" className={styles.main} />
    </svg>
  );
}

export function TripleDer() {
  return (
    <svg viewBox="0 0 32 32" className={styles.svg}>
      <path d="M 16 16 V 16 0" className={styles.alt} />
      <path d="M 16 16 L 0 0" className={styles.alt} />
      <path d="M 16 32 V 16 16 L 32 0" className={styles.main} />
    </svg>
  );
}
