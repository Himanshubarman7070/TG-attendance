
let homeHTML=document.getElementById('Container').innerHTML;
let home=document.getElementById('Home');
let Home_nav=document.getElementById('Home-nav').innerHTML;
let Application_nav=document.getElementById('Application-nav').innerHTML;
let ReadApplication_nav=document.getElementById('Read').innerHTML;
let Requests=document.getElementById('Requests').innerHTML
let Requests2=document.getElementById('Requests2').innerHTML;
let attendance=document.getElementById('Attendance');
let application=document.getElementById('Application');
let profile=document.getElementById('Profile');
let about=document.getElementById('About');
let log=document.getElementById('LogOut');
let Pro= document.getElementById('Pro');
let Attendance_req="NoPost";
let ProHTML=`<div class="pro" id="Pro">
         <div class="pro-back" onclick="ProBack()"><i class="fa-solid fa-arrow-left"></i></div>
         <div class="pro-icon"><i class="fa-regular fa-circle-user"></i></div>
         <div class="pro-name ">${name}</div>
         <div class="pro-TG_GroupID pro-item">TG group ID: ${TG_id}</div>
         <div class="pro-mobile pro-item">Mobile No: ${mobile}</div>
         <div class="pro-enrollment pro-item">Enrollment NO: ${Enroll}</div>
         <div id="pro-sign-out"class="item Log-out"><pre onclick="LogOut()"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sign out</pre></div>
        </div>`;

 function ProBack(){
    document.getElementById('Container').innerHTML=homeHTML;
     
      
}

async function Home(){
     document.getElementById('Main').innerHTML=Home_nav;
     document.getElementById('Home').style.color="#5e48d9";
     document.getElementById('Attendance').style.color="#8c899c";
     document.getElementById('Application').style.color="#8c899c";
     document.getElementById('Profile').style.color="#8c899c";
     document.getElementById('About').style.color="#8c899c";
     document.getElementById('LogOut').style.color="#8c899c";
     
     let res= await fetch(`/GetStatus?mobile=${mobile}&TG_id=${TG_id}`);
     let data = await res.json();
     let i=0;
     
     while(data[i]){
        let index = i;
        if(data[i].posting.trim()=='yes'){
     document.getElementById('PostingAttendance').innerHTML=document.getElementById('PostingAttendance').innerHTML
     +`<div class="posting-student ">
               <div class="posting-name">${data[i].name}</div>
               <div class="posting-enroll">${data[i].Enroll}</div>
               <div class="posting-status">Present</div>
               <div id="PostingMark${index}" class="posting-mark" onclick="MarkAttendance(${data[i].mobile},${index})">Mark Attendance</div>
            </div>`;
        }
            i++;
     }


}
function Profile(){
    document.getElementById('Container').innerHTML=document.getElementById('Container').innerHTML
    +ProHTML;
    document.getElementById('Home').style.color="#8c899c";
    document.getElementById('Attendance').style.color="#8c899c";
    document.getElementById('Application').style.color="#8c899c";
    document.getElementById('Profile').style.color="#5e48d9";
    document.getElementById('About').style.color="#8c899c";
    document.getElementById('LogOut').style.color="#8c899c";
}
function Read(content,roll,value){
    fetch(`/SeenApplication?roll=${roll}&value=${value}`,{method:"GET"}).catch(err=>{
        console.error(err);
    })
    document.getElementById('Main').innerHTML=ReadApplication_nav;
    document.getElementById('Reading').innerText=`${content}`;
    document.getElementById('Nav').style.width="27%";
    
}

