import { BIG_NEW_LINE_SIGN, CORRECT_SORT, EMPTY_STRING, FIRST_GROUP, SPACE_SIGN, ZERO_INT_SIGN } from '~const/common';
import { WEBVTT } from '~const/labels';
import { NOT_VTT_ERROR } from '~const/log';
import {
  ASS_COMMENTS_MASK,
  ASS_EFFECTS_MASK,
  BRACKET_MASK,
  COLON_MASK,
  COMMA_MASK,
  DASH_MASK,
  DOT_MASK,
  DOUBLE_SPACES_MASK,
  DRAW_MASK,
  EXCLAMATION_MARK_MASK,
  GOOD_END_SYMBOLS_MASK,
  ITALIAN_MASK,
  NEXT_LINE_MASK,
  NO_SPACE_NEXT_LINE_MASK,
  QUESTION_MARK_MASK,
  QUOTE_MASK,
  SEMICOLON_MASK,
  SRT_EFFECTS_MASK
} from '~dictionaries/regExp';
import badSymbols from '~dictionaries/badSymbols';
import {
  AbstractAnalysed,
  AnalysedDialog,
  AnalysedItem,
  AnalysedLine,
  AssSubtitlesItem,
  PrepareToTranslateItem,
  SrtSubtitlesItem,
  TranslatedDialogItem,
  TranslatedItem
} from '~types/state';
import { isEmpty, isEmptyArray } from '~utils/CommonUtils';
import {
  assSeparator,
  assValidator,
  countRegExpEntry,
  srtStartValidator,
  srtTimeExtract,
  srtTimeValidator
} from '~utils/ValidationUtils';
import {
  onlyEndSymbols,
  withoutDashes,
  withoutNonEndSymbols,
  withoutWordAndDashes,
  withoutWordCount
} from '~dictionaries/filters';
import { FileFormat } from '~enums/File';

const replaceAllWords = (input: string, from: string, to: string): string => {
  const fromLen = from.length;
  let output = EMPTY_STRING;
  let pos = 0;
  for (; ;) {
    const matchPos = input.indexOf(from, pos);
    if (matchPos === -1) {
      output += input.slice(pos);
      break;
    }
    output += input.slice(pos, matchPos);
    output += to;
    pos = matchPos + fromLen;
  }
  return output;
};

const replaceAll = (text: string, from: RegExp, to: string): string => {
  let temp = String(text);
  while (from.test(temp)) {
    temp = temp.replace(from, to);
  }
  return temp;
};

export const formatLine = (line: string, dictionary: { key: string, val: string }[]): string => {
  let temp = String(line);
  for (let i = 0; i < dictionary.length; i++) {
    temp = replaceAllWords(temp, dictionary[i].key, dictionary[i].val);
  }
  return temp;
};

export const cleanLine = (text: string): string => replaceAll(
  formatLine(text, badSymbols), NO_SPACE_NEXT_LINE_MASK, FIRST_GROUP)
  .replace(NEXT_LINE_MASK, SPACE_SIGN)
  .replace(DRAW_MASK, EMPTY_STRING)
  .replace(ASS_EFFECTS_MASK, EMPTY_STRING)
  .replace(ASS_COMMENTS_MASK, EMPTY_STRING)
  .replace(SRT_EFFECTS_MASK, EMPTY_STRING)
  .replace(DOUBLE_SPACES_MASK, SPACE_SIGN)
  .trim();

export const parseAssDialogs = (origins: string[]): Record<number, AssSubtitlesItem> => origins.map(
  (text, i) => assValidator(text) && assSeparator(i, text))
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

export const parseSrtDialogs = (origins: string[]): Record<number, SrtSubtitlesItem> => {
  let i = 0;
  while (!srtStartValidator(origins[i]) && i < origins.length) {
    i += 1;
  }
  let dialogs = {};
  while (i < origins.length) {
    const lineIndex = srtStartValidator(origins[i]) && Number(origins[i]);
    const temp = [];
    let times = [] as string[];
    i += 1;
    while (!srtStartValidator(origins[i]) && i < origins.length) {
      if (srtTimeValidator(origins[i])) {
        times = srtTimeExtract(origins[i]);
      } else if (!isEmpty(origins[i])) {
        temp.push(origins[i]);
      }
      i += 1;
    }
    dialogs = {
      ...dialogs,
      [lineIndex]: { startTime: times[0], endTime: times[1], text: temp.join(SPACE_SIGN + BIG_NEW_LINE_SIGN) }
    };
  }
  return dialogs;
};

