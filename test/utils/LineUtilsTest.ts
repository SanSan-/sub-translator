/* eslint-disable max-len */
import { buildPrepare, cleanLine, parseAssDialogs, parseSrtDialogs } from '~utils/LineUtils';
import { origin as akebi11assOrigin } from '~mocks/getAssAkebi11';
import { origin as bisco12assOrigin } from '~mocks/getAssBisco12';
import { origin as girlishNum10assOrigin } from '~mocks/getAssGirlishNum10';
import { origin as hakozume12assOrigin } from '~mocks/getAssHakozume12';
import { origin as sonoB12assOrigin } from '~mocks/getAssSonoB12';
import { origin as freeMovieSrtOrigin } from '~mocks/getSrtFreeMovie';
import { EMPTY_STRING } from '~const/common';
import { isEmptyArray, isEmptyObject } from '~utils/CommonUtils';

describe('LineUtils::cleanLine New line smart-wrapping Tests', () => {

  test('ASS Style override codes::New line smart-wrapping test', () => {
    expect(cleanLine('For a sex crime, we use\\Na doll like this to reenact it.'))
      .toEqual('For a sex crime, we use a doll like this to reenact it.');
  });

  test('ASS Style override codes::New line smart-wrapping test [2]', () => {
    expect(cleanLine(
      '--And, sure enough,\\Nthings didn\'t look right.\\N--It\'s 50 meters from the scene of\\Nthe crime to Hamaguchi Dental.'))
      .toEqual('- And, sure enough, things didn\'t look right. - It\'s 50 meters from the scene of the crime to' +
        ' Hamaguchi Dental.');
  });

  test('ASS Style override codes::New line smart-wrapping test [3]', () => {
    expect(cleanLine(
      '"Ahh! The sergeants are\\Nabout to go at it again."\\N"Oh!" "Yamada-{\\i1}san {\\i0}is timing\\Nwhen to present his head!"'))
      .toEqual('"Ahh! The sergeants are about to go at it again." "Oh!" "Yamada-san is timing when to' +
        ' present his head!"');
  });

  test('ASS Style override codes::New line smart-wrapping test [4]', () => {
    expect(cleanLine(
      '{\\move(320,140,303,140)\\bord0\\c&H705E5B&\\fs11\\frx14\\fry306\\frz356.1}Fukumoto Miki \\N\\NMusic Note Interior'))
      .toEqual('Fukumoto Miki Music Note Interior');
  });

  test('ASS Style override codes::New line smart-wrapping test [5]', () => {
    expect(cleanLine('{\\fs8\\pos(150,55)\\fay-.3\\frz2.928\\bord3}K\\Ni\\Nz\\Na\\Nk\\Ni\\N \\NE\\Nr\\Ni\\Nk\\Na'))
      .toEqual('Kizaki Erika');
  });

  test('ASS Style override codes::New line smart-wrapping test [6]', () => {
    expect(cleanLine('{\\pos(240,105)}W\\Na\\Ns\\Nh\\Ni\\No\\N \\NH\\Ni\\Nt\\No\\Nm\\Ni'))
      .toEqual('Washio Hitomi');
  });

  test('ASS Style override codes::New line smart-wrapping test [7]', () => {
    expect(cleanLine('{\\pos(325,100)}N\\Na\\Nw\\Na\\Ns\\Nh\\Ni\\Nr\\No\\N \\NY\\Na\\Ns\\Nu\\Nk\\No'))
      .toEqual('Nawashiro Yasuko');
  });

  test('ASS Style override codes::New line smart-wrapping test [8]', () => {
    expect(cleanLine('{\\pos(325,100)}\\NY\\Na\\Ns\\Nu\\Nk\\No N\\Na\\Nw\\Na\\Ns\\Nh\\Ni\\Nr\\No\\N'))
      .toEqual('Yasuko Nawashiro');
  });

  test('ASS Style override codes::New line smart-wrapping test [9]', () => {
    expect(cleanLine('I\'m gonna be in the cheer squad \\Nalong with Akebi-chan, you know...'))
      .toEqual('I\'m gonna be in the cheer squad along with Akebi-chan, you know…');
  });

  test('ASS Style override codes::New line smart-wrapping test [10]', () => {
    expect(cleanLine('What\'s this about? \\NThere\'s no need to be so polite.'))
      .toEqual('What\'s this about? There\'s no need to be so polite.');
  });

  test('ASS Style override codes::New line smart-wrapping test [11]', () => {
    expect(cleanLine('What\'s this about?\\NThere\'s no need to be so polite.'))
      .toEqual('What\'s this about? There\'s no need to be so polite.');
  });

  test('ASS Style override codes::New line smart-wrapping test [12]', () => {
    expect(cleanLine('But that doesn\'t matter if you\\N can\'t keep the ball in the air.'))
      .toEqual('But that doesn\'t matter if you can\'t keep the ball in the air.');
  });

  test('ASS Style override codes::New line smart-wrapping test [13]', () => {
    expect(cleanLine('H-Hey, I\'m just wishing out loud!\\N Don\'t be mad, okay?'))
      .toEqual('H-Hey, I\'m just wishing out loud! Don\'t be mad, okay?');
  });

  test('ASS Style override codes::New line smart-wrapping test [14]', () => {
    expect(cleanLine('H-Hey, I\'m just wishing out loud!\\NDon\'t be mad, okay?'))
      .toEqual('H-Hey, I\'m just wishing out loud! Don\'t be mad, okay?');
  });

  test('ASS Style override codes::New line smart-wrapping test [15]', () => {
    expect(cleanLine(
      '{\\fs8}2. Acoustic Guitar and Singing (Class 2-3 Soumi Ruri) \\NShort Film "As We Accelerate" (Film Research Club) \\N4. Band Performance (Radical☆Pop) \\N5. Dance (Drama Club: Akebi Komichi) \\N6. Catch the Rhythm! Medley of Popular Songs (Brass Band Club) \\NClosing Speech \\NAfter-Party Planning Committee President (Class 3-2 Hanasato Yuka) \\N\\N{\\fs12}Time: After the Athletic Festival\'s Closing Ceremony \\NPlace: Roubai Auditorium'))
      .toEqual(
        '2. Acoustic Guitar and Singing (Class 2-3 Soumi Ruri) Short Film "As We Accelerate" (Film Research Club) 4. Band Performance (Radical☆Pop) 5. Dance (Drama Club: Akebi Komichi) 6. Catch the Rhythm! Medley of Popular Songs (Brass Band Club) Closing Speech After-Party Planning Committee President (Class 3-2 Hanasato Yuka) Time: After the Athletic Festival\'s Closing Ceremony Place: Roubai Auditorium');
  });

  test('ASS Style override codes::New line smart-wrapping test [16]', () => {
    expect(cleanLine(
      'Roubai Academy Athletic Festival \\N\\N{\\fs16}After-Party \\N\\N{\\fs12}Program \\N\\N{\\fs8}• Opening Speech •\\NAfter-Party Planning Committee Vice President\\N (Class 3-4 Takayama Haru) \\N\\N• Stage Program •\\N1. Quiz Competition:\\N "How Many Do You Know?! Secrets of Roubai Academy" \\N(After-Party Planning Committee) \\N2. Acoustic Guitar and Singing (Class 2-3 Soumi Ruri) \\NShort Film "As We Accelerate" (Film Research Club) \\N4. Band Performance (Radical☆Pop) \\N5. Dance (Drama Club: Akebi Komichi)'))
      .toEqual(
        'Roubai Academy Athletic Festival After-Party Program • Opening Speech • After-Party Planning Committee' +
        ' Vice President (Class 3-4 Takayama Haru) • Stage Program • 1. Quiz Competition: "How Many Do You Know?!' +
        ' Secrets of Roubai Academy" (After-Party Planning Committee) 2. Acoustic Guitar and Singing (Class 2-3 Soumi' +
        ' Ruri) Short Film "As We Accelerate" (Film Research Club) 4. Band Performance (Radical☆Pop)' +
        ' 5. Dance (Drama Club: Akebi Komichi)');
  });

  test('ASS Style override codes::New line smart-wrapping test [17]', () => {
    expect(cleanLine(
      '{\\an8}"First Investigation Division"\\NWhat is this, an invitational\\Nhard-boiled tournament?!'))
      .toEqual(
        '"First Investigation Division" What is this, an invitational hard-boiled tournament?!');
  });

  test('ASS Style override codes::New line smart-wrapping test [18]', () => {
    expect(cleanLine(
      '--I\'m outta here.\\N--It does get tense, when it comes\\Nto HQ\'s First Investigation Division.'))
      .toEqual(
        '- I\'m outta here. - It does get tense, when it comes to HQ\'s First Investigation Division.');
  });

  test('ASS Style override codes::New line smart-wrapping test [19]', () => {
    expect(cleanLine(
      'Hold on! Hold on! Hold on, dummy!\\NI\'m doing my best here, too!'))
      .toEqual(
        'Hold on! Hold on! Hold on, dummy! I\'m doing my best here, too!');
  });

  test('ASS Style override codes::New line smart-wrapping test [20]', () => {
    expect(cleanLine(
      '{\\an8\\b1\\blur0.4\\shad0\\fs26\\bord1.5\\c&H2400D3&\\3c&HDDD9F5&\\pos(542.667,21.334)}Declares \\NIndependence \\Nfrom the \\NJapanese\\NGovernment'))
      .toEqual(
        'Declares Independence from the Japanese Government');
  });

  test('ASS Style override codes::New line smart-wrapping test [21]', () => {
    expect(cleanLine(
      '{\\an8\\b1\\blur0.4\\fax-0.07\\shad0\\bord1.2\\c&H2400D3&\\3c&HDDD9F5&\\frz7.875\\pos(172,142.666)}New Governor\\N{\\fs42}Nekoyanagi\\N Pawoo'))
      .toEqual(
        'New Governor Nekoyanagi Pawoo');
  });

  test('ASS Style override codes::New line smart-wrapping test [22]', () => {
    expect(cleanLine(
      'Hey, Mako- <i>chan</i> , do you have a wish?'))
      .toEqual(
        'Hey, Mako- chan , do you have a wish?');
  });

  test('ASS Style override codes::New line smart-wrapping test [23]', () => {
    expect(cleanLine(
      'It\'s all right. Let\'s give it our all, Rei- <i>chan</i> !'))
      .toEqual(
        'It\'s all right. Let\'s give it our all, Rei- chan !');
  });

  test('ASS Style override codes::double spaces test [1]', () => {
    expect(cleanLine(
      '          "Victim"            "Suspect"        '))
      .toEqual(
        '"Victim" "Suspect"');
  });

  test('ASS Style override codes::double spaces test [2]', () => {
    expect(cleanLine(
      '{\\an7\\fs85\\1c&H433A3C&\\pos(102,344)\\frz345.7}Вас ждёт решающий день\\N{\\fs25} \\N{\\fs85} Постарайтесь!'))
      .toEqual('Вас ждёт решающий день Постарайтесь!');
  });

  test('ASS Style override codes::double spaces test [3]', () => {
    expect(cleanLine('{\\move(602,686,602,576,0,398)\\clip(572,552,1168,692)}Нисиката повержен!\\N\\N\\N Нисиката' +
      ' всё ещё смущается.')).toEqual('Нисиката повержен! Нисиката всё ещё смущается.');
  });
});

