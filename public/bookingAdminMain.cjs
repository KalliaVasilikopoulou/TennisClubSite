let table = document.querySelector(".table");

const tableWidth = 14;
const tableHeight = 8;
let currentCourt;
let hoursArray = [];

let changeBooking = (event) => { 
    let date = event.target.getAttribute("date"); 
    let time = event.target.getAttribute("time");
    let datetime = date+time;
    let modal_form = document.querySelector("#accept_decline .modal-container");
    modal_form.style.zIndex = "-1";
    modal_form.style.display = "none";
    fetch('/booking/change/' + datetime)
    .then(
        (response) => response.json()
        .then((json) => fillCells(json))
    )
}

let deleteBooking = (event) => { 
    let date = event.target.getAttribute("date"); 
    let time = event.target.getAttribute("time");
    let datetime = date+time;
    let modal_form = document.querySelector("#accept_decline .modal-container");
    modal_form.style.zIndex = "-1";
    modal_form.style.display = "none";

    fetch('/booking/delete/' + datetime)
    .then(
        (response) => response.json()
        .then((json) => fillCells(json))
    )
}

let closeForm = () => { 
    let modal_form = document.querySelector("#accept_decline .modal-container");
    modal_form.style.zIndex = "-1";
    modal_form.style.display = "none";
}

let confirmForm = (date, time, command) => { 
    let modal_form = document.querySelector("#accept_decline .modal-container");
    modal_form.style.zIndex = "500";
    modal_form.style.display = "flex";
    let proceedWithChange = modal_form.querySelector("#proceedBtn"); 
    proceedWithChange.setAttribute("date", date);
    proceedWithChange.setAttribute("time", time);
    if(command=="delete"){ 
        proceedWithChange.addEventListener("click", deleteBooking);
    }
    else if(command=="change"){ 
        proceedWithChange.addEventListener("click", changeBooking);
    }
    let cancelChange = modal_form.querySelector("#cancelBtn");
    cancelChange.addEventListener("click", closeForm);
}

let getIdForBookingChange = (event) => { 
    confirmForm(event.target.getAttribute("date"), event.target.getAttribute("time"), "change");
}

let getIdForBookingDelete = (event) => { 
    confirmForm(event.target.getAttribute("date"), event.target.getAttribute("time"), "delete");
}

let fillCells = (reservations) => { 

    const data = document.querySelectorAll(".data_row td"); 

    for (let i of data) { 

        let data_date = i.getAttribute("date");
        let data_time = i.getAttribute("time");

        i.setAttribute("availability", "true");
        for (let k of reservations) { 
            if (k.reservationdate == data_date) {
                if(k.reservationtime == data_time) { 
                    i.setAttribute("availability", "false");
                    break;
                } 
            }
        }
    }

    for (let cell of data) { 
        if(cell.getAttribute("availability") == "true") { 
            cell.innerHTML = "&#10003;";
            cell.style.color = "#19E600";
            cell.style.backgroundColor = '#f5f7f9';
            cell.addEventListener("click", getIdForBookingChange)
        }
        else if (cell.getAttribute("availability") == "false") { 
            cell.innerHTML = "&#88;";
            cell.style.color = "#FF2E2E";
            cell.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            cell.addEventListener("click", getIdForBookingDelete)
        }
    }

}

let identifyDataColumns = () => { 

    const datarows = document.querySelectorAll(".data_row"); 

    for (let i of datarows) { 
        let cells = i.querySelectorAll("td"); 
        let counter = 0;
        for (let k of cells) { 
            k.setAttribute("time", hoursArray[counter]);
            counter++;
        }
    }
    fetchReservations();

}

let fillHourRow = (hourslots) => {

    const data_length = hourslots.length;
    const hours = document.querySelector(".hours");
    let children = hours.children;

    for (let i = 0; i<data_length; i++) {

        let cell = children[i+1];
        let hour = hourslots[i].tablehour;
        hoursArray.push(hour);
        let text = document.createTextNode(hour);
        let p = document.createElement('p'); 
        p.appendChild(text);
        cell.appendChild(p);
    }
    identifyDataColumns();
}

let fillDayColumn = () => { 

    const month_cell = document.querySelector(".hours .cell0"); 
    let text = document.createTextNode("Για την επόμενη εβδομάδα");
    month_cell.append(text);
    
    const days = document.querySelectorAll(".data_row .cell0");
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let cellDate = new Date();

    for (let i = 0; i<days.length; i++) { 
        cellDate.setDate(new Date().getDate() + i);
        let text = document.createTextNode(cellDate.toLocaleDateString('el-GR', options));
        days[i].append(text);
    }

}

let fillRow = (day, row) => { 

    let rowDate = new Date();
    rowDate.setDate(new Date().getDate() + (day-1));
    rowDate = rowDate.toISOString().slice(0,10);

    let cell = document.createElement("th");

    cell.style.width = "20%";

    for (let i = 0; i<tableWidth; i++) { 
        if (i != 0) { 
            cell = document.createElement("td");
            cell.style.colSpan = "1";
            cell.setAttribute("date", rowDate);
        }
        cell.classList.add(`cell${i}`);
        cell.classList.add("bookingTableCell");

        row.appendChild(cell);
    }

}

let makeTable = () => {

    for (let i = 0; i<tableHeight; i++) { 
        let row = document.createElement("tr");
        if (i == 0) { 
            row.className = "hours";
        }
        else { 
            row.className = "data_row"
        }
        fillRow(i, row);
        table.appendChild(row);
    }

    fillDayColumn();
}

let renderTablehours = (hourslots) => { 
    fillHourRow(hourslots);
}

let renderCells = (reservations) => { 
    fillCells(reservations);
}

function setCourt(court) { 
    currentCourt = court;
    fetchTablehours();
}

let fetchReservations = () => { 
    fetch('booking/availability')
    .then( 
        (response) => response.json()
        .then(
            (json) => renderCells(json)
        )
    )
}

let fetchCurrentCourt = () => { 
    fetch('/booking/courts')
    .then(
        (response) => response.json()
        .then(
            (json) => setCourt(json)
        )
    )
}

let fetchTablehours = () => { 
    fetch('/booking/hours')
    .then(
        (response) => response.json()
        .then((json) => renderTablehours(json))
    )
}

window.addEventListener('DOMContentLoaded', (event) => { 
    makeTable();
    fetchCurrentCourt();
    //fetchTablehours();
    //fetchReservations();
});


