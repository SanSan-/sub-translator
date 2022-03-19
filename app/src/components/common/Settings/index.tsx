import React, { ReactElement, useState } from 'react';
import { useSettingsContext, useSettingsDispatch } from '~hooks/UseSettingsContext';
import { Button, Drawer, Space, Switch } from 'antd';
import { setUseLinesSmartUnion } from '~actions/backend/settings';

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
    setSettings(settingsDraft);
    onClose();
  };
  const handleSwitchSmartUnion = (checked: boolean): void => {
    setSettingsDraft({ ...settings, useSmartDialogSplitter: checked });
  };
  return <Drawer onClose={handleCancelSettings} visible={visible} placement={'right'}
    size={'large'} extra={<Space>
      <Button onClick={handleCancelSettings}>Отмена</Button>
      <Button type={'primary'} onClick={handleSaveSettings}>Сохранить</Button>
    </Space>}>
    <p>Включить Умный Режим разделения фраз из диалогов: <Switch checked={settingsDraft.useSmartDialogSplitter}
      checkedChildren={'да'} unCheckedChildren={'нет'} onChange={handleSwitchSmartUnion}/></p>
  </Drawer>;
};

export default Settings;
