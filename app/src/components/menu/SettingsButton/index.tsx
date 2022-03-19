import React, { ReactElement, useState } from 'react';
import { Menu, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import Settings from '~components/common/Settings';

const { Item } = Menu;

interface Props {
  key: string;
}

const SettingsButton = ({ key }: Props): ReactElement => {
  const [visible, setVisible] = useState(false);
  return <Space>
    <Item key={key} icon={<SettingOutlined/>} onClick={() => setVisible(true)}>Настройки</Item>
    <Settings visible={visible} onClose={() => setVisible(false)}/>
  </Space>;
};

export default SettingsButton;
