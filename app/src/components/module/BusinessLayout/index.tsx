import React, { ReactElement } from 'react';
import { Layout, Menu } from 'antd';
import SettingsProvider from '~components/providers/SettingsProvider';
import { APP_DESC } from '~const/settings';
import SettingsButton from '~components/menu/SettingsButton';
import { detectLanguage } from '~utils/CommonUtils';

const { Header, Content, Footer } = Layout;

interface Props {
  children?: Array<ReactElement> | ReactElement;
}

const BusinessLayout: React.FC<Props> = ({ children }: Props): ReactElement =>
  <Layout className='layout'>
    <SettingsProvider>
      <Header>
        <div style={{ color: 'white', float: 'left' }}>{APP_DESC}</div>
        <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['1']}
          style={{ float: 'right' }}>
          <Menu.Item key={'0'}>{detectLanguage()[1]}</Menu.Item>
          <SettingsButton key={'1'}/>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Layout className='site-layout-background' style={{ padding: '24px 0' }}>
          <Content style={{ padding: '0 24px', minHeight: 480 }}>
            <div className='site-layout-content'>{children}</div>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}><a href={'https://github.com/SanSan-'}>SanSan</a> © 2022</Footer>
    </SettingsProvider>
  </Layout>;

export default BusinessLayout;
