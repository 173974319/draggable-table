import React, { type FC, useState } from 'react';
import type { TableProps } from 'antd';
import { Table } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { generateUUID } from "../../utils";
import { DraggableBodyRow, NEXT, PREV } from "draggable-table/Table/DraggableBodyRow";

export type RowMovedProps = { // 拖拽事件
  dragItem: { tableId: string, record: any }, //拖拽的行，及其表格id
  dropItem: { tableId: string, record: any }, //插入的行，及其表格id
  dragPos: typeof PREV | typeof NEXT, //插入的位置
}

export interface DndProps {
  enable: boolean, //是否启用拖拽
  onRowMoved?: (props: RowMovedProps) => void, // drop触发时的事件，合法拖拽中，松开左键的那一刻，这个事件就会触发

  // disabledInnerDrag?: boolean // 禁用同一个表格的内部拖拽
  // disabledOuterDrag?: boolean // 禁用不同表格的互相拖拽
  // disabledDrop?: boolean  // 禁用当前表格的drop
  // disabledDrag?: boolean  // 禁用当前表格的drag
  // allowRowDrop?: (hoverRecord: any, dragRecord: any) => boolean //悬浮到当前行的时候，是否允许放
  // allowRowDrag?: (hoverRecord: any, dragRecord: any) => boolean //当前行是否允许拖
}

export interface DraggableProps {
  tableId: string,
  dnd: DndProps,
}

export interface DraggableTableProps extends TableProps, DraggableProps {

}

const DndTable: FC<DraggableTableProps> = (props) => {
  const {
    dnd,
    tableId = generateUUID(),
    dataSource = [],
    ...rest
  } = props;

  const components = () => {
    const rst: any = {
      header: {},
      body: {},
    }

    const extraProps: DraggableProps & { rowKey: any } = {
      dnd,
      tableId,
      rowKey: props.rowKey || 'key',
    }

    if (dnd && dnd.enable) {
      rst.body.row = (rowProps: any) => {
        const record = dataSource[rowProps['data-row-index']]
        return DraggableBodyRow({ ...rowProps, record }, extraProps)
      }
    }

    return rst
  }

  const onRow = (record: any, index: number) => {
    return {
      'data-row-index': index,
    }
  }

  return <DndProvider backend={HTML5Backend}>
    <Table
      className={`${tableId}`}
      components={components()}
      onRow={onRow}
      dataSource={dataSource}
      {...rest}
    />
  </DndProvider>
};

export default DndTable;
