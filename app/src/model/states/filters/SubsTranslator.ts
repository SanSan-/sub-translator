import { SubtitlesTranslationFilter } from '~types/filter';
import Languages from '~enums/module/Languages';
import TranslatorApiType from '~enums/module/TranslatorApiType';
import { FileFormat } from '~enums/File';

const defaultFilter: SubtitlesTranslationFilter = {
  subtitlesType: FileFormat.ASS,
  fileName: null,
  translateApi: TranslatorApiType.YANDEX,
  originFromLanguage: Languages.EN,
  destinationLanguage: Languages.RU
};

export default defaultFilter;
