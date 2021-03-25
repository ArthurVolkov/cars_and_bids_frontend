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
            return state.user
        },
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
            if (state.user) { 
                const userCars = await carService.queryUserCars(state.user._id);
                console.log('USER CARS:',userCars)
                userCars.forEach(car => {
                    car.msgs?.forEach(msg=>{
                        if (msg.by._id !== state.user._id) state.msgs.push(msg)
                    })                
                })
                state.msgs.sort((msg1, msg2) => { return msg2.createdAt - msg1.createdAt })            
            }
        },
        async addUserMsg( {state}, {msg}) {
            if (msg.type === 'car') state.msgs.push(msg)
            else {
                const userCars = await carService.queryUserCars(state.user._id);
                const carFound = userCars.find(car=>{
                    return car._id === msg.carId                
                })
                if (carFound && msg.by._id !== state.user._id) state.msgs.unshift(msg)
            }
        },
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