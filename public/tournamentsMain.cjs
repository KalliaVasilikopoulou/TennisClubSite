const monthNums = {0: "Ιανουάριος", 1: "Φεβρουάριος", 2: "Μάρτιος", 3: "Απρίλιος", 4: "Μάιος", 5: "Ιούνιος", 6: "Ιούλιος", 7: "Αύγουστος", 8: "Σεπτέμβριος", 9: "Οκτώβριος", 10: "Νοέμβριος", 11: "Δεκέμβριος"}
const monthNumsEnglish = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'}

let existing_months =[];
let mode;


function appendMonthsTournaments(tournaments) {
    if (tournaments.length === 0 ) {
        let field = document.querySelector('.tournament_rows');
        let infoRow = document.createElement('div');
        infoRow.style.padding = "120px";
        infoRow.appendChild(document.createTextNode("Δεν έχουν καταχωρηθεί πληροφορίες για επερχόμενα τουρνουά..."));
        field.appendChild(infoRow);

        let board = document.querySelector('.board_row table');
        let boardRow = document.createElement('tr');
        let boardCell = document.createElement('td');
        boardCell.colSpan = '5';
        boardCell.style.padding = "20px";
        boardCell.appendChild(document.createTextNode("Δεν έχουν καταχωρηθεί πληροφορίες για επερχόμενα τουρνουά..."));
        boardRow.appendChild(boardCell);
        board.appendChild(boardRow);

        return;
    }
    
    for (let tour of tournaments){
        tour.startdate = new Date(tour.startdate);
        let tourMonth = tour.startdate.getMonth();
        let existing = false;

        for (month of existing_months){
            if (tourMonth === month){
                newTournamentField_NE(tour,tourMonth);
                existing = true;
            }
        }

        if (existing === true) continue;

        existing_months.push(tourMonth);

    let field = document.querySelector('.tournament_rows');

    let tourInfoRow = document.createElement('div');
    tourInfoRow.className = 'tournaments_info_row';

    tourInfoRow.setAttribute('id', `month${tourMonth}`);

    let monthRow = document.createElement("div"); 
    monthRow.className = "month_row"; 


    let month_title_field = document.createElement('div');
    month_title_field.className = 'month_title';
    let text_field = document.createElement('h4');
    //text_field.contentEditable = 'True';
    month_title_field.appendChild(text_field);
    monthRow.append(month_title_field);
    tourInfoRow.appendChild(monthRow);

    field.appendChild(tourInfoRow);
    addMonthTitleDB(tourInfoRow.id, monthNums[tourMonth]);
    newTournamentField_NE(tour,tourMonth);

    }
}

function addMonthTitleDB(monthId, monthName) {

    let field = document.getElementById(monthId).querySelector('.month_row .month_title h4');

    let text = document.createTextNode(monthName);
    field.appendChild(text);

}

function newTournamentField_NE(tour, tourMonth) {

    tournament_row = createTournamentRow_NE(tour.tournamentid);
    let month = document.getElementById("month"+tourMonth);
    month.appendChild(tournament_row);
    addTournamentTitleDB(tournament_row.id, tour.tournamentid, tour.title);
    addTournamentDetailsDB(tournament_row.id, tour.details);
    addTournamentPosterDB(tournament_row.id, tour.poster);
}

function createTournamentRow_NE(tournamentid) { 

    //tournaments_counter +=1; 

    let row = document.createElement('div');
    row.className = 'tournament_row';
    //row.classList.add("current_tourn");

    let tournaments_list = document.getElementsByClassName('tournament_row');
    for (let i in tournaments_list)
        tournaments_list[i].id = 'tournament'+i;
    let tournaments_counter = tournaments_list.length;
    row.setAttribute('id', `tournament${tournaments_counter}`);

    let infoRow = document.createElement("div"); 
    infoRow.className = "info_row";

    let description = document.createElement('div');
    description.className = 'tournament_description';
    infoRow.appendChild(description); 

    let text = document.createElement('div');
    text.className = 'tournament_text';
    description.appendChild(text);
    
    let title = document.createElement('h4');
    title.className = 'tournament_title';
    //title.contentEditable = 'True';
    text.appendChild(title);
    
    let details = document.createElement('p');
    details.className = 'tournament_details';
    //details.contentEditable = 'True';
    text.appendChild(details);

    let poster = document.createElement('div');
    poster.className = 'tournament_poster';
    //details.contentEditable = 'True';
    description.appendChild(poster);
    row.appendChild(infoRow);

    return row
}

function addTournamentTitleDB(tourRowId, tourId, tourTitle) {

        let tournament = document.getElementById(tourRowId);
        tournament.querySelector('.info_row').setAttribute("id", tourId);
        let field = document.getElementById(tourId).querySelector('.tournament_description .tournament_text .tournament_title');
        let text = document.createTextNode(tourTitle);
        field.appendChild(text);
}

function addTournamentDetailsDB(tourId, tourDetails) { 

        let tournament = document.getElementById(tourId);
        let field = tournament.querySelector('.info_row .tournament_description .tournament_text .tournament_details');
        let text = document.createTextNode(tourDetails);
        if (tourDetails === "") text = document.createTextNode('Δεν υπάρχει περιγραφή... Για να ενημερωθείτε για το τουρνουά, επικοινωνήστε μαζί μας μέσω τηλεφώνου ή e-mail.');
        field.appendChild(text);

}


function addTournamentPosterDB(tourId, tourPoster) { 

    let tournament = document.getElementById(tourId);
    let field = tournament.querySelector('.info_row .tournament_description .tournament_poster');
    let poster = document.createElement('img');
    if (tourPoster === null) {
        poster = document.createTextNode('Δεν υπάρχει εικόνα...');
    }
    else poster.src = tourPoster;
    field.appendChild(poster);

}
const rowLength = 5;

function addTableHeaders() { 
    
    //makes table's title (static)
    let table_field = document.querySelector(".board"); 
    let title = document.querySelector(".board #board_title");
    let board_headers = document.querySelectorAll("#board_headers th");

    let headers = [{"header_id": "start_date", "header_name" : "Ημερομηνία Έναρξης"},
                    {"header_id" : "end_date", "header_name" : "Ημερομηνία Λήξης"}, 
                    {"header_id" : "title", "header_name" : "Τίτλος Τουρνουά"},	
                    {"header_id" : "join_right", "header_name" : "Επίπεδο Ικανοτήτων"},
                    {"header_id" : "age", "header_name" : "Ηλικιακή Κατηγορία"}]
    for (let i = 0; i<5; i++) { 

        board_headers[i].className = "table_header";
        let text = document.createTextNode(headers[i].header_name);
        board_headers[i].appendChild(text);
        board_headers[i].setAttribute("id", headers[i].header_id);
 
    }
    
}


let fetchAllTournaments = () => { 
    fetch('/tournaments/allTournaments')     //the fetched result is a list of strings
    .then(
        (response) => response.json()   //we turn the list of strings into a list of jason objects
        .then((json) => renderAllTournaments(json))
    )
}

let renderAllTournaments = (tournaments) => {
    appendMonthsTournaments(tournaments);
}

window.addEventListener('DOMContentLoaded', (event) => { 
    fetchAllTournaments();
    addTableHeaders();
});


