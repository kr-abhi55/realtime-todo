import { useEffect, useState } from 'react'
import './App.css'
import Utils from './Utils'
import Todo from './todo/Todo'

function SignIn({ onSignUp, onTodoApp }) {
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
    <div className='form-box'>
      <form className='flex-h ' onSubmit={handleSubmit} >
        <label htmlFor="">SignIn</label>
        <input onChange={(e) => { setEmail(e.target.value) }} type="text" placeholder='email' />
        <input onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder='password' />
        <button type="submit">SignIn</button>
      </form>
      <a onClick={handleSignUp} href="/signUp">SignUp</a>
    </div>
  )
}


function SignUp({ onSignIn }) {
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

    <div className='form-box'>
      SignUp
      <form
        className='flex-h '
        onSubmit={handleSubmit} >
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
            value={gender}
            onChange={(e) => { setGender(e.target.value) }}
          >
            <option >Male</option>
            <option >Female</option>
            <option >Others</option>
          </select>
        </label>
        <button type="submit">SignUp</button>
      </form>
      <a onClick={handleSignIn} href="/signIn">SignIn</a>
    </div>
  )
}


function TodoApp({ onSignIn }) {
  const [items, setItems] = useState(["home", "office", "d"])
  const [userInfo, setUserInfo] = useState({ name: undefined, age: undefined, email: undefined, _id: undefined })
  function handleSignOut() {
    Utils.deleteToken()
    onSignIn()
  }
  useEffect(() => {
    //get user details
    (async () => {
      const token = Utils.getToken()
      if (token) {
        const { error, result } = await Utils.getJson("/user/info", "", token)
        setUserInfo(result)
      } else {
        onSignIn()
      }
    })()
  }, [])
  function add() {
    setItems([...items, "Ok"])
  }
  return (
    <div >
      <button onClick={add}>Add</button>
      <button onClick={handleSignOut}>SignOut</button>
      <div>{userInfo.name} {userInfo.email} {userInfo.age}</div>
      <Todo info={userInfo} items={items} handleSetItems={setItems} />
    </div>
  )
}
function App() {
  //signIn signUp todoApp
  const [currentRoute, setCurrentRoute] = useState("signIn")

  return (
    <div>
      {
        currentRoute == 'signIn' &&
        <SignIn
          onSignUp={() => { setCurrentRoute("signUp") }}
          onTodoApp={() => { setCurrentRoute("todoApp") }}
        />
      }
      {
        currentRoute == 'signUp' &&
        <SignUp
          onSignIn={() => { setCurrentRoute("signIn") }}
        />
      }
      {
        currentRoute == 'todoApp' &&
        <TodoApp
          onSignIn={() => { setCurrentRoute("signIn") }}
        />}
    </div>
  )
}

export default App
