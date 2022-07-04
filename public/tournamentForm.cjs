function selectedTournament () {

    let select = document.querySelector("select");
    let selection = select.id;
    let options = select.querySelectorAll("option");
    for (option of options){
        if (option.id === selection){
            option.selected = true;
        }
    }
    
}


window.addEventListener('DOMContentLoaded', (event) => { 
    selectedTournament();
});