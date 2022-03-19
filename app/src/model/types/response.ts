import { DefaultState } from '~types/state';

export interface AnyResponse {
  [key: string]: string | unknown;

  responseStatus?: string;
  responseId?: string;
  responseTitle?: string;
  responseMessage?: string;
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

export type GoogleTranslateResponse = Record<number, string>[];

export interface AnyTextResponse extends AnyResponse {
  text: string;
}
