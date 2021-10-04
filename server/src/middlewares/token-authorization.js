const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_ISSUER, JWT_SECRET } = require('../config');
const { User, Token } = require('../models');
const { AuthenticationException } = require('../utils/errors');
const { getTokenFromHeaders } = require('../utils');
const { UserController } = require('../controllers');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: JWT_ISSUER,
      algorithms: 'HS512',
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    },
    async (req, jwt, done) => {
      try {
        const rawToken = getTokenFromHeaders(req);
        const { id } = jwt;
        const user = await User.findByPk(id, {
          include: 'role',
          attributes: ['id', 'name', 'roleId'],
        });
        const isStoredToken = await Token.findOne({
          where: { token: rawToken },
        });

        if (user && isStoredToken) {
          return done(null, UserController.parseUser(user, user.role));
        }
        return done(new AuthenticationException());
      } catch {
        return done(new AuthenticationException());
      }
    }
  )
);

module.exports = () => {
  return passport.authenticate('jwt', { session: false });
};
