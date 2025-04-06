/**
 * Проверяет корректность email по минимальным требованиям и возвращает текст ошибки, если email некорректен.
 *
 * Требования:
 * - Минимум 3 символа перед `@`
 * - Минимум 2 символа после `@`
 * - Минимум 2 символа после последней точки
 *
 * @param {string} email - Email, который нужно проверить
 * @returns {string} Пустая строка, если email валиден, иначе сообщение об ошибке
 */
export const getEmailValidationError = (email: string): string => {
  const emailRegex = /^([a-zA-Z0-9._%+-]{3,})@([a-zA-Z0-9-]{2,})\.([a-zA-Z]{2,})$/;

  const domainPart = email.split('@')[1];
  if (!domainPart || domainPart.split('.').slice(-2, -1)[0]?.length < 2) {
    return 'Электронная почта указана неверно';
  }

  return emailRegex.test(email) ? '' : 'Электронная почта указана неверно';
};
