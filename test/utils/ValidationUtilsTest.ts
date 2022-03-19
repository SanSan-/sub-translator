/* eslint-disable max-len */
import { assSeparator } from '~utils/ValidationUtils';
import { isEmptyObject } from '~utils/CommonUtils';
import { EMPTY_STRING } from '~const/common';
import { AssSubtitlesItem } from '~types/state';

describe('ValidationUtils::assSeparator Tests', () => {

  const checkDialogLine = (
    line: AssSubtitlesItem,
    layer: number,
    startTime: string,
    endTime: string,
    style: string,
    actor: string,
    marginL: number,
    marginR: number,
    marginV: number,
    effect: string,
    text: string
  ): void => {
    expect(line.layer).toEqual(layer);
    expect(line.startTime).toEqual(startTime);
    expect(line.endTime).toEqual(endTime);
    expect(line.style).toEqual(style);
    expect(line.actor).toEqual(actor);
    expect(line.marginL).toEqual(marginL);
    expect(line.marginR).toEqual(marginR);
    expect(line.marginV).toEqual(marginV);
    expect(line.effect).toEqual(effect);
    expect(line.text).toEqual(text);
  };

  test('Incorrect', () => {
    const idx = 155;
    const result = assSeparator(
      idx,
      'Dialogue: ,0:00:36.72,0:00:37.97,Карасума_Годзё_23:28(Ep 10),Wakana,0,0,0,Ba750[;0;25],"Ahh! The sergeants are\\\\Nabout to go at it again."\\\\N"Oh!" "Yamada-{\\\\i1}san {\\\\i0}is timing\\\\Nwhen to present his head!"'
    );
    expect(isEmptyObject(result)).toBeTruthy();
  });

  test('Layers:: 1', () => {
    const idx = 1;
    const result = assSeparator(
      idx, 'Dialogue: 1,0:12:27.56,0:12:29.59,main,Touko,0000,0000,0000,,You really went to all that trouble?');
    expect(isEmptyObject(result)).toBeFalsy();
    checkDialogLine(
      result[idx], 1, '0:12:27.56', '0:12:29.59', 'main', 'Touko', 0, 0, 0, EMPTY_STRING, 'You really went' +
      ' to all that trouble?');
  });

  test('Style:: with undergrounds', () => {
    const idx = 1;
    const result = assSeparator(
      idx,
      'Dialogue: 0,0:12:25.59,0:12:29.60,sign_17877_164_Request_for_Perm,Text,0000,0000,0000,,{\\move(240,285,240,375)\\fnTrebuchet MS\\b1\\frz14.04\\an1}To practice for the athletic festival volleyball event'
    );
    expect(isEmptyObject(result)).toBeFalsy();
    checkDialogLine(
      result[idx], 0, '0:12:25.59', '0:12:29.60', 'sign_17877_164_Request_for_Perm', 'Text', 0, 0, 0, EMPTY_STRING,
      '{\\move(240,285,240,375)\\fnTrebuchet MS\\b1\\frz14.04\\an1}To practice for the athletic festival volleyball event'
    );
  });

  test('Style:: with space and minus splitter', () => {
    const idx = 2;
    const result = assSeparator(
      idx,
      'Dialogue: 0,0:02:45.10,0:02:47.18,Default - Top,Все,0,0,0,,Отлично потрудились.'
    );
    expect(isEmptyObject(result)).toBeFalsy();
    checkDialogLine(
      result[idx], 0, '0:02:45.10', '0:02:47.18', 'Default - Top', 'Все', 0, 0, 0, EMPTY_STRING,
      'Отлично потрудились.'
    );
  });

  test('Style:: with space and brackets', () => {
    const idx = 3;
    const result = assSeparator(
      idx,
      'Dialogue: 0,0:17:17.43,0:17:23.18,Performance_date(Ep 12),Надпись,0,0,0,,{\\q2\\blur0.95\\frx27\\fry4\\pos(801,735)\\frz333.6}[Дата проведения]'
    );
    expect(isEmptyObject(result)).toBeFalsy();
    checkDialogLine(
      result[idx], 0, '0:17:17.43', '0:17:23.18', 'Performance_date(Ep 12)', 'Надпись', 0, 0, 0, EMPTY_STRING,
      '{\\q2\\blur0.95\\frx27\\fry4\\pos(801,735)\\frz333.6}[Дата проведения]'
    );
  });

  test('Style:: with colons', () => {
    const idx = 4;
    const result = assSeparator(
      idx,
      'Dialogue: 0,0:22:42.21,0:22:43.21,Text/Messages(green)_22:33(Ep' +
      ' 12),Надпись,0,0,0,,{\\q2\\blur1.2\\pos(126,294)}Отличная работа сегодня! \\NМне можно пить'
    );
    expect(isEmptyObject(result)).toBeFalsy();
    checkDialogLine(
      result[idx], 0, '0:22:42.21', '0:22:43.21', 'Text/Messages(green)_22:33(Ep 12)', 'Надпись', 0, 0, 0, EMPTY_STRING,
      '{\\q2\\blur1.2\\pos(126,294)}Отличная работа сегодня! \\NМне можно пить'
    );
  });

  test('Style:: with colons', () => {
    const idx = 5;
    const result = assSeparator(
      idx,
      'Dialogue: 0,0:22:42.21,0:22:43.21,Text_Messages!(green)_22:33(Ep' +
      ' 12),Надпись,0,0,0,,{\\q2\\blur1.2\\pos(126,294)}Отличная работа сегодня! \\NМне можно пить'
    );
    expect(isEmptyObject(result)).toBeFalsy();
    checkDialogLine(
      result[idx], 0, '0:22:42.21', '0:22:43.21', 'Text_Messages!(green)_22:33(Ep 12)', 'Надпись', 0, 0, 0,
      EMPTY_STRING,
      '{\\q2\\blur1.2\\pos(126,294)}Отличная работа сегодня! \\NМне можно пить'
    );
  });

  test('Style:: unicode', () => {
    const idx = 6;
    const result = assSeparator(
      idx,
      'Dialogue: 0,0:22:42.21,0:22:45.67,Нанами_22:33(Ep 12),Надпись,0,0,0,,{\\q2\\blur1.6\\pos(663,-17)}Нанами'
    );
    expect(isEmptyObject(result)).toBeFalsy();
    checkDialogLine(
      result[idx], 0, '0:22:42.21', '0:22:45.67', 'Нанами_22:33(Ep 12)', 'Надпись', 0, 0, 0, EMPTY_STRING,
      '{\\q2\\blur1.6\\pos(663,-17)}Нанами'
    );
  });

  test('Actor:: unicode', () => {
    const idx = 10;
    const result = assSeparator(
      idx,
      'Dialogue: 0,0:23:39.68,0:23:41.19,Italics - Top,Карасума_Годзё_23:28(Ep 10),0,0,0,,{\\q2\\blur.6\\pos(95.667,90.333)}Карасума Годзё'
    );
    expect(isEmptyObject(result)).toBeFalsy();
    checkDialogLine(
      result[idx], 0, '0:23:39.68', '0:23:41.19', 'Italics - Top', 'Карасума_Годзё_23:28(Ep 10)', 0, 0, 0, EMPTY_STRING,
      '{\\q2\\blur.6\\pos(95.667,90.333)}Карасума Годзё'
    );
  });

  test('Effects:: Karaoke', () => {
    const idx = 28;
    const result = assSeparator(idx, 'Dialogue: 0,0:00:36.72,0:00:37.97,Italics,Wakana,0,0,0,Karaoke,Мы так близко.');
    expect(isEmptyObject(result)).toBeFalsy();
    expect(result[idx].effect).toEqual('Karaoke');
    expect(result[idx].text).toEqual('Мы так близко.');
  });

  test('Effects:: Scroll up;y1;y2;delay(1-100)[;fadeawayheight]', () => {
    const idx = 25;
    const result = assSeparator(
      idx, 'Dialogue: 0,0:00:36.72,0:00:37.97,Italics - Top,Карасума_Годзё_23:28(Ep 10),0,0,0,Scroll' +
      ' up;125;350;99[;345],"Ahh! The sergeants are\\Nabout to go at it again."\\N"Oh!" "Yamada-{\\i1}san {\\i0}is' +
      ' timing\\Nwhen to present his head!"');
    expect(isEmptyObject(result)).toBeFalsy();
    expect(result[idx].effect).toEqual('Scroll up;125;350;99[;345]');
    expect(result[idx].text).toEqual(
      '"Ahh! The sergeants are\\Nabout to go at it again."\\N"Oh!" "Yamada-{\\i1}san {\\i0}is timing\\Nwhen to present his head!"');
  });

  test('Effects:: Banner;delay(1-1000)[;lefttoright(0,1);fadeawaywidth]', () => {
    const idx = 11;
    const result = assSeparator(
      idx,
      'Dialogue: 0,0:03:01.49,0:03:02.74,Japanese_Vocals_02:51_(Ep 10),Надпись,0,0,0,Banner;750[;0;125],{\\q2\\blur1\\frz359.5\\pos(642,304)}Японский Словарь Вокала и Актёрского Мастерства'
    );
    expect(isEmptyObject(result)).toBeFalsy();
    expect(result[idx].effect).toEqual('Banner;750[;0;125]');
    expect(result[idx].text).toEqual(
      '{\\q2\\blur1\\frz359.5\\pos(642,304)}Японский Словарь Вокала и Актёрского Мастерства');
  });

  test('Effects:: no effects', () => {
    const idx = 33;
    const result = assSeparator(idx, 'Dialogue: 0,0:01:40.37,0:01:40.62,OP_Rom,,0,0,0,,Mebaeru to amaku omotteta');
    expect(isEmptyObject(result)).toBeFalsy();
    expect(result[idx].effect).toEqual(EMPTY_STRING);
    expect(result[idx].text).toEqual('Mebaeru to amaku omotteta');
  });

  test('Text:: commas', () => {
    const idx = 44;
    const result = assSeparator(idx, 'Dialogue: 0,0:08:54.53,0:08:57.91,Default,,0,0,0,,On days we do reenactments,\\Neven though it\'s just a doll,');
    expect(isEmptyObject(result)).toBeFalsy();
    expect(result[idx].text).toEqual('On days we do reenactments,\\Neven though it\'s just a doll,');
  });

});
