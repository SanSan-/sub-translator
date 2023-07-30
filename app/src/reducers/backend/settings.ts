import produce from 'immer';
import ActionType from '~enums/actions/SettingsContext';
import { DialogShowColumns } from '~types/filter';
import { SettingsContextType } from '~types/context';
import { SettingsContextActionType } from '~types/action';
import LocalStorage from '~enums/LocalStorage';

const defaultShowColumns: DialogShowColumns = {
  line: true,
  layer: false,
  startTime: true,
  endTime: true,
  style: true,
  actor: true,
  marginL: false,
  marginR: false,
  marginV: false,
  effect: false,
  text: true
};

export const defaultState: SettingsContextType = {
  dialogShowColumns: defaultShowColumns,
  useSmartDialogSplitter: false,
  threadCount: 1,
  batchSize: 5,
  iamToken: localStorage.getItem(LocalStorage.YANDEX_IAM_TOKEN),
  folderId: localStorage.getItem(LocalStorage.YANDEX_FOLDER_ID)
};

export const reducer = (state: SettingsContextType, action: SettingsContextActionType): SettingsContextType =>
  produce(state, (draft: SettingsContextType): SettingsContextType => {
    switch (action.type) {
      case ActionType.SET_DIALOG_SHOW_COLUMNS: {
        draft.dialogShowColumns = action.context.dialogShowColumns;
        return draft;
      }
      case ActionType.SET_USE_LINES_SMART_UNION: {
        draft.useSmartDialogSplitter = action.context.useSmartDialogSplitter;
        return draft;
      }
      case ActionType.SET_THREAD_COUNT: {
        draft.threadCount = action.context.threadCount;
        return draft;
      }
      case ActionType.SET_BATCH_SIZE: {
        draft.batchSize = action.context.batchSize;
        return draft;
      }
      case ActionType.SET_IAM_TOKEN: {
        localStorage.setItem(LocalStorage.YANDEX_IAM_TOKEN, action.context.iamToken);
        draft.iamToken = action.context.iamToken;
        return draft;
      }
      case ActionType.SET_FOLDER_ID: {
        localStorage.setItem(LocalStorage.YANDEX_FOLDER_ID, action.context.folderId);
        draft.folderId = action.context.folderId;
        return draft;
      }
      default: {
        return draft;
      }
    }
  });