describe('LineUtils::cleanLine Override Codes Tests', () => {

  test('ASS Style override codes::bold test', () => {
    expect(cleanLine('There is a {\\b1}bold {\\b0}word here'))
      .toEqual('There is a bold word here');
  });

  test('ASS Style override codes::italicised test', () => {
    expect(cleanLine('There is an {\\i1}italicised {\\i0}word here'))
      .toEqual('There is an italicised word here');
  });

  test('ASS Style override codes::underline test', () => {
    expect(cleanLine('There is an {\\u1}underline {\\u0}word here'))
      .toEqual('There is an underline word here');
  });

  test('ASS Style override codes::strikeout test', () => {
    expect(cleanLine('There is an {\\s1}strikeout {\\s0}word here'))
      .toEqual('There is an strikeout word here');
  });

  test('ASS Style override codes::border test', () => {
    expect(cleanLine('{\\bord1.5}Телепередачи часто нелегально загружают в интернет.'))
      .toEqual('Телепередачи часто нелегально загружают в интернет.');
  });

  test('ASS Style override codes::shadow test', () => {
    expect(cleanLine('{\\shad.15}{SSA logo#текст под лого}Brand new SSA.'))
      .toEqual('Brand new SSA.');
  });

  test('ASS Style::comments test', () => {
    expect(cleanLine(
      '{\\fad(0,650)\\blur5\\an5\\pos(640,510)\\alpha&HFFF\\t(0,450,\\alpha&H777)}На {\\c&H9e55e8&}Зад{\\c}ней {\\c&H9e55e8&}Пар{\\c}те {Нет, серьёзно, это же Зазнайкина и Бармалейкин в японской реальности, спустя 40 лет}'))
      .toEqual('На Задней Парте');
  });

  test('ASS Style override codes::blur edges test', () => {
    expect(cleanLine('{\\be1}Я умственно переутомляюсь от этих ролей за массовку.{\\be0}'))
      .toEqual('Я умственно переутомляюсь от этих ролей за массовку.');
  });

  test('ASS Style override codes::font name test', () => {
    expect(cleanLine('Here is some {\\fnCourier New}fixed space text'))
      .toEqual('Here is some fixed space text');
  });

  test('ASS Style override codes::font size test', () => {
    expect(cleanLine('{\\fs16}This is small text. {\\fs28}This is large text'))
      .toEqual('This is small text. This is large text');
  });

  test('ASS Style override codes::x scales horizontally, y scales vertically test', () => {
    expect(cleanLine('{\\fscx14.05\\fscy13.75\\t(0,620,(\\fscx100\\fscy100))}Donna'))
      .toEqual('Donna');
  });

  test('ASS Style override codes::distance between letters test', () => {
    expect(cleanLine('changes the distance {\\fsp24}between letters'))
      .toEqual('changes the distance between letters');
  });

  test('ASS Style override codes::rotation angle around the xyz axis test', () => {
    expect(cleanLine('{\\frz359.9\\fax-0.1\\frx.354\\fry2}Mebaeru to amaku omotteta'))
      .toEqual('Mebaeru to amaku omotteta');
  });

  test('ASS Style override codes::color test', () => {
    expect(cleanLine('{\\c&HFF&}This is pure, full intensity red'))
      .toEqual('This is pure, full intensity red');
    expect(cleanLine('{\\c&HFF00&}This is pure, full intensity Green'))
      .toEqual('This is pure, full intensity Green');
    expect(cleanLine('{\\c&HFF0000&}This is pure, full intensity Blue'))
      .toEqual('This is pure, full intensity Blue');
    expect(cleanLine('{\\c&HFFFFFF&}This is White'))
      .toEqual('This is White');
    expect(cleanLine('{\\c&HA0A0A&}This is dark grey'))
      .toEqual('This is dark grey');
  });

  test('ASS Style override codes::specific colors test', () => {
    expect(cleanLine('{\\1c&H2C374A&}год')).toEqual('год');
    expect(cleanLine('{\\2c&H2C374A&}год')).toEqual('год');
    expect(cleanLine('{\\3c&H2C374A&}год')).toEqual('год');
    expect(cleanLine('{\\4c&H2C374A&}год')).toEqual('год');
  });

  test('ASS Style override codes::specific alpha channels test', () => {
    expect(cleanLine('{\\1a&HFF&}год')).toEqual('год');
    expect(cleanLine('{\\2a&HEE&}год')).toEqual('год');
    expect(cleanLine('{\\3a&HAA&}год')).toEqual('год');
    expect(cleanLine('{\\4a&H07E&}год')).toEqual('год');
  });

  test('ASS Style override codes::alpha channel test', () => {
    expect(cleanLine('Что случилось?\\N{\\alpha&HFFF&}`{\\alpha}')).toEqual('Что случилось? `');
  });

  test('ASS Style override codes::alignment test', () => {
    expect(cleanLine('{\\a1}This is a left-justified subtitle')).toEqual('This is a left-justified subtitle');
    expect(cleanLine('{\\a2}This is a centered subtitle')).toEqual('This is a centered subtitle');
    expect(cleanLine('  {\\a3}This is a right-justified subtitle')).toEqual('This is a right-justified subtitle');
    expect(cleanLine('{\\a5}This is a left-justified toptitle')).toEqual('This is a left-justified toptitle');
    expect(cleanLine('{\\a11}This is a right-justified midtitle')).toEqual('This is a right-justified midtitle');
  });

  test('ASS Style override codes::numpad layout test', () => {
    expect(cleanLine('{\\an8}"Police in a Pod"')).toEqual('"Police in a Pod"');
  });

  test('ASS Style override codes::karaoke highlight by words test', () => {
    expect(cleanLine(' {\\k94}This {\\k48}is {\\k24}a {\\k150}karaoke {\\k94}line')).toEqual('This is a karaoke line');
  });

  test('ASS Style override codes::karaoke fill up from left to right test', () => {
    expect(cleanLine('{\\K50}Kan{\\K25}chi{\\K45}ga{\\K40}i  {\\kf}sa{\\kf}re{\\kf}cha{\\kf}tta{\\kf}tte' +
      '  {\\K75}ii  {\\K35}yo')).toEqual('Kanchigai sarechattatte ii yo');
  });

  test('ASS Style override codes::karaoke outline highlighting from left to right test', () => {
    expect(
      cleanLine('{\\ko30}Ko{\\ko30}tei  {\\ko20}de  {\\ko35}ki{\\ko35}mi  {\\ko30}no  {\\ko30}ko{\\ko30}to{\\ko30}ba'))
      .toEqual('Kotei de kimi no kotoba');
  });

  test('ASS Style override codes::wrapping style test', () => {
    expect(cleanLine('{\\q2\\blur.8\\pos(66.667,416.667)}Результат Поиска')).toEqual('Результат Поиска');
  });

  test('ASS Style override codes::cancels all previous style overrides in a line test', () => {
    expect(cleanLine(
      '{\\q2\\blur1.1\\frx18\\fry358\\org(428.4,167.2)\\frz0.6719\\pos(319.6,285.6)\\clip(184,296,428.8,328)}П{\\blur.9}р{\\blur.6}ямая {\\rDefault}трансляция'))
      .toEqual('Прямая трансляция');
  });

  test('ASS Style override codes:: wrong symbol in effects test', () => {
    expect(cleanLine('{\\frx18\\fry24|}Gojo Dolls')).toEqual('Gojo Dolls');
  });
});

