import { Table } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { isEmptyArray } from '~utils/CommonUtils';
import Header from '~types/classes/Header';
import useWindowResize from '~hooks/UseWindowResize';
import ResizableTitle from '~components/common/ResizableTitle';
import { EMPTY_FUNC } from '~const/common';
import { SortType } from '~enums/SortType';
import { Sort } from '~const/Sort';
import { FilterValue, SortOrder, TablePaginationConfig, TableRowSelection } from 'antd/lib/table/interface';
import { FORM_ELEM_DEFAULT_SIZE } from '~const/settings';

interface Props {
  data?: Array<Record<string, unknown>>;
  defaultExpandAllRows?: boolean;
  headers?: Header[];
  callback?: (currentPage: number, pageSize: number, sortKey: string, sortType: string) => void;
  rowSelection?: TableRowSelection<unknown>;
  style?: React.CSSProperties;
}

interface TableState {
  columns?: Header[];
  tableWidth?: number;
}

interface SortedInfoType {
  field?: string;
  order?: SortOrder;
}

const initialSortedInfo: SortedInfoType = {
  field: null,
  order: null
};

const ResultTable: React.FC<Props> = ({
  data,
  defaultExpandAllRows,
  headers,
  rowSelection,
  callback,
  style
}: Props): ReactElement => {
  const [state, setState] = useState({} as TableState);
  useEffect(() => {
    setState({
      columns: headers,
      tableWidth: isEmptyArray(headers) ? 0 : headers.map((header) => header.width)
        .reduce((acc, val) => acc + val, 0)
    });
  }, [headers]);
  const [sortedInfo, setSortedInfo] = useState(initialSortedInfo);
  const windowSize = useWindowResize();
  const components = { header: { cell: ResizableTitle } };
  const dataSource = isEmptyArray(data) ? null : data.map((element, i) => ({ ...element, key: i }));
  const handleResize = (index: number) => (_e: Event, { size }: { size: { width: number, height: number } }): void => {
    setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width
      };
      return { columns: nextColumns };
    });
  };
  const columns = isEmptyArray(state.columns) ? [] : state.columns.map((col, index) => ({
    ...col,
    sorter: col.sortName ? EMPTY_FUNC : false,
    sortOrder: col.sortName ? sortedInfo.field === col.sortName && sortedInfo.order : false,
    onHeaderCell: (column: Header): Record<string, unknown> => ({
      width: column.width,
      onResize: handleResize(index)
    })
  }));
  const handleChange = (
    { current, pageSize: newPageSize }: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    { column, order }: { column: Header, order: SortOrder }
  ): void => {
    setSortedInfo({ order: order || null, field: column ? column.sortName : null });
    callback(current, newPageSize, column ? column.sortName : null, Sort[order] || SortType.NONE as string);
  };
  return isEmptyArray(dataSource) ? null : (
    <Table columns={columns} dataSource={dataSource} expandable={{ defaultExpandAllRows }}
      style={{ whiteSpace: 'pre-wrap', maxWidth: windowSize.width - 125, ...style }}
      components={components} size={FORM_ELEM_DEFAULT_SIZE}
      scroll={state.tableWidth > windowSize.width - 125 ? { x: state.tableWidth } : {}}
      rowSelection={rowSelection}
      onChange={handleChange}/>);
};

ResultTable.defaultProps = {
  defaultExpandAllRows: true,
  rowSelection: null
};

export default ResultTable;
