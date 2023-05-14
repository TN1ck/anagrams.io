import { ThemedStyledFunction } from 'styled-components';

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

export function getNumberOfCPUs() {
  return navigator.hardwareConcurrency || 1;
}

//
// Drawing cool paths
// * M is the start point
// * L draws a line to x/y
// * A rx ry x-axis-rotation large-arc-flag sweep-flag x y
// * Q x1 y1, x y (or q dx1 dy1, dx dy) - quadratic bezier curve where the slope is both the same
// * Z close the path
//

export function drawPath(x1: number, y1: number, x2: number, y2: number, yOffset: number, arcRadius: number): string {
  const intermediateY = y1 + (yOffset);
  const intermediateX = (x1 + x2) / 2;
  const x1arc = x1 + (arcRadius * (x1 > x2 ? -1 : 1));
  const x2arc = x2 - (arcRadius * (x1 > x2 ? -1 : 1));
  const x1intermediate = x1 > x2 ? Math.max(x1arc, intermediateX) : Math.min(x1arc, intermediateX);
  const x2intermediate = x1 > x2 ? Math.min(x2arc, intermediateX) : Math.max(x2arc, intermediateX);
  return `
M ${x1}, ${y1}
L ${x1},${intermediateY}
Q ${x1},${intermediateY + arcRadius} ${x1intermediate},${intermediateY + arcRadius}
L ${x2intermediate},${intermediateY + arcRadius}
Q ${x2},${intermediateY + arcRadius} ${x2},${intermediateY + arcRadius * 2}
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

  return ""
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
  linear: function (t: number) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t: number) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t: number) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t: number) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t: number) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t: number) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t: number) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t: number) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t: number) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t: number) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t: number) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t: number) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t: number) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};
