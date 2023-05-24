import { useEffect, useRef, useState } from 'react'
import SignIn from './page/SignIn'
import SignUp from './page/SignUp'
import MainPage from './page/MainPage'
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
        <MainPage
          onSignIn={() => { setCurrentRoute("signIn") }}
        />}
    </div>
  )
}

export default App
