import { BIG_NEW_LINE_SIGN, EMPTY_STRING, SPACE_SIGN } from '~const/common';
import {
  DOUBLE_SPACES_AND_NEXT_LINE_MASK,
  DRAW_MASK,
  EFFECTS_MASK,
  GOOD_END_SYMBOLS_MASK,
  ITALIAN_MASK,
  NEXT_LINE_MASK,
  PURE_EFFECTS_MASK
} from '~dictionaries/regExp';
import badSymbols from '~dictionaries/badSymbols';
import {
  AssSubtitlesItem,
  EffectDialogItem,
  PrepareToTranslateItem,
  TranslatedDialogItem,
  TranslatedItem
} from '~types/state';
import { isEmptyArray } from '~utils/CommonUtils';

const replaceAll = (input: string, from: string, to: string): string => {
  const fromLen = from.length;
  let output = '';
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

export const formatLine = (line: string, dictionary: { key: string, val: string }[]): string => {
  let temp = EMPTY_STRING;
  for (let i = 0; i < dictionary.length; i++) {
    temp = replaceAll(line, dictionary[i].key, dictionary[i].val);
  }
  return temp;
};

export const cleanLine = (text: string): string => formatLine(text, badSymbols)
  .replace(DOUBLE_SPACES_AND_NEXT_LINE_MASK, SPACE_SIGN)
  .replace(DRAW_MASK, EMPTY_STRING)
  .replace(EFFECTS_MASK, EMPTY_STRING)
  .trim();

export const analysisLine = (text: string): string[] => text.split(SPACE_SIGN).reduce((acc, cur) => {
  const temp = [];
  const line = cur.replace(ITALIAN_MASK, EMPTY_STRING).replace(DRAW_MASK, EMPTY_STRING);
  if (EFFECTS_MASK.test(line)) {
    const match = PURE_EFFECTS_MASK.exec(line);
    if (match.length > 1) {
      for (let i = 1; i < match.length; i++) {
        temp.push(match[i]);
      }
    }
  }
  if (NEXT_LINE_MASK.test(line)) {
    temp.push(BIG_NEW_LINE_SIGN);
  }
  return temp.length > 0 ? [...acc, ...temp] : acc;
}, [] as string[]);

export const buildPrepare = (dialogs: Record<number, AssSubtitlesItem>): PrepareToTranslateItem[] => {
  const result = [] as PrepareToTranslateItem[];
  let tempoLines = [] as number[];
  let tempoText = EMPTY_STRING;
  const keys = Object.keys(dialogs).map((key) => (Number(key))).sort();
  for (let i = 0; i < keys.length; i++) {
    tempoLines.push(keys[i]);
    tempoText += ` ${dialogs[keys[i]].text}`;
    if (GOOD_END_SYMBOLS_MASK.test(dialogs[keys[i]].text)) {
      const toTranslate = cleanLine(tempoText);
      result.push({ idx: result.length, lines: tempoLines, toTranslate });
      tempoLines = [];
      tempoText = EMPTY_STRING;
    }
  }
  return result;
};

export const buildEffects = (dialogs: Record<number, AssSubtitlesItem>): EffectDialogItem => {
  let result = {} as EffectDialogItem;
  for (const key in dialogs) {
    const analysis = analysisLine(dialogs[key].text);
    if (!isEmptyArray(analysis)) {
      result = { ...result, [key]: analysis };
    }
  }
  return result;
};

export const buildTranslated = (dialogs: TranslatedItem[]): TranslatedDialogItem => {
  let result = {} as TranslatedDialogItem;
  for (let i = 0; i < dialogs.length; i++) {
    const lines = dialogs[i].lines;
    const linesCount = lines.length;
    const text = dialogs[i].text;
    if (linesCount > 1) {
      const splinted = text.split(SPACE_SIGN);
      const limit = Math.floor(splinted.length / linesCount);
      for (let j = 0; j < linesCount; j++) {
        result = { ...result, [lines[j]]: splinted.slice(j * limit, j * limit + limit).join(SPACE_SIGN) };
      }
    } else {
      result = { ...result, [lines[0]]: text };
    }
  }
  return result;
};

const buildDialogLine = (
  dialog: AssSubtitlesItem,
  text: string
  // eslint-disable-next-line max-len
): string => (`Dialogue: ${dialog.layer},${dialog.startTime},${dialog.endTime},${dialog.style},${dialog.actor},${dialog.marginL},${dialog.marginR},${dialog.marginV},${dialog.effect},${text}`);

const buildTranslatedLine = (dialog: AssSubtitlesItem, translated: string, effect: string[]): string => {
  if (!isEmptyArray(effect)) {
    let newLineCount = 0;
    let temp = EMPTY_STRING;
    for (let i = 0; i < effect.length; i++) {
      if (effect[i] === BIG_NEW_LINE_SIGN) {
        newLineCount += 1;
      } else {
        temp += effect[i];
      }
    }
    if (newLineCount > 0) {
      const splinted = translated.split(SPACE_SIGN);
      const limit = Math.floor(splinted.length / newLineCount);
      const separated = [];
      for (let j = 0; j < newLineCount; j++) {
        separated.push(splinted.slice(j * limit, j * limit + limit).join(SPACE_SIGN));
      }
      return buildDialogLine(dialog, temp + separated.join(BIG_NEW_LINE_SIGN));
    }
    return buildDialogLine(dialog, temp + translated);

  }
  return buildDialogLine(dialog, translated);
};

export const buildExportLines = (
  origin: string[], dialogs: Record<number, AssSubtitlesItem>, translatedDialogs: TranslatedDialogItem,
  effects: EffectDialogItem
): string[] => {
  const result = [];
  for (let i = 0; i < origin.length; i++) {
    if (translatedDialogs[i]) {
      result.push(buildTranslatedLine(dialogs[i], translatedDialogs[i], effects[i]));
    } else {
      result.push(origin[i]);
    }
  }
  return result;
};
