import React, { useState, useEffect, Fragment } from 'react';
import { Input, Form, Row, Col, Radio, Button } from 'antd';
import EditAbleTagGroup from '../EditableTagGroup';
import ItemData from '../../map';
import styles from './style.less';

const { FieldLabels } = ItemData;

const DialogRecord = props => {
  const [reverse, setReverse] = useState(props.dialog.reverse);
  const { form, dialog, index, onDelete, disabled } = props;
  const { getFieldDecorator } = form;

  useEffect(() => {
    getFieldDecorator(`dialogRecord[${dialog.dialogId}].reverse`, {
      initialValue: dialog.reverse,
    })(<Input/>);
    getFieldDecorator(`dialogRecord[${dialog.dialogId}].dialogId`, {
      initialValue: dialog.dialogId,
    })(<Input/>);
    getFieldDecorator(`dialogRecord[${dialog.dialogId}].userId`, {
      initialValue: dialog.userId,
    })(<Input/>);
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
    const { setFieldsValue } = form;
    setReverse(!reverse);

    const temp = {};
    temp[`dialogRecord[${dialog.dialogId}].reverse`] = !reverse;
    setFieldsValue(temp);
  };

  return (
    <div className={styles.dialogForm}>
      <h4>No{index + 1}</h4>
      <Form {...formItemLayout}>
        <Row>
          <Form.Item label={FieldLabels.dialogType}>
            {
              getFieldDecorator(`dialogRecord[${dialog.dialogId}].dialogType`, {
                initialValue: dialog.dialogType,
              })(
                <Radio.Group name="dialogType" disabled={disabled}>
                  <Radio value="业务">业务</Radio>
                  <Radio value="互动">互动</Radio>
                  <Radio value="推荐">推荐</Radio>
                  <Radio value="其他">其他</Radio>
                </Radio.Group>)
            }
            {
              <Fragment>
                <Button type="link" style={{ float: 'right' }} icon="sync" onClick={handleReverse} disabled={disabled}/>
                <Button type="link" style={{ float: 'right', color: 'red', marginRight: '16px' }} icon="delete" onClick={() => { onDelete() }} disabled={disabled}/>
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
                    getFieldDecorator(`dialogRecord[${dialog.dialogId}].customer`, {
                      initialValue: dialog.customer,
                    })(<Input disabled={disabled}/>)
                  }
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label={`用户${dialog.userId}`}>
                  {
                    getFieldDecorator(`dialogRecord[${dialog.dialogId}].user`, {
                      initialValue: dialog.user,
                    })(<Input disabled={disabled}/>)
                  }
                </Form.Item>
              </Row>
            </Fragment> :
            <Fragment>
              <Row>
                <Form.Item label={`用户${dialog.userId}`}>
                  {
                    getFieldDecorator(`dialogRecord[${dialog.dialogId}].user`, {
                      initialValue: dialog.user,
                    })(<Input disabled={disabled}/>)
                  }
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label={FieldLabels.customerServer}>
                  {
                    getFieldDecorator(`dialogRecord[${dialog.dialogId}].customer`, {
                      initialValue: dialog.customer,
                    })(<Input disabled={disabled}/>)
                  }
                </Form.Item>
              </Row>
            </Fragment>
        }
        <Row>
          <Col md={8}>
            <Form.Item label={FieldLabels.textEmotion} {...formItemLayout2}>
              {
                getFieldDecorator(`dialogRecord[${dialog.dialogId}].emotionTag`, {
                  initialValue: dialog.emotionTag,
                })(<EditAbleTagGroup form={form} fieldName={`dialogRecord[${dialog.dialogId}].emotionTag`} disabled={disabled}/>)
              }
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label={FieldLabels.action} {...formItemLayout2}>
              {
                getFieldDecorator(`dialogRecord[${dialog.dialogId}].actionTag`, {
                  initialValue: dialog.actionTag,
                })(<EditAbleTagGroup form={form} fieldName={`dialogRecord[${dialog.dialogId}].actionTag`} disabled={disabled}/>)
              }
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label={FieldLabels.tag} {...formItemLayout2}>
              {
                getFieldDecorator(`dialogRecord[${dialog.dialogId}].dialogTag`, {
                  initialValue: dialog.dialogTag,
                })(<EditAbleTagGroup form={form} fieldName={`dialogRecord[${dialog.dialogId}].dialogTag`} disabled={disabled}/>)
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DialogRecord
