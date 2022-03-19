import { DialogShowColumns } from '~types/filter';

export interface SettingsContextType {
  dialogShowColumns?: DialogShowColumns;
  useSmartDialogSplitter?: boolean;
  threadCount?: number;
  batchSize?: number;
}
