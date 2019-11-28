export default {
  'POST /api/reset/password': (_, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'admin',
    });
  },
};
