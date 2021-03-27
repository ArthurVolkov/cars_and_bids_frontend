import { httpService } from './http.service.js'

var gLoggedinUser = JSON.parse(sessionStorage.getItem('loggedinUser'));

export const userService = {
    signUp,
    login,
    getLoggedinUser,
    getUsers,
    logout
}

async function signUp(user) {
    console.log('user in serv signUp:', user)

    const signedUser = await httpService.post('auth/signup', user)
    _handleLoggedinUser(signedUser)
    return signedUser
}
async function login(user) {
    console.log('user in serv signUp:', user)

    const loginedUser = await httpService.post('auth/login', user)
    _handleLoggedinUser(loginedUser)
    return loginedUser
}

async function logout() {
    const logedout = await httpService.post('auth/logout')
    console.log('logedout in user-service:', logedout)
    sessionStorage.clear()
    return logedout
}

async function getUsers() {
    const users = await httpService.get('user/')
//    console.log('loggedinUsers:', users)
    return users
}

function _handleLoggedinUser(user) {
//    gLoggedinUser = user;
    sessionStorage.setItem('loggedinUser', JSON.stringify(user))
    return user;
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem('loggedinUser') || 'null')
}