describe('LineUtils::cleanLine Functions Tests', () => {

  test('ASS Style Functions::Animation test [1]', () => {
    expect(cleanLine(
      '{\\c&HD5C5F5&\\3c&H9A60E4&\\t(355,355,(\\c&H524C48&))\\t(355,355,(\\3c&HFFFFFF&))\\t(1523,1523,(\\c&HE7B592&))\\t(1523,1523,(\\3c&HB86F62&))\\t(1857,1857,(\\c&H524C48&))\\t(1857,1857,(\\3c&HFFFFFF&))}Чтобы зазвучал (на весь белый свет)'))
      .toEqual('Чтобы зазвучал (на весь белый свет)');
  });

  test('ASS Style Functions::Animation test [2]', () => {
    expect(cleanLine(
      'Furē! {\\alpha&HFF\\t(290,-15,\\alpha&H00)}Furē! {\\alpha&HFF\\t(580,-15,\\alpha&H00)}Furē! {\\alpha&HFF\\t(880,-15,\\alpha&H00)}☆'))
      .toEqual('Furē! Furē! Furē! ☆');
  });

  test('ASS Style Functions::Animation test [3]', () => {
    expect(cleanLine(
      '{\\fad(0,2000)\\c&H8E61C3&\\t(4071,0,(\\fs44)}Koete saku darou'))
      .toEqual('Koete saku darou');
  });

  test('ASS Style Functions::movement test [1]', () => {
    expect(cleanLine(
      '{\\move(640,60,639.822,20.178,26,2528)}(Kizuita n da ne? Hajimaru yo)'))
      .toEqual('(Kizuita n da ne? Hajimaru yo)');
  });

  test('ASS Style Functions::movement test [2]', () => {
    expect(cleanLine(
      '{\\q2\\blur1\\frz270\\move(115,83,115,-573)}Очарован и в состоянии\\Nстать кем-угодно и чем-угодно'))
      .toEqual('Очарован и в состоянии стать кем-угодно и чем-угодно');
  });

  test('ASS Style Functions::movement test [3]', () => {
    expect(cleanLine(
      '{\\q2\\bord1.5\\fs42\\blur1.5\\move(2994,658,-1700,658,27,26701)\\c&HF9F8F7&\\3c&H111111&}Первый том Blu-ray&DVD выйдет 21 декабря'))
      .toEqual('Первый том Blu-ray&DVD выйдет 21 декабря');
  });

  test('ASS Style Functions::position test', () => {
    expect(cleanLine('{\\pos(160,260)}Перевод')).toEqual('Перевод');
  });

  test('ASS Style Functions::Moves the default origin test', () => {
    expect(cleanLine('{\\blur1\\c&fafafa&\\pos(636,677)\\org(636,679)}Yumemiyo otome')).toEqual('Yumemiyo otome');
  });

  test('ASS Style Functions::fade test [1]', () => {
    expect(cleanLine('{\\fad(150,0)}Ichiban ni naritai')).toEqual('Ichiban ni naritai');
  });

  test('ASS Style Functions::fade test [2]', () => {
    expect(cleanLine('{\\fad(200,220)\\fax-0.3\\t(1770,2062,(\\fax0)}Chiisana yume no tane wo maku'))
      .toEqual('Chiisana yume no tane wo maku');
  });

  test('ASS Style Functions::fade test [3]', () => {
    expect(cleanLine('{\\fade(&HFF, &HEE, &H00, 0, 500, 350, 2000)\\c&H8E61C3&\\t(4071,0,(\\fs44)}И надеждой' +
      ' расцветём.')).toEqual('И надеждой расцветём.');
  });

  test('ASS Style Functions::clip test [1]', () => {
    expect(cleanLine('{\\move(602,570,602,525,571,738)\\clip(572,552,1168,692)}Такаги-сан дразнит его.'))
      .toEqual('Такаги-сан дразнит его.');
  });

  test('ASS Style Functions::clip test [2]', () => {
    expect(cleanLine('{\\blur1\\1c&H171719&\\pos(96,244)\\iclip(m 286 236 l 248 284 192 230)}Нисиката появился!'))
      .toEqual('Нисиката появился!');
  });

  test('ASS Style Drawings::drawing mode test', () => {
    expect(cleanLine(
      '{\\fad(250,250)\\an7\\pos(783,114)\\1c&Hfafafa&\\p1\\fscx25\\fscy25}{SSA logo#рамка}m 294 294.02 l 455.98 294.02 455.98 456 294 456  m 312.34 312.36 l 312.34 437.66 437.64 437.66 437.64 312.36'))
      .toEqual(EMPTY_STRING);
  });

  test('ASS Style Drawings::drawing mode test', () => {
    expect(cleanLine('{\\blur3\\1c&HFDFDFD&\\p4\\frz345.7\\pos(100,340)}m 0 0 l 1100 0 1100 195 0 195{\\p0}'))
      .toEqual(EMPTY_STRING);
  });

  test('ASS Style Drawings::baseline offset up (y<0) test', () => {
    expect(cleanLine(
      '{\\blur1\\1c&H171719&\\pbo-34\\pos(96,244)\\iclip(m 286 236 l 248 284 192 230)}m 0 0 l 190 0 190 55 0 55'))
      .toEqual(EMPTY_STRING);
  });

  test('ASS Style Drawings::baseline offset down (y>0) test', () => {
    expect(cleanLine('{\\blur1\\1c&H131313&\\pbo12\\pos(228,357)}m 0 0 l 150 0 150 250 0 250')).toEqual(EMPTY_STRING);
  });
});

