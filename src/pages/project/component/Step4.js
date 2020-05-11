import React, { Component, Fragment } from 'react';
import { Button, Form } from 'antd';
import BraftEditor from 'braft-editor';
import ColorPicker from 'braft-extensions/dist/color-picker';
import { connect } from 'dva';
import TextClassifyView from './labelView/TextClassifyView';
import SequenceLabelView from './labelView/SequenceLabelView';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css'
import styles from './style.less';

BraftEditor.use(ColorPicker({
  includeEditors: ['editor-with-color-picker'],
  theme: 'light',
}));

@connect(({ textProjectFormData }) => ({
  labelType: textProjectFormData.labelType,
  projectId: textProjectFormData.projectId,
  preLabelData: textProjectFormData.preLabelData,
  preLabelResult: textProjectFormData.preLabelResult,
  stepTwo: textProjectFormData.stepTwo,
  optionData: textProjectFormData.optionData,
  explain: textProjectFormData.explain,
}))
class Step4 extends Component {
  componentDidMount() {
    const { dispatch, projectId } = this.props;
    dispatch({
      type: 'textProjectFormData/fetchPreLabelData',
      payload: { projectId },
    });
  }

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/stepFourPrevious',
    });
  };

  handleSaveRule = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel, projectId } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        dispatch({
          type: 'textProjectFormData/sveStepFourData',
          payload: { explain: values.content.toHTML(), projectId },
          callback: () => {
            onCancel();
          },
        });
      }
    });

  };

  render () {
    const { labelType, preLabelData, preLabelResult, stepTwo, optionData, explain, form: { getFieldDecorator } } = this.props;
    const excludeControls = ['media', 'code'];

    let labelComponent = <TextClassifyView />;
    if (labelType.slice(-1)[0] === 'textClassify') {
      labelComponent = <TextClassifyView data={preLabelData} markTool={{ classifyName: stepTwo.classifyName, multiple: stepTwo.multiple, options: optionData }} result={preLabelResult} />
    } else if (labelType.slice(-1)[0] === 'sequenceLabeling') {
      labelComponent = <SequenceLabelView data={preLabelData} markTool={{ classifyName: stepTwo.classifyName, saveType: stepTwo.saveType, options: optionData }} result={preLabelResult} />
    }

    return (
      <Fragment>
        { labelComponent }
        <div className={styles.title}>标注规则</div>
        <Form>
          <Form.Item>
            {
              getFieldDecorator('content', {
                initialValue: BraftEditor.createEditorState(explain),
              })(
                <BraftEditor
                  id="editor-with-color-picker"
                  excludeControls={excludeControls}
                  className={styles.editor}
                  contentStyle={{ height: '200px' }}
                />)
            }
          </Form.Item>
        </Form>
        <Button style={{ marginTop: '16px' }} onClick={this.onPrev}>上一步</Button>
        <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.handleSaveRule}>创建并发布</Button>
      </Fragment>
    );
  }
}


export default Form.create()(Step4);
