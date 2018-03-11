import { ThemedStyledFunction } from 'styled-components';

export function withProps<U>() {
  return <P, T, O>(
      fn: ThemedStyledFunction<P, T, O>,
  ): ThemedStyledFunction<P & U, T, O & U> => fn;
}

export function partitionArray<T>(array: T[], columns: number): T[][] {
  const partitionedArray: T[][] = [];
  let currentGroup: T[] = [];
  for (let ga of array) {
    currentGroup.push(ga);
    if (currentGroup.length === columns) {
      partitionedArray.push(currentGroup);
      currentGroup = [];
    }
  }
  if (currentGroup.length !== 0) {
    partitionedArray.push(currentGroup);
  }
  return partitionedArray;
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

//
// Drawing cool paths
// * M is the start point
// * L draws a line to x/y
// * A rx ry x-axis-rotation large-arc-flag sweep-flag x y
// * Z close the path
//

export function drawPath(x1: number, y1: number, x2: number, y2: number, yOffset: number, arcRadius: number): string {
  const intermediateY = y1 + (yOffset);
  return `
M ${x1}, ${y1}
L ${x1},${intermediateY}
C ${x1},${intermediateY + arcRadius} ${x2},${intermediateY + arcRadius} ${x2},${intermediateY + arcRadius * 2}
L ${x2} ${y2}`;
}

export function drawPathOld(x1: number, y1: number, x2: number, y2: number, yOffset: number, arcRadius: number): string {
  const intermediateY = y1 + (yOffset);
  
  if (x2 > x1) {
    return `
M ${x1}, ${y1}
L ${x1},${intermediateY}
A ${arcRadius} ${arcRadius} 0 0 0 ${x1 + arcRadius} ${intermediateY + arcRadius}
L ${x2 - arcRadius} ${intermediateY + arcRadius}
A ${arcRadius} ${arcRadius} 0 0 1 ${x2} ${intermediateY + arcRadius * 2}
L ${x2} ${y2}
`.replace(/\n/g, ' ');
  }

  if (x1 > x2) {
    return `
M ${x1}, ${y1}
L ${x1},${intermediateY}
A ${arcRadius} ${arcRadius} 0 0 1 ${x1 - arcRadius} ${intermediateY + arcRadius}
L ${x2 + arcRadius} ${intermediateY + arcRadius}
A ${arcRadius} ${arcRadius} 0 0 0 ${x2} ${intermediateY + arcRadius * 2}
L ${x2} ${y2}
`.replace(/\n/g, '');
  }

  if (x1 === x2) {
    arcRadius = 0.1;
    return `
M ${x1}, ${y1}
L ${x1},${intermediateY}
A ${arcRadius} ${arcRadius} 0 0 1 ${x1 - arcRadius} ${intermediateY + arcRadius}
L ${x2 + arcRadius} ${intermediateY + arcRadius}
A ${arcRadius} ${arcRadius} 0 0 0 ${x2} ${intermediateY + arcRadius * 2}
L ${x2} ${y2}
`.replace(/\n/g, '');
  }
}

export function pathDataToPath(pathData: (string | number)[][]): string {
  const rows = pathData.map(row => row.join(' '));
  return rows.join(' ');
};

export function createPathData(
  x1: number, y1: number, x2: number, y2: number, yOffset: number, arcRadius: number
) {
  const intermediateY = y1 + (yOffset);
  let directionArcRadius = arcRadius;
  const arcSweepFirst = x2 > x1 ? 0 : 1;
  const arcSweepSecond = x2 > x1 ? 1 : 0;
  if (x1 === x2) {
    arcRadius = 0;
  }
  if (x2 > x2) {
    directionArcRadius = directionArcRadius * -1;
  }
  return [
    ['M', x1, y1],
    ['L', x1, intermediateY],
    ['A', arcRadius, arcRadius, 0, 0, arcSweepFirst, x1 + directionArcRadius, intermediateY + arcRadius],
    ['L', x2 - directionArcRadius, intermediateY + arcRadius],
    ['A', x2 + arcRadius, 0, 0, arcSweepSecond, x2, intermediateY + arcRadius * 2],
    ['L', x2, y2],
  ];
}

export const EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};