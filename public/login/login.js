const form=document.getElementById("form")
form.addEventListener("submit",async(event)=>{
    try{
    event.preventDefault()
    const loginDetails={
         email:event.target.email.value,
         password:event.target.password.value
    }
    console.log('nmae',loginDetails)
    const response=await axios.post("http://localhost:5000/user/login",loginDetails)
    if (response.status === 200) {
        alert(response.data.message);
        
        localStorage.setItem('token',response.data.token)
         window.location.href= "../chat/chat.html"
    }
} catch (err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red;">${err.response ? err.response.data.message : 'Login failed'}</div>`;
}

})
