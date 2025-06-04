import { UserInfo } from './types';

export const validateStep = (step: number, userInfo: UserInfo) => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!userInfo.firstName.trim()) {
      errors.firstName = 'Il nome è obbligatorio';
    }
    if (!userInfo.lastName.trim()) {
      errors.lastName = 'Il cognome è obbligatorio';
    }
  }

  if (step === 3) {
    if (!userInfo.storeName.trim()) {
      errors.storeName = 'Il nome del negozio è obbligatorio';
    }
    if (!userInfo.storeDescription.trim()) {
      errors.storeDescription = 'La descrizione del negozio è obbligatoria';
    }
  }

  if (step === 4) {
    if (!userInfo.storeDescription.trim()) {
      errors.storeDescription = 'La descrizione del negozio è obbligatoria';
    }
    if (!userInfo.storeLocation) {
      errors.storeLocation = 'La posizione del negozio è obbligatoria';
    }
  }

  if (step === 5) {
    if (!userInfo.storePlaceId) {
      errors.storePlaceId = "L'ID del luogo del negozio è obbligatorio";
    }
  }

  if (step === 6) {
    if (!userInfo.password) {
      errors.password = 'La password è obbligatoria';
    } else {
      if (userInfo.password.length < 8) {
        errors.password = 'La password deve essere lunga almeno 8 caratteri';
      }
      if (!/[a-z]/.test(userInfo.password)) {
        errors.password =
          errors.password ||
          'La password deve contenere almeno una lettera minuscola';
      }
      if (!/[A-Z]/.test(userInfo.password)) {
        errors.password =
          errors.password ||
          'La password deve contenere almeno una lettera maiuscola';
      }
      if (!/[0-9]/.test(userInfo.password)) {
        errors.password =
          errors.password || 'La password deve contenere almeno un numero';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(userInfo.password)) {
        errors.password =
          errors.password ||
          'La password deve contenere almeno un simbolo speciale';
      }
      if (userInfo.password !== userInfo.confirmPassword) {
        errors.confirmPassword = 'Le password non corrispondono';
      }
    }
  }

  if (step === 8) {
    if (!userInfo.acceptedTOS) {
      errors.acceptedTOS = 'Devi accettare i termini e le condizioni';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
