
import express from 'express'
import { VerifyLoginInfo } from '../JWTAuthHelper.js'
import User from '../models/User.js'
import Utils from '../Utils.js'
const todoRouter = express.Router()
//{error,message,result}
todoRouter.get('/', (req, res) => {
    res.send("<h1>Nothing here</h1>")
})
todoRouter.get('/result', (req, res) => {
    res.json({
        result: {
            name: "info"
        }
    })
})
todoRouter.get('/error', (req, res) => {
    res.json({
        error: "some error"
    })
})
todoRouter.post("/verify", async (req, res) => {
    res.send(req.headers)
})
todoRouter.get('/user/info', VerifyLoginInfo(), async (req, res) => {
    const { _id: id, email } = req.user as any
    const user = await User.findOne({ loginInfo: id }) as any
    const result = {
        _id: user._id,
        age: user.age,
        gender: user.gender,
        email: email,
        name: user.name
    }
    res.status(200).json({ result })

})
todoRouter.post("/sign-in", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "required all input" })
    }
    const { result, error } = await Utils.postJson("/auth/login", { email, password })
    if (error) {
        return res.status(400).json({ error })
    }
    return res.status(200).json({ result: result, message: "login success " })

})
todoRouter.post('/sign-up', async (req, res) => {
    const { email, password, name, age, gender } = req.body
    //post to /auth/register if success create user
    if (!email || !password || !name || !age || !gender) {
        return res.status(400).json({ error: "required all input" })
    }

    const { result, error } = await Utils.postJson("/auth/register", { email, password })
    if (error) {
        return res.status(400).json({ error })
    }
    const user = new User({
        name: name,
        age: age,
        gender: gender,
        loginInfo: result._id
    })
    user.save()
    return res.status(200).json({ result: user, message: "created " })
})
// todoRouter.get("/todo", VerifyLoginInfo(), async (req, res) => {

// })
todoRouter.get("/todos", VerifyLoginInfo(), async (req, res) => {

})
todoRouter.post("/todos", VerifyLoginInfo(), async (req, res) => {
    const { _id, email } = req.user as any
    console.log(_id, email)
    res.send({ result: "ok" })
})
todoRouter.get("/todos/:id", VerifyLoginInfo(), async (req, res) => {

})
todoRouter.put("/todos/:id", VerifyLoginInfo(), async (req, res) => {

})
todoRouter.delete("/todos/:id", VerifyLoginInfo(), async (req, res) => {

})
export default todoRouter