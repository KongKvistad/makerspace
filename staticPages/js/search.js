let projects = document.querySelector(".mainContProjects > div:nth-child(2) > ul")
let interval= {"start": 0, "end": 7}


function intervalChange(dir, interval){
   
        if(dir === "r"){
            interval["start"] = interval["end"]
            interval["end"] += 7
            return interval
        } else if (dir ==="l" && interval["start"] > 0) {
            interval["start"] -= 7
            interval["end"] -= 7
            return interval
        }
    
}


function repaint(res){
    res.forEach((element, idx, arr) => {
                
                

        projects.innerHTML += `<li><a href="${window.location.origin}/getpage/${element.slug.current}"><figure>
        <div>
            
        </div>
        <h1>${element.title.length >= 20 ? element.title.slice(0, 18) + "..": element.title}</h1>
        <div class="hover"></div>
        <img src="${element.url}">
        </figure></a></li>`
        
        
    })
}


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
    

    //get latest projects
    client.fetch('*[_type == "post"][0..7]{"title": title, "url": mainImage[0].asset->url, "slug": slug}').then(res => {
        res.forEach((element, idx, arr) => {
            
            projects.innerHTML += `<li><a href="${window.location.origin}/getpage/${element.slug.current}"><figure>
            <div>
                
            </div>
            <h1>${element.title.length >= 20 ? element.title.slice(0, 18) + "..": element.title}</h1>
            <div class="hover"></div>
            <img src="${element.url}">
            </figure></a></li>`
            console.log(arr)
            
        });
        //apply visual effects
    }).then(response => addEffect())
    //apply search filter functionality
    .then(something => {
        let searchMenu = document.querySelectorAll("#searchmenu > ul > li > input");
        searchMenu.forEach((item, idx, orgArr) => {
            item.addEventListener("click", box => {
               if(box.target.checked === true){
                    client.fetch(`*[_type == "post" && categories[0]._ref == "${box.target.value}"]{"title": title, "url": mainImage[0].asset->url, "slug": slug}`)
                    .then(res => {
                        console.log(res)
                        projects.innerHTML = ""
                        repaint(res) 
                        
                    })
                } else{
                    return
                }
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

//browse pages
const arrows = document.querySelector(".arrows")

arrows.addEventListener("click", e =>{
    let target = e.target.id
    console.log(target)

    
    

        let result = intervalChange(target==="rightArrow" ? "r" : "l", interval)
        
        if(result !== undefined) {

        projects.innerHTML = "";
        client.fetch(`*[_type == "post"][${result["start"]}..${result["end"]}]{"title": title, "url": mainImage[0].asset->url, "slug": slug}`).then(res => {
            repaint(res)
        })
    } else{
     alert("targetIndex is 0")
    }
})

let searchfield = document.querySelector(".mainContProjects input[type=text]")
searchfield.addEventListener("keyup", event => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      console.log(event.target.value)
      client.fetch(`*[_type == "post"][0..7]{"title": title, "url": mainImage[0].asset->url, "slug": slug}`).then(res => {
          
          
          let resultArr = []
          
          res.forEach(elem => {
              if(elem.title.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1){
                resultArr.push(elem)
                
              }
          })
          projects.innerHTML = "";
          repaint(resultArr)
      })
    }
  });