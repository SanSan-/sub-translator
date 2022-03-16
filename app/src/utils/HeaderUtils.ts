import { DialogShowColumns } from '~types/filter';
import Header from '~types/classes/Header';

const pushHeader = (headers: Header[], showColumns: DialogShowColumns) => (
  index: string, title: string, width: number, colSpan?: number, className?: string, sortName?: string
): void => {
  showColumns[index] && headers.push(new Header(title, index, width, colSpan, className, sortName));
};

export const getDialogHeaders = (showColumns: DialogShowColumns): Header[] => {
  const headers: Header[] = [];
  const pushNewHeader = pushHeader(headers, showColumns);
  headers.push(new Header('Line', 'line', 55, 1, 'column-center'));
  pushNewHeader('layer', 'Layer', 75, 1, 'column-center');
  pushNewHeader('startTime', 'Start', 125, 1, 'column-left');
  pushNewHeader('endTime', 'End', 125, 1, 'column-left');
  pushNewHeader('style', 'Style', 150, 1, 'column-left');
  pushNewHeader('actor', 'Actor', 150, 1, 'column-left');
  pushNewHeader('marginL', 'Margin L', 75, 1, 'column-center');
  pushNewHeader('marginR', 'Margin R', 75, 1, 'column-center');
  pushNewHeader('marginV', 'Margin V', 75, 1, 'column-center');
  pushNewHeader('effect', 'Effect', 75, 1, 'column-center');
  pushNewHeader('text', 'Text', 750, 1, 'column-left');
  return headers;
};
