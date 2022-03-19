import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { GeneralState } from '~types/store';
import Dialog from '~components/antd/Dialog';
import Spinner from '~components/antd/Spinner';
import SpinnerEnum from '~enums/Spinner';
import bg from '~app/resources/bg.png';

interface Props {
  children?: Array<ReactElement> | ReactElement;
  background?: boolean;
}

const CommonLayout: React.FC<Props> = ({ background, children }: Props): ReactElement =>
  <div style={{ background: `url(${background ? bg : null})` }} id='main_layout'>
    <Dialog/>
    <Spinner id={SpinnerEnum.ID as string}>
      {React.Children.only(children)}
    </Spinner>
  </div>;

export default connect((state: GeneralState) => ({
  background: state.app.common.background
}))(CommonLayout);
