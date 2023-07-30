import { ContentType, Headers, Method } from '~enums/Http';
import { Either, left, right } from '@sweet-monads/either';
import TimeoutException, { timeoutException } from '~exceptions/TimeoutException';
import { EMPTY_STRING } from '~const/common';
import JsonParsingException, { jsonParsingException } from '~exceptions/JsonParsingException';
import { JSON_PARSING_ERROR } from '~const/log';
import axios, { AxiosHeaders } from 'axios';

const initRequestDetail = (otherHeaders: Record<string, string> = {}): AxiosHeaders => {
  const headers = new AxiosHeaders();
  headers.setAccept(ContentType.JSON);
  otherHeaders && otherHeaders[Headers.AUTHORIZATION] && headers.setAuthorization(otherHeaders[Headers.AUTHORIZATION]);
  headers.set(Headers.ACCESS_CONTROL_ALLOW_ORIGIN, 'http://localhost:9090');
  headers.set(Headers.ACCESS_CONTROL_ALLOW_METHODS, 'POST, GET');
  headers.set(Headers.ACCESS_CONTROL_ALLOW_HEADERS, 'Content-Type, Accept, Authorization');
  return headers;
};

export const wrapFetch = async (input: RequestInfo, init: RequestInit): Promise<Either<TimeoutException, Response>> => {
  try {
    const data = await fetch(input, init);
    return right(data);
  } catch (e) {
    return left(timeoutException(e instanceof Error ? e.message : JSON.stringify(e)));
  }
};

export const fetchGet = async (
  endpoint: string,
  headers: Record<string, string> = {}
): Promise<Either<TimeoutException, Response>> => await wrapFetch(
  endpoint,
  {
    headers: initRequestDetail(headers),
    method: Method.GET
  }
);

export const fetchPost = async (
  endpoint: string,
  body: string = EMPTY_STRING,
  headers: Record<string, string> = {}
): Promise<Either<TimeoutException, Response>> => await axios.post(
  endpoint, body, {
    headers: initRequestDetail(headers),
    withCredentials: false,
    method: Method.POST
  });

export const wrapJson = async <T> (response: Response): Promise<Either<JsonParsingException, T>> => {
  try {
    const json = await response.json() as T;
    return right(json);
  } catch (e) {
    return left(jsonParsingException(JSON_PARSING_ERROR));
  }
};
