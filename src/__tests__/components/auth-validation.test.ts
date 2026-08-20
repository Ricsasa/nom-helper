import { describe, expect, it } from 'vitest';
import {
  authErrorKeys,
  isStrongPassword,
  validateLogin,
  validateRegister,
} from '@/lib/utils/auth-validation';

describe('isStrongPassword', () => {
  it('requires at least 8 characters and one digit', () => {
    expect(isStrongPassword('abc12')).toBe(false);
    expect(isStrongPassword('abcdefgh')).toBe(false);
    expect(isStrongPassword('abcdefg1')).toBe(true);
  });
});

describe('validateLogin', () => {
  it('reports missing credentials when either field is empty', () => {
    expect(validateLogin({ email: '', password: 'abcdefg1' })).toBe('missingCredentials');
    expect(validateLogin({ email: 'a@b.mx', password: '' })).toBe('missingCredentials');
  });

  it('treats whitespace as an empty email', () => {
    expect(validateLogin({ email: '   ', password: 'abcdefg1' })).toBe('missingCredentials');
  });

  it('passes when both fields are present', () => {
    expect(validateLogin({ email: 'a@b.mx', password: 'x' })).toBeNull();
  });
});

describe('validateRegister', () => {
  it('reports missing fields before judging the password', () => {
    expect(validateRegister({ name: '', email: '', password: 'short' })).toBe('missingFields');
  });

  it('reports a weak password once the fields are filled', () => {
    expect(validateRegister({ name: 'Ramiro', email: 'a@b.mx', password: 'short' })).toBe(
      'weakPassword'
    );
  });

  it('passes on a complete, valid form', () => {
    expect(validateRegister({ name: 'Ramiro', email: 'a@b.mx', password: 'abcdefg1' })).toBeNull();
  });
});

describe('authErrorKeys', () => {
  it('builds keys that exist in the dictionary', async () => {
    const esMX = (await import('@/i18n/es-MX')).default;
    const keys = authErrorKeys('invalidCredentials');
    expect(esMX[keys.titleKey]).toBe('Correo o contraseña incorrectos');
    expect(esMX[keys.helpKey]).toContain('Recuperar acceso');
  });
});
