import { userService } from "../services/user.service";
import { carService } from "../services/car.service";

export const userStore = {
    state: {
        user: null,
        msgs: [],
        loginShown: false,
    },
    getters: {
        loggedinUser(state) {
            // console.log('userService.LoggedinUser:', userService.getLoggedinUser())
            return state.user
        },
        // isAdmin(state) { 
        //     return state.user.isAdmin
        // },
        loginShown({loginShown}) {
            return loginShown
        },
        userMsgs({msgs}) {
            return msgs;
        }
    },
    mutations: {
        toggleLogin(state, {isShown}) {
            state.loginShown = isShown
            console.log('state.loginShown:', state.loginShown)
        },
    },
    actions: {
        async getUserMsgs({state}) {
            state.msgs = []
            const userCars = await carService.queryUserCars(state.user._id);
            console.log('USER CARS:',userCars)
            userCars.forEach((car,idx) => {
                console.log(car,idx)
                car.msgs?.forEach(msg=>{
                    console.log(msg)
                    if (msg.by._id !== state.user._id) state.msgs.push(msg)
                })                
            })
        },
        async addUserMsg( {state}, {msg}) {
            if (msg.type === 'car') state.msgs.push(msg)
            else {
                const userCars = await carService.queryUserCars(state.user._id);
                const carFound = userCars.find(car=>{
                    return car._id === msg.carId                
                })
                if (carFound && msg.by._id !== state.user._id) state.msgs.push(msg)
            }
        },

        ///TODO SORT
        async getLoggedinUser({state}) {
            state.user = await userService.getLoggedinUser()
        },
        async signUp(context, { user }) {
            console.log('user in store signUp:', user)
            try {
                const signupedUser = await userService.signUp(user)
                context.state.user = await userService.getLoggedinUser()
                return signupedUser
            } catch (err) {
                throw err
            }

        },
        async login(context, { user }) {
            console.log('user in store login:', user)
            try {
                const loggedinUser = await userService.login(user)
                context.state.user = await userService.getLoggedinUser()
                return loggedinUser
            } catch (err) {
                throw err
            }

        },
        async logout(context) {
            console.log('store logout:')
            try {
                const logout = await userService.logout()
                context.state.user = null
                console.log('logout:', logout)
                return logout
            } catch (err) {
                throw err
            }
        }
    }
}