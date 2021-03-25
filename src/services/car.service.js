// import { utilService } from './util.service.js'
import { httpService } from './http.service.js'
import { userService} from './user.service.js'

const vendors = ['Audi', 'BMW', 'Golf', 'Mazda', 'Ferari']
const bodyStyles = ['Coupe', 'Sedan', 'Truck', 'Hatchback'];
const transmissions = ['Automatic', 'Manual', 'Robotic'];
const drivetrains = ['Rear-wheel drive', 'Front-wheel drive', 'All-wheel drive'];
const colors = ['Blue', 'Black', 'Red', 'Yellow', 'Green', 'Gray'];


const CAR_KEY = 'cars'
const CAR_URL = '//localhost:3030/api/car/'

// createDemoData()

async function createDemoData(){
    save(await _createDemoCar1());
    save(await _createDemoCar2());
    save(await _createDemoCar3());
    save(await _createDemoCar4());
    save(await _createDemoCar5());
    save(await _createDemoCar6());
    save(await _createDemoCar7());
    save(await _createDemoCar8());
    save(await _createDemoCar9());    
}


//_createCars()
var gFilterBy = { name: '', pageIdx: 0 }

export const carService = {
    query,
    queryUserCars,
    save,
    getEmptyCar,
    getById,
    // setFilter,
    // nextPage,
    makeId,
    makeRandomUser,
    getBodyStyleList,
    getVendorList,
    getTransmissionList,
    getDrivetrainList,
    saveComment,
    saveBid,
    saveLike,
    removeLike,
    getEmptyFilter,
    getLastBid
    // getCarsCountByUserId
}

// function setFilter(filterBy) {
//     gFilterBy.title = filterBy.title
//     gFilterBy.pageIdx = 0;
// }
// function nextPage() {
//     gFilterBy.pageIdx++
// }

async function query(filterBy) {
    var currFiletr = JSON.parse(JSON.stringify(filterBy))
    if (!filterBy.name) currFiletr.name = ''
    if (!filterBy.bodyStyles) currFiletr.bodyStyles = 'all'
    if (filterBy.bodyStyles === 'All') currFiletr.bodyStyles = 'all'
    if (!filterBy.vendors || !filterBy.vendors.length) currFiletr.vendors = ['all']
    if (!filterBy.byYears) currFiletr.byYears = [1970, 2021]
    if (!filterBy.sortBy) currFiletr.sortBy = 'ending-soon'

    var queryStr = (!filterBy) ? '' : `?name=${currFiletr.name}&bodyStyles=${currFiletr.bodyStyles}&vendors=${currFiletr.vendors}&years=${currFiletr.byYears}&pageIdx=${currFiletr.pageIdx}&pageSize=${currFiletr.pageSize}&sortBy=${currFiletr.sortBy}`
    const data = await httpService.get(`car${queryStr}`)
    return data
}

async function queryUserCars(userId) {
    // var queryStr = (!userId) ? '' : `?userId=${userId}`
    if (!userId) userId = ''
    const data = await httpService.get(`car/user/${userId}`)
    return data
}

async function getById(carId) {
    const car = await httpService.get(`car/${carId}`)
    return car
}

async function saveComment(comment) {
    const res = await httpService.post('car/comment', comment)
    return res
}

async function saveBid(bid) {
    return await httpService.post('car/bid', bid)
}

async function saveLike(like) {
    const res = await httpService.post('car/like', like)
    return res
}

async function removeLike(like) {
    return httpService.delete(`car/like/${like.carId}`)
}

async function save(car) {
    if (car._id) {
        return await httpService.put('car', car)
    } else {
        console.log('KKKKKKKKKKKKK',car)
        return await httpService.post('car', car)
    }
}

function getLastBid(car) {
    if (car.auction.bids.length) return car.auction.bids[0].price
    else return car.auction.startPrice
}

function getVendorList() {
    var vendors = ["Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "Daewoo", "Daihatsu", "Dodge", "Donkervoort", "DS", "Ferrari", "Fiat", "Fisker", "Ford", "Honda", "Hummer", "Hyundai", "Infiniti", "Iveco", "Jaguar", "Jeep", "Kia", "KTM", "Lada", "Lamborghini", "Lancia", "Land Rover", "Landwind", "Lexus", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Morgan", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Rover", "Saab", "Seat", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"]
    return vendors.map(item => { return { value: item, label: item } })
}

function getBodyStyleList() {
    var bodyStyles = ['All', 'Coupe', 'Convertible', 'Sedan', 'SUV/Crossover', 'Hatchback']
    return bodyStyles.map(item => { return { value: item, label: item } })
}

function getTransmissionList() {
    return transmissions.map(item => { return { value: item, label: item } })
}

function getDrivetrainList() {
    return drivetrains.map(item => { return { value: item, label: item } })
}

function getEmptyFilter() {
    return {
        byYears: [1970, 2021],
        year: {
            from: 0,
            to: 2021
        },
        years: [1970, 2021],
        bodyStyles: '',
        vendors: [],
        sortBy: '',
    }
}

