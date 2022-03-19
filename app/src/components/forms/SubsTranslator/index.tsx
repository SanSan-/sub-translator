import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, message, Progress, Statistic, Upload } from 'antd';
import { DownloadOutlined, SettingOutlined, TranslationOutlined, UploadOutlined } from '@ant-design/icons';
import * as actions from '~actions/module/subsTranslator';
import { PrepareToTranslateItem, SubsState, TranslationOptions } from '~types/state';
import { GeneralState } from '~types/store';
import { bindActionCreators } from 'redux';
import { SubsAction, ThunkResult } from '~types/action';
import './style.less';
import { isAllPropsInObjectAreNull, isEmptyArray, isEmptyObject } from '~utils/CommonUtils';
import { toExportHeaders } from '~dictionaries/headers';
import defaultFilter from '~model/states/filters/SubsTranslator';
import { handleUpdateFilter } from '~utils/FilterUtils';
import ResultTable from '~components/antd/ResultTable';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import SelectFilter from '~components/antd/SelectFilter';
import SubtitlesTranslatorFields from '~enums/module/SubtitlesTranslatorFields';
import { subsTypeFilter, transLangFilter, transTypeFilter } from '~dictionaries/filters';
import { SelectValue } from 'antd/lib/select';
import { SubtitlesTranslationFilter } from '~types/filter';
import { useSettingsContext, useSettingsDispatch } from '~hooks/UseSettingsContext';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { setDialogsShowColumns } from '~actions/backend/settings';
import ColumnSettings from '~components/common/ColumnSettings';
import { dialogColumnSettings } from '~dictionaries/columnSettings';
import { getDialogHeaders } from '~utils/HeaderUtils';
import Header from '~types/classes/Header';
import HeaderGroup from '~types/classes/HeaderGroup';

const { Countdown } = Statistic;

interface Props {
  state: SubsState;
  importData: (filter: SubtitlesTranslationFilter, data: string) => ThunkResult<void, SubsAction>;
  translate: (lines: PrepareToTranslateItem[], opts: TranslationOptions) => ThunkResult<void, SubsAction>;
  exportData: (fileName: string, toExport: string[], format: string) => ThunkResult<void, SubsAction>;
}

const calcDeadline = (startDate: number, doneCount: number, allCount: number): number => {
  const now = Date.now();
  return now + ((allCount - doneCount) * ((now - startDate) / doneCount));
};

const renderTable = (
  data: Record<string, unknown>[],
  tableHeaders: Header[] | HeaderGroup[],
  filter: SubtitlesTranslationFilter
): ReactElement => {
  if (!data || data.length === 0) {
    return <div>{
      isAllPropsInObjectAreNull(filter) ?
        'записи отсутствуют' :
        'записи не найдены, попробуйте изменить условие поиска'
    }</div>;
  }
  return <ResultTable data={data} headers={tableHeaders as Header[]}/>;
};

