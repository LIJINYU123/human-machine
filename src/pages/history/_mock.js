import { parse } from 'url';
import mockjs from 'mockjs';

let tableListDataSource = [];

for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    key: i,
    recordTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    dialogTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    tag: '男，28，专业技术人员，短发，近视眼，无',
    editor: '李雷',
    id: 'SY0111',
  });
}

for (let i = 4; i < 8; i += 1) {
  tableListDataSource.push({
    key: i,
    recordTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    dialogTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    tag: '女，23，办事人员，短发，近视眼，无',
    editor: '曲丽丽',
    id: 'SY0112',
  });
}

for (let i = 8; i < 12; i += 1) {
  tableListDataSource.push({
    key: i,
    recordTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    dialogTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    tag: '女，26，企事业单位人员，短发，近视眼，无',
    editor: '露西',
    id: 'SY0113',
  });
}

const detailInfos = [
  {
    id: '0',
    sex: { key: 'male', label: '男' },
    attendant: { key: 'none', label: '无' },
    appearance: [{ value: 'myopic', label: '近视镜' }, { value: 'bingle', label: '短发' }],
    age: 28,
    profession: { key: 'technology', label: '专业技术人员' },
    emotion: { key: 'hate', label: '厌恶' },
    customize: ['有房', '有车', '资产500万'],
    dialogTime: '2019-11-20 00:00:00',
    videoId: 'adbcd1234545',
    remark: '这是一段备注',
    dialogInfos: [{
      user: ['这是第一轮对话，用户说话1', '这是第一轮对话，用户说话2'],
      customer: ['这是第一轮对话，客服说话1', '这是第一轮对话，客服说话2'],
      questioner: 'customer',
    }, {
      user: ['这是第二轮对话，用户说话1', '这是第二轮对话，用户说话2'],
      customer: ['这是第二轮对话，客服说话1', '这是第二轮对话，客服说话2'],
      questioner: 'user',
    }, {
      user: ['这是第三轮对话，用户说话1'],
      customer: ['这是第三轮对话，客服说话1'],
      questioner: 'user',
    }],
  },
  {
    id: 'SY0112',
    sex: { key: 'female', label: '女' },
    attendant: { key: 'none', label: '无' },
    appearance: [{ value: 'myopic', label: '近视镜' }, { value: 'longhair', label: '长发' }],
    age: 23,
    profession: { key: 'officer', label: '办事人员' },
    emotion: { key: 'hate', label: '厌恶' },
    customize: ['有房', '无车', '资产300万'],
    dialogTime: '2019-11-20 00:00:00',
    videoId: 'adbcd1234545',
    remark: '这是一段备注',
    dialogInfos: [{
      user: ['这是第一轮对话，用户说话1', '这是第一轮对话，用户说话2'],
      customer: ['这是第一轮对话，客服说话1', '这是第一轮对话，客服说话2'],
      questioner: 'customer',
    }, {
      user: ['这是第二轮对话，用户说话1', '这是第二轮对话，用户说话2'],
      customer: ['这是第二轮对话，客服说话1', '这是第二轮对话，客服说话2'],
    }],
  },
  {
    id: 'SY0113',
    sex: { key: 'female', label: '女' },
    attendant: { key: 'none', label: '无' },
    appearance: [{ value: 'myopic', label: '近视镜' }, { value: 'longhair', label: '长发' }],
    age: 23,
    profession: { key: 'officer', label: '办事人员' },
    emotion: { key: 'hate', label: '厌恶' },
    customize: ['有房', '无车', '资产300万'],
    dialogTime: '2019-11-20 00:00:00',
    videoId: 'adbcd1234545',
    remark: '这是一段备注',
    dialogInfos: [{
      user: ['这是第一轮对话，用户说话1', '这是第一轮对话，用户说话2'],
      customer: ['这是第一轮对话，客服说话1', '这是第一轮对话，客服说话2'],
      questioner: 'customer',
    }, {
      user: ['这是第二轮对话，用户说话1', '这是第二轮对话，用户说话2'],
      customer: ['这是第二轮对话，客服说话1', '这是第二轮对话，客服说话2'],
    }],
  },
];

function getRecord(req, res, u) {
  let url = u;

  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;
  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }

      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.editor) {
    const editors = params.editor.split(',');
    let filterDataSource = [];
    editors.forEach(s => {
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.id === s));
    });
    dataSource = filterDataSource;
  }

  if (params.dialogStartTime && params.dialogEndTime) {
    let filterDataSource = [];
    dataSource.forEach(data => {
      // eslint-disable-next-line max-len
      if (data.dialogTime.valueOf() > params.dialogStartTime && data.dialogTime.valueOf() < params.dialogEndTime) {
        filterDataSource = filterDataSource.concat(data);
      }
    });
    dataSource = filterDataSource;
  }

  if (params.recordStartTime && params.recordEndTime) {
    let filterDataSource = [];
    dataSource.forEach(data => {
      // eslint-disable-next-line max-len
      if (data.recordTime.valueOf() > params.recordStartTime && data.dialogTime.valueOf() < params.recordEndTime) {
        filterDataSource = filterDataSource.concat(data);
      }
    });
    dataSource = filterDataSource;
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  // res.sendStatus(401);
  return res.json(result);
}

function getDetailInfo(req, res, u) {
  let url = u;

  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;
  if (params.key) {
    const filterInfos = detailInfos.filter(detail => detail.id === params.key);
    return res.json(filterInfos[0]);
  }
  return res.json(detailInfos[0]);
}

function postRecord(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { method, keys } = body;
  if (method === 'delete') {
    tableListDataSource = tableListDataSource.filter(item => keys.indexOf(item.key) === -1);
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };
  return res.json(result);
}

function postExport(req, res) {
  res.sendFile('/Users/mac/Documents/work/prj/react/human-machine/src/pages/history/knowledge_template.xlsx');
}

function getEditors(req, res) {
  const result = [
    {
      id: 'SY0111',
      name: '李雷',
    },
    {
      id: 'SY0112',
      name: '曲丽丽',
    },
    {
      id: 'SY0113',
      name: '露西',
    },
  ];

  return res.json(result);
}

export default {
  'GET /api/record': getRecord,
  'GET /api/detail/info': getDetailInfo,
  'GET /api/editors': getEditors,
  'POST /api/record': postRecord,
  'POST /api/export': postExport,
  'POST /api/detailview/form': (_, res) => {
    res.send({ message: 'OK' });
  },
}
