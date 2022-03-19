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
