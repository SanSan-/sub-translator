import ActionType from '~enums/module/SettingsContext';
import { DialogShowColumns } from '~types/filter';
import { SettingsContextActionType } from '~types/action';

export const setDialogsShowColumns = (dialogShowColumns: DialogShowColumns): SettingsContextActionType => ({
  type: ActionType.SET_DIALOG_SHOW_COLUMNS,
  context: { dialogShowColumns }
});
