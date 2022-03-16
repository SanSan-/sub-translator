import TranslationType from '~enums/module/TranslationType';
import TranslatorApiType from '~enums/module/TranslatorApiType';
import SubtitlesType from '~enums/module/SubtitlesType';

export const subsTypeFilter: string[] = [
  SubtitlesType.ASS,
  SubtitlesType.SRT
];

export const transTypeFilter: string[] = [
  TranslatorApiType.GOOGLE
];

export const transLangFilter: string[] = [
  TranslationType.EN,
  TranslationType.RU
];