export const parseVttDialogs = (origins: string[]): Record<number, SrtSubtitlesItem> => {
  if (origins[0] !== WEBVTT) {
    throw new Error(NOT_VTT_ERROR);
  }
  let i = 1;
  let dialogs = {};
  while (i < origins.length) {
    const lineIndex = Object.keys(dialogs).length + 1;
    const temp = [];
    let times = [] as string[];
    i += 1;
    while (cleanLine(origins[i]) !== EMPTY_STRING && i < origins.length) {
      if (srtTimeValidator(origins[i])) {
        times = srtTimeExtract(origins[i]);
      } else if (!isEmpty(origins[i])) {
        temp.push(origins[i]);
      }
      i += 1;
    }
    if (!isEmptyArray(temp)) {
      dialogs = {
        ...dialogs,
        [lineIndex]: { startTime: times[0], endTime: times[1], text: temp.join(SPACE_SIGN + BIG_NEW_LINE_SIGN) }
      };
    }
  }
  return dialogs;
};

export const buildPrepare = (
  dialogs: Record<number, AssSubtitlesItem>, useSmartDialogSplitter = false): PrepareToTranslateItem[] => {
  const result = [] as PrepareToTranslateItem[];
  let tempoLines = [] as number[];
  let tempoText = EMPTY_STRING;
  const keys = Object.keys(dialogs).map((key) => (Number(key))).sort(CORRECT_SORT);
  for (let i = 0; i < keys.length; i++) {
    tempoLines.push(keys[i]);
    tempoText += ` ${dialogs[keys[i]].text}`;
    if (GOOD_END_SYMBOLS_MASK.test(dialogs[keys[i]].text) || !useSmartDialogSplitter) {
      const toTranslate = cleanLine(tempoText);
      !isEmpty(toTranslate) && result.push({ idx: result.length, lines: tempoLines, toTranslate });
      tempoLines = [];
      tempoText = EMPTY_STRING;
    } else if (i === keys.length - 1) {
      const toTranslate = cleanLine(tempoText);
      !isEmpty(toTranslate) && result.push({ idx: result.length, lines: tempoLines, toTranslate });
    }
  }
  return result;
};

const calcEffectIndex = (line: string, match: string): number => {
  const before = cleanLine(line.slice(0, line.indexOf(match)));
  return isEmpty(before) ? 0 : before.split(SPACE_SIGN).length;
};

export const buildEffects = (line: string): Record<number, string> => {
  let result = {} as Record<number, string>;
  const matches = line.match(ASS_EFFECTS_MASK);
  matches && matches.forEach((match) => {
    result = { ...result, [calcEffectIndex(line, match)]: match };
  });
  const srtMatches = line.match(SRT_EFFECTS_MASK);
  srtMatches && srtMatches.forEach((match) => {
    result = { ...result, [calcEffectIndex(line, match)]: match };
  });
  return result;
};

const countSymbols = (text: string): AbstractAnalysed => ({
  dotCount: countRegExpEntry(text, DOT_MASK),
  commaCount: countRegExpEntry(text, COMMA_MASK),
  quoteCount: countRegExpEntry(text, QUOTE_MASK),
  bracketCount: countRegExpEntry(text, BRACKET_MASK),
  dashCount: countRegExpEntry(text, DASH_MASK),
  colonCount: countRegExpEntry(text, COLON_MASK),
  semicolonCount: countRegExpEntry(text, SEMICOLON_MASK),
  questionMarkCount: countRegExpEntry(text, QUESTION_MARK_MASK),
  exclamationMarkCount: countRegExpEntry(text, EXCLAMATION_MARK_MASK)
});

