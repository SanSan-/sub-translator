import TranslatorApiType from '~enums/module/TranslatorApiType';
import { FileFormat } from '~enums/File';
import { LabeledValue } from 'antd/lib/select';
import { langs } from '~dictionaries/languages';

export const subsTypeFilter: LabeledValue[] = [
  { key: FileFormat.ASS, label: 'Aegisub Advanced SSA Subtitle (ASS)', value: FileFormat.ASS },
  { key: FileFormat.SRT, label: 'Aegisub SubRip text subtitle (SRT)', value: FileFormat.SRT },
  { key: FileFormat.VTT, label: 'Web Video Text Tracks (WebVTT)', value: FileFormat.VTT }
];

export const transTypeFilter: LabeledValue[] = [
  { key: TranslatorApiType.GOOGLE, label: 'Google Translate API', value: TranslatorApiType.GOOGLE },
  { key: TranslatorApiType.YANDEX, label: 'Yandex Translate API', value: TranslatorApiType.YANDEX }
];

export const transLangFilter: LabeledValue[] = Object.keys(langs)
  .map((key) => ({ key, label: langs[key], value: key }));

export const onlyEndSymbols = (key: string): boolean => (key !== 'commaCount' && key !== 'dashCount');
export const withoutDashes = (key: string): boolean => (key !== 'dashCount');
export const withoutWordCount = (key: string): boolean => (key !== 'wordCount');
export const withoutWordAndDashes = (key: string): boolean => (key !== 'wordCount' && key !== 'dashCount');
export const withoutNonEndSymbols = (key: string): boolean => (key !== 'wordCount' && key !== 'dashCount' && key !==
  'commaCount');
