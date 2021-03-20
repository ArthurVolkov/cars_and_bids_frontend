import { httpService } from './http.service.js'




// Ben Oliver
// Shannon Bishop
// Christine Hale
// Amelia Davis
// Donald Rhodes
// Bryan Williams
// Tom Grant
// Nathaniel Steward
// Alice Sutton
// Brent Martinez















// var gLoggedinUser = JSON.parse(sessionStorage.getItem('loggedinUser'));

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
    // _handleLoggedinUser(signedUser)
    return signedUser

    // var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&inStock=${filterBy.inStock}&type=${filterBy.type}`
    // const cars = await httpService.get(`car${queryStr}`)
    // console.log('cars:', cars)
    // return cars
}
async function login(user) {
    console.log('user in serv signUp:', user)

    const loginedUser = await httpService.post('auth/login', user)
    // _handleLoggedinUser(loginedUser)
    return loginedUser

    // var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&inStock=${filterBy.inStock}&type=${filterBy.type}`
    // const cars = await httpService.get(`car${queryStr}`)
    // console.log('cars:', cars)
    // return cars
}

async function logout() {
    const logedout = await httpService.post('auth/logout')
    console.log('logedout in user-service:', logedout)
    // _handleLoggedinUser(null)
    return logedout
}

async function getLoggedinUser() {
    const loggedinUser = await httpService.get('auth/user')
    console.log('loggedinUser:', loggedinUser)
    return loggedinUser
}

async function getUsers() {
    const users = await httpService.get('user/')
    console.log('loggedinUsers:', users)
    return users
}


// function _handleLoggedinUser(user) {
//     gLoggedinUser = user;
//     console.log('user:', user)
//     sessionStorage.setItem('loggedinUser', JSON.stringify(user))
//     return user;
// }
