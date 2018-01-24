import { ThemedStyledFunction } from 'styled-components';

export function withProps<U>() {
  return <P, T, O>(
      fn: ThemedStyledFunction<P, T, O>,
  ): ThemedStyledFunction<P & U, T, O & U> => fn;
}

export function parseSearch(search: string) {
  const splitRe = /\?|&/g;
  const splitted = search.split(splitRe).filter(s => s.length > 0);
  const results = splitted.reduce(
    (current: any, next) => {
      const [key, value] = next.split('=');
      const decodedValue = decodeURIComponent(value);
      const newSet = {[key]: decodedValue};
      return {...current, ...newSet};
    }, {});
  return results;

}

const ARC_RADIUS = 10;

//
// Drawing cool paths
// * M is the start point
// * L draws a line to x/y
// * A rx ry x-axis-rotation large-arc-flag sweep-flag x y
// * Z close the path
//

export function drawPath(x1: number, y1: number, x2: number, y2: number, yOffset: number): string {
  // const xDistance = Math.abs(x2 - x1);
  // const yDistance = Math.abs(y2 - y1);
  const intermediateY = y1 + (yOffset);
  
  if (x2 > x1) {
    return `
      M ${x1}, ${y1}
      L ${x1},${intermediateY}
      A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 0 ${x1 + ARC_RADIUS} ${intermediateY + ARC_RADIUS}
      L ${x2 - ARC_RADIUS} ${intermediateY + ARC_RADIUS}
      A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${x2} ${intermediateY + ARC_RADIUS * 2}
      L ${x2} ${y2}
    `;
  }

  if (x1 > x2) {
    return `
      M ${x1}, ${y1}
      L ${x1},${intermediateY}
      A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${x1 - ARC_RADIUS} ${intermediateY + ARC_RADIUS}
      L ${x2 + ARC_RADIUS} ${intermediateY + ARC_RADIUS}
      A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 0 ${x2} ${intermediateY + ARC_RADIUS * 2}
      L ${x2} ${y2}
    `;
  }

  if (x1 === x2) {
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
    `;
  }
}
