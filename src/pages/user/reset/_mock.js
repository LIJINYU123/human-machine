export default {
  'POST /api/reset/password': (_, res) => {
    res.send({
      status: 'ok',
      message: '重置密码成功',
      currentAuthority: 'admin',
    });
  },
};
