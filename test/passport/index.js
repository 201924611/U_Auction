const passport = require('passport');

const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
  // 사용자 정보를 세션에 저장할 때 호출됨
  passport.serializeUser((user, done) => {
    done(null, user.id); // 사용자 ID만 세션에 저장
  });

  // 세션에서 사용자 정보를 복원할 때 호출됨
  passport.deserializeUser((id, done) => {
    // 데이터베이스에서 사용자 정보를 찾음
    User.findOne({ where: { id } })
      .then(user => done(null, user)) // 사용자 정보를 복원
      .catch(err => done(err)); // 오류 발생 시
  });

  // 로컬 전략 설정 함수 호출
  local();
};