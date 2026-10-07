const EMAIL_REGEX =
  /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export const isEmailValid = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

// making sure the users sends the correct email
