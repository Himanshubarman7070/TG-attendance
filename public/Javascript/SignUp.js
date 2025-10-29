function Sign(event){
    event.preventDefault();
    if(document.getElementById('CNF').value==document.getElementById("pass").value){
        let name = document.getElementById('name').value;
        let mobile  = document.getElementById('mobile').value;
        let module = document.querySelector('input[name="module"]:checked').value;
        let Enroll = document.getElementById('Enroll').value;
        let  pass = document.getElementById('pass').value;
        window.location.href=`/Home?name=${name}&mobile=${mobile}&module=${module.trim()}
        &Enroll=${Enroll}&pass=${pass}`;
        window.close();
    }else{
        document.getElementById('Wrong').innerHTML="Wrong password.Please enter correct password";
    }
}