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
  projectId: textProjectFormData.projectId,
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

  saveStepData = () => {
    const { onCancel } = this.props;
    onCancel();
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
    const { dispatch, projectId } = this.props;

    const formData = new FormData();
    if (fileList.length) {
      formData.append('file', fileList[0]);
      formData.append('projectId', projectId);

      this.setState({
        uploading: true,
      });
      reqwest({
        url: '/api/project/step-three',
        method: 'post',
        processData: false,
        data: formData,
        headers: {
          Authorization: localStorage.getItem('Authorization'),
          DepartmentId: localStorage.getItem('DepartmentId'),
        },
        success: () => {
          this.setState({
            // fileList: [],
            uploading: false,
          });
          dispatch({
            type: 'textProjectFormData/saveStepThreeData',
          });
        },
        error: () => {
          this.setState({
            uploading: false,
          });
          message.error('文件上传失败');
        },
      });
    } else {
      dispatch({
        type: 'textProjectFormData/saveStepThreeData',
      });
    }
  };

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/stepThreePrevious',
    });
  };

  handleDownload = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/downloadTemplate',
      callback: blob => {
        const link = document.createElement('a');
        link.download = 'template.xlsx';
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        // 释放的 URL 对象以及移除 a 标签
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      },
    });
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
            <Button onClick={this.onPrev}>上一步</Button>
            <Button style={{ marginLeft: '8px' }} onClick={this.saveStepData}>暂存</Button>
            <Button style={{ marginLeft: '8px' }} type="primary" onClick={this.handleUpload} loading={uploading}>下一步</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Step3;