export const analyseLine = (dialogLine: string): AnalysedDialog => {
  let result = {
    wordCount: cleanLine(dialogLine).split(SPACE_SIGN).length,
    dotCount: 0,
    commaCount: 0,
    quoteCount: 0,
    bracketCount: 0,
    dashCount: 0,
    colonCount: 0,
    semicolonCount: 0,
    questionMarkCount: 0,
    exclamationMarkCount: 0
  } as AnalysedDialog;
  const lines = dialogLine.split(NEXT_LINE_MASK);
  const analysed = [] as AnalysedLine[];
  if (DRAW_MASK.test(dialogLine)) {
    analysed.push({ ...result, effects: { 0: dialogLine } });
  } else {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(ITALIAN_MASK, EMPTY_STRING).replace(DRAW_MASK, EMPTY_STRING);
      const pureLine = cleanLine(lines[i]);
      const countedSymbols = countSymbols(pureLine);
      analysed.push({
        ...countedSymbols,
        wordCount: pureLine && pureLine.length > 0 ? pureLine.split(SPACE_SIGN).length : 0,
        effects: ASS_EFFECTS_MASK.test(line) || SRT_EFFECTS_MASK.test(line) ? buildEffects(line) : {}
      });
      result = {
        ...result,
        dotCount: result.dotCount + countedSymbols.dotCount,
        commaCount: result.commaCount + countedSymbols.commaCount,
        quoteCount: result.quoteCount + countedSymbols.quoteCount,
        bracketCount: result.bracketCount + countedSymbols.bracketCount,
        dashCount: result.dashCount + countedSymbols.dashCount,
        colonCount: result.colonCount + countedSymbols.colonCount,
        semicolonCount: result.semicolonCount + countedSymbols.semicolonCount,
        questionMarkCount: result.questionMarkCount + countedSymbols.questionMarkCount,
        exclamationMarkCount: result.exclamationMarkCount + countedSymbols.exclamationMarkCount
      };
    }
  }
  return { ...result, lines: analysed };
};

export const analyseLines = (dialogs: Record<number, AssSubtitlesItem>): AnalysedItem => {
  let result = {} as AnalysedItem;
  for (const key in dialogs) {
    const analysed = analyseLine(dialogs[key].text);
    const analysedLines = analysed.lines || [];
    if (!isEmptyArray(analysedLines) || !(analysedLines.length === 1 && analysedLines[0].wordCount === 0) ||
      (analysed && analysed.wordCount > 0)) {
      result = { ...result, [key]: analysed };
    }
  }
  return result;
};

const addEffects = (words: string[], effects: Record<number, string>): void => {
  effects && Object.keys(effects).map((i) => Number(i)).forEach((key) => {
    if (words[key]) {
      words[key] = effects[key] + words[key];
    } else {
      words[words.length - 1] = words[words.length - 1] + effects[key];
    }
  });
};

/**
 const allLess = <T extends AbstractAnalysed> (from: T, diff: T): boolean => (Object.keys(from)
 .map((key) => (from[key] < diff[key])).reduce((acc, cur) => acc && cur, true));
 */

const anyLess = <T extends AbstractAnalysed> (
  from: T, diff: T, filter: (key: string) => boolean = () => true): boolean => (Object.keys(from).filter(filter)
    .map((key) => (from[key] < diff[key])).reduce((acc, cur) => acc || cur, false));

const allZeros = <T extends AbstractAnalysed> (
  obj: T, filter: (key: string) => boolean = () => true): boolean => (Object.keys(obj)
    .filter(filter)
    .map((key) => Number(obj[key])).reduce((acc, cur) => (Number.isNaN(cur) ? acc : acc + cur), 0) === 0);

const splitCharsByLine = (words: string[], linesPerWord: number, lines: AnalysedLine[], result: string[]): void => {
  for (let i = 0; i < words.length; i++) {
    let characters = Array.from(words[i]);
    const charsPerLines = Math.ceil(characters.length / linesPerWord);
    const temp = [];
    for (let j = i * linesPerWord; j < i * linesPerWord + linesPerWord; j++) {
      const cur = lines[j];
      if (cur.wordCount > 0) {
        const head = [characters[0]];
        let n = 1;
        while ((anyLess(countSymbols(head.join(EMPTY_STRING)), cur) ||
          (allZeros(cur, withoutWordCount) && n < charsPerLines)) && n < characters.length) {
          head.push(characters[n]);
          n += 1;
        }
        addEffects(head, cur.effects);
        temp.push(head.join(EMPTY_STRING));
        characters = characters.slice(n);
      } else {
        temp.push(BIG_NEW_LINE_SIGN);
      }
    }
    result.push(temp.join(BIG_NEW_LINE_SIGN));
  }
};

