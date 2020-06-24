import LoginTest from './main.js';

export default function(to, from, next) {
    LoginTest.check(to, from, function(ret) {
        next();
    }, false);
}