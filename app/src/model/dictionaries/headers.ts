import Header from '~types/classes/Header';

export const dialogsHeaders: Header[] = [
  new Header('Line', 'line'),
  new Header('layer', 'layer'),
  new Header('Start', 'startTime'),
  new Header('End', 'endTime'),
  new Header('Style', 'style'),
  new Header('Actor', 'actor'),
  new Header('Margin L', 'marginL'),
  new Header('Margin R', 'marginR'),
  new Header('Margin V', 'marginV'),
  new Header('Effect', 'effect'),
  new Header('Text', 'text')
];

export const prepareHeaders: Header[] = [
  new Header('#', 'idx', 55),
  new Header('Text', 'toTranslate', 750),
  new Header('Lines', 'lines', 125)
];

export const effectsHeaders: Header[] = [
  new Header('Line', 'line', 75),
  new Header('Effects', 'fx', 750)
];

export const translatedHeaders: Header[] = [
  new Header('#', 'idx', 55),
  new Header('Text', 'text', 750),
  new Header('Lines', 'lines', 125)
];

export const toExportHeaders: Header[] = [
  new Header('#', 'idx', 55),
  new Header('Content', 'text', 850)
];
