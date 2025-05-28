console.log("js check")
const form=document.getElementById("form")
form.addEventListener("submit",async(event)=>{
    try{
    event.preventDefault()
    const signupDetails={
         name: event.target.username.value,
         email:event.target.email.value,
         phonenumber:event.target.phone.value,
         password:event.target.password.value
    }
    console.log('nmae',signupDetails)

    const response=await axios.post(`http://localhost:5000/user/signup`,signupDetails)
    if(response.status===201){
        window.location.href= "./login"
        alert(`Succesfully signup`)
    }else{
        throw new Error("failed to login")
    }
    }catch(err){
        alert("User already exists, Please Login")
        document.body.innerHTML +=`<div style="color:red;">${err}</div>`
    }    
})
