const ex = require('express')
const app = ex();
const oracledb = require('oracledb');
const path = require('path')
const cors = require('cors');
const { Console } = require('console');
const port = 1212;

app.use(ex.static(path.join(__dirname,'public')))
app.use(ex.json())
app.use(ex.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(cors());

oracledb.fetchAsString=[oracledb.CLOB];//Automatically convert CLOBs to strings
const connection = {
    username:process.env.DB_USER,
    password:process.env.DB_PASS,
    connectString:process.env.DB_CON
};
const db = oracledb.getConnection(connection);

//DBMS set upfl
//usersTG(username,mobile,module,Enroll,TG_id,pass,posting,presence) mobile is primary key 
// posting values=[yes,no,marked]
//Attendance(mobile,att_date,TG_id,status) status values=[present]
//Join_Request(mobile,TG_id)
//Application(mobile,application_date,content,TG_id,seen) seen values =[yes,no]




app.get('/',async(req,res)=>{
   // res.sendFile(path.join(__dirname,'Login.html'));
   res.render('Login');
})

app.post('/LoginDone',async(req,res)=>{
    let mobile = req.body.mobile;
    let pass = req.body.pass;
    let result = await (await db).execute(`
        select case 
           WHEN COUNT(*)>0 then 'yes'
           else 'no'
            END from usersTG where mobile=:mobile AND pass=:pass 
        `,{mobile,pass});

        if(result.rows[0].join(',')=='yes'){
            let module = await (await db).execute(`select module from usersTG 
                where mobile=:mobile`,{mobile});
                let value= module.rows[0].join(',');
                let sql_name = await(await db).execute(`
                    select username,Enroll,TG_id from usersTG where mobile=:mobile`
                ,{mobile});
               let data = {
                    name:sql_name.rows[0][0],
                    Enroll:sql_name.rows[0][1],
                    TG_id:sql_name.rows[0][2],
                    mobile:mobile.trim()
                };
                
                if(value.trim()=="Student"){
                    res.render('Student-home',{data});
                }
                 else{
                     res.render('TG-home',{data});
                 }   
                }
        else{
            res.send(`<p>Wrong mobile number or password</p>`);
        }
        
})
app.get('/SignUp',(req,res)=>{
    res.render('SignUP');
})

app.get('/Home',async(req,res)=>{
    let name = req.query.name;
    let mobile = req.query.mobile;
    let module = req.query.module;
    let Enroll = req.query.Enroll;
    let pass=req.query.pass;
    let login = await (await db).execute(`
        select case 
        when COUNT(*)>0 then 'yes'
        else 'no' END from usersTG where mobile=:mobile`,{mobile});
    
       if(login.rows[0]=="no"){ 

    let sql = await (await db).execute(`insert into usersTG (username,mobile,module,pass,Enroll)
        values (:name,:mobile,:module,:pass,:Enroll)`,{name,mobile,module,pass,Enroll},{autoCommit:true});
        let sql_name = await(await db).execute(`
            select username,Enroll,TG_id from usersTG where mobile=:mobile`
        ,{mobile});
        let data = {
            name:sql_name.rows[0][0],
            Enroll:sql_name.rows[0][1],
            TG_id:sql_name.rows[0][2],
            mobile:mobile.trim()
        };
        if(module.trim()=="TG"){
            let id = Math.trunc(Math.random()*(10**10));
            let sql2 = await (await db).execute(
                `update usersTG set TG_id=:id where mobile=:mobile`,{id,mobile},{autoCommit:true}
            );
            data.TG_id=id;
     res.render('TG-home',{data});
        }
    else{
        let sql3 = await (await db).execute(`
            insert into join_request (mobile,TG_id) values (:mobile,-1)`,
        {mobile},{autoCommit:true});
          res.render('Student-home',{data});
    }
    }
     else{
        res.send("<p>This mobile number is already registered</p>")
     }
})

app.get('/TG_name',async(req,res)=>{
    let TG_id= req.query.TG_id;
    let sql0 = await (await db).execute(`
        update usersTG  set module=TRIM(module)`);
    let sql = await (await db).execute(`
        select username from usersTG where TG_id=:TG_id AND module='TG'`,{TG_id});
        res.json(sql.rows[0]);
})
app.get('/Presence',async(req,res)=>{
    let mobile=req.query.mobile;
    let val = req.query.val;
    let sql = await (await db).execute(`
        update usersTG set presence=:val where
         mobile=:mobile`,{val,mobile},{autoCommit:true});
})
app.get('/TG_Data',async(req,res)=>{
    let TG_id= req.query.TG_id;
    let sql0 = await (await db).execute(`
        update usersTG  set module=TRIM(module)`);
    let sql = await (await db).execute(`
        select username,mobile from usersTG where TG_id=:TG_id AND module='TG'`,{TG_id});
        res.json(sql.rows);
})

app.post('/Posting',async(req,res)=>{
    let mobile = req.query.mobile;
    let sql = await (await db).execute(`
        update usersTG set posting='yes' where mobile=:mobile`,{mobile},{autoCommit:true});
})
app.post('/CanclePosting',async(req,res)=>{
    let mobile = req.query.mobile;
    let sql = await (await db).execute(`
        update usersTG set posting='no' where mobile=:mobile`,{mobile},{autoCommit:true});
})
app.post('/JoinRequest',async(req,res)=>{
    let mobile = req.query.mobile;
    let TG_id = req.query.TG_id;
    let sql = await (await db).execute(`update join_request set TG_id=:TG_id where 
        mobile=:mobile`,{TG_id,mobile},{autoCommit:true});
})
app.get('/GroupRequest',async(req,res)=>{
    let TG_id = req.query.TG_id;
    let sql = await (await db).execute(`
        select mobile from Join_request where TG_id=:TG_id`,{TG_id});
    let count=0;

        if(sql.rows[0]){
             let i=0;
             while(sql.rows[i]){
                count++;
                i++;
             }
            let name = Array(count);
            let Enroll = Array(count);
            let mobile = Array(count);
            for(let i=0; i<count; i++){
                let mobile2 = sql.rows[i].join(',');
               
              let  sql2= await (await db).execute(
                   `select username,Enroll,mobile from usersTG where mobile=:mobile2`,{mobile2});
               name[i]=sql2.rows[0][0];
                Enroll[i]=sql2.rows[0][1];
                mobile[i]=sql2.rows[0][2];
            }
            
            res.json({name,Enroll,count,mobile});
        }
           
        else{
            res.json(0);
        }
})
app.get('/Leave',async(req,res)=>{
    let mobile= req.query.mobile;
    let sql= await (await  db).execute(`
        update usersTG set TG_id=-1 where mobile=:mobile`,
    {mobile},{autoCommit:true});
})
app.get('/TG_id',async(req,res)=>{
    let mobile=req.query.mobile;
    let sql=await (await db).execute(`
        select TG_id from usersTG where mobile=:mobile`,{mobile});
        let data=sql.rows[0];
        res.json(data);
})
app.get('/Add',async(req,res)=>{
    let Mobile= req.query.mobile;
    let TG_id=req.query.TG_id;
    let mobile= Number(Mobile)
   
    let sql = await (await db).execute(`update join_request set TG_id=-1
        where mobile=:mobile`,{mobile},{autoCommit:true});
    let sql2 = await (await db).execute(`update usersTG set TG_id=:TG_id 
        where mobile=:mobile`,{TG_id,mobile},{autoCommit:true});    
})
app.get('/PostingStatus',async(req,res)=>{
    let mobile=req.query.mobile;
      let sql= await (await db).execute(
        `select posting from usersTG where mobile=:mobile`,{mobile}
      );
      let data = sql.rows[0];
      res.json(data);
})
app.get('/GetStatus',async(req,res)=>{
    let mobile= req.query.mobile;
    let TG_id = req.query.TG_id;
    let sql = await (await db).execute(`
        select username,mobile,Enroll,posting,presence from usersTG where TG_id=:TG_id AND module='Student'`,{TG_id});
    let i=0;
    let data=[];
    while(sql.rows[i]){
        data[i]={
            name:sql.rows[i][0],
            mobile:sql.rows[i][1],
            Enroll:sql.rows[i][2],
            posting:sql.rows[i][3],
            presence:sql.rows[i][4]
            }
        i++;
    }
    
        res.json(data);
})
app.get('/Marked',async(req,res)=>{
    let mobile=req.query.mobile;
    let TG_id=req.query.TG_id;
   let sql= await (await db).execute(`
      update usersTG set posting='no' where mobile=:mobile 
       AND TG_id=:TG_id AND module='Student'`,{mobile,TG_id},{autoCommit:true});
    let date = new Date();
    let currentDate= date.toLocaleDateString();
    let sql2 = await (await db).execute(`
        insert into attendance (mobile,att_date,TG_id,status) values (:mobile,TRUNC(SYSDATE),
        :TG_id,'present')`,{mobile,TG_id},{autoCommit:true});
     
})
app.get('/Submit',async(req,res)=>{
    let TG_id=req.query.TG_id;
    let date = new Date();
    let current=date.toLocaleDateString()
    console.log("rr",current);
})
app.get('/Remove',async(req,res)=>{
    let mobile= req.query.mobile;
    let sql = await (await db).execute(`
        update usersTG set TG_id=-1 where mobile=:mobile`,{mobile},{autoCommit:true});
    
})
app.get('/PostConfirm',async(req,res)=>{
    let mobile=req.query.mobile;
    let sql = await (await db).execute(`
        select mobile from attendance where mobile=:mobile and att_date=
        TRUNC(SYSDATE)`,{mobile});
        if(sql.rows[0]){
            res.json(false);
        }
        else{
            res.json(true);
        }
})
app.get('/Att_report',async(req,res)=>{
    let mobile=req.query.mobile;
   let sql = await (await db).execute(`
    select DISTINCT TO_CHAR(TRUNC(att_date),'YYYY-MM_DD') from
     Attendance where mobile=:mobile order by TO_CHAR(TRUNC(att_date),'YYYY-MM_DD')
      asc `,{mobile});
    
    res.json(sql.rows);
})
app.get('/Att_count',async(req,res)=>{
   let sql = await (await db).execute(`
    select DISTINCT TO_CHAR(TRUNC(att_date),'YYYY-MM_DD') from Attendance 
    order by TO_CHAR(TRUNC(att_date),'YYYY-MM_DD') asc `);
    res.json(sql.rows);
})
app.get('/ViewReport',async (req,res) => {
    let TG_id = req.query.TG_id;
    let value = req.query.value;
    let sql  = await (await db).execute(`
        select DISTINCT TO_CHAR(TRUNC(att_date),'YYYY-MM-DD'),mobile,status from attendance usersTG where TG_id=:TG_id
        `,{TG_id});
         let data=[];
         let i=0;
         let k=0;
         while(sql.rows[i]){
            let mobile=sql.rows[i][1];
               let sql2 = await (await db).execute(`
                select  username,Enroll from usersTG where mobile=:mobile`,{mobile})
            if(value==sql.rows[i][0]){
            data[k]={
             username:sql2.rows[0][0],
             Enroll:sql2.rows[0][1],
             mobile:mobile,
             date:value,
             status:"Present"   
            }  
            k++;
            }
    
            i++;
         }
         let sql3 = await (await db).execute(
            `select DISTINCT mobile,username,Enroll from usersTG where TG_id=:TG_id AND module='Student'`,{TG_id}
         )
        
         let m=0;
         let Res=[]
         let x=1;
         while(sql3.rows[m]){
            let y=0;
            while(y<k){
                if(sql3.rows[m][0]==data[y].mobile){
                    Res[m]={
                        username:data[y].username,
                        mobile:data[y].mobile,
                        Enroll:data[y].Enroll,
                        date:data[y].date,
                        status:'Present'
                    }
                    x=0;
                    break;
                }
                else{
                    x=1;
                }
                y++;
            }
            if(x==1){
                    Res[m]={
                        username:sql3.rows[m][1],
                        mobile:sql3.rows[m][0],
                        Enroll:sql3.rows[m][2],
                        date:value,
                        status:'Absent'
                    }
            }
          m++;
         }
         
        res.json(Res)
})
app.get('/ViewReport2',async(req,res)=>{
    let value=req.query.value;
    let TG_id=req.query.TG_id;
    let sql = await (await db).execute(`
        select mobile,content from application where application_date=TO_DATE(:bindDate,'YYYY-MM-DD')
        AND TG_Id=:TG_id `,{bindDate:value,TG_id});
    let i=0;
    let data=Array(40);
    while(sql.rows[i]){
        let mob=sql.rows[i][0];
        let sql2 = await (await db).execute(`
            select username,Enroll from usersTG where mobile=:mob `,{mob}
        );
        data[i]={
            name:sql2.rows[0][0],
            Enroll:sql2.rows[0][1],
            content:sql.rows[i][1],
            mobile:sql.rows[i][0],
            date:value
        };
        i++;
}
 res.json(data);
})
app.get('/SeenApplication',async(req,res)=>{
    let mobile= req.query.roll;
    let date=req.query.value;
    let sql =await (await db).execute(`update application set seen='yes'
        where Application_date=TO_DATE(:bindDate,'YYYY-MM-DD') AND mobile=:mobile`,
    {bindDate:date,mobile},{autoCommit:true});
})
app.get('/UpdateAttendance',async(req,res)=>{
    let mobile=req.query.mobile;
    let date=req.query.date;
    let sql = await (await db).execute(`
     delete  attendance where att_date=TO_DATE(:bindDate,'YYYY-MM-DD') AND mobile=:mobile`,
     {bindDate : date,mobile},{autoCommit:true}); 
})
app.get('/PresentAttendance',async(req,res)=>{
    let mobile=req.query.mobile;
    let date=req.query.date;
    let TG_id=req.query.TG_id;
    let sql=await (await db).execute(`insert into attendance (att_date,mobile,status,TG_id)
        values (TO_DATE(:bindDate,'YYYY-MM-DD'),:mobile,'present',:TG_id)`,{bindDate:date,mobile,TG_id},{autoCommit:true});
})
app.post('/SubmitApplication',async(req,res)=>{
    let d1=req.body.data;
    let t1 =req.body.TG_id;
    let m1=req.body.mobile;
    let data= d1;
    let TG_id=Number(t1);
    let mobile=Number(m1);
    let sql  = await (await db).execute(`insert into application 
        (mobile,application_date,content,TG_id,seen)
        values (:mobile,TRUNC(SYSDATE),:data,:TG_id,'no')`
        ,[mobile,data,TG_id],{autoCommit:true});  
})
app.get('/PreviousApplication',async(req,res)=>{
    let mobile= req.query.mobile;
    let con = await db;
    let sql = await con.execute(`
        select TO_CHAR(TRUNC(application_date),'YYYY-MM-DD'),TG_id, content,seen from application where mobile=:mobile
        order by application_date desc`,{mobile});    
     res.json(sql.rows); 
})
app.get('/DeleteApplication',async(req,res)=>{
    let mobile=req.query.mobile;
    let date= req.query.date;
    
    let sql = await (await db).execute(`delete application where
         application_date=TO_DATE(:bindDate,'YYYY-MM-DD') AND mobile=:mobile`,
        {bindDate:date,mobile},{autoCommit:true});
})
app.listen(2121,'0.0.0.0');