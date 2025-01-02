const { newEvent } = require('./newEvent');
const errorHandler = (err,req,res,next) => {
    newEvent(`${err.name} : ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;