const splitWordsByLine = (linesCount: number, lines: AnalysedLine[], words: string[], result: string[]): void => {
  let temp = [...words];
  for (let i = 0; i < linesCount; i++) {
    const cur = lines[i];
    if (cur.wordCount > 0) {
      const head = [temp[0]];
      let j = 1;
      while ((anyLess(countSymbols(head.join(SPACE_SIGN)), cur, withoutDashes) ||
        (allZeros(cur, withoutWordCount) && j < cur.wordCount) ||
        (allZeros(cur, withoutWordAndDashes) && anyLess(countSymbols(head.join(SPACE_SIGN)), cur))) && cur.wordCount >
      1 &&
      j < temp.length) {
        head.push(temp[j]);
        j += 1;
      }
      addEffects(head, cur.effects);
      result.push(head.join(SPACE_SIGN));
      temp = temp.slice(j);
    } else {
      result.push(EMPTY_STRING);
    }
  }
};

const restoreLine = (text: string, analysis: AnalysedDialog): string => {
  const result = [] as string[];
  const words = text.split(SPACE_SIGN);
  const lines = analysis.lines;
  const linesCount = lines.length;
  if (linesCount > 1) {
    if (linesCount > words.length) {
      const linesPerWord = Math.floor(linesCount / words.length);
      splitCharsByLine(words, linesPerWord, lines, result);
    } else {
      splitWordsByLine(linesCount, lines, words, result);
    }
  } else {
    addEffects(words, lines[0].effects);
    return words.join(SPACE_SIGN);
  }
  return result.join(BIG_NEW_LINE_SIGN);
};

export const buildTranslatedDialogs = (translated: TranslatedItem[], analysis: AnalysedItem): TranslatedDialogItem => {
  let result = {} as TranslatedDialogItem;
  for (let i = 0; i < translated.length; i++) {
    const lineIdxs = translated[i].lines;
    const linesCount = lineIdxs.length;
    const text = cleanLine(translated[i].text);
    if (linesCount > 1) {
      let words = text.split(SPACE_SIGN);
      for (let j = 0; j < linesCount; j++) {
        const cur = analysis[lineIdxs[j]];
        const temp = [words[0]];
        let k = 1;
        while ((anyLess(countSymbols(temp.join(SPACE_SIGN)), cur, onlyEndSymbols) ||
          (allZeros(cur, withoutWordCount) && k < cur.wordCount) ||
          (allZeros(cur, withoutNonEndSymbols) && anyLess(countSymbols(temp.join(SPACE_SIGN)), cur))) &&
        cur.wordCount > 1 && k < words.length) {
          temp.push(words[k]);
          k += 1;
        }
        result = { ...result, [lineIdxs[j]]: restoreLine(temp.join(SPACE_SIGN), cur) };
        words = words.slice(k);
      }
    } else {
      result = { ...result, [lineIdxs[0]]: restoreLine(text, analysis[lineIdxs[0]]) };
    }
  }
  return result;
};

const buildAssDialogLine = (
  dialog: AssSubtitlesItem,
  text: string
): string => (`Dialogue: ${dialog.layer || ZERO_INT_SIGN},${dialog.startTime || EMPTY_STRING},${dialog.endTime ||
EMPTY_STRING},${dialog.style || EMPTY_STRING},${dialog.actor || EMPTY_STRING},${dialog.marginL ||
ZERO_INT_SIGN},${dialog.marginR || ZERO_INT_SIGN},${dialog.marginV || ZERO_INT_SIGN},${dialog.effect ||
EMPTY_STRING},${text || EMPTY_STRING}`);

export const buildExportLines = (
  origin: string[], fileFormat: string, dialogs: Record<number, AssSubtitlesItem>,
  translatedDialogs: TranslatedDialogItem
): string[] => {
  const result = [];
  if (fileFormat === FileFormat.ASS) {
    for (let i = 0; i < origin.length; i++) {
      if (translatedDialogs[i]) {
        result.push(buildAssDialogLine(dialogs[i], translatedDialogs[i]));
      } else {
        result.push(origin[i]);
      }
    }
  } else {
    fileFormat === FileFormat.VTT && result.push(WEBVTT);
    fileFormat === FileFormat.VTT && result.push(EMPTY_STRING);
    Object.keys(translatedDialogs).map((key) => Number(key)).sort(CORRECT_SORT).forEach((i) => {
      fileFormat === FileFormat.SRT && result.push(String(i));
      result.push(`${dialogs[i].startTime || EMPTY_STRING} --> ${dialogs[i].endTime || EMPTY_STRING}`);
      translatedDialogs[i].split(BIG_NEW_LINE_SIGN).forEach((text) => result.push(text));
      result.push(EMPTY_STRING);
    });
  }
  return result;
};
