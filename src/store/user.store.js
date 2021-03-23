import { userService } from "../services/user.service";

export const userStore = {
    state: {
        user: null,
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
        }
    },
    mutations: {
        toggleLogin(state, {isShown}) {
            state.loginShown = isShown
            console.log('state.loginShown:', state.loginShown)
        }
    },
    actions: {
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