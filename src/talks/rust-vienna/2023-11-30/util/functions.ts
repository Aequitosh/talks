export function zip<T1, T2>(a: Array<T1>, b: Array<T2>): Array<[T1, T2]>  {
  return a.map((elementA, indexA) => [elementA, b[indexA]]);
}

