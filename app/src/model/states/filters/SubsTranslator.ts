import { SubtitlesTranslationFilter } from '~types/filter';
import SubtitlesType from '~enums/module/SubtitlesType';
import TranslationType from '~enums/module/TranslationType';
import TranslatorApiType from '~enums/module/TranslatorApiType';

const defaultFilter: SubtitlesTranslationFilter = {
  subtitlesType: SubtitlesType.ASS,
  fileName: null,
  translateApi: TranslatorApiType.GOOGLE,
  originFromLanguage: null,
  destinationLanguage: TranslationType.RU
};

export default defaultFilter;
