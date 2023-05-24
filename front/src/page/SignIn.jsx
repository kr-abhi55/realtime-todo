import { useEffect, useRef, useState } from 'react'
import Utils from "../Utils";
export default function SignIn({ onSignUp, onTodoApp }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  useEffect(() => {
    //check already login
    const token = Utils.getToken()
    console.log("token", token)

    if (token) {
      //redirect  to todo
      onTodoApp()
    }
    return () => {

    }
  }, [])
  async function handleSubmit(e) {
    e.preventDefault()
    const { error, result } = await Utils.postJson("/sign-in", { email, password })
    console.log(error, result)
    if (result) {
      Utils.saveToken(result)
      onTodoApp()
    } else {
      alert(error)
    }
  }
  function handleSignUp(e) {
    e.preventDefault()
    onSignUp()
  }
  return (
    <div className='full-box flex-center'>
      <div className='box '>
        <form className='form' onSubmit={handleSubmit} >
          <label className='form-title'>SignIn</label>
          <input onChange={(e) => { setEmail(e.target.value) }} type="text" placeholder='email' />
          <input onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder='password' />
          <button className='form-button' type="submit">SignIn</button>
          <label >Create account if not exist <a onClick={handleSignUp} href="/signUp">SignUp</a></label>
        </form>
      </div>
    </div>
  )
}
