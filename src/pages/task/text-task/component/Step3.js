import React, { Component } from 'react';
import { Button, Form, Row, Col, Upload, Icon } from 'antd';
import { connect } from 'dva';

const { Dragger } = Upload;

@connect(({ loading }) => ({
  submitting: loading.effects['textFormData/createTask'],
}))
class Step3 extends Component {
  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textFormData/stepThreePrevious',
    });
  };

  render() {
    const formData = new FormData();
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col>
            <Dragger>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到该区域上传</p>
            </Dragger>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col>
            <Button type="primary">完成</Button>
            <Button style={{ marginLeft: '8px' }} onClick={this.onPrev}>上一步</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Step3;
