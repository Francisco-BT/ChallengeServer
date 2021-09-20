const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_ISSUER, JWT_SECRET } = require('../config');
const { User } = require('../models');
const { ForbiddenException } = require('../utils/errors');
const { UserController } = require('../controllers');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: JWT_ISSUER,
      algorithms: 'HS512',
      secretOrKey: JWT_SECRET,
    },
    async (jwt, done) => {
      try {
        const { id } = jwt;
        const user = await User.findByPk(id, {
          include: 'role',
          attributes: ['id', 'name', 'roleId'],
        });

        if (user) {
          return done(null, UserController.parseUser(user, user.role));
        }
        return done(new ForbiddenException());
      } catch {
        return done(new ForbiddenException());
      }
    }
  )
);

module.exports = () => {
  return passport.authenticate('jwt', { session: false });
};
