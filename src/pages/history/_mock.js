import { parse } from 'url';

let tableListDataSource = [];

for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    key: i,
    recordTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    dialogTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    tag: '男，28，专业技术人员，短发，近视眼，无',
    editor: '李雷',
  });
}

for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    key: i,
    recordTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    dialogTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    tag: '女，23，办事人员，短发，近视眼，无',
    editor: '曲丽丽',
  });
}

for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    key: i,
    recordTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    dialogTime: new Date(`2019-11-${Math.floor(i / 2) + 1}`),
    tag: '女，26，企事业单位人员，短发，近视眼，无',
    editor: '露西',
  });
}

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
      filterDataSource = filterDataSource.concat(dataSource.filter(dataSource.filter(item => {
        if (item.editor === s) {
          return true;
        }
        return false;
      })));
    });
    dataSource = filterDataSource;
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 10);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.pageSize}`, 10) || 1,
    },
  };

  return res.json(result);
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
  'GET /api/query/editors': getEditors,
}
