const { format } = require('date-fns');
const { v4:uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const newEvent = async(massage, logName) => {
    const times = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss\t')}`;
    const logItems = `${times}\t${uuid()}\t${massage}\n`;
    console.log(logItems);
    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItems)
    } catch (err) {
        console.error(err);
    }
}

const logger = (req,res,next) => {
    newEvent(`${req.method}\t${req.header.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, newEvent };
