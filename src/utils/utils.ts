// export function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } ;
export function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }