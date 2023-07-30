import { AnyAction } from 'redux';
import { DefaultDispatch } from '~types/store';
import { GetStateAction } from '~types/action';
import { DefaultStringState } from '~types/state';

export interface ExceptionType extends DefaultStringState {
  errorType?: string;
  message?: string;
  originalStackTrace?: string;
}

export interface ErrorResponse extends ExceptionType {
  moduleId?: string;
  errorId?: string;
  originalMessage?: string;
}

export interface StackTrace {
  declaringClass?: string;
  methodName?: string;
  fileName?: string;
  lineNumber?: number;
  className?: string;
  nativeMethod?: boolean;
}

export interface DetailMessage {
  detailMessage?: string;
  cause?: DetailMessage;
  stackTrace?: StackTrace[];
  suppressedExceptions?: string[];
  reportUUID?: string;
  message?: string;
  localizedMessage?: string;
  suppressed?: string[];
}

export type ErrorType = ExceptionType | Error | unknown;
export type Spinner = string | boolean;

export type SpinnerShowCallback = (id?: string, message?: string) => AnyAction;
export type SpinnerHideCallback = (id?: string, force?: boolean) => (
  dispatch: DefaultDispatch, getState: GetStateAction
) => void;

export type BiRecordType<T extends string | number | symbol> = Record<T, T>;

export type StringBiRecordType = BiRecordType<string>;
