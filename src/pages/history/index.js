import React, { Component, Fragment } from 'react';
import { connect } from 'dva';


@connect(({ historyRecordList, loading }) => ({
  historyRecordList,
  loading: loading.models.historyRecordList,
}))
class HistoryList extends Component {

  render() {

  }
}

