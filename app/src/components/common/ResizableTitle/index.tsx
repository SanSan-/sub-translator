import React, { ReactElement } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';

interface ResizableType {
  width?: number;
  onResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => unknown;
}

const ResizableTitle = (props: ResizableType): ReactElement => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return <Resizable
    width={width}
    height={0}
    handle={<span className={'react-resizable-handle'}
      onClick={(e) => {
        e.stopPropagation();
      }}/>}
    onResize={onResize}
    draggableOpts={{ enableUserSelectHack: false }}>
    <th {...restProps} />
  </Resizable>;
};

export default ResizableTitle;
