import { AnyAction } from 'redux';

export const NEW_LINE_SIGN = '\n';
export const HARD_NEW_LINE_SIGN = '\r\n';
export const BIG_NEW_LINE_SIGN = '\\N';
export const EQUAL_SIGN = '=';
export const PLUS_SIGN = '+';
export const MINUS_SIGN = '-';
export const UNDERGROUND_SIGN = '_';
export const SLASH_SIGN = '/';
export const DOT_SIGN = '.';
export const COMMA_SIGN = ',';
export const SEMICOLON_SIGN = ';';
export const AMPERSAND_SIGN = '&';
export const ASTERISK_SIGN = '*';
export const QUESTION_SIGN = '?';
export const RIGHT_COMA_SIGN = ')';
export const LEFT_COMA_SIGN = '(';
export const SPACE_SIGN = ' ';
export const FIRST_GROUP = '$1';
export const SECOND_GROUP = '$2';
export const EMPTY_STRING = '';
export const QUOTE_JOINER = ', ';
export const SEMICOLON_JOINER = '; ';

export const ZERO_SIGN = '0';
export const ZERO_INT_SIGN = 0;

export const FORM_ELEMENT_SIZE = 'small';

export const DATE_FORMAT = 'DD.MM.YYYY';
export const EXPORT_DATE_FORMAT = 'YYYY-MM-DD_HH_mm_ss';
export const ANT_DATE_FORMAT = 'YYYY-MM-DD';

export const CORRECT_SORT = (a: number, b: number): number => (a - b);
export const EMPTY_FUNC = (): void => {
  // do nothing
};

export const EMPTY_ACTION: AnyAction = {
  type: EMPTY_STRING
};
