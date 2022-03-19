import ActionType from '~enums/actions/SettingsContext';
import { DialogShowColumns } from '~types/filter';
import { SettingsContextActionType } from '~types/action';

export const setDialogsShowColumns = (dialogShowColumns: DialogShowColumns): SettingsContextActionType => ({
  type: ActionType.SET_DIALOG_SHOW_COLUMNS,
  context: { dialogShowColumns }
});

export const setUseLinesSmartUnion = (useLinesSmartUnion: boolean): SettingsContextActionType => ({
  type: ActionType.SET_USE_LINES_SMART_UNION,
  context: { useSmartDialogSplitter: useLinesSmartUnion }
});

export const setThreadCount = (threadCount: number): SettingsContextActionType => ({
  type: ActionType.SET_THREAD_COUNT,
  context: { threadCount }
});

export const setBatchSize = (batchSize: number): SettingsContextActionType => ({
  type: ActionType.SET_BATCH_SIZE,
  context: { batchSize }
});
