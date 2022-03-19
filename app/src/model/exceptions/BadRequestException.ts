import Exceptions from '~enums/Exceptions';
import { ExceptionType } from '~types/dto';

export default class BadRequestException {
  [key: string]: string;

  constructor (e: ExceptionType) {
    if (e.errorType === Exceptions.BAD_REQUEST_EXCEPTION) {
      const that = this;
      Object.keys(e).forEach((key) => {
        that[key] = e[key];
      });
    }
  }
}

export const badRequestException = (message: string): BadRequestException => new BadRequestException({
  errorType: Exceptions.BAD_REQUEST_EXCEPTION,
  message
});
