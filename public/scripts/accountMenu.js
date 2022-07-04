let accountBtn = document.querySelector(".connectedButton");
accountBtn.addEventListener("click", showAccountMenu);

function showAccountMenu() {

    let accountMenu = document.querySelector(".account");

    if(accountMenu.getAttribute("state") == "hidden") { 
        accountMenu.style.display = "block"; 
        accountMenu.setAttribute("state", "show");
    }
    else{ 
        accountMenu.style.display = "none";
        accountMenu.setAttribute("state", "hidden");
    }

}


function addMyTournaments(tournaments){
    let accountList = document.querySelector("#tournaments .accountList");
    for (tour of tournaments){
        let listItem = document.createElement("li");
        listItem.className = 'accountListItem';

        let title = document.createElement('span');
        title.innerHTML = 'Τουρνουά: '+ tour.title
        // title.className = 'row';
        listItem.appendChild(title);

        let startdate = document.createElement('span');
        startdate.innerHTML = 'Έναρξη: ' + tour.startdate;
        // startdate.className = 'row';
        listItem.appendChild(startdate);

        let enddate = document.createElement('span');
        enddate.innerHTML = 'Λήξη: '+ tour.enddate;
        // enddate.className = 'row';
        listItem.appendChild(enddate);

        let location = window.location.href;
        location = "/"+location.split("/").pop();

        let tournamentCancelBtn = document.createElement('button');
        let tournamentCancelHref = document.createElement('a');
        tournamentCancelHref.innerHTML = 'Ακύρωση';
        tournamentCancelHref.style.color = "grey";
        tournamentCancelHref.style['-webkit-text-stroke-width'] = '0.6px';
        tournamentCancelHref.style['-webkit-text-stroke-color'] = 'grey';
        tournamentCancelHref.href = '/cancelJoinTournament?tournamentid='+tour.tournamentid+'&location='+location;
        // tournamentCancelBtn.className = 'row';
        tournamentCancelBtn.appendChild(tournamentCancelHref);
        listItem.appendChild(tournamentCancelBtn);

        accountList.appendChild(listItem);
        listItem.style.display = 'flex';
        listItem.style.flexDirection = 'column';
        listItem.style.paddingTop = '10px';

    }
}


function addMyReservations(reservations){
    let accountList = document.querySelector("#reservations .accountList");
    for (rsv of reservations){
        let listItem = document.createElement("li");
        listItem.className = 'accountListItem';

        let court = document.createElement('span');
        court.innerHTML = 'Γήπεδο: '+ rsv.courtid;
        // court.className = 'row';
        listItem.appendChild(court);

        let bookingDate = document.createElement('span');
        bookingDate.innerHTML = 'Ημερομηνία: '+ rsv.reservationdate;
        // bookingDate.className = 'row';
        listItem.appendChild(bookingDate);

        let bookingTime = document.createElement('span');
        bookingTime.innerHTML = 'Ώρα: '+ rsv.reservationtime;
        // bookingTime.className = 'row';
        listItem.appendChild(bookingTime);

        let location = window.location.href;
        location = "/"+location.split("/").pop();

        let reservationCancelBtn = document.createElement('button');
        let reservationCancelHref = document.createElement('a');
        reservationCancelHref.innerHTML = 'Ακύρωση';
        reservationCancelHref.style.color = "grey";
        reservationCancelHref.style['-webkit-text-stroke-width'] = '0.6px';
        reservationCancelHref.style['-webkit-text-stroke-color'] = 'grey';
        reservationCancelHref.href = '/cancelReservation?reservationid='+rsv.reservationid+'&location='+location;
        // reservationCancelBtn.className = 'row';
        reservationCancelBtn.appendChild(reservationCancelHref);
        listItem.appendChild(reservationCancelBtn);
        reservationCancelBtn.style.width = "100%";

        accountList.appendChild(listItem);
        listItem.style.display = 'flex';
        listItem.style.flexDirection = 'column';
        listItem.style.paddingTop = '10px';

    }
}


let fetchUserTournaments = () => { 
    fetch('/tournaments/userTournaments')     //the fetched result is a list of strings
    .then(
        (response) => response.json()   //we turn the list of strings into a list of jason objects
        .then((json) => renderUserTournaments(json))
    )
}

let renderUserTournaments = (tournaments) => {
    addMyTournaments(tournaments);
}



let fetchUserReservations = () => { 
    fetch('/booking/userReservations')     //the fetched result is a list of strings
    .then(
        (response) => response.json()   //we turn the list of strings into a list of jason objects
        .then((json) => renderUserReservations(json))
    )
}

let renderUserReservations = (reservations) => {
    addMyReservations(reservations);
}



window.addEventListener('DOMContentLoaded', (event) => { 
    fetchUserTournaments();
    fetchUserReservations();
});