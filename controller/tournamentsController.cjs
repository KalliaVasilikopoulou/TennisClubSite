const dotenv = require('dotenv');
const { send } = require('express/lib/response');
dotenv.config();

const fs = require("fs");

let model = require('../model/model_pg.cjs');
let bookingController = require ('./bookingController.cjs');

const monthsGreek = {0: 'Ιανουάριος', 1: 'Φεβρουάριος', 2: 'Μάρτιος', 3: 'Απρίλιος', 4: 'Μάιος', 5: 'Ιούνιος', 6: 'Ιούλιος', 7: 'Αύγουστος', 8: 'Σεπτέμβριος', 9: 'Οκτώβριος', 10: 'Νοέμβριος', 11: 'Δεκέμβριος'}
const monthsEnglish = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'}

let loadpopup = null;


function translate (months){
    for (m of months){
        m.monthname = m.monthname.replace(/\s+/g, '');
        for (let i in monthsEnglish){
            if (monthsEnglish[i] == m.monthname){
                m.monthid = m.monthname;
                m.monthname = monthsGreek[i];
            }
        }
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
}

function fixDates (tournaments){
    for (tour of tournaments){
        tour.startdate = formatDate(tour.startdate);
        tour.enddate = formatDate(tour.enddate);
    }
}

function renderTournamentForm(req, res) { 
    let scripts = [];
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            res.render('tournamentForm', {layout: 'signed', title: "Villia Tennis Club | Join A Tournament", style: "booking.css", tournaments: tournaments , scripts: scripts});
        }
    });
}

function allTournaments(req,res) {
    model.getTournaments(function(err, rows) { 
        if(err) { 
            res.send(err);
        }
        else {
            res.send(rows);
        }
    });
}

function addTournamentToForm (req,res) {
    let scripts = [];

    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            res.render('tournamentForm', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "booking.css", tournaments: tournaments , selectedTournament: req.query.tournamentid, scripts: scripts});
        }
    });
}

function addTournamentToDB (req,res) {
    model.getTournamentsNumber(function(err, number) {
        if (err)
            return console.error(err.message);
        else{
            var todayDate = new Date().toISOString().slice(0, 10);
            if (req.body.startdate == "") req.body.startdate = todayDate;
            if (req.body.enddate == "") req.body.enddate = todayDate;
            let poster;
            if (req.file === undefined) poster= null;
            else poster = req.file.filename;
            const tournamentid = parseInt(number[0].count)+1;
            const newTournament = {"tournamentid":"TOUR_"+ tournamentid+"_"+Math.floor(Math.random() * 101), "title":req.body.title, "startdate":req.body.startdate, "enddate":req.body.enddate, "skilllevel": req.body.skilllevel, "agerestrictions": req.body.agerestrictions, "details": req.body.details, "poster": poster};

            model.addTournament(newTournament, function(addError, data) { 
                model.getTournaments(function(err, tournaments) { 
                    if(err) { 
                        res.send(err);
                    }
                    else {
                        fixDates(tournaments);
                        model.getMonths(function(err, months) {
                            if(err) { 
                                res.send(err);
                            }
                            else {
                                translate(months);
                                if (addError){
                                    console.log(addError);
                                    // completed = "false";
                                    res.send("Τα στοιχεία που συμπληρώσατε δεν είναι εγκυρα! Ελέγξτε αν έχετε συμπληρώσει σωστά τα πεδία της φόρμας. Πηγαίνετε στην προηγούμενη σελίδα για να επαναλάβετε την προσπάθεια σας...");
                                }
                                else {
                                    console.log("form submitted");
                                    // completed = "true";
                                    res.redirect("/tournamentsAdmin");
                                }
                                // res.render('tournaments', {title: "Villia Tennis Club | Tournaments", style: "tournaments.css", tournaments: tournaments, months: months , scripts: scripts, completed: completed});
                            }
                        });
                    }
                });
            });
        }
    }); 
}

function deleteTournamentFromDB (req,res) {
    model.deleteTournament(req.body.tournamentid, function(err, number) {
        if (err)
            return console.error(err.message);
        else {
            cleanDisk();
            model.getTournaments(function(err, tournaments) { 
                if(err) { 
                    res.send(err);
                }
                else {
                    res.redirect("/tournamentsAdmin");
                }
            });
        }
    }); 
}