const SubsTranslator: React.FC<Props> = (props: Props): ReactElement => {
  const { state } = props;
  const {
    fileName,
    dialogs,
    prepare,
    translated,
    translatedCount,
    translateStartDate,
    subsType,
    toExport,
    isFileActionFailed,
    fileActionError,
    isTranslating,
    isLoadingExport
  } = state;
  const [filter, setFilter] = useState(defaultFilter);
  const settings = useSettingsContext();
  const settingsDispatch = useSettingsDispatch();
  const dialogShowColumns = settings.dialogShowColumns;
  useEffect(() => {
    isFileActionFailed && message.error('Произошла ошибка во время импорта');
    fileActionError && message.error(fileActionError);
  }, [isFileActionFailed]);
  const handleSelector = (key: string) => (value: SelectValue) => handleUpdateFilter(key, value as string, setFilter);
  const handleUploadSubs = (subtitlesType: string) => ({ file }: UploadChangeParam): void => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file.originFileObj, 'utf-8');
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    }).then((value) => {
      props.importData({ subtitlesType, fileName: file.name.slice(0, -4) }, value as string);
    });
  };
  const createHandleSettingsCheckbox = (field: string) => (e: CheckboxChangeEvent) =>
    settingsDispatch(setDialogsShowColumns({ ...dialogShowColumns, [field]: e.target.checked }));
  return <Form
    labelCol={{ span: 6 }}
    wrapperCol={{ span: 18 }}
    layout='horizontal'
  >
    <Form.Item>
      <SelectFilter
        id={SubtitlesTranslatorFields.SUBS_TYPE}
        value={filter.subtitlesType}
        label={{ text: 'Тип субтитров', labelCol: 5, wrapperCol: 19 }}
        filteredData={subsTypeFilter}
        onChange={handleSelector}
        disabled={true}
      />
    </Form.Item>
    <Form.Item>
      <Upload onChange={handleUploadSubs(filter.subtitlesType)}>
        <Button icon={<UploadOutlined/>}>Загрузить субтитры</Button>
      </Upload>
    </Form.Item>
    <Form.Item hidden={isEmptyObject(dialogs)}>
      <ColumnSettings callback={createHandleSettingsCheckbox} showColumnObject={dialogShowColumns}
        elements={dialogColumnSettings} icon={<SettingOutlined/>}/>
      {renderTable(
        Object.keys(dialogs).map((key) => Number(key))
          .map((key) => ({
            line: key, layer: dialogs[key].layer, startTime: dialogs[key].startTime,
            endTime: dialogs[key].endTime,
            style: dialogs[key].style,
            actor: dialogs[key].actor,
            marginL: dialogs[key].marginL,
            marginR: dialogs[key].marginR,
            marginV: dialogs[key].marginV,
            effect: dialogs[key].effect,
            text: dialogs[key].text
          })),
        getDialogHeaders(dialogShowColumns), filter
      )}
    </Form.Item>
    <hr/>
    <Form.Item>
      Перевести
      <SelectFilter
        id={SubtitlesTranslatorFields.TRANS_API}
        value={filter.translateApi}
        label={{ text: 'переводчик', labelCol: 5, wrapperCol: 19 }}
        filteredData={transTypeFilter}
        onChange={handleSelector}
      />
      <SelectFilter
        id={SubtitlesTranslatorFields.FROM_LANG}
        value={filter.originFromLanguage}
        label={{ text: 'откуда', labelCol: 5, wrapperCol: 19 }}
        filteredData={transLangFilter}
        onChange={handleSelector}
      />
      <SelectFilter
        id={SubtitlesTranslatorFields.DEST_LANG}
        value={filter.destinationLanguage}
        label={{ text: 'куда', labelCol: 5, wrapperCol: 19 }}
        filteredData={transLangFilter}
        onChange={handleSelector}
      />
    </Form.Item>
    <Form.Item hidden={isEmptyArray(prepare)}>
      <Button loading={isTranslating} type={isEmptyArray(translated) ? 'default' : 'primary'}
        hidden={isEmptyArray(prepare)}
        onClick={() => props.translate(
          prepare, {
            api: filter.translateApi,
            from: filter.originFromLanguage,
            to: filter.destinationLanguage
          })}>
        <TranslationOutlined style={{ color: 'green' }}/> Перевести
      </Button>
      &nbsp;
      <Button loading={isLoadingExport} hidden={isEmptyArray(toExport)}
        onClick={() => props.exportData(fileName, toExport, subsType)}>
        <DownloadOutlined/> Скачать перевод
      </Button>
    </Form.Item>
    <br/>
    <Form.Item hidden={!isTranslating}>
      <Progress status={isTranslating ? 'active' : 'normal'}
        percent={translatedCount > 0 ? Math.round((translatedCount / prepare.length) * 100) :
          0}/>
      <Countdown title={'Осталось'}
        value={calcDeadline(translateStartDate, translatedCount, prepare.length)}/>
    </Form.Item>
    <Form.Item hidden={isTranslating || isEmptyArray(toExport)}>
      <ResultTable data={toExport.map((text, i) => ({ idx: i, text }))} headers={toExportHeaders}/>
    </Form.Item>
  </Form>;
};

export default connect((state: GeneralState) => ({
  state: state.app.module.subsTranslator
}), (dispatch) => bindActionCreators(actions, dispatch))(SubsTranslator);
