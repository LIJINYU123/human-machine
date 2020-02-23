import React, { Component } from 'react';
import { Button, Row, Col, Upload, Icon, message } from 'antd';
import { connect } from 'dva';
import reqwest from 'reqwest';

const { Dragger } = Upload;

@connect(({ textProjectFormData }) => ({
  stepOne: textProjectFormData.stepOne,
  stepTwo: textProjectFormData.stepTwo,
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
    const { stepOne, stepTwo } = this.props;
    console.log(stepOne);
    console.log(stepTwo);
  };

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/stepThreePrevious',
    });
  };

  handleDownload = () => {
    fetch('/api/text-project/download-template', {
      method: 'POST',
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
