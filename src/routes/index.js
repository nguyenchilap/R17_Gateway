const siteRouter = require('./sites');
const meRouter = require('./me');

function route(app){
    app.use('/me', meRouter);
    app.use('/', siteRouter);   
}   

module.exports = route;