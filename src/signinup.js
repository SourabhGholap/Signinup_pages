import {useState,useEffect} from 'react';
import email from './Assets/email.png';
import password from './Assets/password.png';
import person from './Assets/person.png';
import './signinup.css';

function Signinup() {
     const [action,setaction] = useState('Signup');
     const [username,setusername] = useState('');
     const [useremail,setuseremail] = useState('');
     const [userpassword,setuserpassword] = useState('');
     const [error,seterror] = useState('0');
     const [errortext,seterrortext] = useState('');
     const [forgotpassword,setforgotpassword] = useState('0');
     const [otp,setotp] = useState('');
     const [verified_otp,setverified_otp] = useState('0');
     const [otp_sent,setotp_sent] = useState('0');
    //  let url = 'http://localhost:8080/';
     let url = 'https://sininup-pages-backend.onrender.com/';
     
     const update_user_password = async (e) => {
        e.preventDefault();
        console.log('update password');
        const response = await fetch(url + "updatepassword",
        {
            method: 'POST',
            body : JSON.stringify({email: useremail,password: userpassword}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response);
        const msg = await response.json();
        console.log(msg);
        if(msg==='Password updated'){
            seterror('0');
            seterrortext('password updated');
            setforgotpassword('0');
        }
     }

     const validate_otp = async (e) => {  
        e.preventDefault();
        console.log('otp',otp);
        const response = await fetch(url + "verifyotp",
        {
            method: 'POST',
            body : JSON.stringify({otp: otp}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const msg = await response.json();
        console.log(msg);
        if(msg==='OTP verified'){
            console.log('otp verified');
            seterror('0');
            seterrortext('otp verified');
            setverified_otp('1');
        }
        else{
            console.log('incorrect otp');
            seterror('1');
            seterrortext('incorrect otp');
            setverified_otp('0');
        }
     }

     const forgotpasswordaction = async (e) => { 
        e.preventDefault();
        console.log('forgot password action');
        const response = await fetch(url + "forgotpassword", 
        {
            method: 'POST',
            body : JSON.stringify({email: useremail}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const msg = await response.json();
        if (msg==='OTP sent to your email') {
            setotp_sent('1');
            seterror('0');
            seterrortext('OTP sent to your email');
        }
        else{
            seterror('1');
            seterrortext('Email not found. Please sign up with this email');
        }
    }

     const submit = async (e) => {
        e.preventDefault();
        if(action==='Signup'){
            if(username!=='' && useremail!=='' && userpassword!==''){
                const newuser= {
                name: username,
                email: useremail,
                password: userpassword
                }
                const response = await fetch(url + "adduser", 
                {
                    method: 'POST', 
                    body : JSON.stringify(newuser),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const msg = await response.json();
                console.log(msg);
                if(msg==='User added')
                {
                  seterror('0');
                  seterrortext('signup success');
                }
                else{
                  seterror('1');
                  seterrortext(msg);
                }
            }
            else{
                console.log('fill all the fields');
                seterror('1');
                seterrortext('fill all the fields');
            }
        }
        else{
            const finduser = {  
                name: username,
                password: userpassword
            }
            const response = await fetch(url + "finduser", 
            {
                method: 'POST', 
                body : JSON.stringify(finduser),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const msg = await response.json();
            console.log(msg);
            if(msg==='login successful'){
                console.log('login success');
                seterror('0');
                seterrortext('login success');
            }
            else if(msg==='incorrect password'){
                console.log('incorrect password');
                seterror('1');
                seterrortext('incorrect password');
            }
            else if(msg==='User not found'){
                console.log('user not found');
                seterror('1');
                seterrortext('user not found');
            }
            else
            {
                seterrortext('unable to connect to mangodb');
            }
        }
     }

     return (
        <div>
            <div>
                {forgotpassword === '0'?
                <div className='container'>
                <div className="submit-container">
                    <button className={action==="Login"?"submitgray":"submit"} onClick={()=> {setaction("Login"); seterror('0') ; seterrortext(' ')} }>Login</button>
                    <button className={action==="Signup"?"submitgray":"submit"} onClick={()=>{setaction("Signup") ;seterror('0') ; seterrortext(' ') }}>Signup</button>
                </div>
                <div className = 'header'>
                    <div className= 'text'>{action}</div>
                    <div className= 'underline'></div>
                </div>
                {error==='1'?<div className="error">{errortext}</div>:null}
                {error==='0'?<div className="success">{errortext}</div>:null}
                <form onSubmit={submit}>
                    <div className = 'inputs'>
                        <div className = 'input'>
                            <img src={person} alt="" />
                            <input type="text" value={username} onChange={(e)=>setusername(e.target.value)} id="username"/>
                        </div>
                        {action==='Signup'?<div className = 'input'> <div><img src={email} alt="" /> <input type = 'email' value={useremail} onChange={(e)=>setuseremail(e.target.value)} id="email"/> </div></div>: null} 
                        <div className = 'input'>
                            <img src={password} alt="" />
                            <input type="password" value={userpassword} onChange={(e)=>setuserpassword(e.target.value)} id="password"/>
                        </div>
                    </div>
                    {action==='Login'?<button className="forget-password" onClick = {()=>{setforgotpassword('1')}}>forgot password</button>:null}
                    <div className="submit-container">
                        <button className="submit" type="submit">{action}</button>
                    </div>
                </form>
               </div>
               :             
               <div className='container'>
               <div className = 'header'>
                   <div className= 'text'>{"Forgot password"}</div>
                   <div className= 'underline'></div>
               </div>
               <form onSubmit={forgotpasswordaction}>
                   <div className = 'inputs'>
                       {action==='Login'?<div className = 'input'> <div><img src={email} alt="" /> <input type = 'email' value={useremail} onChange={(e)=>setuseremail(e.target.value)} id="email"/> </div></div>: null} 
                   </div>
                   <div className="submit-container">
                        <button className="submit" type="submit">{'Send otp'}</button>
                   </div>
                   {error==='1'?<div className="error">{errortext}</div>:null}
                   {error==='0'?<div className="success">{errortext}</div>:null}
               </form>
                {otp_sent==='1'?            
               <form onSubmit={validate_otp}>
                   <div className = 'inputs'>
                       <div className = 'input'> <div><input type = 'text' value={otp} onChange={(e)=>setotp(e.target.value)} id="otp"/> </div></div>
                   </div>

                   <div className="submit-container">
                        <button className="submit" type="submit">{'verify'}</button>
                    </div>
               </form>:null
                }
               <div>
                {verified_otp==='1'?
                    <form onSubmit={update_user_password}>
                    <div className = 'inputs'>
                        <div className = 'input'> <div><img src={password} alt="" /> <input type = 'password' value={userpassword} onChange={(e)=>setuserpassword(e.target.value)} id="diff_password"/> </div></div>
                    </div>
                    <div className="submit-container">
                         <button className="submit" type="submit">{'update password'}</button>
                     </div>
                    </form>
                    : null
                }
                </div>
               </div>}
            </div>
        </div>
     )
}
export default Signinup;