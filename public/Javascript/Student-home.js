
let homeHTML=document.getElementById('Container').innerHTML;
let home=document.getElementById('Home');
let attendance=document.getElementById('Attendance');
let application=document.getElementById('Application');
let profile=document.getElementById('Profile');
let PostingHtml=document.getElementById('Posting').innerHTML;
let attendanceHTMl=document.getElementById('Container2').innerHTML;
let ApplicationHTMl=document.getElementById('Container3').innerHTML;
let about=document.getElementById('About');
let log=document.getElementById('LogOut');
let Pro= document.getElementById('Pro');
let Attendance_req="NoPost";
let percentage=0;
let ProHTML=`<div class="pro" id="Pro">
         <div class="pro-back" onclick="ProBack()"><i class="fa-solid fa-arrow-left"></i></div>
         <div class="pro-icon"><i class="fa-regular fa-circle-user"></i></div>
         <div class="pro-name ">${name}</div>
         <div class="pro-TG_GroupID pro-item">TG group ID: ${TG_id}</div>
         <div class="pro-mobile pro-item">Mobile No:${mobile}</div>
         <div class="pro-enrollment pro-item">Enrollment NO: ${Enroll}</div>
         <div id="pro-sign-out"class="item Log-out"><pre onclick="LogOut()">
         <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign out</pre></div>
        </div>`;

 function ProBack(){

    document.getElementById('Container').innerHTML=homeHTML;
    if(Attendance_req=="sent"){
      document.getElementById('Post').innerHTML=`<div class="post-data">Your attendance is successfully sent to your TG</di>
              <div class="cancle-container"><div class="post-cancle" onclick="CancleAttendance()">Cancle</div></div> `;
   }
      
}
 async function Home(){
    document.getElementById('Container').innerHTML=homeHTML;
     home.style.color="#5e48d9";
     attendance.style.color="#8c899c";
     application.style.color="#8c899c";
     profile.style.color="#8c899c";
     about.style.color="#8c899c";
     log.style.color="#8c899c";
     let res11 = await fetch(`/Att_report?mobile=${mobile}`)
    let report1 = await res11.json();
    let res2= await fetch(`/Att_count`)
    let report2 = await res2.json();
     let k=0;
    
     let Att_report = document.getElementById('Att_Report').innerHTML;
     let percentage = ((report1.length)*100)/(report2.length);
     fetch(`Presence?mobile=${mobile}&val=${Math.round(percentage)}`,{method:"GET"}).catch(err=>{
        console.error(err);
     });
     
     document.getElementById('TG-p').innerHTML=`<div class="TG-name" id="Per">${Math.round(percentage)}%</div>
                  <div class="TG-value">TG Attendance</div>
                  <button class="TG-pro" onclick="Attendance()">View</button> `;
     let res1  = await fetch(`/TG_id?mobile=${mobile}`);
        let data1 = await res1.json();
    
       
    TG_id=data1;
    let data3;
     if(TG_id==-1){
      document.getElementById('TG_name').innerText="No TG"
      document.getElementById('TG_id').innerText='-1';
     }
     else{
        let res  = await fetch(`/TG_name?TG_id=${TG_id}`);
        let dataN = await res.json();
        data3=dataN;
        document.getElementById('TG_name').innerText=`${data3}`;
        document.getElementById('TG_id').innerText=`${TG_id}`;
     }
     let res = await fetch(`/PostingStatus?mobile=${mobile}`);
     let data = await res.json();
     if(data=='no'){
        document.getElementById('Posting').innerHTML=
        ` <div class="posting-t1">
               <div class="posting-text">Post your today's <br>attendance</div>
               <div onclick="PostAttendance()" class="posting-attendance">
                  <i class="fa-regular fa-calendar-check"></i> Attendance</div>
            </div>
               <div class="posting-t1 pt1">
                  <div class="posting-text">Post your today's <br> application</div>
               <div onclick="Application()" class="posting-application">
                  <i class="fa-regular fa-file-zipper"></i> Application</div>
                  </div>`;
     }
   else  if(data=="yes"                                                                                                                                                                                                                                                        ){
       document.getElementById('Posting').innerHTML=`<div class="post-data ">Your attendance is successfully sent to your TG</div>
               <div class="post-cancle" onclick="CancleAttendance()">Cancle</div> `;
     }
    
}
function Leave(){
    if(confirm("Do you want to leave from TG gruop")){
    fetch(`/Leave?mobile=${mobile}`,{method:"GET"}).catch(err=>{
        console.error(err)
    });
     document.getElementById('TG_name').innerText="No TG";
     TG_id=-1;
     document.getElementById('TG_id').innerText='-1'; 
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
async function Attendance(){
    document.querySelector('#Home').style.color="#8c899c";
    document.getElementById('Attendance').style.color="#5e48d9";
    document.getElementById('Application').style.color="#8c899c";
    document.getElementById('Profile').style.color="8c899c";
    document.getElementById('About').style.color="#8c899c";
    document.getElementById('LogOut').style.color="#8c899c";

    document.getElementById('Main').innerHTML=attendanceHTMl; 
    let res1 = await fetch(`/Att_report?mobile=${mobile}`)
    let report1 = await res1.json();
    let res2= await fetch(`/Att_count`)
    let report2 = await res2.json();
     let k=0;
     let i=0;
     let Att_report = document.getElementById('Att_Report').innerHTML;
     let percentage = ((report1.length)*100)/(report2.length);
   
     
     while(report2[k]){  
       if(report1[i]==report2[k].join('')){
        let hh = `<div class="container2-student">
           <div class="container2-s">${k+1}.</div>
           <div class="container2-enroll">${Enroll}</div>
           <div class="container2-date">${report2[k]}</div>
           <div class="container2-status ">✔Present</div>
         </div>`;
         document.getElementById('Att_Report').innerHTML=
         document.getElementById('Att_Report').innerHTML
         +hh;
         i++;
       }
       else{
        let hh = `<div class="container2-student">
           <div class="container2-s">${k+1}.</div>
           <div class="container2-enroll">0187CS221100</div>
           <div class="container2-date">${report2[k].join('')}</div>
           <div  style="color:red;margin-left:7%;" > X Absent</div>
         </div>`;
         document.getElementById('Att_Report').innerHTML=
         document.getElementById('Att_Report').innerHTML
         +hh;
         
       }      
   k++;
     }

      let res = await fetch(`/PostingStatus?mobile=${mobile}`);
      let data = await res.json();
      
      if(data=="yes"){
        document.getElementById('Posting').innerHTML=`<div class="post-data ">Your attendance is successfully sent to your TG</div>
                <div class="post-cancle" onclick="CancleAttendance()">Cancle</div> `;
      } 
       if(data=='marked'){
        document.getElementById('Posting').innerHTML=`<div class="post-data ">Your attendance is successfully marked by your TG</div>
               `;
     }  
}
let val=1.2;
function Incr(){
    val=val+0.25;   
    document.getElementById('ApplicationText').style.fontSize=`${val}vw`;
}
function Decr(){
    val=val-0.25;   
    document.getElementById('ApplicationText').style.fontSize=`${val}vw`;
}
function Application(){
    document.getElementById('Main').innerHTML=ApplicationHTMl;
    document.querySelector('#Home').style.color="#8c899c";
    document.getElementById('Attendance').style.color="#8c899c";
    document.getElementById('Application').style.color="#5e48d9";
    document.getElementById('Profile').style.color="#8c899c";
    document.getElementById('About').style.color="#8c899c";
    document.getElementById('LogOut').style.color="#8c899c";
}
async function TG_Profile() {
    document.getElementById('Main').style.filter="brightness(40%)";
    document.getElementById('TG_Pro').style.display="block";
    let res  = await fetch(`TG_Data?TG_id=${TG_id}`);
    let data = await res.json();
    document.getElementById(`TG_Name`).innerText=`Name:${data[0][0]}`
    document.getElementById('TG_ID').innerText=`TG ID:${TG_id}`;
    document.getElementById('TG_Mobile').innerText=`TG Mobile No.:${data[0][1]}`;
}
function Cutting(){
    document.getElementById('Main').style.filter="brightness(100%)";
    document.getElementById('TG_Pro').style.display="none";
}
function About(){
    document.getElementById('Main').innerHTML=`
    <div id="Bar"onclick="incr()" class="bar"> <i class="fa-solid fa-bars"></i> </div>
    <div class=about-text>
    Contact us to any query
    <br>
    himanshubarman7070@gmail.com
</div>`;
    document.querySelector('#Home').style.color="#8c899c";
    document.getElementById('Attendance').style.color="#8c899c";
    document.getElementById('Application').style.color="#8c899c";
    document.getElementById('Profile').style.color="#8c899c";
    document.getElementById('About').style.color="#5e48d9";
    document.getElementById('LogOut').style.color="#8c899c";
}
function CancleAttendance(){
    if(confirm("You want to cancle your today's attendance")){
      document.getElementById('Posting').innerHTML=PostingHtml;
            fetch(`CanclePosting?mobile=${mobile}`,{method:"POST"}).catch(err=>{
                console.log(err);
            }) 
    }
}
async function PostAttendance(){
  let res  = await fetch(`/PostConfirm?mobile=${mobile}`);
  let con = await res.json();
     if(con){
        
    fetch(`/Posting?mobile=${mobile}`,{method:"POST"}).catch(err=>{
        console.error(err)
    });
    document.getElementById('Posting').innerHTML=`<div class="post-data "> Your attendance is successfully sent to your TG </div>
                <div class="post-cancle" onclick="CancleAttendance()">Cancle</div> `;
} else{
    document.getElementById('Posting').innerHTML=`<div class="post-data "> ✕ You have already sent today's attendance </div>
                `;
}

       
} 
function JoinGroup(){
    document.getElementById('Join').style.display="block";
    document.getElementById('Container').style.filter="brightness(40%)";
}
function LogOut(){
   document.getElementById('Log-Out').style.display="block";
   document.getElementById('Container').style.filter="brightness(40%)";

}
function Cross(){
    document.getElementById('Join').style.display="none";
    document.getElementById('Log-Out').style.display="none";
    document.getElementById('Container').style.filter="brightness(100%)";
}
function CancleAttendance2(){
    if(confirm("You want to cancle your today's attendance")){
        document.getElementById('container2-text').innerText="Post your today's attendance or application";
        document.getElementById('Container2-Posting').innerHTML=`<div onclick="PostAttendance2()"
         class="posting-attendance">
        <i class="fa-regular fa-calendar-check"></i> Attendance</div>
               <div class="posting-application"><i class="fa-regular fa-file-zipper">
               </i> Application</div>`;
               Attendance_req="NoPost"
    }
}    
function PostAttendance2(){
    document.getElementById('container2-text').innerText="Your attendance is successfully sent to your TG";
    document.getElementById('Container2-Posting').innerHTML=`<div class="container2-cancle"> 
    <div class="container2-cancle-post" onclick="CancleAttendance2()">Cancle</div>
    </div>`;
    Attendance_req="sent";
}
function JoinRequest(){
  let TG_id = document.getElementById('Id').value;
  if(TG_id){
    fetch(`/JoinRequest?mobile=${mobile}&TG_id=${TG_id}`,{method:"POST"}).catch(err=>{
        console.error(err);
    })
    document.getElementById('Join').style.display="none";
    document.getElementById('Log-Out').style.display="none";
    document.getElementById('Container').style.filter="brightness(100%)";
    alert("successfully TG group join request  sent ");
  }
}
function ApplicationSubmit(){
   if(confirm("You want to send your application")){
let data=document.getElementById("ApplicationText").value;
   document.getElementById('Sent').innerText="Your application successfully sent to your TG";  
     fetch(`/SubmitApplication`,{method:'POST',headers:{
        'Content-Type':'application/json'
     },body:JSON.stringify({
        data:data,
        TG_id:TG_id,
        mobile:mobile
     })
    });
   }
}
function ReadText(text){
  document.getElementById('Main').innerHTML=`<div class="container3" id="Container3">
      <div id="Bar"onclick="incr()" class="bar"> <i class="fa-solid fa-bars"></i> </div>
      <div style="margin-left: 3%;margin-top: 4%; color:white;"> Your Application 
         <button onclick="Incr()" id="Incr">+</button><button onclick="Decr()" id="Decr">-</button>
      </div>
   <textarea id="ApplicationText" rows="100" col="400">${text}
   </textarea> 
   </div>`;
}
function DeleteApplication(date,i){
    if(confirm("YOU WANT TO DELETE APPLICATION")){
        
  fetch(`/DeleteApplication?mobile=${mobile}&date=${date}`,{method:"GET"}).catch(err=>{
    console.error(err);
  });
 
  let dd= document.getElementById(`ConDelete${i}`);
   dd.innerText="Deleted";
  dd.style.backgroundColor='#212121';
  dd.style.color="Red";
}
}
async function PreviousApplication(){
    let res = await fetch(`/PreviousApplication?mobile=${mobile}`);
    let data = await res.json();
    document.getElementById('Main').innerHTML=`<div class="container2" id="Con2">
    <div class="container2-posts" id="Att_Report">
         <div id="Bar"onclick="incr()" class="bar"> <i class="fa-solid fa-bars"></i> </div>
         <div class="container2-information">
            <div class="container2-s">S.NO</div>
            <div class="container2-enroll">Application</div>
            <div class="container2-date"> Date</div>
            <div class="container2-date">Operation</div> 
         </div>
         </div>
         </div>`;
        let i=0;
    
        while(data[i]){
            let text=data[i][2];
            let index=i+1;
            let da =data[i][0];
            let hh;
            if(data[i][3]!="yes"){
             hh=`<div class="container2-student">
           <div class="container2-s">${i+1}.</div>
           <div  class="container2-enroll" id="Reading${i+1}" style="color:green;text-decoration:underline;" >Read Application</div>
           <div class="container2-date">${data[i][0]}</div>
           <div style="font-size:1.1vw;color:white;"><i class="fa-solid fa-check-double"></i></div>
           <div class="container2-pro" id="ConDelete${i+1}" >Delete</div>
         </div>`;
            }
            else{
                  hh=`<div class="container2-student">
           <div class="container2-s">${i+1}.</div>
           <div  class="container2-enroll" id="Reading${i+1}" style="color:green;text-decoration:underline;" >Read Application</div>
           <div class="container2-date">${data[i][0]}</div>
           <div style="font-size:1.1vw;color:green;"><i class="fa-solid fa-check-double"></i></div>
           <div class="container2-pro" id="ConDelete${i+1}" >Delete</div>
         </div>`;
            }
         document.getElementById('Att_Report').insertAdjacentHTML('beforeend',hh)
        document.getElementById(`Reading${i+1}`).onclick= function(){
            ReadText(text);
         }; 
          document.getElementById(`ConDelete${i+1}`).onclick= function(){
            DeleteApplication(da,index);
         };  
          i++;

        }
        
}
Home();