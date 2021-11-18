import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Cnp } from './../utils/cnp';

export const cnpValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const cnp = new Cnp(control.value);

    return cnp.isValid ? null : { invalidCnp: { value: control.value } };
  };
};
