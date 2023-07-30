import { DefaultState } from '~types/state';

export interface AnyResponse {
  responseStatus?: string;
  responseId?: string;
  responseTitle?: string;
  responseMessage?: string;

  [key: string]: string | boolean | unknown;
}

export interface FileActionType extends DefaultState {
  actionType?: string;
  contentType?: string;
  format?: string;
  useSmartDialogSplitter?: boolean;
}

export interface YandexTranslateItem {
  text: string;
  detectedLanguageCode?: string;
}

export interface YandexTranslateResponse {
  translations: YandexTranslateItem[];
}

export interface YandexErrorDetails {
  '@type'?: string;
  requestId?: string;
}

export interface YandexErrorResponse {
  code: number;
  message: string;
  details?: YandexErrorDetails;
}

export interface TranslateLanguageResponse {
  didYouMean: boolean;
  iso: string;
}

export interface TranslateTextResponse {
  autoCorrected: boolean;
  value: string;
  didYouMean: boolean;
}

export interface TranslateFromResponse {
  language: TranslateLanguageResponse;
  text: TranslateTextResponse;
}

export type StringOrStringArray = string | string[] | StringOrStringArray[];

export interface GoogleTranslateResponse extends AnyResponse {
  text: string;
  pronunciation: string;
  from: TranslateFromResponse;
  raw: StringOrStringArray;
}
