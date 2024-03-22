const cl = console.log;

const moviecard = document.getElementById("moviecard");
const titlecontrol = document.getElementById("title");
const imgurlcontrol = document.getElementById("imgurl");
const descriptioncontrol = document.getElementById("description");
const ratingurl = document.getElementById("rating");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn");
const moviecontainer = document.getElementById("moviecontainer");



const baseurl = `https://mov-m-a9f98-default-rtdb.asia-southeast1.firebasedatabase.app`;

const posturl = `${baseurl}/posts.json`;


const onDelete = async (ele) => {
    // cl(ele)
    let deleteId = ele.closest(".card").id;
    // cl(deleteId);
    let deleteUrl = `${baseurl}/posts/${deleteId}.json`;
    // cl(deleteUrl)

    let res = await makeapicall("DELETE", deleteUrl);
    // cl(res)
    ele.closest(".card").remove();
}

const onEdit = async (ele)=> {
   try{
    let editid = ele.closest(".card").id;
    localStorage.setItem("editid",editid)
    let editUrl = `${baseurl}/posts/${editid}.json`; 

    let data = await makeapicall("GET",editUrl);
    titlecontrol.value = data.title;
    imgurlcontrol.value = data.imgurl;
    descriptioncontrol.value = data.description;
    ratingurl.value = data.rating
   }catch(err){
    cl(err)
   }finally{
    submitbtn.classList.add("d-none");
    updatebtn.classList.remove("d-none");
   }
}

const objtoArr = (data) => {
    let postArr = [];
    for(const key in data){
        let obj = {...data[key],id:key};
        // obj.id = key
        // cl(obj)
        postArr.push(obj)
    
    }
      return postArr
}

const createcards = (obj) => {
    let card = document.createElement("div");
    
    card.className = `card mb-4`
    card.id = obj.id;
    card.innerHTML = `
                         <div class="card-header">
                        <h4 class="d-flex justify-content-between">${obj.title}
                             <small>${obj.rating}/5</small>
                        </h4>
                        </div>
                        <div class="card-body">
                            <img src="${obj.imgurl}" alt="">
                            <p class="m-0 p-3">${obj.description}</p>
                         </div>
                        <div class="card-footer d-flex justify-content-between"> 
                            <button class="btn btn-primary" onclick ="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" onclick ="onDelete(this)">Delete</button>
                        </div>
    `
    moviecontainer.prepend(card)
}

const cardtemplating = (arr) => {
  arr.forEach(obj => {
    createcards(obj)
  });
}

const makeapicall = async (methodname,apiurl,msgbody)=> {
    
       try{
        let msginfo = msgbody ? JSON.stringify(msgbody): null;
        let res = await fetch(apiurl, {
            method : methodname,
            body : msginfo
        })
        return res.json();
       }catch(err){
            cl(err)
       }finally{

       }
        
}
     
const fetchallposts = async ()=> {
    try{
        let data = await makeapicall("GET",posturl);
        cl(data)
       let postArr = objtoArr(data)
        cardtemplating(postArr)
     }catch(err){
        cl(err)
    }
}
fetchallposts()

const onsubmitbtn =  async (eve) =>  {
  
   try{
    eve.preventDefault();
    let movieobj = {
        title : titlecontrol.value,
        imgurl : imgurlcontrol.value,
        description : descriptioncontrol.value,
        rating : ratingurl.value

    }
    // cl(movieobj);

    let data = await makeapicall("POST",posturl,movieobj);
    cl(data)
    
    movieobj.id = data.name;
    createcards(movieobj);
   }catch(err){
     cl(err)
   }finally{
    moviecard.reset();
   }
}

const onpostupdate = async () =>{
    let updateobj = {
        title : titlecontrol.value,
        imgurl : imgurlcontrol.value,
        description : descriptioncontrol.value,
        rating : ratingurl.value
    }
    cl(updateobj)
    try{
        let updateid = localStorage.getItem("editid");
        // localStorage.removeItem("editid")
        let updateurl = `${baseurl}/posts/${updateid}.json`;
        let res = await makeapicall("PATCH",updateurl,updateobj)
        // cl(res)
        let card = [...document.getElementById(updateid).children];
        card[0].innerHTML = ` <h4 class="d-flex justify-content-between">${updateobj.title}
                              <small>${updateobj.rating}/5</small></h4>`;
        card[1].innerHTML = `<img src="${updateobj.imgurl}" alt="">
                             <p class="m-0">${updateobj.description}</p>`;
    }catch(err){
         cl(err)
    }finally{
        moviecard.reset();
        updatebtn.classList.add("d-none");
        submitbtn.classList.remove("d-none");
        
    }
}

moviecard.addEventListener("submit",onsubmitbtn)
updatebtn.addEventListener("click",onpostupdate)