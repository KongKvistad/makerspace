let registerform = document.querySelector("#registerform");

let createdUser = false;

turnform = () => {
    registerform.innerHTML=
    `<p>Du skal ha fått tilsendt en sikkerhetskode på e-post.</p>
    <label for="email">* Sikkerhetskode</label><input type = "text" placeholder="f.eks: ..abd46f" id="code" name="code">
    <button for="registerform">Registrer</button>`

    document.querySelectorAll("form > label, form > input, form > button, form > p")
    .forEach(e => {
        e.style.transform = "rotateY(180deg)"
        if (e.tagName === "BUTTON") {
            e.addEventListener("click", btn => {
                btn.preventDefault();
                verifyUser(btn)
            })
        }

    })
    registerform.style.boxShadow = "-6px 5px 5px rgb(0, 0, 0, 0.20)";
    
    document.querySelector("#backBtn").style.display = "flex";
    
}

verifyUser = (btn) => {
    
    console.log(btn.target.form.code.value)
    let inp = btn.target.form.code.value

    const query = '*[_type == "author" && secKey == $student ] {"id": _id, "email": email, "name": name, "secKey": secKey, "verified": verified}'
    const params = {student: inp}
    
        client.fetch(query, params).then(res => {
            if(res.length <= 0){
                console.log("bruker finnes ikke! registrer deg på nytt..")
            } else {
                confirm(res[0].id)
            }
        })
    
    
    
    confirm = (userId) => {
        client
          .patch(userId) // Document ID to patch
          .set({verified: true}) //set the field in question
          .commit() // Perform the patch and return a promise
          .then(update => {
            console.log(update)
          })
          .catch(err => {
            console.error('Oh no, the update failed: ', err.message)
          })
    }
}

document.querySelector("button").addEventListener("click", event => {
    event.preventDefault();
    
 
    
        let navn = event.target.form.username.value
        let passord = event.target.form.pass.value
        let email = event.target.form.email.value


        const doc = {
        _type: 'author',
        name: navn,
        password: passord,
        email: email,
        verified: false
        }

        client.create(doc).then(res => {
        console.log(`user was created, document ID is ${res._id}`) 
        sendmail(res._id)  
        })
        
        function sendmail(id) {
            fetch(window.location.origin+'/gencode', {
                method: 'post',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({json: id})
            }).then(res=>res.json())
                .then(res => {
                    console.log(res)
                    if(res.result.statusCode === 201) {
                        setTimeout(turnform, 400)
                        registerform.classList.add("clicked");
                    } else {
                        alert("problem server side!")
                    }
                });
        }
    
})