function deleteMonthFromDB (req,res) {
    model.deleteMonth(req.body.monthid, function(err, month) {
        if (err)
            return console.error(err.message);
        else {
            cleanDisk();
            model.getTournaments(function(err, tournaments) { 
                if(err) { 
                    res.send(err);
                }
                else {
                    res.redirect("/tournamentsAdmin");
                }
            });
        }
    }); 
}

function editTournamentSelect(req,res) {
    let scripts = [{script: '/scripts/tournamentPopup.js'}];
    model.getTournamentById(req.query.tournamentid, function(err, selected) { 
        if(err) { 
            res.send(err);
        }
        else {

            //DUE TO TIMEZONE PROBLEMS, WE HAVE TO MANUALLY ADD ONE DAY TO THE DATES
            selected[0].startdate.setDate(selected[0].startdate.getDate()+1);
            selected[0].enddate.setDate(selected[0].enddate.getDate()+1);

            selected[0].startdate = (selected[0].startdate).toISOString().slice(0, 10);
            selected[0].enddate = (selected[0].enddate).toISOString().slice(0, 10);

            model.getTournaments(function(err, tournaments) { 
                if(err) { 
                    res.send(err);
                }
                else {
                    fixDates(tournaments);
                    model.getMonths(function(err, months) {
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            translate(months);
                            loadpopup = "loadEditTournament";
                            res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments, months: months ,selected: selected[0], loadpopup: loadpopup, scripts: scripts});
                        }
                    });
                }
            });
        }
    });
}




function deleteTournamentSelect(req,res) {
    let scripts = [{script: '/scripts/tournamentPopup.js'}];
    model.getTournamentById(req.query.tournamentid, function(err, selected) { 
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(selected);
            model.getTournaments(function(err, tournaments) { 
                if(err) { 
                    res.send(err);
                }
                else {
                    fixDates(tournaments);
                    model.getMonths(function(err, months) {
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            translate(months);
                            loadpopup = "loadDeleteTournament";
                            res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments, months: months ,selected: selected[0], loadpopup: loadpopup, scripts: scripts});
                        }
                    });
                }
            });
        }
    });
}


function deleteMonthSelect(req,res) {
    let scripts = [{script: '/scripts/tournamentPopup.js'}];
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(tournaments);
            model.getMonths(function(err, months) {
                if(err) { 
                    res.send(err);
                }
                else {
                    model.getMonthTournaments(req.query.monthid, function(err, tournamentsCount) { 
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            selectedMonth = [{monthname: req.query.monthid}];
                            translate(selectedMonth);
                            selectedMonth[0].tournamentsCount = tournamentsCount[0].count;
                            loadpopup = "loadDeleteMonth";
                            res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments, months: months ,selected: selectedMonth[0], loadpopup: loadpopup, scripts: scripts});
                        }});
                    // selectedMonth = [{monthname: req.query.monthid}];
                    // translate(selectedMonth);
                    // loadpopup = "loadDeleteMonth";
                    // res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments, months: months ,selected: selectedMonth[0], loadpopup: loadpopup, scripts: scripts});
                }
            });
        }
    });
}




function editTournamentAtDB (req,res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    model.getTournamentsNumber(function(err, number) {
        if (err)
            return console.error(err.message);
        else{
            //req.body.poster = req.body.poster.replace("blob:","");
            var todayDate = new Date().toISOString().slice(0, 10);
            if (req.body.startdate == "") req.body.startdate = todayDate;
            if (req.body.enddate == "") req.body.enddate = todayDate;
            let poster;
            if (req.file === undefined) poster= null;
            else poster = req.file.filename;
            const newTournament = {"tournamentid": req.body.tournamentid, "title":req.body.title, "startdate":req.body.startdate, "enddate":req.body.enddate, "skilllevel": req.body.skilllevel, "agerestrictions": req.body.agerestrictions, "details": req.body.details, "poster": poster};
            
            model.updateTournament(newTournament, function(editError, data) {
                model.getTournaments(function(err, tournaments) { 
                    if(err) { 
                        res.send(err);
                    }
                    else {
                        fixDates(tournaments);
                        model.getMonths(function(err, months) {
                            if(err) { 
                                res.send(err);
                            }
                            else {
                                translate(months);
                                if (editError){
                                    console.log(editError);
                                    res.send(err);
                                }
                                else {
                                    cleanDisk();
                                    console.log("form submitted");
                                    res.redirect("/tournamentsAdmin");
                                }
                                
                            }
                        });
                    }
                });
            });
        }
    }); 
}

