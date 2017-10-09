import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import denodeify from 'denodeify';
import bodyParser from 'body-parser';
import pick from 'lodash/pick';

// https://www.djamware.com/post/58eba06380aca72673af8500/node-express-mongoose-and-passportjs-rest-api-authentication

const genSalt = denodeify(bcrypt.genSalt);
const createHash = denodeify(bcrypt.hash);
const compareHash = denodeify(bcrypt.compare);

const SECRET = 'CTC clave secreta: pepino'; // todo el string es el secreto;
let usersCollection;

export function setStrategy(db) {
  usersCollection = db.collection('users');
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: SECRET,
  };
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      console.log('verify', jwtPayload.username);
      usersCollection.findOne({ _id: jwtPayload.username }, (err, user) => {
        if (err) {
          done(err, false);
        } else if (user) {
          done(null, pick(user, 'username'));
        } else {
          done(null, false);
        }
      });
    })
  );
}

export async function signup(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.json({ success: false, msg: 'Please pass username and password.' });
  } else {
    try {
      const salt = await genSalt(10);
      const hash = await createHash(password, salt, null);
      try {
        await usersCollection.insertOne({
          _id: username,
          username,
          password: hash,
        });
        res.json({ success: true, msg: 'Successful created new user.' });
      } catch (err) {
        if (err.code === 11000) {
          res.json({ success: false, msg: 'Username already exists.', err });
        } else {
          res.status(500).send(`MongoDB error ${err.message}`);
        }
      }
    } catch (err) {
      res.status(500).send(`bcrypt error ${err}`);
    }
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await usersCollection.findOne({
    _id: username,
  });
  if (user) {
    const isMatch = await compareHash(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ username }, SECRET);
      // return the information including token as JSON
      res.json({ success: true, token: `JWT ${token}`, preferences: user.preferences });
    } else {
      res.json({ success: false, msg: 'Authentication failed. Wrong password.' });
    }
  } else {
    res.json({ success: false, msg: 'Authentication failed. Username not found.' });
  }
}

export function logout(req, res) {
  req.logout();
  res.json({});
}
/* eslint-disable consistent-return */
export async function userData(req, res) {
  try {
    const user = await usersCollection.findOne({ _id: req.params.username });
    return res.json(pick(user, 'username', 'preferences'));
  } catch (err) {
    res.status(500).send(err);
  }
}
/* eslint-enable consistent-return */

export function authenticate(req, res, next) {
  return passport.authenticate('jwt', { session: false })(req, res, next);
}

export function userRoutes(app, path) {
  app.use(passport.initialize());
  app.use(`${path}/signup`, bodyParser.json(), signup);
  app.use(`${path}/login`, bodyParser.json(), login);
  app.use(`${path}/logout`, logout);
  app.get(`${path}/data/:username`, authenticate, userData);
}