describe('LineUtils::parse Dialogs Tests', () => {

  test('parseAssDialogs:: Akebi ep 11', () => {
    const dialogs = parseAssDialogs(akebi11assOrigin);
    expect(isEmptyObject(dialogs)).toBeFalsy();
    expect(Object.keys(dialogs).length).toEqual(299);
  });

  test('parseAssDialogs:: Bisco ep 12', () => {
    const dialogs = parseAssDialogs(bisco12assOrigin);
    expect(isEmptyObject(dialogs)).toBeFalsy();
    expect(Object.keys(dialogs).length).toEqual(310);
  });

  test('parseAssDialogs:: Girlish Number ep 11', () => {
    const dialogs = parseAssDialogs(girlishNum10assOrigin);
    expect(isEmptyObject(dialogs)).toBeFalsy();
    expect(Object.keys(dialogs).length).toEqual(653);
  });

  test('parseAssDialogs:: Hakozume ep 12', () => {
    const dialogs = parseAssDialogs(hakozume12assOrigin);
    expect(isEmptyObject(dialogs)).toBeFalsy();
    expect(Object.keys(dialogs).length).toEqual(403);
  });

  test('parseAssDialogs:: Sono B ep 12', () => {
    const dialogs = parseAssDialogs(sonoB12assOrigin);
    expect(isEmptyObject(dialogs)).toBeFalsy();
    expect(Object.keys(dialogs).length).toEqual(376);
  });

  test('parseSrtDialogs:: Free Movie', () => {
    const dialogs = parseSrtDialogs(freeMovieSrtOrigin);
    expect(isEmptyObject(dialogs)).toBeFalsy();
    expect(Object.keys(dialogs).length).toEqual(1724);
  });

});

