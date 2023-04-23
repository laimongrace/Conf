const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const prisma = require('@prisma/client').PrismaClient;

const prismaClient = new prisma();

const opts = {
  jwtFromRequest: (req) => req.cookies.token,
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id: jwtPayload.id },
      });

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);
