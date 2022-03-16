import React, { ReactElement } from 'react';
import { LabelType } from '~types/filter';
import { SelectValue } from 'antd/lib/select';
import { Form, Select } from 'antd';
import { FORM_ELEM_DEFAULT_SIZE, LABEL_DEFAULT_ALIGN } from '~const/settings';

const Item = Form.Item;
const Option = Select.Option;

export interface Props {
  id: string;
  value: string;
  label: LabelType;
  filteredData: string[];
  onChange: (key: string) => (
    value: SelectValue,
    option: ReactElement<unknown> | ReactElement<unknown>[]
  ) => void;
  disabled?: boolean;
}

const SelectFilter = ({ id, value, filteredData, label, onChange, disabled }: Props): ReactElement => {
  const { text, labelCol, wrapperCol } = label;
  return <div>
    <Item
      label={text}
      hasFeedback
      labelCol={labelCol && { span: labelCol }}
      wrapperCol={wrapperCol && { span: wrapperCol }}
      labelAlign={LABEL_DEFAULT_ALIGN}>
      <Select
        id={id}
        size={FORM_ELEM_DEFAULT_SIZE}
        value={value}
        disabled={disabled}
        onChange={onChange(id)}>
        {filteredData.map((typeItem) => (<Option key={typeItem}>{typeItem}</Option>))}
      </Select>
    </Item>
  </div>;
};

SelectFilter.defaultProps = {
  disabled: false
};

export default SelectFilter;
