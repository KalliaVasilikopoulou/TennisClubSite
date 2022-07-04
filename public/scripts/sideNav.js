let collapse = document.querySelector(".collapse_button");
collapse.addEventListener("click", showSideNavBar); 

function showSideNavBar() {

    let sideNavBar = document.querySelector(".sidenav-container");

    if(sideNavBar.getAttribute("state") == "hidden") { 
        sideNavBar.style.display = "block"; 
        sideNavBar.setAttribute("state", "show");
    }
    else{ 
        sideNavBar.style.display = "none";
        sideNavBar.setAttribute("state", "hidden");
    }

}