


let login = document.querySelector("header > div > ul > li > a")

let loginForm = document.querySelector("#loginform")

let isLoggedIn = false;


window.addEventListener("load", e => {

    let cookie = JSON.parse(localStorage.getItem("student"))

    //if login cookie exists
    if (cookie) {
        let loginDiv = document.querySelector("header > div > ul > li")
        loginDiv.innerHTML = `<div class="dropdown">
        <p>${cookie[0].name} <i class="fas fa-chevron-down"></i></p>
        <ul class="dropdown-content">
        <li><p><a href="prosjektSub.html">Publiser prosjekt</a></p></li>
        <li><p>Mine prosjekter</p></li>
        <li><p>Rediger profil</p></li>
        </ul>
        </div>`
        
        isLoggedIn = true;


    } else {
        //if no login-cookie exists
        
        
        
        document.querySelector("#loginform > button").addEventListener("click", e => {
            e.preventDefault();
            let navn = e.target.form.username.value
            let passord = e.target.form.pass.value
        
            const query = '*[_type == "author" && name == $student && password == $pass ] {"id": _id, "email": email, "name": name, "secKey": secKey, "verified": verified}'
            const params = {student: navn, pass: passord}
        
            client.fetch(query, params).then(res => {
                if(res.length <= 0){
                    newUser()
                } else {
                    localStorage.setItem("student", JSON.stringify(res))
                    let cookie = localStorage.getItem("student");
                    console.log(JSON.parse(cookie))
                    
        
                    loginForm.style.display = "none";

                    let loginDiv = document.querySelector("header > div > ul > li")
                    loginDiv.innerHTML = `<div class="dropdown">
                    <a>${JSON.parse(cookie)[0].name}</a>
                    <ul class="dropdown-content">
                    <li><p><a href="prosjektSub.html">Publiser prosjekt</a></p></li>
                    <li><p>Mine prosjekter</p></li>
                    <li><p>Rediger profil</p></li>
                    </ul>
                    </div>`

                    isLoggedIn = true;
                }
            })
        })
    }

})

login.addEventListener("click", e => {
    if(isLoggedIn === false) {
        if (!loginForm.style.display || loginForm.style.display === "none") {
            loginForm.style.display = "flex"
        } else if (loginForm.style.display === "flex") {
            loginForm.style.display = "none"
        }
    } else {
        alert("hey")
    }
    

})



newUser = () => {
    console.log(loginForm.children[2].children)
}


