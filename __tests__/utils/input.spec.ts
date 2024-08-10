import { parseUsername } from "../../src/utils/input.js";

describe('parseUsername', () => {
  it.each([
    [''],
    ['  '],
    ['username with spaces'],
    ['-beginsWithHyphen'],
    ['endsWithHyphen-'],
    ['double--hyphen'],
    ['withSpecialChars!']
  ])(
    'should throw an exception if the username is invalid',
    (username: string) => {
      expect(() => parseUsername(username)).throws();
    }
  );

  it.each([
    ['github'],
    ['username123'],
    ['first-last']
  ])(
    'should not throw an exception if the username is valid',
    (username: string) => {
      expect(() => parseUsername(username)).not.throws();
    }
  );
});