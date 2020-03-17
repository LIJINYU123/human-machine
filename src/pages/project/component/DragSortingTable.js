import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './style.less';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';

let dragingIndex = -1;

class BodyRow extends Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    const { className } = restProps;
    let clsString;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        clsString = classNames(className, styles.downward);
      }
      if (restProps.index < dragingIndex) {
        clsString = classNames(className, styles.upward);
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={clsString} style={style}/>),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

class DragSortingTable extends Component {
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  componentDidMount() {

  }

  // moveRow = (dragIndex, hoverIndex) => {
  //   const { data } = this.props;
  //   const dragRow = data[dragIndex];
  //
  //   this.setState(
  //     update(data, {
  //       $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
  //     }),
  //   );
  // };

  render() {
    const { data, onMoveRow, ...rest } = this.props;
    return (
      <DndProvider backend={HTML5Backend}>
        <Table
          dataSource={data}
          components={this.components}
          pagination={false}
          onRow={(record, index) => ({
            index,
            moveRow: onMoveRow,
          })}
          {...rest}
        />
      </DndProvider>
    );
  }
}

export default DragSortingTable;
