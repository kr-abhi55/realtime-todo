# realtime-todo
web app to manage todo list  in realtime

![Peek 2023-05-25 05-32](https://github.com/kr-abhi55/realtime-todo/assets/118665057/a515825f-7625-479e-8c8f-7d2533ff6224)

## Features
- [x] SignIn SignUp SignOut 
- [x] realtime update,delete,add,get of todo
- [x] session  system (what happen if user open multiple tab)
- [x] authentication on both REST and WebSocket
- [ ] offline mode
- [ ] update profile like name,email etc
- [ ] password reset/forget system based on email
- [ ] add image to profile
- [ ] collaboration (a user can share with other )
- [ ] add creation of todo list
- [ ] implement animation on add,delete 
- [ ] add sorting system based on creation time,A-Z
- [ ] add drag and drop of todo to change order
## How to
update **.env** in both back and front   
```bash
#must have typescript and nodemon globally installed or install with 
npm i -g typescript nodemon
#open two terminal or tab in project directory
cd back
npm install
#must transpile ts to js by Ctrl+shift+b in vs code or run `tsc --build or tsc --watch in other tab`
npm run dev

#in second terminal or tab
cd front
npm install
npm run dev
```
