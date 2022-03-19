import React, { ReactElement } from 'react';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { ButtonType } from '~types/state';
import { Button, Checkbox, Popover } from 'antd';
import { SETTING_CAPTION } from '~const/labels';
import ColumnSettingsElement from '~types/classes/ColumnSettingsElement';

interface Props {
  callback: (field: string) => (e: CheckboxChangeEvent) => void;
  showColumnObject: { [key: string]: boolean };
  elements: ColumnSettingsElement[];
  placement?: TooltipPlacement;
  caption?: string;
  icon?: ReactElement;
  buttonType?: ButtonType;
}

const ColumnSettings = ({
  elements,
  placement,
  callback,
  showColumnObject,
  caption,
  icon,
  buttonType
}: Props): ReactElement => {
  const settingContent = <div>
    {elements.map((element) => <Checkbox
      key={element.fieldName}
      id={element.id}
      onChange={callback(element.fieldName)}
      checked={showColumnObject[element.fieldName]}
    >{element.text}</Checkbox>)}
  </div>;
  return <Popover trigger={'click'} placement={placement || 'rightBottom'} content={settingContent}>
    <Button type={buttonType || 'primary'} id={'settingButton'}>{icon}{caption || SETTING_CAPTION}</Button>
  </Popover>;
};

export default ColumnSettings;
