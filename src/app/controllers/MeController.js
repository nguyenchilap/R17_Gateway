const meRepo = require('../repository/MeRepository')

class MeController {
    //[GET] /account/change-password
    showChangePassword(req, res, next){
        res.render('account/change-password', {
            user: req.user
        });
    }

    //[GET] /account/change-information
    showChangeInfo(req, res, next){
        res.render('account/change-information', {
            user: req.user,
            userBirth: meRepo.getUserBirth(req.user.userBirth)
        });
    }
}

module.exports = new MeController();