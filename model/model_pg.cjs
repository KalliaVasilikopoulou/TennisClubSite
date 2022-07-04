'use strict';
const sql = require('./db.pg.js');
const bcrypt = require('bcrypt');

//used by logincontroller
let getUserByUsername = (username, callback) => { 

    const query = { 
        text: 
        `SELECT * FROM account WHERE accountname = $1`, 
        values: [username],
    }

    sql.query(query, (err, user) => { 

        if(err) { 
            console.log(err.stack)
            callback(err.stack)
        }
        else { 
            callback(null, user.rows[0])
        }

    });

}

let registerUser = (username, password, email, fullname, callback) => { 

    getUserByUsername(username, async(err, userIdbyUsername) => { 

        if(userIdbyUsername != undefined) { 
            callback(null, null, "Υπάρχει ήδη χρήστης με αυτό το όνομα")
        }
        else { 
            try{ 
                const hashedPassword = await bcrypt.hash(password, 10);

                const query = { 
                    text: 
                    `INSERT INTO account(AccountName, AccountPassword, Email, FullName, AdminRights) 
                    VALUES ($1, $2, $3, $4,'false') RETURNING accountid`,
                    values: [username, hashedPassword, email, fullname]
                }

                sql.query(query, (err, result) => {
                    if (err)
                        callback(err.stack, null);
                    else {
                        callback(null, result.rows[0].accountid)
                    }
                })
            }   
            catch { 
                console.log(err)
                callback(err)
            }
        }
    })
}

//used by booking controller
let getTablehours = (callback) => { 

    const query = { 
        text: 
        `SELECT tablehour FROM tabletimes ORDER BY tabletimeid;`
    }

    sql.query(query, (err, tablehours) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, tablehours.rows);
        }
    })
}

let bookSlot = (userid, date, time, courtid, callback) => { 
    
    const query = { 
        text: 
        `INSERT INTO reservation(reservationdate, reservationtime, reserveeid, courtid)
        VALUES ($2, $3, $1, $4)
        RETURNING *`,
        values: [userid, date, time, courtid]
    }

    sql.query(query, (err, row) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, row);
        }
    })

}

let changeSlotAvailability = (userid, date, time, courtid, callback) => { 

    const query = { 
        text: 
        `INSERT INTO reservation (reservationdate, reservationtime, courtid, reserveeid) 
        VALUES ($1, $2, $3, $4)`,
        values: [date, time, courtid, userid],
    }

    sql.query(query, (err, state) => { 
        if(err){ 
            callback(err.stack)
        }
        else{ 
            callback(null, true);
        }
    })

}

let deleteReservation = (date, time, courtid, callback) => { 

    const query = { 
        text: 
        `DELETE 
        FROM reservation 
        WHERE reservationdate = $1 AND reservationtime = $2 AND courtid = $3`, 
        values: [date, time, courtid],
    }

    sql.query(query, (err, state) => { 
        if(err){ 
            callback(err.stack)
        }
        else{ 
            callback(null, true);
        }
    })

}

let courtReservations = (courtid, callback) => { 
    
    const query = { 
        text: 
        `SELECT * 
        FROM reservation 
        WHERE courtid = $1`, 
        values: [courtid],
    }

    sql.query(query, function(err, reservations){ 
        if(err) { 
            callback(err.stack)
        }
        else{ 
            callback(null, reservations.rows)
        }
    })

}

let accountReservations = (userid, callback) => { 

    const query = { 
        text: 
        `SELECT * 
        FROM reservation
        WHERE reserveeid = $1`,
        values: [userid],
    }

    sql.query(query, (err, reservations) => { 
        if(err){ 
            callback(err.stack)
        }
        else { 
            callback(null, reservations.rows)
        }
    })
}


let cancelReservation= (reserveeid, reservationid, callback) => {
    const query = { 
        text: 
        `delete from reservation where reserveeid = ${reserveeid} and reservationid = '${reservationid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  
        }
    })

}



//used by tournament controller 
let getTournaments = (callback) => {
    const query = { 
        text: 
        `select tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster from tournament ORDER BY startdate;`
    }


    sql.query(query, (err, tournaments) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, tournaments.rows)  //returns results as rows
        }
    })

}

let getTournamentById = (tournamentId, callback) => {
    const query = { 
        text: 
        `select * from tournament where tournamentid = '${tournamentId}';`
    }


    sql.query(query, (err, tournament) => { 
        if(err) { 
            callback(err.stack);
        }
        else {
            callback(null, tournament.rows)  //returns results as rows
        }
    })

}

let getTournamentsNumber = (callback) => {
    const query = { 
        text: 
        `select count(*) from tournament;`
    }


    sql.query(query, (err, tournaments) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, tournaments.rows)  //returns results as rows
        }
    })

}

let addTournament = (newTournament, callback) => {
    if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
    if (newTournament.skilllevel == '') newTournament.skilllevel = null;
    if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;

    let query;
    if (newTournament.poster == null)
        query = { 
            text: 
            `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
            values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', ${newTournament.poster});`
        }
    else
    query = { 
        text: 
        `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
        values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', '${newTournament.poster}');`
    }

    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

let deleteTournament = (tournamentid, callback) => {
    const query = { 
        text: 
        `delete from tournament where tournamentid = '${tournamentid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

let getMonths = (callback) => {
    const query = { 
        text: 
        `select distinct monthname from 
        (select distinct startdate, TO_CHAR(DATE(startdate), 'Month') as monthname FROM tournament order by startdate) as orderedmonths;`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

let deleteMonth = (monthid, callback) => {
    const query = { 
        text: 
        `delete from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

let getMonthTournaments = (monthid, callback) => {
    const query = { 
        text: 
        `select count(*) from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}


let updateTournament = (newTournament, callback) => {
    if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
    if (newTournament.skilllevel == '') newTournament.skilllevel = null;
    if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;
    
    let query;
    if (newTournament.poster == null)
        query = { 
            text:
            `update tournament
                set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}'
                where tournamentid = '${newTournament.tournamentid}';`
        }
    else
        query = { 
            text:
            `update tournament
                set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}', poster = '${newTournament.poster}'
                where tournamentid = '${newTournament.tournamentid}';`
        }
    
    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//below are functions added after handing project in 
let joinTournament= (participantid, tournamentid, callback) => {
    const query = { 
        text: 
        `insert into joins(participantid, tournamentid)
         VALUES (${participantid}, '${tournamentid}');`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  
        }
    })

}


let cancelJoinTournament= (participantid, tournamentid, callback) => {
    const query = { 
        text: 
        `delete from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  
        }
    })

}


let getUserTournaments = (participantid, callback) => {
    const query = { 
        text: 
        `select distinct * 
        from joins join tournament on joins.tournamentid = tournament.tournamentid
        where joins.participantid = '${participantid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

module.exports = {getUserByUsername, registerUser, getTablehours, bookSlot, changeSlotAvailability, deleteReservation, courtReservations, accountReservations, cancelReservation, 
getTournaments, getTournamentById, getTournamentsNumber, addTournament, deleteTournament, getMonths, deleteMonth, updateTournament, joinTournament, getUserTournaments, getMonthTournaments, cancelJoinTournament};