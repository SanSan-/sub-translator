import { DefaultBooleanState, DefaultState } from '~types/state';
import { StringBiRecordType } from '~types/dto';

export type ValidateStatus = '' | 'success' | 'warning' | 'error' | 'validating';

export interface ValidatorState {
  [key: string]: ValidateStatus | string;

  validateStatus?: ValidateStatus;
  help: string;
}

export interface LabelType extends DefaultState {
  text: string;
  maxRows?: number;
  labelCol?: number;
  wrapperCol?: number;
}

export interface FilterBuffer<T extends DefaultState> {
  [key: string]: T | Record<string, unknown>;

  filter?: T;
  validators?: Record<string, unknown>;
}

/**
 * User filters
 */

export interface DialogShowColumns extends DefaultBooleanState {
  line?: boolean;
  layer?: boolean;
  startTime?: boolean;
  endTime?: boolean;
  style?: boolean;
  actor?: boolean;
  marginL?: boolean;
  marginR?: boolean;
  marginV?: boolean;
  effect?: boolean;
  text?: boolean;
}

export interface TranslationDirection extends StringBiRecordType {
  from?: string;
  to?: string;
}

export interface SubtitlesTranslationFilter extends StringBiRecordType {
  fileName?: string;
  subtitlesType?: string;
  translateApi?: string;
  originFromLanguage?: string;
  destinationLanguage?: string;
}