describe('LineUtils::buildPrepare smartSplitter OFF Tests', () => {

  test('buildPrepare:: Akebi ep 11', () => {
    const prepare = buildPrepare(parseAssDialogs(akebi11assOrigin));
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(299);
  });

  test('buildPrepare:: Bisco ep 12', () => {
    const prepare = buildPrepare(parseAssDialogs(bisco12assOrigin));
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(310);
  });

  test('buildPrepare:: Girlish Number ep 11', () => {
    const prepare = buildPrepare(parseAssDialogs(girlishNum10assOrigin));
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(653);
  });

  test('buildPrepare:: Hakozume ep 12', () => {
    const prepare = buildPrepare(parseAssDialogs(hakozume12assOrigin));
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(403);
  });

  test('buildPrepare:: Sono B ep 12', () => {
    const prepare = buildPrepare(parseAssDialogs(sonoB12assOrigin));
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(376);
  });

  test('buildPrepare:: Free Movie', () => {
    const prepare = buildPrepare(parseSrtDialogs(freeMovieSrtOrigin));
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(1724);
  });
});

describe('LineUtils::buildPrepare smartSplitter ON Tests', () => {

  test('buildPrepare:: Akebi ep 11', () => {
    const prepare = buildPrepare(parseAssDialogs(akebi11assOrigin), true);
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(275);
  });

  test('buildPrepare:: Bisco ep 12', () => {
    const prepare = buildPrepare(parseAssDialogs(bisco12assOrigin), true);
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(229);
  });

  test('buildPrepare:: Girlish Number ep 11', () => {
    const prepare = buildPrepare(parseAssDialogs(girlishNum10assOrigin), true);
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(336);
  });

  test('buildPrepare:: Hakozume ep 12', () => {
    const prepare = buildPrepare(parseAssDialogs(hakozume12assOrigin), true);
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(370);
  });

  test('buildPrepare:: Sono B ep 12', () => {
    const prepare = buildPrepare(parseAssDialogs(sonoB12assOrigin), true);
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(317);
  });

  test('buildPrepare:: Free Movie', () => {
    const prepare = buildPrepare(parseSrtDialogs(freeMovieSrtOrigin), true);
    expect(isEmptyArray(prepare)).toBeFalsy();
    expect(prepare.length).toEqual(1619);
  });
});
