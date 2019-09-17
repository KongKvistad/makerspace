window.addEventListener("load", event => {
    let menu = document.querySelector("#searchmenu > ul");

    //get menu options
    client.fetch('*[_type == "category"]').then(res => {
        res.forEach(element => {
            menu.innerHTML += `<li>
            <p>${element.title}</p>
            <input type="checkbox" value="${element._id}"></li>`
        });
    })
    let projects = document.querySelector(".mainContProjects > div:nth-child(2) > ul")

    //get latest projects
    client.fetch('*[_type == "post"]{"title": title, "url": mainImage[0].asset->url, "slug": slug}').then(res => {
        res.forEach(element => {
            projects.innerHTML += `<li><a href="http://localhost:3000/getpage/${element.slug.current}"><figure>
            <div>
                
            </div>
            <h1>${element.title.length >= 20 ? element.title.slice(0, 18) + "..": element.title}</h1>
            <div class="hover"></div>
            <img src="${element.url}">
            </figure></a></li>`
        });
        //apply visual effects
    }).then(response => addEffect())
    //apply search filter functionality
    .then(something => {
        let searchMenu = document.querySelectorAll("#searchmenu > ul > li > input");
        searchMenu.forEach(item => {
            item.addEventListener("click", box => {
                console.log(box)
            })
        })
    })
    
})

//legg til hovereffect etter alle resultater er hentet
addEffect = () => {
    let hoverbox = document.querySelectorAll(".hover");
        
        hoverbox.forEach(e => {
            e.addEventListener("mouseover", e => {
                e.path[1].children[0].style.opacity = 0.5
                e.path[1].children[0].style.transition = "0.7s ease"
            })
        });
        hoverbox.forEach(e => {
            e.addEventListener("mouseout", e => {
                e.path[1].children[0].style.opacity = 0
            })
        });

}



// search functionality
let btn = document.querySelector(".mainContProjects svg");
let text = btn.children[1]

btn.addEventListener("click", elem => {
    let overlay = document.querySelector("#overlay")
    let boxes = document.querySelector("#searchmenu");
    let dropdowns = document.querySelectorAll(".dropdown");

    boxes.style.display === "none" ? 
    (boxes.style.display = "flex", 
    overlay.style.display = "block", 
    text.innerHTML = "-", 
    text.x.baseVal[0].value = 10,
    dropdowns.forEach(e => {
        e.style.zIndex = 2;
    })) : 
    
    (boxes.style.display = "none", 
    overlay.style.display = "none",
    text.innerHTML = "+",
    text.x.baseVal[0].value = 7,
    dropdowns.forEach(e => {
        e.style.zIndex = 5;
    }));


})
//scrollbutton
let scrollBtn = document.querySelector("#scrollToTop")
scrollBtn.addEventListener("click", e => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
})

