import * as backend from '~actions/backend';
import { SubsAction, ThunkResult } from '~types/action';
import ActionType from '~enums/module/SubsTranslator';
import { translateApi } from '~dictionaries/backend';
import { AnyTextResponse, FileActionType } from '~types/response';
import { ErrorType } from '~types/dto';
import { Either } from '@sweet-monads/either';
import { SubtitlesTranslationFilter } from '~types/filter';
import SubtitlesType from '~enums/module/SubtitlesType';
import { GoogleTranslationOptions, PrepareToTranslateItem, TranslationOptions } from '~types/state';

export const addTranslatedSuccess = (
  translatedText: string, translatedIdx: number, translatedLines: number[]): SubsAction => ({
  type: ActionType.ADD_TRANSLATED_SUCCESS,
  translatedText,
  translatedIdx,
  translatedLines
});

export const startTranslation = (): SubsAction => ({
  type: ActionType.START_TRANSLATION
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

export const fileActionSuccess = (
  fileName?: string, subsType?: string, stringData?: string
): SubsAction => ({
  type: ActionType.FILE_ACTION_SUCCESS,
  fileName,
  subsType,
  stringData
});

export const fileActionFailed = (fileName?: string, subsType?: string, fileActionError?: string): SubsAction => ({
  type: ActionType.FILE_ACTION_FAIL,
  fileActionError,
  fileName,
  subsType
});

export const importFromSubs = (
  filter: SubtitlesTranslationFilter, data: string): ThunkResult<void, SubsAction> => (dispatch) => {
  try {
    switch (filter.subtitlesType) {
      case SubtitlesType.SRT: {
        dispatch(
          fileActionSuccess(
            filter.fileName,
            filter.subtitlesType,
            data
          ));
        break;
      }
      case SubtitlesType.ASS: {
        dispatch(
          fileActionSuccess(
            filter.fileName,
            filter.subtitlesType,
            data
          ));
        break;
      }
    }
  } catch (error) {
    dispatch(fileActionFailed(filter.fileName, filter.subtitlesType, error));
  }
};

const translateOne = (
  line: PrepareToTranslateItem,
  opts: GoogleTranslationOptions
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
  opts: TranslationOptions
): ThunkResult<Promise<void>, SubsAction> => (dispatch) => (Promise.allSettled(
  lines.map((line) => dispatch(translateOne(line, { from: opts.from, to: opts.to }))))
  // eslint-disable-next-line no-console
  .catch((response: Error) => console.error(response)));

export const translate = (
  lines: PrepareToTranslateItem[], opts: TranslationOptions,
  threadCount = 1
): ThunkResult<void, SubsAction> => async (dispatch) => {
  dispatch(startTranslation());
  let start = 0;
  while (start < lines.length) {
    await dispatch(translateParallel(lines.slice(start, start + threadCount), opts));
    start += threadCount;
  }
  dispatch(endTranslation());
};
