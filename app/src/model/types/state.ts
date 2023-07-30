import Header from '~types/classes/Header';
import { ReactNode } from 'react';

export interface DefaultState {
  [key: string]: unknown;
}

export interface DefaultStringState {
  [key: string]: string;
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

/**
 * ModuleState interfaces
 */

export interface PageableState extends DefaultState {
  totalRecords: number;
  pageSizeOptions: string[];
  tableHeaders?: Header[];
}

export interface SrtSubtitlesItem extends DefaultState {
  startTime?: string;
  endTime?: string;
  text?: string;
}

export interface AssSubtitlesItem extends SrtSubtitlesItem {
  layer?: number;
  style?: string;
  actor?: string;
  marginL?: number;
  marginR?: number;
  marginV?: number;
  effect?: string;
}

export interface PrepareToTranslateItem extends DefaultState {
  idx?: number;
  toTranslate?: string;
  lines?: number[];
}

export interface GoogleTranslateOpts extends DefaultState {
  from?: string;
  to?: string;
  tld?: string;
  except?: string[];
  detail?: boolean;
}

export interface YandexTranslateOpts extends GoogleTranslateOpts {
  iamToken?: string;
  folderId?: string;
}

export interface TranslationOptions extends YandexTranslateOpts {
  api?: string;
}

export interface TranslatedItem extends DefaultState {
  idx?: number;
  text?: string;
  lines?: number[];
}

export interface AbstractAnalysed extends DefaultState {
  dotCount?: number;
  commaCount?: number;
  quoteCount?: number;
  bracketCount?: number;
  dashCount?: number;
  colonCount?: number;
  semicolonCount?: number;
  questionMarkCount?: number;
  exclamationMarkCount?: number;
}

export interface AnalysedWords extends AbstractAnalysed {
  wordCount: number;
}

export interface AnalysedLine extends AnalysedWords {
  effects?: Record<number, string>;
}

export interface AnalysedDialog extends AnalysedWords {
  lines?: AnalysedLine[];
}

export type AnalysedItem = Record<number, AnalysedDialog>;

export type TranslatedDialogItem = Record<number, string>;

export interface SubsState extends DefaultState {
  origin?: string[];
  dialogs?: Record<number, AssSubtitlesItem>;
  analysis?: AnalysedItem;
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
