export const WHITE_SPACE_FORMAT = /\s{2,}/gi;
export const WHITE_SPACE_REPLACE_FORMAT = '$1 ';
export const NUMBER_MASK = /^[\d]+$/;
export const NUMBER_AND_WORD_MASK = /^[\d\w]+$/;
export const SUM_FORMAT = /(\d)(?=(\d{3})+(?!\d))/g;
export const SUM_MASK = /^(\d{1,3})([ ]\d{3})*([.,-]\d{1,2})?$/;
export const STRONG_SUM_MASK = /^(\d{1,3})([ ]\d{3})*$/;
export const SUM_ONLY_DOTS_MASK = /^[\d]+([.][\d]{1,2})?$/;
export const NAME_MASK = /^([\u0400-\u04FFA-Za-z]+)[ ]([\u0400-\u04FFA-Za-z]+)[ ]?([\u0400-\u04FFA-Za-z]+)?$/;
export const UUID_MASK = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[1-5][0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/;
export const ITALIAN_MASK = /\{\\i[0|1]\}/gi;
// eslint-disable-next-line no-useless-escape
export const EFFECTS_MASK = /(\{\\[\w\d\. \-&\(,\)\\]+\})/gi;
// eslint-disable-next-line no-useless-escape
export const PURE_EFFECTS_MASK = /(\{\\[\w\d\. \-&\(,\)\\]+\})/;
export const DRAW_MASK = /(\{\\p1\}.+\{\\p0\})/gi;
export const DOUBLE_SPACES_AND_NEXT_LINE_MASK = /\\n|\\N|\s{2,}/gi;
export const NEXT_LINE_MASK = /\\n|\\N/gi;
// eslint-disable-next-line no-useless-escape
export const GOOD_END_SYMBOLS_MASK = /[\.|\?|\-|"|!|~]{1}$/;
// eslint-disable-next-line max-len
export const ASS_MASK = /^Dialogue: ([\d]+)[,]([\d]+[:][\d]+[:][\d]+[.][\d]+)[,]([\d]+[:][\d]+[:][\d]+[.][\d]+)[,]([\w -_]*)[,]([\w -_]*)[,]([\d]+)[,]([\d]+)[,]([\d]+)[,]([\w\d;]*)[,]([\w\W]*)$/;
