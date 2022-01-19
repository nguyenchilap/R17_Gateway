class MeRepository {
    getUserBirth(userBirth){
        const d = new Date(userBirth);
        return {
            day: d.getDate(),
            month: d.getMonth() + 1,
            year: d.getFullYear(),
        }
    }
}

module.exports = new MeRepository();