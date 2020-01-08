import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, List, Icon, Button } from 'antd';
import styles from './style.less';
import { connect } from 'dva';

@connect(({ cardList, loading }) => ({
  cardList,
  loading: loading.models.cardList,
}))
class WordBank extends Component {
  render() {
    const { cardList: { list }, loading } = this.props;
    const MyIcon = Icon.createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/font_1496038_q7v8jd89gxd.js', // 在 iconfont.cn 上生成
    });
    return (
      <PageHeaderWrapper content="此页面可以创建不同类别的词典">
        <div className={styles.cardList}>
          <List
            rowKey="wordId"
            loading={loading}
            grid={{
              gutter: 24,
              lg: 4,
              md: 3,
              sm: 2,
              xs: 2,
            }}
            dataSource={[{}, ...list]}
            renderItem={item => {
              if (item && item.wordId) {
                return (
                  <List.Item key={item.wordId}>
                    <Card
                      hoverable
                      actions={[
                        <Icon type="edit" key="edit" />,
                        <Icon type="delete" key="delete" />,
                      ]}
                      loading={loading}
                    >
                      <Card.Meta
                        avatar={<MyIcon type="icon-dictionary" style={{ fontSize: '24px' }} />}
                        title={item.wordName}
                      />
                    </Card>
                  </List.Item>
                );
              }
              return (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" />新增词典
                  </Button>
                </List.Item>
              );
            }}
          >

          </List>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default WordBank;
