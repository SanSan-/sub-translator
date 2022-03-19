import * as backend from '~actions/backend';
import _ from 'lodash';
import { SubsAction, ThunkResult } from '~types/action';
import ActionType from '~enums/actions/SubsTranslator';
import { translateApi } from '~dictionaries/backend';
import { AnyTextResponse, FileActionType, GoogleTranslateResponse, YandexTranslateResponse } from '~types/response';
import { ErrorType } from '~types/dto';
import { Either } from '@sweet-monads/either';
import { SubtitlesTranslationFilter } from '~types/filter';
import { GoogleTranslateOpts, PrepareToTranslateItem, TranslationOptions } from '~types/state';
import { FileAction } from '~enums/File';
import { EMPTY_STRING, HARD_NEW_LINE_SIGN } from '~const/common';
import TranslatorApiType from '~enums/module/TranslatorApiType';
import yandexTranslate from '~actions/module/yandexTranslate';
import { isEmptyArray } from '~utils/CommonUtils';

const init = (): SubsAction => ({
  type: ActionType.INIT
});

export const updatePrepareState = (fileAction: FileActionType): SubsAction => ({
  type: ActionType.UPDATE_PREPARE_STATE,
  fileAction
});

export const addTranslatedSuccess = (
  translatedText: string, translatedIdx: number, translatedLines: number[]): SubsAction => ({
  type: ActionType.ADD_TRANSLATED_SUCCESS,
  translatedText,
  translatedIdx,
  translatedLines
});

export const startTranslation = (opts: TranslationOptions): SubsAction => ({
  type: ActionType.START_TRANSLATION,
  translationOpts: opts
});

export const endTranslation = (): SubsAction => ({
  type: ActionType.END_TRANSLATION
});

export const refreshTranslatedCounter = (): SubsAction => ({
  type: ActionType.REFRESH_TRANSLATED_COUNT
});

export const startFileAction = (fileAction: FileActionType): SubsAction => ({
  type: ActionType.START_FILE_ACTION,
  fileAction
});

export const endFileAction = (fileAction: FileActionType): SubsAction => ({
  type: ActionType.END_FILE_ACTION,
  fileAction
});

export const fileActionSuccess = (fileAction: FileActionType, fileName?: string, stringData?: string): SubsAction => ({
  type: ActionType.FILE_ACTION_SUCCESS,
  fileAction,
  fileName,
  stringData
});

export const fileActionFailed = (
  fileAction: FileActionType, fileName?: string, fileActionError?: string): SubsAction => ({
  type: ActionType.FILE_ACTION_FAIL,
  fileAction,
  fileActionError,
  fileName
});

export const importData = (
  filter: SubtitlesTranslationFilter, data: string): ThunkResult<void, SubsAction> => (dispatch) => {
  dispatch(init());
  try {
    dispatch(
      fileActionSuccess(
        {
          format: filter.subtitlesType,
          actionType: FileAction.IMPORT,
          useSmartDialogSplitter: filter.useSmartDialogSplitter
        },
        filter.fileName,
        data
      ));
  } catch (error: unknown) {
    dispatch(fileActionFailed({ format: filter.subtitlesType, actionType: FileAction.IMPORT }, filter.fileName,
      error as string
    ));
  }
};

export const updateFile = (
  useSmartDialogSplitter: boolean): ThunkResult<void, SubsAction> => (dispatch) => {
  dispatch(updatePrepareState({ useSmartDialogSplitter }));
};

export const exportData = (
  fileName: string, toExport: string[], format: string): ThunkResult<void, SubsAction> => (dispatch) => {
  dispatch(startFileAction({ actionType: FileAction.EXPORT, format }));
  dispatch(fileActionSuccess({ actionType: FileAction.EXPORT, format }, fileName, toExport.join(HARD_NEW_LINE_SIGN)));
};

const translateByGoogleOnce = (
  line: PrepareToTranslateItem,
  opts: GoogleTranslateOpts
): ThunkResult<Promise<void>, SubsAction> => (dispatch) => (
  dispatch(backend.executeRequest(translateApi.googleTranslate, { text: line.toTranslate, opts }, { spinner: false }))
    .then((either: Either<ErrorType, AnyTextResponse>) => {
      either.mapRight((response) => {
        dispatch(addTranslatedSuccess(response.text, line.idx, line.lines));
      })
        .mapLeft(() => dispatch(endTranslation()));
    })
    .catch((response: Error) => {
      // eslint-disable-next-line no-console
      console.error(response);
      dispatch(endTranslation());
    })
);

