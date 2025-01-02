const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

//MiddleWare untuk Log
const { logger } = require('./middleware/newEvent');
const errorHandler = require('./middleware/errorHandler');
const { error } = require('console');
const { el } = require('date-fns/locale');

const PORT = process.env.PORT || 3500;

//EJS to Combine File
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//EJS

//BodyParser
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json())
//BodyParser

//custom logs
app.use(logger);
// Cross Origin Resource Sharing (API)
// Untuk Web Security Tapi Karena Lagi Development di localhost kasi atau !origin
// Biasanya ga ada, kalau ada apa gunanya membatasi

//custom

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')))


//db Server
const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost', 
    user : 'root', 
    password : '', 
    database : 'farmland'
});

let bslink = {
    linkcss : 'bootstrap/css/bootstrap.css', 
    linkjs : 'bootstrap/css/bootstrap.css'
};

app.get('/main(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
});

app.get('/unused(.html)?', (req, res) => {
    res.redirect(301, '/main.html');
});

//Routes Handle
app.get('/hello(.html)?', (req, res, next) => {
    console.log('Try To Entry Hello.html');
    next();
}, (req, res) => {
    res.send('Hello World');
}); 

app.get('^/$|/index(.html)?', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        const query = `
            SELECT 
                user_plant.*, 
                plant.name AS plant_name, 
                plant.img AS plant_img, 
                plant.id AS plant_id, 
                plant.duration AS plant_duration,
                plant_task.task AS task,
                plant_task.day AS task_day
            FROM 
                user_plant 
            LEFT JOIN 
                plant ON user_plant.plant_id = plant.id
            LEFT JOIN 
                plant_task ON plant.id = plant_task.plant_id AND plant_task.day = user_plant.time;
        `;

        connection.query(query, (err, rows) => {
            connection.release();
            if (!err) {
                // Group tasks by plant_id for easier handling in the template
                const plants = rows.reduce((acc, row) => {
                    const { plant_id, task, task_day, ...plantData } = row;
                    if (!acc[plant_id]) {
                        acc[plant_id] = { ...plantData, tasks: [] };
                    }
                    if (task) {
                        acc[plant_id].tasks.push({ task, day: task_day });
                    }
                    return acc;
                }, {});

                res.render('index', { 
                    ...bslink,
                    plants: Object.values(plants) // Convert grouped object back to array
                });
            } else {
                console.log(err);
                res.render('index', { 
                    ...bslink,
                    plants: [] 
                });                
            }
        });
    });
});

app.get('/get-tasks/:plantId', (req, res) => {
    const plantId = req.params.plantId;
  
    pool.getConnection((err, connection) => {
      if (err) throw err;
  
      // First, get the current time for this plant
      connection.query('SELECT time, plant_id FROM user_plant WHERE id = ?', [plantId], (err, timeResults) => {
        if (err) {
          connection.release();
          return res.json({ success: false, tasks: [] });
        }

        if (timeResults.length === 0) {
          connection.release();
          return res.json({ success: false, tasks: [] });
        }

        const currentTime = timeResults[0].time;
        const currentIDPlant = timeResults[0].plant_id;

        // Then get the task for this specific day
        const query = `
          SELECT task, day 
          FROM plant_task 
          WHERE plant_id = ? AND day <= ? + 1
          ORDER BY day DESC
          LIMIT 1;
        `;
  
        connection.query(query, [currentIDPlant, currentTime], (err, results) => {
          connection.release();
          if (!err) {
            res.json({ success: true, tasks: results, currentTime: currentTime, currentIDPlant: currentIDPlant });
          } else {
            console.log(err);
            res.json({ success: false, tasks: [], currentTime: currentTime });
          }
        });
      });
    });
});

app.post('/add-plant', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        const { plant_id, time } = req.body; // Extract form data from the request body
        const values = [plant_id, time];

        // Query to get all data
        connection.query('INSERT into user_plant (`plant_id`, `time`) VALUES (?)',[values] ,(err, rows) => {
                connection.release();
                if (!err) {
                    res.redirect('/');
                } else {
                    console.log(err);
                    res.status(500).send('Error retrieving data');
                }
        });
    });
});

app.post('/increment-time', (req, res) => {
    const { id } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        connection.query(
            'UPDATE user_plant SET time = time + 1 WHERE id = ?',
            [id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    connection.release();
                    return res.status(500).json({ success: false });
                }

                // Retrieve the new time value
                connection.query(
                    'SELECT time FROM user_plant WHERE id = ?',
                    [id],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ success: false });
                        }

                        res.json({ success: true, newTime: rows[0].time });
                    }
                );
            }
        );
    });
});

app.post('/delete-plant', (req, res) => {
const { id } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as id  ${connection.threadId}`);

        connection.query(
            'DELETE FROM user_plant WHERE id=?',
            [id],
            (err, result) => {
                if(err){
                    console.error(err);
                    connection.release();
                    return res.status(500).json({ success: false });
                }
            }
        )
    })
});

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    if(req.accepts('json')) {
        res.json({error: "404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`));