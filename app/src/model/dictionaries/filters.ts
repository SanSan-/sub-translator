import TranslationType from '~enums/module/TranslationType';
import TranslatorApiType from '~enums/module/TranslatorApiType';
import { FileFormat } from '~enums/File';

export const subsTypeFilter: string[] = [
  FileFormat.ASS,
  FileFormat.SRT
];

export const transTypeFilter: string[] = [
  TranslatorApiType.GOOGLE
];

export const transLangFilter: string[] = [
  TranslationType.EN,
  TranslationType.RU
];
