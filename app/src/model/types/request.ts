import { DefaultState, DefaultStringState } from '~types/state';

interface GlossaryPair extends DefaultStringState {
  sourceText?: string;
  translatedText?: string;
}

interface GlossaryData extends DefaultState {
  glossaryPairs?: GlossaryPair[];
}

interface GlossaryConfig extends DefaultState {
  glossaryData?: GlossaryData;
}

export interface YandexTranslateRequest extends DefaultState {
  sourceLanguageCode?: string;
  targetLanguageCode?: string;
  texts?: string[];
  format?: string;
  folderId?: string;
  model?: string;
  glossaryConfig?: GlossaryConfig;
}
