import { SPACE_SIGN } from '~const/common';
import { AssSubtitlesItem } from '~types/state';
import {
  ASS_MASK,
  NAME_MASK,
  NUMBER_AND_WORD_MASK,
  NUMBER_MASK,
  STRONG_SUM_MASK,
  SUM_FORMAT,
  SUM_MASK,
  SUM_ONLY_DOTS_MASK,
  UUID_MASK,
  WHITE_SPACE_FORMAT,
  WHITE_SPACE_REPLACE_FORMAT
} from '~dictionaries/regExp';

export const trimSpaces = (text: string): string => text.replace(WHITE_SPACE_FORMAT, SPACE_SIGN);
export const sumFormatter = (text: string): string => trimSpaces(text).replace(SUM_FORMAT, WHITE_SPACE_REPLACE_FORMAT);
export const numValidator = (text: string): boolean => NUMBER_MASK.test(text);
export const numAndWordValidator = (text: string): boolean => NUMBER_AND_WORD_MASK.test(text);
export const sumValidator = (text: string): boolean => SUM_MASK.test(text);
export const strongSumValidator = (text: string): boolean => STRONG_SUM_MASK.test(text);
export const sumOnlyDotsValidator = (text: string): boolean => SUM_ONLY_DOTS_MASK.test(text);
export const nameValidator = (text: string): boolean => NAME_MASK.test(text);
export const uuidValidator = (text: string): boolean => UUID_MASK.test(text);
export const textValidator = (text: string): boolean => text && text.length > 0 && text.length < 255;

export const assValidator = (text: string): boolean => ASS_MASK.test(text);
export const assSeparator = (line: number, text: string): Record<number, AssSubtitlesItem> => {
  const match = ASS_MASK.exec(text);
  if (match.length < 11) {
    return {};
  }
  return {
    [line]: {
      layer: Number(match[1]),
      startTime: match[2],
      endTime: match[3],
      style: match[4],
      actor: match[5],
      marginL: Number(match[6]),
      marginR: Number(match[7]),
      marginV: Number(match[8]),
      effect: match[9],
      text: match[10]
    }
  };
};