async function JoinRequest(){
    document.querySelector('#Home').style.color="#8c899c";
    document.getElementById('Attendance').style.color="#5e48d9";
    document.getElementById('Application').style.color="#8c899c";
    document.getElementById('Profile').style.color="8c899c";
    document.getElementById('About').style.color="#8c899c";
    document.getElementById('LogOut').style.color="#8c899c";
    let res = await fetch(`/GroupRequest?TG_id=${TG_id}`);
    let data = await res.json();
          
            
             document.getElementById('Main').innerHTML=Requests;
             let i;
             for(i=0; i<data.count; i++){
                let  I = i;
                let hh = `<div class="posting-student">
                <div class="posting-name">${data.name[i]}</div>
                <div class="posting-enroll">${data.Enroll[i]}</div>
                <div class="posting-status">Join reqeuest</div>
                <div id="Request${i}" class="posting-mark" onclick="Add(${data.mobile[i]},${I})">Add</div>
             </div>`; 
             document.getElementById('AddReq').innerHTML=
             document.getElementById('AddReq').innerHTML+hh;
             
             }

}
function Application(){  
    document.getElementById('Main').innerHTML=Application_nav;
    document.querySelector('#Home').style.color="#8c899c";
    document.getElementById('Attendance').style.color="#8c899c";
    document.getElementById('Application').style.color="#5e48d9";
    document.getElementById('Profile').style.color="#8c899c";
    document.getElementById('About').style.color="#8c899c";
    document.getElementById('LogOut').style.color="#8c899c";
}
let k=0;
function MarkAttendance(Mobile,i){
    fetch(`/Marked?mobile=${Mobile}&TG_id=${TG_id}`,{method:"GET"}).catch(err=>{
        console.error(err);
    })
    let mark=document.getElementById(`PostingMark${i}`);
    mark.style.backgroundColor="#121212";
    mark.style.color="green";
    mark.innerText="✓ Marked";
    mark.style.fontWeight="bolder";
    mark.style.fontSize="1.1vw";
    
}
function Add(mobile,i){
    fetch(`/Add?mobile=${mobile}&TG_id=${TG_id}`,{method:"GET"}).catch(err=>{
        console.error(err);
    }) 
    let res = document.getElementById(`Request${i}`);
    res.style.backgroundColor="#000000";
    res.style.color="#45d145";
    res.innerText=" ✓Added ";

}
function Remove(mobile,i){
    fetch(`/Remove?mobile=${mobile}`,{method:"GET"}).catch(err=>{
        console.error(err);
    })
    let mark=document.getElementById(`Request${i}`);
    mark.style.backgroundColor="#121212";
    mark.style.color="green";
    mark.innerText=" Removed ";
    mark.style.fontWeight="bolder";
    mark.style.fontSize="0.8vw";
}
async function GruopMember() {
     let res= await fetch(`/GetStatus?mobile=${mobile}&TG_id=${TG_id}`);
     let data = await res.json();
    document.getElementById('Main').innerHTML=Requests2;
    let i=0;
    let html = `<div class="posting-student" style="background-color:#121212;height:6%;">
                <div class="posting-name">Name</div>
                <div class="posting-enroll">Enrollment No.</div>
                <div class="posting-status" style="color:white;">Mobile No.</div>
                <div class="posting-status" style="color:white;">Attendance%</div>
                <div  class="posting-status" Update</div>
             </div>`;
    document.getElementById('AddReq').innerHTML=
    document.getElementById('AddReq').innerHTML+html;
    while(data[i]){
        let index=i;
    let hh = `<div class="posting-student">
                <div class="posting-name">${data[i].name}</div>
                <div class="posting-enroll">${data[i].Enroll}</div>
                <div class="posting-status" style="color:white;">${data[i].mobile}</div>
                <div class="posting-status" style="color:white;">${data[i].presence}%</div>
                <div id="Request${index}" class="posting-mark" onclick="Remove(${data[i].mobile},${index})"> Remove </div>
             </div>`;
             document.getElementById('AddReq').innerHTML=
             document.getElementById('AddReq').innerHTML+hh; 
             i++;
    }

}
function About(){
    document.getElementById('Main').innerHTML=`
    <div id="Bar"onclick="incr()" class="bar"> <i class="fa-solid fa-bars"></i> </div>
    <div class=about-text>Contact us to any query<br>
    himanshubarman7070@gmail.com</div>`;
    document.querySelector('#Home').style.color="#8c899c";
    document.getElementById('Attendance').style.color="#8c899c";
    document.getElementById('Application').style.color="#8c899c";
    document.getElementById('Profile').style.color="#8c899c";
    document.getElementById('About').style.color="#5e48d9";
    document.getElementById('LogOut').style.color="#8c899c";
}
function CancleAttendance(){
    if(confirm("You want to cancle your today's attendance")){
      document.getElementById('Post').innerHTML=`<div class="posting-text">Post your today's attendance or application</div>
            <div class="posting-items">
               <div onclick="PostAttendance()" class="posting-attendance"><i class="fa-regular fa-calendar-check"></i> Attendance</div>
               <div class="posting-application"><i class="fa-regular fa-file-zipper"></i> Application
            </div>
            </div>`;
            Attendance_req="NoPost";  
    }
}
function ViewAttendance(){
    document.getElementById('Take-Date').style.display='block';
   document.getElementById('Main').style.filter='brightness(40%)';
   document.getElementById('TakeDateBtn').onclick=()=>{
    ViewReport();
   }
}
function ViewApplication(){
      document.getElementById('Take-Date').style.display='block';
   document.getElementById('Main').style.filter='brightness(40%)';
   document.getElementById('TakeDateBtn').onclick=()=>{
    ViewReport2();
   }
}
function Cut(){
    document.getElementById('Take-Date').style.display='none';
   document.getElementById('Main').style.filter='brightness(100%)'; 
}
function Update(Mobile,index){
     let value = document.getElementById('TakeInput').value;
    let dd=value;
    if(document.getElementById(`ReadAtt${index}`).innerText=="Present"){
        fetch(`/UpdateAttendance?mobile=${Mobile}&date=${value}`,{method:"GET"}).catch(err=>{
            console.error(err);
        })
    document.getElementById(`ReadAtt${index}`).style.color="red";
    document.getElementById(`ReadAtt${index}`).innerText="Absent";
    }
    else{
        fetch(`/PresentAttendance?mobile=${Mobile}&date=${value}&TG_id=${TG_id}`,{method:"GET"}).catch(err=>{
            console.log(err);
        })
        document.getElementById(`ReadAtt${index}`).style.color="green";
    document.getElementById(`ReadAtt${index}`).innerText="Present";
    }
}
async function ViewReport2() {
    document.getElementById('Take-Date').style.display='none';
   document.getElementById('Main').style.filter='brightness(100%)';
    let value=document.getElementById('TakeInput').value;
    let res  = await fetch(`/ViewReport2?TG_id=${TG_id}&value=${value}`);
    let data=await res.json();
    document.getElementById('Ap').innerText=`Appication Report ${value}`;
    let i=0;

        while(data[i]){
        let dd=data[i].content;
        let index=i;
            let hh=`<div class="posting-student">
                  <div class="posting-name">${data[i].name}</div>
                  <div class="posting-enroll">${data[i].Enroll}</div>
                  <div id="ReadApplication${index}" class="posting-status">Read Application</div>
               </div>`;
    
    let mm=data[i].mobile;
    document.getElementById('ApplicationReport').insertAdjacentHTML('beforeend',hh)
    document.getElementById(`ReadApplication${index}`).addEventListener('click',()=>{
        Read(dd,mm,value);
    });
    i++;
    }
}
async function ViewReport(){
    let value = document.getElementById('TakeInput').value;
    let dd=value;``
let res = await fetch(`/ViewReport?TG_id=${TG_id}&value=${value}`)
let data = await res.json();
 let k=0;
 document.getElementById('Take-Date').style.display='none';
   document.getElementById('Main').style.filter='brightness(100%)';
   document.getElementById('Main').innerHTML=`<div id="Application-nav" class="application-nav">
             <div class="application-container" id="ViewAttendance">
               <div id="Bar"onclick="incr()" class="bar"> <i class="fa-solid fa-bars"></i> </div>   
               <div class="application-text">Here is students attendance report date-${value}</div>
               <div class="posting-student" style="background-color:#121212;">
                  <div class="posting-name">name</div>
                  <div class="posting-enroll" style="margin-right:0%;">Enrollment No.</div>
                  <div id="ReadApplication"  class="posting-status" style="color:white;text-decoration:none;">Status</div>
                  <div id="Request1"class="posting-mark" style="background-color:#121212;font-size:0.9vw;color:white;">Update</div>
               </div>
             </div>
           </div>`;
 while(data[k]){
    let hh;
    let index=k;
    if(data[k].status=="Present"){
     hh =`<div class="posting-student">
                  <div class="posting-name">${data[k].username}</div>
                  <div class="posting-enroll">${data[k].Enroll}</div>
                  <div id="ReadAtt${index}"  class="posting-status" style="color:green;text-decoration:none;">Present</div>
                  <div onclick="Update(${data[k].mobile},${index})" id="Request${index}"class="posting-mark" >Update</div>
               </div>`;
    }
    else{
        hh =`<div class="posting-student">
                  <div class="posting-name">${data[k].username}</div>
                  <div class="posting-enroll">${data[k].Enroll}</div>
                  <div id="ReadAtt${index}"  class="posting-status" style="color:red;text-decoration:none;">Absent</div>
                  <div onclick="Update(${data[k].mobile},${index})" id="Request${index}"class="posting-mark"  >Update</div>
               </div>`;
    }
    document.getElementById('ViewAttendance').innerHTML=
    document.getElementById('ViewAttendance').innerHTML+hh;
    k++;
 }
}
function decr(){
    let val = document.getElementById('Nav');
    let bar = document.getElementById('Bar');
    val.style.animation="decr 0.7s ease-in-out";
     setTimeout(()=>{
     val.style.width="0%";
     bar.style.display="inline";
     },700);
     
}
function incr(){
    let val = document.getElementById('Nav');
    let bar = document.getElementById('Bar');
    bar.style.display="none";
    val.style.animation="incr 0.7s ease-in-out";
     setTimeout(()=>{
     val.style.width="27%";
     },700);
}
 let val=1.2;
function Incr(){
    val=val+0.5;   
    document.getElementById('Read-text').style.fontSize=`${val}vw`;
}
function Decr(){
    val=val-0.5;   
    document.getElementById('Read-text').style.fontSize=`${val}vw`;
}
function LogOut(){
    document.getElementById('Log-Out').style.display="block";
    document.getElementById('Container').style.filter="brightness(40%)";
 
 }
function JoinGroup(){
    console.log("ff")
    document.getElementById('Join').style.display="block";
    document.getElementById('Container').style.filter="brightness(40%)";
}
function Cross(){
    document.getElementById('Join').style.display="none";
    document.getElementById('Log-Out').style.display="none";
    document.getElementById('Container').style.filter="brightness(100%)";
}

Home();
