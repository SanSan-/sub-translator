import { DefaultStringState } from '~types/state';
import { DialogShowColumns } from '~types/filter';

export interface AppContext extends DefaultStringState {
  __appToolbarTitle?: string;
  __appToolbarSystem?: string;
  __appToolbarLeft?: string;
  __appToolbarRight?: string;
  __appModals?: string;
  __appModal?: string;
}

export interface SettingsContextType {
  dialogShowColumns?: DialogShowColumns;
}
