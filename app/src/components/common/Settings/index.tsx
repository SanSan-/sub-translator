import React, { ReactElement, useState } from 'react';
import { useSettingsContext, useSettingsDispatch } from '~hooks/UseSettingsContext';
import { Button, Col, Drawer, Input, InputNumber, Row, Slider, Space, Switch } from 'antd';
import {
  setBatchSize,
  setFolderId,
  setIamToken,
  setThreadCount,
  setUseLinesSmartUnion
} from '~actions/backend/settings';
import Types from '~app/src/model/enums/Types';
import { FORM_ELEM_DEFAULT_SIZE } from '~const/settings';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const Settings = ({ visible, onClose }: Props): ReactElement => {
  const [settings, setSettings] = useState(useSettingsContext());
  const [settingsDraft, setSettingsDraft] = useState(useSettingsContext());
  const dispatch = useSettingsDispatch();
  const handleCancelSettings = (): void => {
    setSettingsDraft(settings);
    onClose();
  };
  const handleSaveSettings = (): void => {
    if (settings.useSmartDialogSplitter !== settingsDraft.useSmartDialogSplitter) {
      dispatch(setUseLinesSmartUnion(settingsDraft.useSmartDialogSplitter));
    }
    if (settings.threadCount !== settingsDraft.threadCount) {
      dispatch(setThreadCount(settingsDraft.threadCount));
    }
    if (settings.batchSize !== settingsDraft.batchSize) {
      dispatch(setBatchSize(settingsDraft.batchSize));
    }
    if (settings.iamToken !== settingsDraft.iamToken) {
      dispatch(setIamToken(settingsDraft.iamToken));
    }
    if (settings.folderId !== settingsDraft.folderId) {
      dispatch(setFolderId(settingsDraft.folderId));
    }
    setSettings(settingsDraft);
    onClose();
  };
  const handleSwitchSmartUnion = (checked: boolean): void => {
    setSettingsDraft({ ...settingsDraft, useSmartDialogSplitter: checked });
  };
  const onChangeThreadCount = (threadCount: number) => {
    setSettingsDraft({ ...settingsDraft, threadCount });
  };
  const onChangeBatchSize = (batchSize: number) => {
    setSettingsDraft({ ...settingsDraft, batchSize });
  };
  const onChangeAccessToken = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSettingsDraft({ ...settingsDraft, iamToken: e.target.value });
  };
  const onChangeFolderId = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSettingsDraft({ ...settingsDraft, folderId: e.target.value });
  };
  return <Drawer onClose={handleCancelSettings} visible={visible} placement={'right'}
    size={'large'} extra={<Space>
      <Button onClick={handleCancelSettings}>Отмена</Button>
      <Button type={'primary'} onClick={handleSaveSettings}>Сохранить</Button>
    </Space>}>
    <Row>
      <Col>Включить Умный Режим разделения фраз из диалогов: <Switch checked={settingsDraft.useSmartDialogSplitter}
        checkedChildren={'да'} unCheckedChildren={'нет'} onChange={handleSwitchSmartUnion}/>
      </Col>
    </Row>
    <Row><p>&nbsp;</p></Row>
    <Row>
      <Col span={12}>
        Количество потоков:
        <Slider
          min={1}
          max={20}
          onChange={onChangeThreadCount}
          value={typeof settingsDraft.threadCount === Types.NUMBER ? settingsDraft.threadCount : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={20}
          style={{ margin: '0 16px' }}
          value={settingsDraft.threadCount}
          onChange={onChangeThreadCount}
        />
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        Размер пачки:
        <Slider
          min={1}
          max={50}
          onChange={onChangeBatchSize}
          value={typeof settingsDraft.batchSize === Types.NUMBER ? settingsDraft.batchSize : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={50}
          style={{ margin: '0 16px' }}
          value={settingsDraft.batchSize}
          onChange={onChangeBatchSize}
        />
      </Col>
    </Row>
    <Row>
      <Col>
        Настройки Yandex
      </Col>
    </Row>
    <Row>
      <Col span={5}>
        IAM_TOKEN:
      </Col>
      <Col span={19}>
        <Input
          allowClear
          size={FORM_ELEM_DEFAULT_SIZE}
          value={settingsDraft.iamToken}
          onChange={onChangeAccessToken}
        />
      </Col>
    </Row>
    <Row>
      <Col span={5}>
        folderId:
      </Col>
      <Col span={19}>
        <Input
          allowClear
          size={FORM_ELEM_DEFAULT_SIZE}
          value={settingsDraft.folderId}
          onChange={onChangeFolderId}
        />
      </Col>
    </Row>
  </Drawer>;
};

export default Settings;
