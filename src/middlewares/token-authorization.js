const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_ISSUER, JWT_SECRET } = require('../config');
const { User } = require('../models');
const { ForbiddenException } = require('../utils/errors');

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
        console.log('JWT: ', jwt);
        const user = await User.findByPk(id, {
          include: 'role',
          attributes: ['id', 'name', 'roleId'],
        });

        if (user) {
          return done(null, user);
        }
        done(new ForbiddenException(), false);
      } catch {
        done(new ForbiddenException(), false);
      }
    }
  )
);

module.exports = () => {
  return passport.authenticate('jwt');
};
