import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
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
}))
class Step4 extends Component {
  state = {
    editorState: BraftEditor.createEditorState(''),
    outputHtml: '',
  };

  componentDidMount() {
    const { dispatch, projectId } = this.props;
    dispatch({
      type: 'textProjectFormData/fetchPreLabelData',
      payload: { projectId },
    });
  }

  handleChange = editorState => {
    this.setState({
      editorState,
      outputHtml: editorState.toHTML(),
    });
  };

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/stepFourPrevious',
    });
  };

  handleSaveRule = () => {
    const { dispatch, onCancel } = this.props;
    const { outputHtml } = this.state;
    dispatch({
      type: 'textProjectFormData/sveStepFourData',
      payload: { explain: outputHtml },
      callback: () => {
        onCancel();
      },
    });
  };

  render () {
    const { labelType, preLabelData, preLabelResult, stepTwo, optionData } = this.props;
    const { editorState } = this.state;
    const excludeControls = ['media', 'code'];

    let labelComponent = <TextClassifyView />;
    if (labelType.slice(-1)[0] === 'textClassify') {
      labelComponent = <TextClassifyView data={preLabelData} markTool={{ classifyName: stepTwo.classifyName, multiple: stepTwo.multiple, options: optionData }} result={preLabelResult} />
    } else if (labelType.slice(-1)[0] === 'sequenceLabeling') {
      labelComponent = <SequenceLabelView data={preLabelData} markTool={{ options: optionData }} result={preLabelResult} />
    }

    return (
      <Fragment>
        { labelComponent }
        <div className={styles.title}>标注规则</div>
        <BraftEditor
          id="editor-with-color-picker"
          excludeControls={excludeControls}
          value={editorState}
          onChange={this.handleChange}
          className={styles.editor}
          contentStyle={{ height: '200px' }}
        />
        <Button style={{ marginTop: '16px' }} onClick={this.onPrev}>上一步</Button>
        <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.handleSaveRule}>创建并发布</Button>
      </Fragment>
    );
  }
}


export default Step4;
