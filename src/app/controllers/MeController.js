const meRepo = require('../repository/MeRepository')

class MeController {
    //[GET] me/account/change-password
    showChangePassword(req, res, next){
        res.render('account/change-password', {
            user: req.user
        });
    }

    //[GET] me/account/change-information
    showChangeInfo(req, res, next){
        res.render('account/change-information', {
            user: req.user,
            userBirth: meRepo.getUserBirth(req.user.userBirth)
        });
    }

    //[POST] me/account/change-avatar
    changeAvatar(req, res, next){
        res.redirect('back');
    }
}

module.exports = new MeController();