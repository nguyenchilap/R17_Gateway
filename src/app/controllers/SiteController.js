const passport = require('../../config/passport');
const siteRepo = require('../repository/SiteRepository');

const {getTransporterForOtp} = require('../../config/nodemailer');

class SiteController {
    //[GET] /
    showHome(req, res, next){
        res.render('home',{
            user: req.user,
        });
    }
    
    //[GET] /login
    showLogin(req, res, next){
        res.render('site/login');
    }

    //[GET] /register
    showRegister(req, res, next){
        res.render('site/register');
    }
    
    //[POST] /register/send-otp
    sendOtp(req, res, next){
        const otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        const transporter = getTransporterForOtp('nguyenchilapk18@gmail.com', 'Lapboy20');
        const mailOption = siteRepo.getMailforOtp(req.body.email, otp);
        transporter.sendMail(mailOption, function(err, info){
            if (err) next(err);
            else res.json({otp: otp});
        })
    }

    //[POST] /register
    register(req, res, next){
        
    }

    //[POST] /login
    login(req, res, next){
        passport.authenticate('localLogin', function(error, user, info){
            if (error) next(error);
            if (!user){
                res.json({notiMessage: info.message})
            }
            req.logIn(req.body.userInfo, function(err){
                if (err) next(err);
                else res.json({
                    user: req.body.userInfo,
                    redirect: '/',
                    notiMessage: 'Login accessed!!!'
                })
            })
        })(req, res, next);
    }

    
}

module.exports = new SiteController();