import { carService } from "../services/car.service";

export const carStore = {
    state: {
        cars: [],
        carsCount: 0,
  
        filterBy: {
            pageIdx: 0,
            pageSize: 9,
        },
        isLoading: false,
    },
    getters: {
        carsCount(state) {
            return state.carsCount
        },
        carsToShow(state) {
            return state.cars
        },
        carsToShowHome(state) {
            return state.cars.slice(0, 5)
        },
        commentsToShow(state) {
            return state.comments
        },
        loading(state) {
            return state.isLoading
        },
        filterBy(state) {
            return state.filterBy
        }
    },
    mutations: {
        setCars(state, { cars }) {
            state.cars = cars;
        },
        setCar(state, { car }) {
            var idx = state.cars.findIndex(currCar => {
                return currCar._id === car._id
            })
            state.cars.splice(idx,1,car);
        },
        setCount(state, { count }) {
            state.carsCount = count;
        },
        addCar(state, { car }) {
            state.cars.unshift(car);
        },
        setFilter(state, { filterBy }) {
            if (filterBy.byYears) state.filterBy.byYears = filterBy.byYears;
            if (filterBy.bodyStyles) state.filterBy.bodyStyles = filterBy.bodyStyles;
            if (filterBy.vendors) state.filterBy.vendors = filterBy.vendors;
            console.log(state.filterBy)
        },
        setFilterName(state, { name }) {
            state.filterBy.name = name;
            console.log(state.filterBy)
        },
        // setPage(state, { page }) {
        //     console.log('page:', page)
        //     console.log('filterBy:', state.filterBy)
        //     state.filterBy.pageIdx = page - 1
        // },
        setSort(state, { sortBy }) {
            state.filterBy.sortBy = sortBy
        },
        setLoading(state, { isLoading }) {
            state.isLoading = isLoading
        },
    },
    actions: {
        async loadCars(context) {
            context.commit({ type: 'setLoading', isLoading: true })
            try {
                const data = await carService.query(context.state.filterBy)
                const cars = data[0];
                const count = data[1];
                // console.log('cars', cars)
                context.commit({ type: 'setCars', cars });
                context.commit({ type: 'setCount', count });
            } catch (err) {
                console.log('Store: Cannot load cars', err);
                throw new Error('Cannot load cars');
            } finally {
                context.commit({ type: 'setLoading', isLoading: false })
            }
        },
        async saveCar({ commit }, { car }) {
            const type = (car._id) ? 'updateCar' : 'addCar';
            try {
                const savedCar = await carService.save(car)
                commit({ type, car: savedCar })
                return savedCar

            } catch (err) {
                console.log('Store: Cannot save car', err);
                throw new Error('Cannot save car');
            }
        },
        // async removeCar(context, payload) {
        //     try {
        //         const removed = await carService.remove(payload.car._id)
        //         context.commit(payload)
        //         return removed
        //     } catch (err) {
        //         console.log('Store: Cannot remove car', err);
        //         throw new Error('Cannot remove car');
        //     }
        // },
        async addComment(context, { comment }) {
            try {
                return await carService.saveComment(comment)
            } catch (err) {
                console.log('Store: Cannot save review', err);
                throw new Error('Cannot save review');
            }
        },
        async addBid(context, { bid }) {
            try {
                return await carService.saveBid(bid)
            } catch (err) {
                console.log('Store: Cannot save review', err);
                throw new Error('Cannot save review');
            }
        },
        async addLike(context, { like }) {
            try {
                return await carService.saveLike(like)
            } catch (err) {
                console.log('Store: Cannot save like', err);
                throw new Error('Cannot save like');
            }
        },
        async removeLike(context, { like }) {
            try {
                await carService.removeLike(like)
            } catch (err) {
                console.log('Store: Cannot save like', err);
                throw new Error('Cannot save like');
            }
        },
    }
}