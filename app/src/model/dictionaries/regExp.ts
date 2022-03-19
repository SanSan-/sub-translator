/* eslint-disable no-useless-escape */
export const ITALIAN_MASK = /{\\i[0|1]}/gi;
export const ASS_EFFECTS_MASK = /({\\[^}]+})/gi;
export const ASS_COMMENTS_MASK = /({(?!\\).*})/gi;
export const SRT_EFFECTS_MASK = /(<\/?[\w]+>)/gi;
export const DRAW_MASK = /({.*\\p(\d|bo).*}.+[{\\p0}]?)/gi;
export const DOUBLE_SPACES_MASK = /\s{2,}/gi;
export const NEXT_LINE_MASK = /\\n|\\N/gi;
export const NO_SPACE_NEXT_LINE_MASK = /\\N([\S]?)($|\\N)/gi;
export const DOT_MASK = /[.…]/gi;
export const COMMA_MASK = /,/gi;
export const QUOTE_MASK = /["»«“”]/gi;
export const BRACKET_MASK = /[()]/gi;
export const DASH_MASK = /-/gi;
export const COLON_MASK = /:/gi;
export const SEMICOLON_MASK = /;/gi;
export const QUESTION_MARK_MASK = /\?/gi;
export const EXCLAMATION_MARK_MASK = /!/gi;
export const GOOD_END_SYMBOLS_MASK = /[.|?\-—)"!~](<\/[\w]+>)?$/;
// eslint-disable-next-line max-len
export const ASS_MASK = /^Dialogue: ([\d]+)[,]([\d]+[:][\d]+[:][\d]+[.][\d]+)[,]([\d]+[:][\d]+[:][\d]+[.][\d]+)[,]([^,]*)[,]([^,]*)[,]([\d]+)[,]([\d]+)[,]([\d]+)[,]([^,]*)[,](.*)$/;
export const SRT_INDEX_MASK = /^([\d]+)$/;
// eslint-disable-next-line max-len
export const SRT_TIME_MASK = /^([\d]{0,2}:?[\d]{2}:[\d]{2}[,|.][\d]{2,3}) --> ([\d]{0,2}:?[\d]{2}:[\d]{2}[,|.][\d]{2,3})$/;
export const FILENAME_MASK = /filename[^;\n]*=\s*(UTF-\d['"]*)?((['"]).*?[.]$\3|[^;\n]*)?/gi;
