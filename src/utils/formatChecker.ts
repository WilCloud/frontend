export const isUrl = (s: string) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

export const isLetterAndNumber = (s: string) => {
  return /^[a-zA-Z0-9]*$/.test(s);
};
