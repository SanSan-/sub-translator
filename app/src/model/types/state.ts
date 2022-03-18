import Header from '~types/classes/Header';
import React, { ReactElement, ReactNode } from 'react';
import { Table } from 'antd';

export interface DefaultState {
  [key: string]: unknown;
}

export interface DefaultStringState {
  [key: string]: string;
}

export interface DefaultNumberState {
  [key: string]: number;
}

export interface DefaultBooleanState {
  [key: string]: boolean;
}

/**
 * BackendState interfaces
 */

export type RequestState = DefaultState

/**
 * CommonState interfaces
 */

export type ButtonType = 'link' | 'text' | 'ghost' | 'primary' | 'default' | 'dashed';

export interface SpinnerState extends DefaultState {
  counter: number;
  message?: string;
  timestamp?: number;
}

export interface ModalState extends DefaultStringState {
  layerId?: string;
  title?: string;
  data?: string;
}

export interface CommonDialog extends DefaultState {
  type?: string;
  index?: number;
  title?: string;
  message?: ReactNode;
  okLabel?: string;
  cancelLabel?: string;
  details?: string;
}

export interface PromiseDialog extends CommonDialog {
  resolve: Promise<Response>;
  reject: Promise<void>;
}

export type EditableTableProps = Parameters<typeof Table>[0];

export type Keywords = Record<React.Key, string[]>;

export type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export interface DataType {
  key: React.Key;
  keywords: ReactElement;
}

export interface EditableTableState {
  keywords: Keywords;
  dataSource: DataType[];
  count: number;
}

/**
 * ModuleState interfaces
 */

export interface PageableState extends DefaultState {
  totalRecords: number;
  pageSizeOptions: string[];
  tableHeaders?: Header[];
}

export interface SortableState extends DefaultState {
  sortKey?: string;
  sortType?: string;
}

export interface AssSubtitlesItem extends DefaultState {
  layer?: number;
  startTime?: string;
  endTime?: string;
  style?: string;
  actor?: string;
  marginL?: number;
  marginR?: number;
  marginV?: number;
  effect?: string;
  text?: string;
}

export interface PrepareToTranslateItem extends DefaultState {
  idx?: number;
  toTranslate?: string;
  lines?: number[];
}

export interface GoogleTranslationOptions extends DefaultState {
  from?: string;
  to?: string;
}

export interface TranslationOptions extends GoogleTranslationOptions {
  api?: string;
}

export interface TranslatedItem extends DefaultState {
  idx?: number;
  text?: string;
  lines?: number[];
}

export type EffectDialogItem = Record<number, string[]>;

export type TranslatedDialogItem = Record<number, string>;

export type ConnectionState = 'success' | 'failed' | null;

export interface SubsState extends DefaultState {
  origin?: string[];
  dialogs?: Record<number, AssSubtitlesItem>;
  effects?: EffectDialogItem;
  prepare?: PrepareToTranslateItem[];
  translationOpts?: TranslationOptions;
  translated?: TranslatedItem[];
  translatedCount?: number;
  translateStartDate?: number;
  toExport?: string[];
  fileName?: string;
  subsType?: string;
  isTranslating?: boolean;
  isLoadingExport?: boolean;
  isFileActionFailed?: boolean;
  fileActionError?: string;
}

/**
 * Summary interfaces
 */

export interface BackendState extends DefaultState {
  request?: RequestState;
}

export interface CommonState extends DefaultState {
  spinner?: number;
  spinnerMessage?: string;
  spinnerTimestamp?: number;
  spinners?: Record<string, SpinnerState>;
  background?: boolean;
  modals?: ModalState[];
  dialogs?: PromiseDialog[];
}

export interface ModuleState extends DefaultState {
  subsTranslator?: SubsState;
}
