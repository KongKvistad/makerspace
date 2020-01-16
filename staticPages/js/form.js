//author dropdown

let resArr = [];

const authorDropDown = document.querySelector("input[name='skaper'] + label + ul");


client.fetch('*[_type == "author"]').then(res => {
  console.log(res)
  res.forEach(elem => {
    resArr.push(elem);
  })
})
const authorInput = document.querySelector("input[name='skaper']");

authorInput.addEventListener("input", event => {
  filterFunction(event.target.value);
})

filterFunction = (params) => {
  if (params === "") { // sørger for at feltet står tomt hvis input === null
    authorDropDown.innerHTML = "";
  } else {
  authorDropDown.innerHTML = "";
  resArr.filter(elem=> 
    elem.name.toLowerCase().indexOf(params)>-1).forEach(resultat=>{
    let option = document.createElement("li")
    option.innerHTML = resultat.name;
    option.dataset.id = resultat._id;
    option.dataset.rev = resultat._rev

    option.addEventListener("click", event => {
      authorInput.value = event.target.innerHTML
      authorDropDown.innerHTML = "";
      localStorage.setItem("valgt", JSON.stringify({_ref: event.target.dataset.id, _type: "reference"}))
    })
    authorDropDown.appendChild(option);
    })
  }
  
  
}



//radiobuttons

let svgs = document.querySelectorAll("svg")


svgs.forEach((e, index) => {
	e.addEventListener("click", item => {
        svgs.forEach(i => {
            if(i.children[1] != item.target && item.target.classList.value === "clickable") {
                i.children[1].style.fill = "white"
                item.target.style.fill= "orange"
            }
        })
        item.path[3].children[2].checked = "checked"
    })
})

/**
 * images
 * @public
 * @param {input} element - input type: file
 * @param {preview} element - The div to stuff the preview files in
 * @param {images} - li's for the ol.
 */

var input = document.querySelector('#image_uploads');
var preview = document.querySelector('.preview');
let curFiles = "";

let images = document.querySelectorAll(".preview > ol > li")

let imageArr = [];
images.forEach(e => {
    e.addEventListener("click", e => {
        input.click()
    } )
})


input.addEventListener('change', updateImageDisplay);


function updateImageDisplay() {
  
    curFiles = input.files;
    if(curFiles.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'No files currently selected for upload';
      preview.appendChild(para);
    } else {
      imageArr.push(curFiles[0])
      for(var i = 0; i < imageArr.length; i++) {
           images[i].children[0].src = window.URL.createObjectURL(imageArr[i])
      }
    }
  }

  const crossouts = document.querySelectorAll(".img-cross");
    crossouts.forEach((e, idx) => {
        e.addEventListener("click", elem => {
            elem.stopPropagation();
            imageArr.splice(idx)
            images[idx].children[0].src = "./assets/emptyphoto.png"
        })
    })



//submitform
const btn = document.querySelector("#submitForm");

let documentId = "";

let assetArr = [];

let objArr = [];

let defaultPic = [{
  alt: "test!",
  asset: {
    _ref: "image-494ff5ec26f2fe4a6746c35c1efadf83b30396cb-1536x1536-png",
    _type: "reference"
  },
  _key: "ABNSM28930047",
  _type: "image"
  }]

btn.addEventListener("click", e => {
    e.preventDefault()


    let emptyflag = false
    let topbtns = document.querySelectorAll(".topBtns input")
    let txtArea = document.querySelector("textarea")

    topbtns.forEach(elem =>{

      if(elem.value === "" || txtArea.value === ""){
        emptyflag = true
      }

    })

    if(emptyflag){
      alert("No empty fields, please!")
      return
    }else {
    
    

    document.querySelector("#loader").style.display = "flex";
    


    //datetime
    const dateInp = document.querySelector("input[name='dato']").value
    const splitDate = dateInp.split("-")

    let date = new Date()
    date.setYear(splitDate[0])
    date.setMonth(splitDate[1] - 1) //some UTC-shit went wrong here. Let me know if it's trouble.
    date.setDate(splitDate[2])
    

    //radiobtns
    let selectedBtn = {_key: "", _ref: "", _type:"reference"};

    e.target.form.radio.forEach(btn => {
      if(btn.checked === true){
        console.log(btn)
        selectedBtn._key = btn.dataset.key;
        selectedBtn._ref = btn.dataset.id;
      }
    })

    //actual post request
    
    const doc = {
        _type: 'post',
        title: e.target.form.navn.value,
        author: JSON.parse(localStorage.getItem("valgt")),
        tid: e.target.form.tid.value,
        from: date.toISOString(),
        course: e.target.form.kurs.value,
        tech: e.target.form.tech.value,
        categories: [selectedBtn] ,
        body:[
          {
            "_key": "abklfl2",
            "_type": "block",
            "children": [
              {
                "_key": "abklfl2",
                "_type": "span",
                "marks": [],
                "text": e.target.form.body.value
              }
            ],
            "markDefs": [],
            "style": "normal"
          }
        ],

      }
      
      client.create(doc).then(res => {
        documentId = res._id
      })
    
 
    //image assets
    uploadAndAttach = () => {

      if(imageArr.length > 0){

      for(var i = 0; i < imageArr.length; i++) {
        client.assets
        .upload('image', imageArr[i], {contentType: 'image/png', filename: imageArr[i].name})
        .then(asset => {
          console.log('The image was uploaded!', asset)
          return asset
          
        })
        .then( asset => {
          var promise1 = new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve(client.fetch(`*[_type == "sanity.imageAsset" && _id == '${asset._id}']`))
            }, 3000);
          })
          
          promise1.then(res => {
            console.log("here's the object!", res)
            objArr.push({
              alt: "test!",
              asset: {
                _ref: res[0]._id,
                _type: "reference"
              },
              _key: "ABNSM28930047",
              _type: "image"
              })
              
          })
          .then((obj) => {
            makeReq(objArr)
          })
          
        })
        .catch(error => {
          console.error('Upload failed:', error.message)
        })
      
      }
    } else {

      console.log("no images!")
      var promise1 = new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(client.fetch(`*[_type == "sanity.imageAsset" && _id == "image-494ff5ec26f2fe4a6746c35c1efadf83b30396cb-1536x1536-png"]`))
        }, 3000);
      })
      promise1.then(res => {
        
        objArr.push({
          alt: "test!",
          asset: {
            _ref: res[0]._id,
            _type: "reference"
          },
          _key: "ABNSM28930047",
          _type: "image"
          })
          
      })
      .then((obj) => {
        makeReq(objArr)
      })


    }
      

    }
    uploadAndAttach()
    
    
    makeReq = (objArr) => {
    console.log("check here: ",objArr)

    generateSlug = () => {
      let str = "";
      let arr = e.target.form.navn.value.split(" ");
      let randnumb = []
      arr.forEach((elem, idx) => {
        if (idx === arr.length - 1){
          str += elem
        } else {
          str += elem + "-"
        }
      })
      
      for(var i = 0; i < 6; i++){
        randnumb.push(Math.floor(Math.random() * 9))
      }
      return str.concat(randnumb.join(""))
     }

    client
      .patch(documentId) // Document ID to patch
      .set({mainImage: objArr}) //set the field in question
      .set({slug: {_type: "slug", current: generateSlug()}})
      .commit() // Perform the patch and return a promise
      .then(patch => {
        console.log('Hurray,document has been patched:'+patch)
        document.querySelector("#loader").style.display = "none";
        window.location.href = window.location.origin+"/prosjekter.html";

      })
      .catch(err => {
        console.error('Oh no, the update failed: ', err.message)
      })
    }
  }
})
  