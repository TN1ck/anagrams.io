import BigNumber from 'bignumber.js';

var f = [new BigNumber("1"), new BigNumber("1")];
var i = 2;
export function factorial(n: number)
{
  if (typeof f[n] !== 'undefined')
    return f[n];
  var result = f[i-1];
  for (; i <= n; i++)
      f[i] = result = result.times(i.toString());
  return result;
}
var cache = 150;
//due to memoization following line will cache first 100 elements
factorial(cache);