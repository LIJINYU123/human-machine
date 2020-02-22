import React, { Component } from 'react';
import { Button, Form, Row, Col, Upload, Icon, message } from 'antd';
import { connect } from 'dva';
import reqwest from 'reqwest';

const { Dragger } = Upload;

@connect(({ textFormData, loading }) => ({
  stepOne: textFormData.stepOne,
  stepTwo: textFormData.stepTwo,
  submitting: loading.effects['textFormData/createTask'],
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

  handleRemove = file => {
    this.setState({
      fileList: [],
    });
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const { stepOne, stepTwo } = this.props;
    const { taskName, taskType, markTool, deadline } = stepOne;
    const { labeler, inspector: inspector, acceptor } = stepTwo;
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('taskName', taskName);
    formData.append('taskType', taskType);
    markTool.forEach(item => {
      formData.append('markTool[]', item);
    });
    formData.append('deadline', deadline.format('YYYY-MM-DD HH:mm:ss'));
    formData.append('labeler', labeler);
    formData.append('inspector', inspector);
    formData.append('acceptor', acceptor);
    this.setState({
      uploading: true,
    });
    reqwest({
      url: '/api/text-task/create',
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('任务创建成功');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('任务创建失败');
      },
    });
  };

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textFormData/stepThreePrevious',
    });
  };

  render() {
    const { uploading, fileList } = this.state;
    return (
      <div>
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
