// @flow
export default function indexBy(a: any[], field: string): { [IdType]: Object } {
  return a.reduce(
    (prev, item) => Object.assign(prev, { [item[field]]: item }),
    {},
  );
}
