import Mock from 'mockjs';
import { parse } from 'url';
import moment from 'moment';

let templatesMockData = [
  {
    templateId: Mock.Random.string(5),
    type: '文本',
    labelType: 'textClassify',
    templateName: '情感配置模板',
    description: '这是情感工具配置模板',
    createdTime: '2020-03-10 10:10:00',
    updatedTime: '2020-03-10 10:10:00',
    creatorId: Mock.Random.string('lower', 5),
    creatorName: Mock.Random.cname(),
    setting: {
      classifyName: '情感',
      multiple: true,
      options: [
        {
          optionName: '愤怒',
          color: '#1890ff',
        },
        {
          optionName: '厌恶',
          color: '#1890ff',
        },
        {
          optionName: '害怕',
          color: '#1890ff',
        },
        {
          optionName: '悲伤',
          color: '#1890ff',
        },
        {
          optionName: '高兴',
          color: '#1890ff',
        },
        {
          optionName: '喜欢',
          color: '#1890ff',
        },
        {
          optionName: '惊喜',
          color: '#1890ff',
        },
        {
          optionName: '中性',
          color: '#1890ff',
        },
      ],
    },
  },
  {
    templateId: Mock.Random.string(5),
    labelType: 'textClassify',
    type: '文本',
    templateName: '句式配置模板',
    description: '这是句式工具配置模板',
    createdTime: '2020-03-11 12:10:00',
    updatedTime: '2020-03-11 12:10:00',
    creatorId: Mock.Random.string('lower', 5),
    creatorName: Mock.Random.cname(),
    setting: {
      classifyName: '句式',
      multiple: true,
      options: [
        {
          optionName: '肯定陈述句',
          color: '#1890ff',
        },
        {
          optionName: '反问句',
          color: '#1890ff',
        },
        {
          optionName: '疑问句',
          color: '#1890ff',
        },
      ],
    },
  },
  {
    templateId: Mock.Random.string(5),
    labelType: 'textClassify',
    type: '文本',
    templateName: '相似度配置模板',
    description: '这是相似度配置模板',
    createdTime: '2020-03-11 12:10:00',
    updatedTime: '2020-03-11 12:10:00',
    creatorId: Mock.Random.string('lower', 5),
    creatorName: Mock.Random.cname(),
    setting: {
      classifyName: '相似度',
      multiple: false,
      options: [
        {
          optionId: 'similar',
          optionName: '相似',
          color: '#1890ff',
        },
        {
          optionId: 'notSimilar',
          optionName: '不相似',
          color: '#1890ff',
        },
      ],
    },
  },
  {
    templateId: Mock.Random.string(5),
    labelType: 'sequenceLabeling',
    type: '文本',
    templateName: '实体识别配置模板',
    description: '这是句式工具配置模板',
    createdTime: '2020-03-12 13:10:00',
    updatedTime: '2020-03-12 13:10:00',
    creatorId: Mock.Random.string('lower', 5),
    creatorName: Mock.Random.cname(),
    setting: {
      classifyName: '实体',
      saveType: 'nomal',
      options: [
        {
          optionId: 'country',
          optionName: '国家',
          color: '#1890ff',
        },
        {
          optionId: 'location',
          optionName: '地名',
          color: '#1890ff',
        },
      ],
    },
  },

];

function getTemplates(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  let dataSource = templatesMockData;
  const params = parse(url, true).query;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return Date.parse(next[s[0]]) - Date.parse(prev[s[0]]);
      }

      return Date.parse(prev[s[0]]) - Date.parse(next[s[0]]);
    })
  }

  if (params.type) {
    const types = params.type.split(',');
    dataSource = dataSource.filter(item => types.includes(item.type));
  }

  if (params.labelType) {
    const types = params.labelType.split(',');
    dataSource = dataSource.filter(item => types.includes(item.labelType));
  }

  if (params.templateName) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.templateName.toLowerCase().includes(params.templateName.toLowerCase()));
  }

  if (params.creatorName) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.creatorName.toLowerCase().includes(params.creatorName.toLowerCase()));
  }

  return res.json(dataSource);
}

function createTemplate(req, res, u, b) {
  const body = (b && b.body) || req.body;
  body.createdTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
  body.updatedTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
  body.templateId = Mock.Random.string(5);
  body.creatorId = Mock.Random.string(5);
  body.creatorName = Mock.Random.cname();
  templatesMockData.push(body);
  return res.json({ message: '创建成功', status: 'ok' });
}

function updateTemplate(req, res, u, b) {
  const body = (b && b.body) || req.body;
  templatesMockData.forEach(template => {
    if (template.templateId === body.templateId) {
      template.templateName = body.templateName;
      template.description = body.description;
      template.setting = body.setting;
      template.updatedTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
    }
  });
  return res.json({ message: '更新成功', status: 'ok' });
}

function deleteTemplates(req, res, u, b) {
  const body = (b && b.body) || req.body;
  templatesMockData = templatesMockData.filter(item => !body.templateIds.includes(item.templateId));
  return res.json({ message: '删除成功', status: 'ok' });
}

export default {
  'GET /api/templates': getTemplates,
  'PUT /api/templates': createTemplate,
  'POST /api/templates': updateTemplate,
  'DELETE /api/templates': deleteTemplates,
};
