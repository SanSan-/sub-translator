import ky from 'ky';
import { ThunkResult } from '~types/action';
import { Either, right } from '@sweet-monads/either';
import { ExceptionType } from '~types/dto';
import { YandexErrorResponse, YandexTranslateResponse } from '~types/response';
import { AnyAction } from 'redux';
import { YandexTranslateRequest } from '~types/request';
import { translateApi } from '~dictionaries/backend';
import { applicationException } from '~exceptions/ApplicationException';
import { RequestMode, ResponseStatus } from '~enums/Http';
import { unexpectedException } from '~exceptions/UnexpectedException';

const yandexTranslate = (
  req: YandexTranslateRequest
): ThunkResult<Promise<Either<ExceptionType, YandexTranslateResponse>>, AnyAction> => async () => {
  const res = await ky.post(translateApi.yandexTranslate, { json: req, mode: RequestMode.NO_CORS });
  try {
    switch (res.status) {
      case ResponseStatus._200: {
        const json = await res.json();
        return right(json);
      }
      case ResponseStatus._401: {
        const err = await res.json();
        throw applicationException((err as YandexErrorResponse).message);
      }
      default: {
        const err = await res.text();
        throw unexpectedException(err);
      }
    }
  } catch (e: unknown) {
    throw new Error(e as string);
  }
};

export default yandexTranslate;
