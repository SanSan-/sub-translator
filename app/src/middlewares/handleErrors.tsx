import { AnyAction, Store } from 'redux';
import * as actions from '~actions/common';
import { GeneralState } from '~types/store';
import { ThunkDispatch } from 'redux-thunk';
import { CommonAction, ThunkResult } from '~types/action';
import { getFinalMessage, isEmpty, isEmptyObject } from '~utils/CommonUtils';
import { REQUEST_PROCESSING_ERROR, UNEXPECTED_ERROR } from '~const/log';
import { DetailMessage, ErrorResponse } from '~types/dto';
import { NEW_LINE_SIGN } from '~const/common';
import { APP_DESC } from '~const/settings';
import AccessDeniedException from '~exceptions/AccessDeniedException';
import ApplicationException from '~exceptions/ApplicationException';
import BadRequestException from '~exceptions/BadRequestException';
import JsonParsingException from '~exceptions/JsonParsingException';
import SilentException from '~exceptions/SilentException';
import TimeoutException from '~exceptions/TimeoutException';
import TransportNoRouteException from '~exceptions/TransportNoRouteException';
import UnexpectedException from '~exceptions/UnexpectedException';
import UnknownCommunicationException from '~exceptions/UnknownCommunicationException';

let previouslyReported: unknown = null;

const handleAccessDeniedException = (arg: ErrorResponse): ThunkResult<void, AnyAction> => (dispatch) => {
  dispatch(actions.showError(
    REQUEST_PROCESSING_ERROR,
    `Request to application "${arg.moduleId || APP_DESC}" cannot be executed, as access denied.
    For more information follow system administrator.`,
    null
  ));
};

const handleApplicationException = (arg: ErrorResponse): ThunkResult<void, CommonAction> => (dispatch) => {
  const details = arg.originalMessage || arg.originalStackTrace ?
    `${arg.message}${NEW_LINE_SIGN}${arg.originalStackTrace}` : null;
  dispatch(actions.showError(
    REQUEST_PROCESSING_ERROR,
    arg.message,
    details
  ));
};

const handleJsonParsingException = (arg: ErrorResponse): ThunkResult<void, CommonAction> => (dispatch) => {
  dispatch(actions.showError(
    REQUEST_PROCESSING_ERROR,
    `JSON parsing error. "${arg.message}".
    For more information follow system administrator.`,
    null
  ));
};

const handleTimeoutException = (arg: ErrorResponse): ThunkResult<void, CommonAction> => (dispatch) => {
  dispatch(actions.showError(
    REQUEST_PROCESSING_ERROR,
    `Request to application "${APP_DESC}" cannot be executed, as timeout.
    For more information follow system administrator.`,
    JSON.stringify(arg)
  ));
};

const handleTransportNoRouteException = (arg: ErrorResponse): ThunkResult<void, CommonAction> => (dispatch) => {
  dispatch(actions.showError(
    `${arg.moduleId || APP_DESC} is unavailable`,
    `Request to application "${arg.moduleId || APP_DESC}" cannot be executed, as transport no route.
    For more information follow system administrator.`,
    null
  ));
};

const handleUnexpectedException = (arg: ErrorResponse): ThunkResult<void, CommonAction> => (dispatch) => {
  const details = arg.originalMessage || arg.originalStackTrace ?
    `${arg.originalMessage}${NEW_LINE_SIGN}${arg.originalStackTrace}` : null;
  dispatch(actions.showError(
    UNEXPECTED_ERROR,
    `Please, follow system administrator. Processing error id: ${arg.errorId}`,
    details
  ));
};

const showError = (arg: ErrorResponse) => (dispatch: ThunkDispatch<GeneralState, unknown, AnyAction>) => {
  let detailMessage: DetailMessage = {};
  let finalMessage: DetailMessage = {};
  const message = arg.message || arg.originalMessage || String(arg);
  const details = arg.originalStackTrace || arg.stackTrace || null;
  if (message.constructor === Object) {
    detailMessage = JSON.parse(message) as DetailMessage;
    finalMessage = getFinalMessage(detailMessage);
  }
  dispatch(actions.showError(
    isEmptyObject(detailMessage) ? UNEXPECTED_ERROR : detailMessage.message,
    isEmptyObject(finalMessage) ? message : finalMessage.message,
    isEmptyObject(finalMessage) ? details : JSON.stringify(finalMessage.stackTrace)
  ));
};

const handleError = (arg: ErrorResponse): ThunkResult<void, CommonAction> => (dispatch) => {
  setTimeout(() => {
    throw arg;
  }, 0);
  dispatch(showError(arg));
};

const catchError = (arg: ErrorResponse): ThunkResult<void, CommonAction> => (dispatch) => {
  switch (arg.constructor) {
    case AccessDeniedException:
      return dispatch(handleAccessDeniedException(arg));
    case ApplicationException:
    case BadRequestException:
      return dispatch(handleApplicationException(arg));
    case JsonParsingException:
      return dispatch(handleJsonParsingException(arg));
    case SilentException:
      return;
    case TimeoutException:
      return dispatch(handleTimeoutException(arg));
    case TransportNoRouteException:
      return dispatch(handleTransportNoRouteException(arg));
    case UnexpectedException:
      return dispatch(handleUnexpectedException(arg));
    case UnknownCommunicationException:
      return dispatch(handleUnexpectedException(arg));
    case Error: {
      return dispatch(handleError(arg));
    }
    default:
      return dispatch(showError(arg));
  }
};

const handleErrors = <T extends Store<GeneralState>> (store: T) =>
  (next: (action: AnyAction) => Promise<unknown>) =>
    (action?: AnyAction): Promise<unknown> => {
      const dispatch = store.dispatch as ThunkDispatch<GeneralState, unknown, CommonAction>;
      /* eslint consistent-return: 0 */
      try {
        const result = next(action);
        if (!isEmpty(result) && result.catch) {
          result.catch((arg: ErrorResponse) => {
            if (previouslyReported === arg) {
              return;
            }
            previouslyReported = arg;
            dispatch(catchError(arg));
          });
        }
        return result;
      } catch (error) {
        setTimeout(() => {
          throw error;
        }, 0);
        const message = error.constructor === Object ? JSON.stringify(error) : String(error);
        dispatch(actions.showError(UNEXPECTED_ERROR, message, null));
      }
    };

export default handleErrors;
