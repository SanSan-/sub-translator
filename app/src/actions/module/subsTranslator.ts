import * as backend from '~actions/backend';
import { SubsAction, ThunkResult } from '~types/action';
import ActionType from '~enums/module/SubsTranslator';
import { translateApi } from '~dictionaries/backend';
import { AnyTextResponse, FileActionType } from '~types/response';
import { ErrorType } from '~types/dto';
import { Either } from '@sweet-monads/either';
import { SubtitlesTranslationFilter } from '~types/filter';
import { GoogleTranslationOptions, PrepareToTranslateItem, TranslationOptions } from '~types/state';
import { FileAction } from '~enums/File';
import { HARD_NEW_LINE_SIGN } from '~const/common';

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
  try {
    dispatch(
      fileActionSuccess(
        { format: filter.subtitlesType, actionType: FileAction.IMPORT },
        filter.fileName,
        data
      ));
  } catch (error) {
    dispatch(fileActionFailed({ format: filter.subtitlesType, actionType: FileAction.IMPORT }, filter.fileName, error));
  }
};

export const exportData = (
  fileName: string, toExport: string[], format: string): ThunkResult<void, SubsAction> => (dispatch) => {
  dispatch(startFileAction({ actionType: FileAction.EXPORT, format }));
  dispatch(fileActionSuccess({ actionType: FileAction.EXPORT, format }, fileName, toExport.join(HARD_NEW_LINE_SIGN)));
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
  dispatch(startTranslation(opts));
  let start = 0;
  while (start < lines.length) {
    await dispatch(translateParallel(lines.slice(start, start + threadCount), opts));
    start += threadCount;
  }
  dispatch(endTranslation());
};
