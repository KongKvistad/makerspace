let skeleton = document.querySelector(".mainContEvents > div:nth-child(2)")

client.fetch('*[_type == "test"]').then(res => {
    for (var i = 0; i < res.length; i++){
        
        skeleton.innerHTML += `<div class="event">
        <div>
            <h3>07 FEB</h3>
        </div>
        <div>
            <h2>${res[i].name}</h2>
            <p>${res[i].desc.split(' ').slice(0, 20).join(" ")}...</p>
            <p><a href = "https://ntnumakerspace.herokuapp.com/getEvent/${res[i]._id}">Les mer</a></p>
        </div>
    </div>`
    };
    
    console.log(res)


})

