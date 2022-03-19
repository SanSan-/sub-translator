import ActionType from '~enums/module/SubsTranslator';
import { SubsState, TranslationOptions } from '~types/state';
import { SubsAction } from '~types/action';
import produce, { original } from 'immer';
import { FileActionType } from '~types/response';
import { FileAction, FileFormat } from '~enums/File';
import { assSeparator, assValidator } from '~utils/ValidationUtils';
import { buildEffects, buildExportLines, buildPrepare, buildTranslatedDialogs } from '~utils/LineUtils';
import { HARD_NEW_LINE_SIGN } from '~const/common';
import { ContentType } from '~enums/Http';
import { saveStringAsFile } from '~utils/SaveUtils';

export const initialState: SubsState = {
  origin: [],
  dialogs: {},
  prepare: [],
  effects: {},
  translationOpts: {},
  translated: [],
  translatedCount: 0,
  translateStartDate: null,
  toExport: [],
  fileName: null,
  subsType: null,
  fileActionError: null,
  isTranslating: false,
  isLoadingExport: false,
  isFileActionFailed: false
};

const refreshTranslation = (draft: SubsState): SubsState => {
  draft.translatedCount = 0;
  draft.translated = [];
  return draft;
};

const startTranslation = (draft: SubsState, opts: TranslationOptions): SubsState => {
  draft.isTranslating = true;
  draft.translateStartDate = Date.now();
  draft.translationOpts = opts;
  return refreshTranslation(draft);
};

const endTranslation = (draft: SubsState): SubsState => {
  draft.isTranslating = false;
  draft.toExport =
    buildExportLines(
      original(draft).origin, original(draft).dialogs, buildTranslatedDialogs(original(draft).translated),
      original(draft).effects
    );
  return draft;
};

const incTranslatedCounter = (draft: SubsState): SubsState => {
  draft.translatedCount += 1;
  return draft;
};

const addTranslatedSuccess = (draft: SubsState, text: string, idx: number, lines: number[]): SubsState => {
  draft.translated.push({
    idx,
    text,
    lines
  });
  return incTranslatedCounter(draft);
};

const fileActionSuccess = (
  draft: SubsState, fileAction: FileActionType, fileName?: string, data?: string): SubsState => {
  draft.isFileActionFailed = false;
  draft.fileActionError = null;
  draft.fileName = fileName;
  draft.subsType = fileAction.format;
  if (fileAction.actionType === FileAction.EXPORT) {
    switch (fileAction.format) {
      case FileFormat.ASS: {
        saveStringAsFile(
          data, `${fileName}.${original(draft).translationOpts.to}.${fileAction.format}`, ContentType.ASS_UTF8);
        draft.isLoadingExport = false;
        break;
      }
      case FileFormat.SRT: {
        draft.isLoadingExport = false;
        break;
      }
    }
  } else {
    draft.translated = [];
    draft.toExport = [];
    switch (fileAction.format) {
      case FileFormat.ASS: {
        const origins = data.split(HARD_NEW_LINE_SIGN);
        const dialogs = origins.map((text, i) => assValidator(text) && assSeparator(i, text))
          .reduce((acc, cur) => ({ ...acc, ...cur }), {});
        const prepare = buildPrepare(dialogs);
        const effects = buildEffects(dialogs);
        draft.origin = origins;
        draft.dialogs = dialogs;
        draft.prepare = prepare;
        draft.effects = effects;
        break;
      }
      case FileFormat.SRT: {
        break;
      }
    }
  }
  return draft;
};

const fileActionFail = (draft: SubsState, importError: string): SubsState => {
  draft.isFileActionFailed = true;
  draft.fileActionError = importError;
  return draft;
};

const switchFileAction = (isLoading: boolean) => (draft: SubsState, fileAction: FileActionType): SubsState => {
  if (fileAction.actionType === FileAction.EXPORT) {
    switch (fileAction.format) {
      case FileFormat.JSON: {
        draft.isLoadingExportToJson = isLoading;
        break;
      }
      case FileFormat.CSV: {
        draft.isLoadingExportToCsv = isLoading;
        break;
      }
      case FileFormat.EXCEL: {
        draft.isLoadingExportToXls = isLoading;
        break;
      }
    }
  }
  return draft;
};

const startFileAction = (draft: SubsState, fileAction: FileActionType): SubsState => switchFileAction(true)(
  draft, fileAction);

const endFileAction = (draft: SubsState, fileAction: FileActionType): SubsState => switchFileAction(false)(
  draft, fileAction);

const subsTranslator = (state: SubsState = initialState, action: SubsAction): SubsState =>
  produce(state, (draft: SubsState): SubsState => {
    switch (action.type) {
      case ActionType.ADD_TRANSLATED_SUCCESS:
        return addTranslatedSuccess(draft, action.translatedText, action.translatedIdx, action.translatedLines);
      case ActionType.START_TRANSLATION:
        return startTranslation(draft, action.translationOpts);
      case ActionType.END_TRANSLATION:
        return endTranslation(draft);
      case ActionType.INCREMENT_TRANSLATED_COUNT:
        return incTranslatedCounter(draft);
      case ActionType.REFRESH_TRANSLATED_COUNT:
        return refreshTranslation(draft);
      case ActionType.START_FILE_ACTION:
        return startFileAction(draft, action.fileAction);
      case ActionType.END_FILE_ACTION:
        return endFileAction(draft, action.fileAction);
      case ActionType.FILE_ACTION_SUCCESS:
        return fileActionSuccess(draft, action.fileAction, action.fileName, action.stringData);
      case ActionType.FILE_ACTION_FAIL:
        return fileActionFail(draft, action.fileActionError);
      case ActionType.INIT:
        return initialState;
      default:
        return draft;
    }
  });

export default subsTranslator;
