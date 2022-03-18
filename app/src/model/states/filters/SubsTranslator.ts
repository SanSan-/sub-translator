import { SubtitlesTranslationFilter } from '~types/filter';
import TranslationType from '~enums/module/TranslationType';
import TranslatorApiType from '~enums/module/TranslatorApiType';
import { FileFormat } from '~enums/File';

const defaultFilter: SubtitlesTranslationFilter = {
  subtitlesType: FileFormat.ASS,
  fileName: null,
  translateApi: TranslatorApiType.GOOGLE,
  originFromLanguage: null,
  destinationLanguage: TranslationType.RU
};

export default defaultFilter;
