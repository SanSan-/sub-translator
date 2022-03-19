import { AssSubtitlesItem } from '~types/state';
import { ASS_MASK, SRT_INDEX_MASK, SRT_TIME_MASK } from '~dictionaries/regExp';

export const assValidator = (text: string): boolean => ASS_MASK.test(text);
export const assSeparator = (line: number, text: string): Record<number, AssSubtitlesItem> => {
  const match = ASS_MASK.exec(text);
  if (!match || match.length < 11) {
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

export const srtStartValidator = (text: string): boolean => SRT_INDEX_MASK.test(text);
export const srtTimeValidator = (text: string): boolean => SRT_TIME_MASK.test(text);
export const srtTimeExtract = (text: string): string[] => SRT_TIME_MASK.exec(text).slice(1);

const findMatches = (str: string, regex: RegExp, matches: RegExpExecArray[] = []): RegExpExecArray[] => {
  const res = regex.exec(str);
  res && matches.push(res) && findMatches(str, regex, matches);
  return matches;
};

export const countRegExpEntry = (text: string, regExp: RegExp): number => (findMatches(text, regExp).length);
