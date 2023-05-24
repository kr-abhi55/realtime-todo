import { useEffect, useRef, useState } from 'react'
import Utils from "../Utils";
export default function SignUp({ onSignIn }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [gender, setGender] = useState("Male")
    const [age, setAge] = useState()
    async function handleSubmit(e) {
        e.preventDefault()
        if (age == undefined || name.trim() === '' || email.trim() === '' || password.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }
        //if success save token to cache and  redirect to signIn -> todo
        const { error, result } = await Utils.postJson("/sign-up", { email, password, name, age, gender })
        console.log(error, result)
        if (result) {
            const { error, result } = await Utils.postJson("/sign-in", { email, password })
            console.log(error, result)
            if (result) {
                Utils.saveToken(result)
                onSignIn()
            } else {
                alert(error)
            }
        } else {
            alert(error)
        }
    }
    function handleSignIn(e) {
        e.preventDefault()
        onSignIn()
    }
    return (
        <div className='full-box flex-center'>
            <div className='box '>
                <form className='form' onSubmit={handleSubmit} >
                <label className='form-title'>SignUp</label>
                    <input
                        onChange={(e) => { setName(e.target.value) }}
                        type="text" placeholder='name'
                    />
                    <input
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email" placeholder='email'
                    />
                    <input
                        onChange={(e) => { setPassword(e.target.value) }}
                        type="password"
                        placeholder='password'
                    />
                    <input
                        onChange={(e) => { setAge(e.target.value) }}
                        type="number"
                        max={100}
                        placeholder='age'
                    />
                    <label>Gender :
                        <select
                        className='form-select'
                            value={gender}
                            onChange={(e) => { setGender(e.target.value) }}
                        >
                            <option >Male</option>
                            <option >Female</option>
                            <option >Others</option>
                        </select>
                    </label>
                    <button className='form-button' type="submit">SignUp</button>
                    <label >If account already exists <a onClick={handleSignIn} href="/signIn">SignIn</a></label>

                </form>
            </div>
        </div>


    )
}
