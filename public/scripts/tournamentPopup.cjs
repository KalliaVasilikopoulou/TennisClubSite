let modal;

let addTournamentBtn = document.querySelector("#addTournamentBtn");
let deleteTournamentBtn = document.querySelector("#deleteTournamentBtn");
let deleteMonthBtn = document.querySelector("#deleteMonthBtn");
let editTournamentSelectBtn = document.querySelector("#editTournamentSelectBtn");


addTournamentBtn.addEventListener("click", addTournamentPopup);
deleteTournamentBtn.addEventListener("click", deleteTournamentPopup);
deleteMonthBtn.addEventListener("click", deleteMonthPopup);
editTournamentSelectBtn.addEventListener("click", editTournamentSelectPopup);


function addTournamentPopup() { 

    let popup = document.querySelector("#addTournament");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}


function deleteTournamentPopup() { 

    let popup = document.querySelector("#deleteTournament");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}


function deleteMonthPopup() { 

    let popup = document.querySelector("#deleteMonth");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}


function editTournamentSelectPopup() { 

    let popup = document.querySelector("#editTournamentSelect");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}

function checkValue () {
    let checkValue = document.querySelector(".check_value");
    if (checkValue.innerHTML === "load"){
        editTournamentPopup();
        checkValue.innerHTML = null;
    }
}


function editTournamentPopup() { 

    let popup = document.querySelector("#editTournament");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}

function closePopup() { 

    modal.style.zIndex = "-1";
    modal.style.display = "none";

}

window.addEventListener('DOMContentLoaded', (event) => { 
    checkValue();
});
