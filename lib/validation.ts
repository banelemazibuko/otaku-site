export type FieldErrors = Record<string, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();

  if (!trimmed) {
    return "Email is required";
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address";
  }

  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return undefined;
}

export function validateSignIn(data: {
  email: string;
  password: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  const emailError = validateEmail(data.email);
  const passwordError = validatePassword(data.password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateSignUp(data: {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  const emailError = validateEmail(data.email);
  const passwordError = validatePassword(data.password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
