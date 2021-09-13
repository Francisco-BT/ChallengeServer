module.exports = (router) => {
  router.post('/', (req, res) =>
    res.status(201).send({
      id: 1,
      name: 'User',
      email: 'user@mail.com',
      englishLevel: null,
      technicalKnowledge: null,
      cvLink: null,
    })
  );

  return router;
};
