import { getEmailValidationError } from 'ui-kit/inputs/InputEmail/helpers';

import { LoginDataType, RegisterDataType } from 'pages/AuthPage/types';

export const validatePassword = (password: string) => {
  const rules = [
    { key: 'hasDigit', label: 'Минимум одна цифра', isValid: /\d/.test(password) },
    { key: 'hasMinLength', label: 'Минимум 8 символов', isValid: password.length >= 8 },
    {
      key: 'hasLatinOnly',
      label: 'Только латинские буквы',
      isValid: /^[A-Za-z\d!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~-]+$/.test(password) && /[A-Za-z]/.test(password),
    },
    { key: 'hasUpperCase', label: 'Минимум одна заглавная буква', isValid: /[A-Z]/.test(password) },
    { key: 'hasLowerCase', label: 'Минимум одна строчная буква', isValid: /[a-z]/.test(password) },
    {
      key: 'hasSpecialChar',
      label: 'Минимум один спецсимвол',
      subLabel: '! ” № ; %:? * () - _ = +',
      isValid: /[!№;:%\?\*\(\)\-_=\+"”]/.test(password),
    },
  ];

  return {
    rules,
    isValid: rules.every(rule => rule.isValid),
  };
};

export const getErrorConfirmedPassword = (password: string, confirmedPassword: string) => {
  if (!password.length || !confirmedPassword.length) return true;
  return password === confirmedPassword;
};

export const isValidRegisterData = (
  registerData: RegisterDataType | undefined,
  confirmedPassword: string,
) => {
  if (!registerData) return false;
  if (confirmedPassword !== registerData.password) return false;
  if (getEmailValidationError(registerData.username).length) return false;
  return Object.values(registerData).every(value => value.length > 0);
};

export const isValidLoginData = (loginData: LoginDataType | undefined) => {
  if (!loginData) return false;
  if (getEmailValidationError(loginData.username).length) return false;
  return Object.values(loginData).every(value => value.length > 0);
};
