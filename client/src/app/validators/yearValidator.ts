import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const yearValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    return parseInt(control.value) > new Date().getFullYear()
      ? { futureYear: { value: control.value } }
      : null;
  };
};
