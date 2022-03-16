import saveAs from 'file-saver';
import { EMPTY_STRING } from '~const/common';
import { ContentType } from '~enums/Http';
import { isEmpty, isEmptyArray } from '~utils/CommonUtils';

const FILENAME_MASK = /filename[^;\n]*=\s*(UTF-\d['"]*)?((['"]).*?[.]$\2|[^;\n]*)?/gi;

export const saveBase64StringAsFile = (data: string, fileName: string): void => {
  const blob = new Blob(
    [new Uint8Array(window.atob(data).split(EMPTY_STRING).map((symbol) => symbol.charCodeAt(0)))],
    { type: ContentType.OCTET_STREAM }
  );
  saveAs(blob, fileName);
};

export const saveStringAsFile = (data: string, fileName: string, type: string): void => {
  const blob = new Blob(
    [data],
    { type }
  );
  saveAs(blob, fileName);
};

const regexExecAll = (str: string, regex: RegExp) => {
  let lastMatch: RegExpExecArray | null;
  const matches: RegExpExecArray[] = [];
  while ((lastMatch = regex.exec(str))) {
    matches.push(lastMatch);
    if (!regex.global) {
      break;
    }
  }
  return matches;
};

export const parseFileName = (contentDisposition: string): string => {
  const matches = regexExecAll(contentDisposition, FILENAME_MASK);
  if (isEmptyArray(matches)) {
    return EMPTY_STRING;
  }
  if (matches.length > 1) {
    return matches.map((match) => (match.length > 2 ? match[2] : match[0])).reduce((prev, cur) => {
      if (isEmpty(prev)) {
        return cur.replace(/"/gi, EMPTY_STRING);
      }
      return prev === cur ? prev : decodeURI(cur);
    }, EMPTY_STRING);
  }
  return matches.map((match) => (match.length > 2 ? match[2] : match[0]))
    .join(EMPTY_STRING).replace(/"/gi, EMPTY_STRING);
};