const translateParallel = (
  lines: PrepareToTranslateItem[],
  opts: GoogleTranslateOpts
): ThunkResult<Promise<void>, SubsAction> => (dispatch) => (Promise.allSettled(
  lines.map((line) => dispatch(translateByGoogleOnce(line, { from: opts.from, to: opts.to }))))
  // eslint-disable-next-line no-console
  .catch((response: Error) => console.error(response)));
const translateByYandex = (
  lines: PrepareToTranslateItem[],
  opts: GoogleTranslateOpts
): ThunkResult<Promise<void>, SubsAction> => (dispatch) => (
  dispatch(yandexTranslate({
    sourceLanguageCode: opts.from,
    targetLanguageCode: opts.to,
    texts: lines.map((line) => line.toTranslate)
  }))
    .then((either: Either<ErrorType, YandexTranslateResponse>) => {
      either.mapRight((response) => {
        const translations = response.translations;
        if (translations && translations.length > 0) {
          for (let i = 0; i < translations.length; i++) {
            dispatch(addTranslatedSuccess(translations[i].text, lines[i].idx, lines[i].lines));
          }
        }
      })
        .mapLeft(() => dispatch(endTranslation()));
    })
    .catch((response: Error) => {
      // eslint-disable-next-line no-console
      console.error(response);
      dispatch(endTranslation());
    })
);

const translateByGoogleMulti = (
  lines: PrepareToTranslateItem[],
  opts: GoogleTranslateOpts
): ThunkResult<Promise<void>, SubsAction> => (dispatch) => (
  dispatch(backend.executeRequest(translateApi.googleTranslateMulti,
    { tranObj: lines.map((line, i) => ({ [i]: line.toTranslate })), opts }, { spinner: false }
  ))
    .then((either: Either<ErrorType, GoogleTranslateResponse>) => {
      either.mapRight((response) => {
        response.forEach((pair, i) => dispatch(addTranslatedSuccess(pair[i], lines[i].idx, lines[i].lines)));
      })
        .mapLeft(() => dispatch(endTranslation()));
    })
    .catch((response: Error) => {
      // eslint-disable-next-line no-console
      console.error(response);
      dispatch(endTranslation());
    })
);

const translateParallelMulti = (
  lines: PrepareToTranslateItem[],
  threadCount: number,
  batchSize: number,
  opts: GoogleTranslateOpts
): ThunkResult<Promise<void>, SubsAction> => (dispatch) => (Promise.allSettled(
  _.range(0, threadCount)
    .map((i: number) => lines.slice(i * batchSize, i * batchSize + batchSize))
    .filter((prep) => !isEmptyArray(prep))
    .map((prep) => dispatch(translateByGoogleMulti(prep, opts))))
  // eslint-disable-next-line no-console
  .catch((response: Error) => console.error(response)));

export const translate = (
  lines: PrepareToTranslateItem[], opts: TranslationOptions,
  threadCount = 1, batchSize = 50, maxLen = 7000
): ThunkResult<void, SubsAction> => async (dispatch) => {
  dispatch(startTranslation(opts));
  switch (opts.api) {
    case TranslatorApiType.YANDEX: {
      let start = 0;
      let i = 0;
      let temp = [];
      while (i < lines.length) {
        temp.push(lines[i].toTranslate);
        if (temp.join(EMPTY_STRING).length >= maxLen || i - start >= batchSize) {
          await dispatch(translateByYandex(lines.slice(start, i - 1), opts));
          start = i;
          temp = [];
        }
        i += 1;
      }
      await dispatch(translateByYandex(lines.slice(start), opts));
      break;
    }
    case TranslatorApiType.GOOGLE: {
      for (let i = 0; i < lines.length; i += batchSize * threadCount) {
        await dispatch(
          translateParallelMulti(lines.slice(i, i + (batchSize * threadCount)), threadCount, batchSize, opts));
      }
      break;
    }
    default: {
      let start = 0;
      while (start < lines.length) {
        await dispatch(translateParallel(lines.slice(start, start + threadCount), opts));
        start += threadCount;
      }
    }
  }
  dispatch(endTranslation());
};
