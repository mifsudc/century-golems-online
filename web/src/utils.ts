export const ensure = <T>(arg: T | undefined | null): T => {
  if (!arg)
    throw new Error('This value was promised to exist, but didn\'t');

  return arg;
}

export const randInt = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const MAX_INT = 2147483647;