import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import TextClassifyView from './labelView/TextClassifyView';


@connect(({ textProjectFormData }) => ({
  labelType: textProjectFormData.labelType,
  projectId: textProjectFormData.projectId,
  preLabelData: textProjectFormData.preLabelData,
  preLabelResult: textProjectFormData.preLabelResult,
  stepTwo: textProjectFormData.stepTwo,
  optionData: textProjectFormData.optionData,
}))
class Step4 extends Component {
  componentDidMount() {
    const { dispatch, projectId } = this.props;
    dispatch({
      type: 'textProjectFormData/fetchPreLabelData',
      payload: { projectId },
    });
  }

  render () {
    const { labelType, preLabelData, preLabelResult, stepTwo, optionData } = this.props;
    let labelComponent = <TextClassifyView />;
    if (labelType.slice(-1)[0] === 'textClassify') {
      labelComponent = <TextClassifyView data={preLabelData} markTool={{ classifyName: stepTwo.classifyName, multiple: stepTwo.multiple, options: optionData }} result={preLabelResult} />
    } else if (labelType.slice[-1][0] === 'sequenceLabeling') {
    }

    return (
      <Fragment>
        { labelComponent }
        <Button>上一步</Button>
        <Button type="primary" style={{ marginLeft: '8px' }}>创建并发布</Button>
      </Fragment>
    );
  }
}


export default Step4;