function renderTournamentAdmin(req, res) { 
    let scripts = [{script: '/scripts/tournamentPopup.cjs'}]; 
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(tournaments);
            model.getMonths(function(err, months) {
                if(err) { 
                    res.send(err);
                }
                else {
                    model.getUserTournaments(req.session.loggedUserId, function(err, myTournaments) {
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            translate(months);
                            fixDates(myTournaments);
                            // translate(months);
                            // res.render('tournaments', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournaments.css", tournaments: tournaments, months: months , scripts: scripts});
                            // href="/userTournaments"
                            
                            res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments , myTournaments: myTournaments, months: months, scripts: scripts});
                        }
            });
        }
    });
}})
}




function renderTournament(req, res) { 
    let scripts = [{script: '/scripts/tournamentPopup.cjs'}]; 
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(tournaments);
            model.getMonths(function(err, months) {
                if(err) { 
                    res.send(err);
                }
                else {
                    model.getUserTournaments(req.session.loggedUserId, function(err, myTournaments) {
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            translate(months);
                            fixDates(myTournaments);
                            // 
                            // translate(months);
                            // res.render('tournaments', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournaments.css", tournaments: tournaments, months: months , scripts: scripts});
                            // href="/userTournaments"
                            
                            res.render('tournaments', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournaments.css", tournaments: tournaments, myTournaments: myTournaments , months: months, reservations: bookingController.accountReservations, scripts: scripts});
                        }
                    });
                }
            });
        }
    });
}

function renderChoice (req, res) { 
    if(req.session.adminRights) { 
        renderTournamentAdmin(req, res);
    }
    else{
        renderTournament(req, res);
    }
}


function joinTournament (req,res) {
    model.joinTournament(req.session.loggedUserId, req.query.tournamentid, function(err, join) {
        if (err)
            return console.error(err.message);
        else {
            if(err) { 
                res.send(err);
            }
            else {
                res.redirect("/tournamentForm");
            }
        }
    }); 
}



function cancelJoinTournament (req,res) {
    model.cancelJoinTournament(req.session.loggedUserId, req.query.tournamentid, function(err, cancelJoinTournament) {
        if (err)
            return console.error(err.message);
        else {
            if(err) { 
                res.send(err);
            }
            else {
                res.redirect(req.query.location);
            }
        }
    }); 
}



function renderUserTournaments(req,res) {
    // let scripts = [];
    model.getUserTournaments(req.session.loggedUserId, function(err, myTournaments) {
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(myTournaments);
            // href="/userTournaments"
            res.send (myTournaments);
            // res.render('userTournaments', {layout: 'signed', title: "Villia Tennis Club | Your Tournaments", style: "userTournaments.css", tournaments: tournaments , scripts: scripts});
        }
    });
}



let allImages;
let imagesInUse;
let imagesNotUsed;


function cleanDisk() {
    imagesInUse = [];
    allImages = fs.readdirSync("public/files/");
    for (let i in allImages) allImages[i]= "public/files/"+allImages[i];
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            for (let tour of tournaments) {
                if (tour.poster != null)
                    imagesInUse.push("public/"+tour.poster);
            }

            imagesNotUsed = allImages.filter( function( el ) {
                return !imagesInUse.includes( el );
            } );

            for (let path of imagesNotUsed) fs.unlinkSync(path);
            
        }
    });
};



exports.renderTournament = renderTournament;
exports.renderTournamentForm = renderTournamentForm;
exports.allTournaments = allTournaments;
exports.addTournamentToForm = addTournamentToForm;
exports.addTournamentToDB = addTournamentToDB;
exports.deleteTournamentFromDB = deleteTournamentFromDB;
exports.deleteMonthFromDB = deleteMonthFromDB;
exports.editTournamentSelect = editTournamentSelect;
exports.editTournamentAtDB = editTournamentAtDB;
exports.renderChoice = renderChoice;
exports.joinTournament = joinTournament;
exports.renderUserTournaments = renderUserTournaments;
exports.deleteTournamentSelect = deleteTournamentSelect;
exports.deleteMonthSelect = deleteMonthSelect;
exports.cancelJoinTournament = cancelJoinTournament;