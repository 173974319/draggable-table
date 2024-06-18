import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DraggableProps } from "draggable-table/Table";
import React from "react";

const type = 'DraggableBodyRow';

const getCurrentTableBodyDom = (id: string) => {
  const currentTable = document.getElementsByClassName(id)
  if (currentTable && currentTable[0]) {
    const tableBody = currentTable[0].getElementsByClassName('ant-table-tbody')
    if (tableBody && tableBody[0]) {
      return tableBody[0]
    }

    return null;
  }

  return null
}

export const PREV = 'prev';
export const NEXT = 'next';

const hoverClassNameMap: any = {
  [PREV]: ' drop-over-upward',
  [NEXT]: ' drop-over-downward',
}

export const DraggableBodyRow = (rowProps: any, extraProps: DraggableProps & { rowKey: any }) => {
  const {
    children,
    className,
    record,
    ...restProps
  } = rowProps;

  const {
    dnd,
    tableId,
    rowKey,
  } = extraProps;

  const {
    onRowMoved,
  } = dnd

  const ref = useRef<any>();

  let [dragPos] = useState<typeof PREV | typeof NEXT>(PREV);

  const [hoverClassName, setHoverClassName] = useState<string>('')
  const [canDrop, setCanDrop] = useState<boolean>(false)

  //用来注册"放开"的事件和属性等
  const [{ isOver }, drop] = useDrop({
    //drop的唯一标识，需要和下面useDrag的唯一标识匹配，拖放才能生效
    accept: type,

    collect: monitor => {
      return {
        isOver: monitor.isOver(),
      };
    },

    hover: (item: any, monitor: any) => {
      if (!record) return
      const hoveredItemId = record[rowKey];

      //根据hover的id获取到悬浮那一行在dom中的位置
      if (hoveredItemId) {
        const rows = getCurrentTableBodyDom(tableId)?.getElementsByClassName('ant-table-row')
        if (rows) {
          let target: any = null;
          for (let i of Array.from(rows)) {
            if (i.getAttribute('data-row-key') === hoveredItemId) {
              target = i;
              break;
            }
          }
          if (target) {
            //被悬浮的那一行
            const hoverBoundingRect = target.getBoundingClientRect();
            //拖着被拖拽行时，鼠标的指针位置
            const clientOffset = monitor.getClientOffset();
            let { y, height } = hoverBoundingRect;
            let { y: mouseY } = clientOffset;

            //被悬浮的那一行中线的位置
            const middleLineY = (y + height / 2)

            if (mouseY < middleLineY) {//指针在中线上方
              dragPos = PREV;
            } else {
              dragPos = NEXT;//指针在中线下方
            }

            if (target.getAttribute('data-row-key') === item.record[rowKey]) {
              setCanDrop(false)
              setHoverClassName('')
              return;
            }

            setCanDrop(true)
            setHoverClassName(hoverClassNameMap[dragPos]);
          }
        }
      }
    },

    //"放"的时候的回调事件，item是拖拽的数据
    drop: (item: { tableId: string, record: any }) => {

      if (onRowMoved) {
        onRowMoved({
          dragItem: {
            tableId: item.tableId,
            record: item.record,
          },
          dropItem: {
            tableId,
            record: record,
          },
          dragPos,
        });
      }
    },

    canDrop: () => {
      return canDrop
    }
  });


  const [, drag] = useDrag({
    type,
    item: { tableId, record },
    collect: monitor => {
      return ({
        isDragging: monitor.isDragging(),
      })
    },

    canDrag: () => {
      return dnd.enable
    }
  });

  drop(drag(ref));

  return <tr
    ref={ref}
    className={`${className} ${isOver ? hoverClassName : ''}`}
    {...restProps}
  >
    {children}
  </tr>
};
