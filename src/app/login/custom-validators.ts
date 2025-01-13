import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  // Email regex kontrolü
  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; //  email regex
    const value = control.value;

    if (!value) {
      return null;
    }

    if (!emailRegex.test(value)) {
      return { invalidEmail: true };
    }

    return null;
  }
}
