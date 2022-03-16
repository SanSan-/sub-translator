import produce from 'immer';
import ActionType from '~enums/module/SettingsContext';
import { DialogShowColumns } from '~types/filter';
import { SettingsContextType } from '~types/context';
import { SettingsContextActionType } from '~types/action';

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
  dialogShowColumns: defaultShowColumns
};

export const reducer = (state: SettingsContextType, action: SettingsContextActionType): SettingsContextType =>
  produce(state, (draft: SettingsContextType): SettingsContextType => {
    switch (action.type) {
      case ActionType.SET_DIALOG_SHOW_COLUMNS: {
        draft.dialogShowColumns = action.context.dialogShowColumns;
        return draft;
      }
      default: {
        return draft;
      }
    }
  });
