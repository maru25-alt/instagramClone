import React, {useState} from 'react';
import {auth} from '../store/firebase'

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [emailSend, setemailSend] = useState(false)

    const handleRestPassword = (e) => {
        e.preventDefault();
        auth.sendPasswordResetEmail(email).then(res => {
             setemailSend(true)
            console.log(res)
        })
        .catch(err => {
            console.log(err)
            alert(err.message)
        })
    }
    return (
        <div className="signin">
            <div className="signin__container"> 
                <div className="signin__formContainer">
                    <h3>Forget Password</h3>
                    <form className="signin__form">
                        <input 
                            onChange={e => setEmail(e.target.value)} 
                            value={email} type="email" 
                            name="email" 
                            placeholder="Reset Email" />
                            {emailSend && <div>Check your email to reset password</div>}
                        <button onClick={handleRestPassword}> {emailSend ? "Resend" : "Send"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword
