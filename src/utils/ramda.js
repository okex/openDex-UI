function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

export const replace = curry((re, rpl, str) => { return str.replace(re, rpl); });

export const noLineBreak = replace(/\n|\r/g);

export const htmlLineBreak = noLineBreak('<br />');

export const emptyLineBreak = noLineBreak('');

export const commaLineBreak = noLineBreak(',');