function getEmptyCar() {
    return {
        vendor: '',
        model: '',
        bodyStyle: '',
        year: null,
        transmission: '',
        drivetrain: '',
        mileage: 0,
        engine: '',
        exteriorColor: '',
        interiorColor: '',
        desc: '',
        equipments: [],
        owner: {},
        imgUrls: [],
        location: {
            address: '',
            lat: 0,
            lng: 0
        },
        comments: [],
        likes: [],
        auction:
        {
            bids: [],
            startPrice: 0,
            status: 'active',
            createdAt: null,
            duration: 1000 * 60 * 60 * 24 * 7
        }
    }
}

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function makeRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function makeRandomUser() {
    var users = await userService.getUsers();
    const idx = makeRandomInt(0, users.length - 1);
    var minimalUser = {
        _id: users[idx]._id,
        fullname: users[idx].fullname,
        imgUrl: users[idx].imgUrl
    }
    return minimalUser
}

async function _createDemoCar1() {
    const _id = '1'
    const car = {
        vendor: 'BMW',
        model: '550i',
        bodyStyle: 'Sedan',
        year: 2014,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 91100,
        engine: '4.4L Turbocharged V8',
        exteriorColor: 'Carbon Black Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2014 BMW 550i xDrive, finished in Carbon Black with a black leather interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/4.jpg',
            'images/' + _id + '/1.jpg'
        ],
        location: {
            address: 'Chicago, IL 60634',
        },
        fake: true
    }
    return car
}

async function _createDemoCar2() {
    const _id = '2'
    const car = {
        vendor: 'Audi',
        model: 'S6',
        bodyStyle: 'Sedan',
        year: 2008,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 135700,
        engine: '5.2L V10',
        exteriorColor: 'Quartz Gray Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2008 Audi S6, finished in Quartz Gray Metallic with a black leather interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Martinez, CA 94553',
        },
        fake: true
    }
    return car
}

async function _createDemoCar3() {
    const _id = '3'
    const car = {
        vendor: 'Porsche',
        model: 'Boxster',
        bodyStyle: 'Convertible',
        year: 1998,
        transmission: 'Manual',
        drivetrain: 'Rear-wheel drive',
        mileage: 132300,
        engine: '2.5L Flat-6',
        exteriorColor: 'Guards Red',
        interiorColor: 'Savannah Beige',
        desc: 'THIS... is a 1998 Porsche Boxster, finished in Guards Red with a beige cloth soft top and a Savannah Beige leather interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Austin, TX 78750',
        },
        fake: true
    }
    return car
}

async function _createDemoCar4() {
    const _id = '4'
    const car = {
        vendor: 'BMW',
        model: 'M5',
        bodyStyle: 'Sedan',
        year: 2018,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 14000,
        engine: '4.4L Turbocharged V8',
        exteriorColor: 'Marina Bay Blue',
        interiorColor: 'Silverstone',
        desc: 'THIS... is a 2018 BMW M5, finished in Marina Bay Blue with a Silverstone full leather interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Humble, TX 77346',
        },
        fake: true
    }
    return car
}

async function _createDemoCar5() {
    const _id = '5'
    const car = {
        vendor: 'Audi',
        model: 'S5',
        bodyStyle: 'Coupe',
        year: 2013,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 87400,
        engine: '3.0L Supercharged V6',
        exteriorColor: 'Ibis White',
        interiorColor: 'Black/Magma Red',
        desc: 'THIS... is a 2013 Audi S5 coupe, finished in Ibis White with a black and Magma Red leather interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Clayton, NC 27527',
        },
        fake: true
    }
    return car
}

async function _createDemoCar6() {
    const _id = '6'
    const car = {
        vendor: 'Mercedes-Benz',
        model: 'G550',
        bodyStyle: 'SUV/Crossove',
        year: 2017,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 5500,
        engine: '4.0L Turbocharged V8',
        exteriorColor: 'Obsidian Black Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2017 Mercedes-Benz G550 4×4², finished in Obsidian Black with a black interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Fort Worth, TX 76108',
        },
        fake: true
    }
    return car
}

async function _createDemoCar7() {
    const _id = '7'
    const car = {
        vendor: 'Tesla',
        model: 'Model Y',
        bodyStyle: 'SUV/Crossove',
        year: 2020,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 3400,
        engine: 'Dual Motors',
        exteriorColor: 'Solid Black',
        interiorColor: 'White/Black',
        desc: 'THIS... is a 2020 Tesla Model Y, finished in Solid Black with a white and black interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Greensboro, NC 27410',
        },
        fake: true
    }
    return car
}

async function _createDemoCar8() {
    const _id = '8'
    const car = {
        vendor: 'Porsche',
        model: '911',
        bodyStyle: 'Convertible',
        year: 2004,
        transmission: 'Manual',
        drivetrain: '4WD/AWD',
        mileage: 45100,
        engine: '3.6L Flat-6',
        exteriorColor: 'Black',
        interiorColor: 'Black',
        desc: 'THIS... is a 2004 Porsche 911 Carrera 4S Cabriolet, finished in black with a black cloth soft top and a black leather interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Santa Barbara, CA 93101',
        },
        fake: true
    }
    return car
}

async function _createDemoCar9() {
    const _id = '9'
    const car = {
        vendor: 'Aston Martin',
        model: 'V8 Vantage',
        bodyStyle: 'Convertible',
        year: 2009,
        transmission: 'Automatic',
        drivetrain: 'Rear-wheel drive',
        mileage: 44500,
        engine: '4.7L V8',
        exteriorColor: 'Titanium Silver Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2009 Aston Martin V8 Vantage Roadster, finished in Titanium Silver Metallic with a black interior.',
        owner: await makeRandomUser(),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'North Hollywood, CA 91605',
        },
        fake: true
    }
    return car
}
