import React, { ReactElement } from 'react';
import { Layout } from 'antd';
import SettingsProvider from '~components/providers/SettingsProvider';

const { Header, Content, Footer } = Layout;

interface Props {
  children?: Array<ReactElement> | ReactElement;
}

const BusinessLayout: React.FC<Props> = ({ children }: Props): ReactElement =>
  <Layout className='layout'>
    <SettingsProvider>
      <Header>
        <div style={{ color: 'white' }}>Subtitles Auto Translator Online</div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className='site-layout-content'>{children}</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}><a href={'https://github.com/SanSan-'}>SanSan</a> © 2022</Footer>
    </SettingsProvider>
  </Layout>;

export default BusinessLayout;
