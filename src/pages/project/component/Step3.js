import React, { Component } from 'react';
import { Button, Row, Col, Upload, Icon, message } from 'antd';
import { connect } from 'dva';
import reqwest from 'reqwest';

const { Dragger } = Upload;

@connect(({ textProjectFormData }) => ({
  stepOne: textProjectFormData.stepOne,
  stepTwo: textProjectFormData.stepTwo,
  forever: textProjectFormData.forever,
  saveTemplate: textProjectFormData.saveTemplate,
  optionData: textProjectFormData.optionData,
  markTools: textProjectFormData.markTools,
}))
class Step3 extends Component {
  state = {
    fileList: [],
    uploading: false,
  };

  handleChange = info => {
    const fileList = [...info.fileList];
    if (fileList.length === 2) {
      const newFileList = fileList.slice(1);
      this.setState({
        fileList: newFileList,
      });
    }
  };

  handleBeforeUpload = file => {
    this.setState({
      fileList: [file],
    });
    return false;
  };

  handleRemove = () => {
    this.setState({
      fileList: [],
    });
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const { stepOne, stepTwo, forever, labelType, optionData, saveTemplate, onCancel, dispatch } = this.props;
    // eslint-disable-next-line max-len
    const { projectName, passRate, checkRate, labeler, inspector, questionNum, projectPeriod, description } = stepOne;
    const { classifyName, multiple } = stepTwo;
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('projectName', projectName);
    formData.append('labelType', labelType.pop());
    formData.append('passRate', passRate);
    formData.append('checkRate', checkRate);
    labeler.forEach(item => {
      formData.append('labeler', item);
    });

    inspector.forEach(item => {
      formData.append('inspector', item);
    });

    formData.append('questionNum', questionNum);
    if (forever) {
      formData.append('startTime', '');
      formData.append('endTime', '');
    } else {
      formData.append('startTime', projectPeriod[0].format('YYYY-MM-DD HH:mm:ss'));
      formData.append('endTime', projectPeriod[1].format('YYYY-MM-DD HH:mm:ss'));
    }
    formData.append('description', description);
    formData.append('saveTemplate', saveTemplate);
    if (saveTemplate) {
      const { templateName } = stepTwo;
      formData.append('template', JSON.stringify({ templateName, classifyName, multiple, options: optionData }));
    } else {
      formData.append('template', JSON.stringify({ templateName: '', classifyName, multiple, options: optionData }));
    }

    this.setState({
      uploading: true,
    });
    reqwest({
      url: '/api/text-project/create',
      method: 'post',
      processData: false,
      data: formData,
      headers: {
        Authorization: localStorage.getItem('Authorization'),
        DepartmentId: localStorage.getItem('DepartmentId'),
      },
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        onCancel();
        dispatch({
          type: 'project/fetchProject',
          payload: { sorter: 'createdTime_descend' },
        });
        message.success('项目创建成功');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('项目创建失败');
      },
    });
  };

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/stepThreePrevious',
    });
  };

  handleDownload = () => {
    const { stepOne } = this.props;
    const { labelType } = stepOne;
    fetch('/api/text-project/download-template', {
      method: 'POST',
      body: JSON.stringify({ labelType }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: localStorage.getItem('Authorization'),
      },
    }).then(response => response.blob().then(blob => {
      const link = document.createElement('a');
      link.download = 'template.xlsx';
      link.style.display = 'none';
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      // 释放的 URL 对象以及移除 a 标签
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }));
  };

  render() {
    const { uploading, fileList } = this.state;
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col>
            <a onClick={this.handleDownload}><Icon type="download"/>下载模板文件</a>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col>
            <Dragger
              onChange={this.handleChange}
              beforeUpload={this.handleBeforeUpload}
              onRemove={this.handleRemove}
              fileList={fileList}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到该区域上传</p>
            </Dragger>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col>
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
            >
              {uploading ? '上传中' : '创建'}
            </Button>
            <Button style={{ marginLeft: '8px' }} onClick={this.onPrev}>上一步</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Step3;
