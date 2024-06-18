# ✨ Draggable-Table

当左右表格互相拖动的时候、或者表格内上下拖动的时候，onMoveRow方法都会触发

```tsx
import React, { useState } from 'react';
import DndTable from '../Table';
import './index.less';
import { NEXT } from './DraggableBodyRow';

const mockData1 = [
  {
    key: '1',
    name: 'A Brown',
    address: 'New York No. 1 Lake Park',
    phone: '1234567890',
  },
  {
    key: '2',
    name: 'B Green',
    address: 'London No. 2 Lake Park',
    phone: '1234567891',
  },
  {
    key: '3',
    name: 'C Black',
    address: 'Sidney No.3 Lake Park',
    phone: '1234567892',
  },
];

const mockData2 = [
  {
    key: '4',
    name: 'D Wang',
    address: 'Chengdu xxxx',
    phone: '1234567894',
  },
  {
    key: '5',
    name: 'E Smith',
    address: 'Chongqing xxxx',
    phone: '1234567894',
  },
  {
    key: '6',
    name: 'F Bill',
    address: 'Beijing aaaa',
    phone: '1234567892',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: 500,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    width: 200,
  },
];

const Test = () => {
  const [data1, setData1] = useState(mockData1);
  const [data2, setData2] = useState(mockData2);

  const dndProps1 = {
    enable: true,
    onRowMoved: (props) => {
      handleRowMoved(props);
    },
  };

  const dndProps2 = {
    enable: true,
    onRowMoved: (props) => {
      handleRowMoved(props);
    },
  };

  const handleRowMoved = (props) => {
    const { dragItem, dropItem, dragPos } = props;

    const removedRow = dragItem.record;
    const insertRow = dropItem.record;
    const dragTableId = dragItem.tableId;
    const dropTableId = dropItem.tableId;

    if (dragTableId === dropTableId) {
      let _data = dragTableId === 'table-1' ? data1 : data2;
      const setData = dragTableId === 'table-1' ? setData1 : setData2;

      _data = _data.filter(item => item.key !== removedRow.key);
      let dropIndex = _data.findIndex(item => item.key === insertRow.key);
      if (dragPos === NEXT) {
        dropIndex += 1;
      }

      _data.splice(dropIndex, 0, removedRow);

      setData([..._data]);

      return;
    }

    let dragTableData = dragTableId === 'table-1' ? data1 : data2;
    const setDragTableData = dragTableId === 'table-1' ? setData1 : setData2;

    let dropTableData = dropTableId === 'table-1' ? data1 : data2;
    const setDropTableData = dropTableId === 'table-1' ? setData1 : setData2;

    dragTableData = dragTableData.filter(item => item.key !== removedRow.key);
    let dropIndex = dropTableData.findIndex(item => item.key === insertRow.key);
    if (dragPos === NEXT) {
      dropIndex += 1;
    }

    dropTableData.splice(dropIndex, 0, removedRow);

    setDragTableData([...dragTableData]);
    setDropTableData([...dropTableData]);

  };

  return <div className={'main-container'}>
    <div className="table-container">
      <DndTable
        tableId={'table-1'}
        dnd={dndProps1}
        dataSource={data1}
        columns={columns}
      />
    </div>

    <div className="table-container">
      <DndTable
        tableId={'table-2'}
        dnd={dndProps2}
        dataSource={data2}
        columns={columns}
      />
    </div>
  </div>;
};

export default Test;



```
