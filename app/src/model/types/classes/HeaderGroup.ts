import Header from '~types/classes/Header';

export default class HeaderGroup {

  [key: string]: string | Header[];

  readonly title: string;
  readonly children: Header[];

  constructor (title: string, headers: Header[]) {
    this.title = title;
    this.children = headers;
  }

}
