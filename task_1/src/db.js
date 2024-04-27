const postgres = require('pg')
const { Process } = require('./class')
require('dotenv').config()

const { Client } = postgres
const client = new Client({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'test', 
    password: process.env.PWD, 
    port: 5432
})
client.connect()


let sql = `
CREATE TABLE IF NOT EXISTS events (
    id INTEGER UNIQUE,
    cid INTEGER NOT NULL,
    type TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
);
`
client.query(sql, (error, result) => {
    if(error) console.log(error)
})


sql = `
INSERT INTO events (id, cid, type, date) VALUES
(1,0,'start','2021-01-01 00:00:00'),
(2,2,'start','2021-01-01 02:00:00'),
(3,1,'start','2021-01-01 03:00:00'),
(4,0,'end','2021-01-01 06:00:00'),
(5,1,'end','2021-01-01 07:00:00'),
(6,3,'start','2021-01-01 08:00:00'),
(7,3,'end','2021-01-01 08:30:00'),
(8,4,'start','2021-01-01 08:45:00'),
(9,2,'end','2021-01-01 09:00:00'),
(10,5,'start','2021-01-01 10:00:00'),
(11,6,'start','2021-01-01 11:00:00'),
(12,4,'end','2021-01-01 12:00:00'),
(13,5,'end','2021-01-01 13:00:00'),
(14,7,'start','2021-01-01 14:00:00'),
(15,7,'end','2021-01-01 15:00:00'),
(16,6,'end','2021-01-01 16:00:00'),
(17,8,'start','2021-01-01 15:30:00'),
(18,9,'start','2021-01-01 16:30:00'),
(19,10,'start','2021-01-01 17:00:00'),
(20,8,'end','2021-01-01 18:00:00'),
(21,10,'end','2021-01-01 19:00:00'),
(22,11,'start','2021-01-01 19:30:00'),
(23,11,'end','2021-01-01 19:45:00'),
(24,9,'end','2021-01-01 19:59:00');
`
client.query(sql, (error, result) => {
    if(result) console.log(result)
})


client.specialQuery = (type) => {  
    client.query(`SELECT * FROM events`, (error, result) => {
        if(error) console.log(error)
        else {
            result.rows.forEach(row => new Process(result.rows, row.cid))
            let output = Process.parse() 

            let highest = 0
            for(let line of output) {
                if(line.concurrent > highest) highest = line.concurrent
            }

            switch(type) {
                case 1: {
                    let range = []
                    let state = 'searching'
                    for(let line of output) {

                        if(state) if(state === 'finished') {
                            out = Process.returnRange(output, ...range)
                            console.log(out)
                            break
                        }
                        
                        switch (state) {
                            case 'searching': {
                                if(line.concurrent == highest) {
                                    state = 'found'
                                    range[0] = output.indexOf(line)
                                } break
                            }
                            case 'found': {
                                if(line.concurrent < highest) {
                                    state = 'finished'
                                    range[1] = output.indexOf(line) - 1
                                } break
                            }
                        }
                    } break
                }
                case 2: {
                    let range = []
                    let state = 'searching'
                    for(let line of output.reverse()) {

                        if(state) if(state === 'finished') {
                            out = Process.returnRange(output, ...range)
                            console.log(out)
                            break
                        }
                        
                        switch (state) {
                            case 'searching': {
                                if(line.concurrent == highest) {
                                    state = 'found'
                                    range[0] = output.indexOf(line)
                                } break
                            }
                            case 'found': {
                                if(line.concurrent < highest) {
                                    state = 'finished'
                                    range[1] = output.indexOf(line) - 1
                                } break
                            }
                        }
                    } break
                    
                }
                case 3: {
                    client.specialQuery(1)
                    client.specialQuery(2)
                }
            }
            
        }
    })
}

module.exports = { client }