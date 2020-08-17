function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

export const compose = (...fns) => {
  return (...args) => {
    return fns.reduceRight((res, fn) => {
      return [fn.call(null, ...res)];
    }, args)[0];
  };
};

export const replace = curry((re, rpl, str) => { return str.replace(re, rpl); });

export const noLineBreak = replace(/\n|\r/g);

export const htmlLineBreak = noLineBreak('<br />');

export const emptyLineBreak = noLineBreak('');

export const commaLineBreak = noLineBreak(',');

export const divide = curry((a, b) => {
  return a / b;
});

export const multiply = curry((a, b) => {
  return a * b;
});

export const fixed = curry((digital, num) => {
  return (num - 0).toFixed(digital);
});

export const carry = curry((cs, num) => {
  let f = num - 0;
  let idx = 0;
  let c = cs[idx].scale;
  while (f >= c && idx < cs.length - 1) {
    f = divide(f, c);
    idx++;
    c = cs[idx].scale;
  }
  return [f, cs[idx].suffix];
});
