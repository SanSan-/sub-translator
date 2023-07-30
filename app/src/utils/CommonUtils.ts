import Type from '~enums/Types';
import { EMPTY_STRING, MINUS_SIGN, UNDERGROUND_SIGN } from '~const/common';
import { DetailMessage } from '~types/dto';

export const isEmpty = (value: unknown): boolean =>
  value === null || typeof value === Type.UNDEFINED || value === EMPTY_STRING;

export const isEmptyObject = <T> (value: T): boolean => isEmpty(value) ||
  (value.constructor === Object && Object.keys(value).length === 0);

export const isEmptyArray = <T> (value: T): boolean => !(value && value instanceof Array && value.length > 0);

export const isClient = (): boolean => typeof window === Type.OBJECT;

export const isAllPropsInObjectAreNull = (obj: Record<string, unknown>): boolean => {
  if (!isEmptyObject(obj)) {
    for (const key in obj) {
      if (obj[key] !== null) {
        return false;
      }
    }
  }
  return true;
};

export const sleep = (waitTimeInMs: number) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

export const getFinalMessage = (message: DetailMessage): DetailMessage => message && message.cause ?
  getFinalMessage(message.cause) : message;

export const detectLanguage = (): string[] => {
  let lang = window.navigator.languages ? window.navigator.languages[0] : null as string;
  lang = lang || window.navigator.language || window.navigator.browserLanguage as string ||
    window.navigator.userLanguage as string;

  let shortLang = lang;
  if (shortLang.indexOf(MINUS_SIGN) !== -1) {
    shortLang = shortLang.split(MINUS_SIGN)[0];
  }

  if (shortLang.indexOf(UNDERGROUND_SIGN) !== -1) {
    shortLang = shortLang.split(UNDERGROUND_SIGN)[0];
  }

  return [lang, shortLang];
};
