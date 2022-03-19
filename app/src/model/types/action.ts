import { CommonDialog, PromiseDialog, TranslationOptions } from '~types/state';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GeneralState } from '~types/store';
import { Spinner } from '~types/dto';
import { FileActionType } from '~types/response';
import { SettingsContextType } from '~types/context';
import { RequestMode } from '~enums/Http';

export interface GetStateAction {
  (): GeneralState;
}

export type ThunkResult<R, T extends AnyAction> = ThunkAction<R, GeneralState, unknown, T>;

/**
 * Backend action interfaces
 */

export interface AsyncAction {
  moduleId?: string;
  spinner?: Spinner;
}

export interface AsyncOptions extends AsyncAction {
  controllerPath?: string;
  headers?: Record<string, unknown>;
  mode?: RequestMode;
  isGetRequest?: boolean;
}

export interface RequestAction extends AnyAction {
  moduleId: string;
  error?: string;
}

/**
 * Common action interfaces
 */

export interface ContextActionType<T> extends AnyAction {
  context?: T;
}

export type SettingsContextActionType = ContextActionType<SettingsContextType>;

export interface CommonAction extends AnyAction {
  id?: string;
  index?: number;
  force?: boolean;
  layerId?: string;
  title?: string;
  data?: string;
  message?: string;
  payload?: CommonDialog | PromiseDialog;
}

/**
 * Common action interfaces
 */

export interface SubsAction extends AnyAction {
  fileName?: string;
  binaryData?: number[];
  stringData?: string;
  tagsCloud?: string[];
  translationOpts?: TranslationOptions;
  translatedText?: string;
  translatedIdx?: number;
  translatedLines?: number[];
  importContent?: unknown;
  fileActionError?: string;
  fileAction?: FileActionType;
}
