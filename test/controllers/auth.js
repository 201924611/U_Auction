const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
  const { name, password, money } = req.body;
  try {
    const exUser = await User.findOne({ where: { name } });
    if (exUser) {
      return res.redirect('/join?error=이미 사용중인 이름입니다.');
    }
    const hash = await bcrypt.hash(password, 12);
    const result = await User.create({
      name,
      password: hash,
      money,
    });
    if(result){
      console.log('가입 성공')
    }
    // 5.로그인 화면
    return res.redirect('../');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      return res.redirect('/login');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('../');
  });
};