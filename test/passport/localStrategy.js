const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user'); // User 모델 가져오기

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'name', // 사용자 이름 필드 설정
    passwordField: 'password', // 비밀번호 필드 설정
  }, async (name, password, done) => {
    try {
      // 사용자 이름으로 사용자 조회
      const exUser = await User.findOne({ where: { name } });
      if (exUser) {
        // 비밀번호 비교
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          done(null, exUser); // 비밀번호가 일치하면 사용자 인증 성공
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); // 비밀번호 불일치
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' }); // 사용자 없음
      }
    } catch (error) {
      console.error(error);
      done(error); // 오류 처리
    }
  }));
};