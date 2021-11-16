import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export class Cnp {
  private _isValid;
  cnp;

  constructor(cnp: any) {
    this._isValid = Cnp.validateCnp(cnp);

    if (this.isValid) this.cnp = cnp.toString();
    else this.cnp = null;
  }

  static validateCnp(cnp: any) {
    if (typeof cnp !== 'string' && typeof cnp !== 'number') return false;

    const cnpString = cnp.toString();
    const verificationConstant = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];

    let isValid = true;

    // convert cnp string to array of numbers
    const cnpArray = cnpString.split('').map((character) => {
      const digit = parseInt(character);

      if (isNaN(digit)) isValid = false;

      return digit;
    });

    if (!isValid) return false;

    const controlDigit = parseInt(cnpString.slice(-1));

    // multiply each cnp digit by corresponding verification constant digit and get their sum
    const sum = verificationConstant.reduce(
      (previous, current, index) => previous + current * cnpArray[index],
      0
    );
    // divide sum by 11 and get remainder
    const remainder = sum % 11;
    // if remainder is 10 change it to 1
    const calculatedControlDigit = remainder === 10 ? 1 : remainder;

    return calculatedControlDigit === controlDigit;
  }

  get isValid() {
    return this._isValid;
  }

  get gender() {
    if (!this.isValid) return null;

    return this.cnp.slice(0, 1);
  }

  get year() {
    if (!this.isValid) return null;

    let century = '20';

    if (this.gender === '1' || this.gender === '2') century = '19';
    else if (this.gender === '3' || this.gender === '4') century = '18';

    return century + this.cnp.slice(1, 3);
  }

  get month() {
    if (!this.isValid) return null;

    return this.cnp.slice(3, 5);
  }

  get day() {
    if (!this.isValid) return null;

    return this.cnp.slice(5, 7);
  }

  get age() {
    if (!this.isValid) return null;

    const now = dayjs();

    let birthday = dayjs(
      `${this.year}-${this.month}-${this.day}T${now.format('HH:mm:ss')}`,
      'YYYY-MM-DDTHH:mm:ss'
    );

    return now.diff(birthday, 'year');
  }
}
