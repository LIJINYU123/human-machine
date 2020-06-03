import React, { useState, useEffect, Fragment } from 'react';
import { Tag, Input, Form, Row, Col, Radio, Icon, Button } from 'antd';
import EditAbleTagGroup from '../EditableTagGroup';
import ItemData from '../../map';
import styles from './style.less';

const { FieldLabels } = ItemData;

const DialogRecord = props => {
  const [reverse, setReverse] = useState(props.dialog.reverse);
  const { form, dialog, index, onDelete } = props;
  const { getFieldDecorator } = form;

  useEffect(() => {
    getFieldDecorator(`dialogRecord[${index}].reverse`, {
      initialValue: dialog.reverse,
    })(<Input/>)
  });

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 21 },
    },
  };

  const formItemLayout2 = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 9 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    },
  };

  const handleReverse = () => {
    setReverse(!reverse);
  };

  return (
    <div className={styles.dialogForm}>
      <h4>No{index + 1}</h4>
      <Form {...formItemLayout}>
        <Row>
          <Form.Item label={FieldLabels.dialogType}>
            {
              getFieldDecorator(`dialogRecord[${index}].dialogType`, {
                initialValue: dialog.dialogType,
              })(
                <Radio.Group name="dialogType">
                  <Radio value="业务">业务</Radio>
                  <Radio value="互动">互动</Radio>
                  <Radio value="推荐">推荐</Radio>
                  <Radio value="其他">其他</Radio>
                </Radio.Group>)
            }
            {
              <Fragment>
                <Button type="link" style={{ float: 'right' }} icon="sync" onClick={handleReverse}/>
                <Button type="link" style={{ float: 'right', color: 'red', marginRight: '16px' }} icon="delete" onClick={() => { onDelete() }}/>
              </Fragment>
            }
          </Form.Item>
        </Row>
        {
          reverse === false ?
            <Fragment>
              <Row>
                <Form.Item label={FieldLabels.customerServer}>
                  {
                    getFieldDecorator(`dialogRecord[${index}].customer`, {
                      initialValue: dialog.customer,
                    })(<Input/>)
                  }
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label={`用户${dialog.userId}`}>
                  {
                    getFieldDecorator(`dialogRecord[${index}].user`, {
                      initialValue: dialog.user,
                    })(<Input/>)
                  }
                </Form.Item>
              </Row>
            </Fragment> :
            <Fragment>
              <Row>
                <Form.Item label={`用户${dialog.userId}`}>
                  {
                    getFieldDecorator(`dialogRecord[${index}].user`, {
                      initialValue: dialog.user,
                    })(<Input/>)
                  }
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label={FieldLabels.customerServer}>
                  {
                    getFieldDecorator(`dialogRecord[${index}].customer`, {
                      initialValue: dialog.customer,
                    })(<Input/>)
                  }
                </Form.Item>
              </Row>
            </Fragment>
        }
        <Row>
          <Col md={8}>
            <Form.Item label={FieldLabels.textEmotion} {...formItemLayout2}>
              {
                getFieldDecorator(`dialogRecord[${index}].emotionTag`, {
                  initialValue: dialog.emotionTag,
                })(<EditAbleTagGroup form={form} fieldName={`dialogRecord[${index}].emotionTag`}/>)
              }
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label={FieldLabels.action} {...formItemLayout2}>
              {
                getFieldDecorator(`dialogRecord[${index}].actionTag`, {
                  initialValue: dialog.actionTag,
                })(<EditAbleTagGroup form={form} fieldName={`dialogRecord[${index}].actionTag`}/>)
              }
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label={FieldLabels.tag} {...formItemLayout2}>
              {
                getFieldDecorator(`dialogRecord[${index}].dialogTag`, {
                  initialValue: dialog.dialogTag,
                })(<EditAbleTagGroup form={form} fieldName={`dialogRecord[${index}].dialogTag`}/>)
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DialogRecord
