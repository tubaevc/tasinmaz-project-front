import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  // Email regex kontrolü
  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; // Basit bir email regex
    const value = control.value;

    if (!value) {
      return null; // Eğer alan boşsa, bu kontrol diğer validator'lara bırakılır (örneğin, required).
    }

    if (!emailRegex.test(value)) {
      return { invalidEmail: true }; // Eğer regex eşleşmezse, hata döner
    }

    return null; // Regex eşleşirse hata yok
  }
}
