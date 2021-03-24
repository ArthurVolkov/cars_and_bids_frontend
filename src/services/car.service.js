// import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

const vendors = ['Audi', 'BMW', 'Golf', 'Mazda', 'Ferari']
const bodyStyles = ['Coupe', 'Sedan', 'Truck', 'Hatchback'];
const transmissions = ['Automatic', 'Manual', 'Robotic'];
const drivetrains = ['Rear-wheel drive', 'Front-wheel drive', 'All-wheel drive'];
const colors = ['Blue', 'Black', 'Red', 'Yellow', 'Green', 'Gray'];

const usersDemo =
    [
        {
            "_id": "u101",
            "fullname": "Shuki ben Shuki",
            "imgUrl": "/img/img1.jpg",
            "isAdmin": false,
            "username": "a",
            "password": "a"
        },
        {
            "_id": "u102",
            "fullname": "Puki ben Puki",
            "imgUrl": "/img/img2.jpg",
            "isAdmin": false,
            "username": "b",
            "password": "b"
        },
        {
            "_id": "u103",
            "fullname": "Muki ben Muki",
            "imgUrl": "/img/img3.jpg",
            "isAdmin": false,
            "username": "c",
            "password": "c"
        },
        {
            "_id": "u104",
            "fullname": "Cooki ben Cooki",
            "imgUrl": "/img/img4.jpg",
            "isAdmin": false,
            "username": "d",
            "password": "d"
        },
        {
            "_id": "u105",
            "fullname": "Ruti be Ruti",
            "imgUrl": "/img/img5.jpg",
            "isAdmin": true,
            "username": "e",
            "password": "e"
        }
    ]

const CAR_KEY = 'cars'
const CAR_URL = '//localhost:3030/api/car/'

// save(_createDemoCar1());
// save(_createDemoCar2());
// save(_createDemoCar3());
// save(_createDemoCar4());
// save(_createDemoCar5());
// save(_createDemoCar6());


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
    getEmptyFilter
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
    var queryStr = (!userId) ? '' : `?userId=${userId}`
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
        return await httpService.post('car', car)
    }
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


function _createCar() {
    const startPrice = makeRandomInt(20000, 40000)
    const car = {
        id: makeId(),
        vendor: makeRandom(vendors),
        model: makeId(4),
        bodyStyle: makeRandom(bodyStyles),
        year: makeRandomInt(2010, 2021),
        transmission: makeRandom(transmissions),
        drivetrain: makeRandom(drivetrains),
        mileage: makeRandomInt(45000, 70000),
        engine: '3.0L I-6',
        exteriorColor: makeRandom(colors),
        interiorColor: makeRandom(colors),
        desc: 'very nice car',
        equipments: ['equip1', 'equip2', 'equip3', 'equip4'],
        owner: makeRandomUser(usersDemo),
        imgUrls: ['shop.jpg', 'more1.jpg', 'more2.jpg'],
        location: {
            address: "Tel-Aviv, Rotshild 25",
            lat: 32.9898,
            lng: 12.28
        },
        comments: [
            {
                id: makeId(4),
                txt: "if i had the cash Id still be bidding",
                by: makeRandomUser(usersDemo),
                createdAt: Date.now()
            },
            {
                id: makeId(4),
                txt: "if i had the cash Id still be bidding",
                by: makeRandomUser(usersDemo)
            },
            {
                id: makeId(4),
                txt: "if i had the cash Id still be bidding",
                by: makeRandomUser(usersDemo)
            }
        ],
        auction:
        {
            startPrice: startPrice,
            status: 'active',
            createdAt: Date.now(),
            duration: 1000 * 60 * 60 * 24 * 7,
            bids: [
                {
                    id: makeId(4),
                    by: makeRandomUser(usersDemo),
                    bidPrice: startPrice + makeRandomInt(30001, 40000),
                    createdAt: Date.now() + 1000 * 60 * 60 * 24
                },
                {
                    id: makeId(4),
                    by: makeRandomUser(usersDemo),
                    bidPrice: startPrice + makeRandomInt(20001, 30000),
                    createdAt: Date.now() + 1000 * 60 * 60 * 24 * 2
                },
                {
                    id: makeId(4),
                    by: makeRandomUser(usersDemo),
                    bidPrice: startPrice + makeRandomInt(10001, 20000),
                    createdAt: Date.now() + 1000 * 60 * 60 * 24 * 3
                },
            ],
        }
    }
    return car
}

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function makeRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function makeRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeRandomUser(users = usersDemo) {
    const idx = makeRandomInt(0, users.length - 1);
    var minimalUser = {
        _id: users[idx]._id,
        fullname: users[idx].fullname,
        imgUrl: users[idx].imgUrl
    }
    return minimalUser
}

function _createDemoCar1() {
    const startPrice = makeRandomInt(20000, 40000)
    const _id = '11111'
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
        desc: 'very nice carTHIS... is a 2014 BMW 550i xDrive, finished in Carbon Black with a black leather interior.',
        equipments: [
            'M Sport Package (19-inch wheels, M Sport body kit, LED fog lights, Shadowline exterior trim, aluminum-look interior trim, M steering wheel, and anthracite headliner)',
            'Executive Package (Comfort Access keyless entry, soft-close doors, power-operated trunk lid, head-up display, and Harman-Kardon surround-sound system)equip2',
            'Cold Weather Package (heated front and rear seats, heated steering wheel, and retractable headlight washers)',
            'Adaptive headlights'],
        owner: makeRandomUser(usersDemo),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/4.jpg',
            'images/' + _id + '/1.jpg'
        ],
        location: {
            address: 'Chicago, IL 60634',
            lat: 41.950401,
            lng: -87.793808
        },
        comments: [],
        likes:[],
        auction:
        {
            startPrice: startPrice,
            status: 'active',
            createdAt: Date.now() - 604800000 + 1000 * 60 * 14,
            duration: 1000 * 60 * 60 * 24 * 7,
            bids: []
        }
    }
    return car
}

function _createDemoCar2() {
    const startPrice = makeRandomInt(20000, 40000)
    const _id = '22222'
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
        equipments: [
            '19-inch alloy wheels',
            '6-speed Tiptronic automatic transmission with shift paddles',
            'Electronic Differential Lock (EDL)',
            'Sport-tuned suspension'],
        owner: makeRandomUser(usersDemo),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Martinez, CA 94553',
            lat: 37.992489,
            lng: -122.114357
        },
        comments: [],
        likes:[],
        auction:
        {
            startPrice: startPrice,
            status: 'active',
            createdAt: Date.now() - 604800000 + 1000 * 60 * 46,
            duration: 1000 * 60 * 60 * 24 * 7,
            bids: []
        }
    }
    return car
}

function _createDemoCar3() {
    const startPrice = makeRandomInt(20000, 40000)
    const _id = '33333'
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
        equipments: [
            '17-inch wheels',
            '5-speed manual transmission',
            'Cloth soft top',
            'Leather upholstery'],
        owner: makeRandomUser(usersDemo),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Austin, TX 78750',
            lat: 30.430460,
            lng: -97.804008
        },
        comments: [],
        likes:[],
        auction:
        {
            startPrice: startPrice,
            status: 'active',
            createdAt: Date.now() - 604800000 + 1000 * 60 * 60 * 3,
            duration: 1000 * 60 * 60 * 24 * 7,
            bids: []
        }
    }
    return car
}

function _createDemoCar4() {
    const startPrice = makeRandomInt(20000, 40000)
    const _id = '44444'
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
        equipments: [
            'Driving Assistance Plus (Active Driving Assistant Plus)',
            '20-inch M light-alloy wheels',
            '8-speed M Steptronic automatic transmission',
            'M carbon ceramic brakes'],
        owner: makeRandomUser(usersDemo),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Humble, TX 77346',
            lat: 29.988130,
            lng: -95.175490
        },
        comments: [],
        likes:[],
        auction:
        {
            startPrice: startPrice,
            status: 'active',
            createdAt: Date.now() - 604800000 + 1000 * 60 * 60 * 12,
            duration: 1000 * 60 * 60 * 24 * 7,
            bids: []
        }
    }
    return car
}

function _createDemoCar5() {
    const startPrice = makeRandomInt(20000, 40000)
    const _id = '55555'
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
        equipments: [
            '7-speed S tronic dual-clutch automatic transmission',
            'Quattro all-wheel-drive system with sports differential',
            'Xenon headlights',
            'Panoramic glass sunroof'],
        owner: makeRandomUser(usersDemo),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Clayton, NC 27527',
            lat: 35.648659,
            lng: -78.385597
        },
        comments: [],
        likes:[],
        auction:
        {
            startPrice: startPrice,
            status: 'active',
            createdAt: Date.now() - 604800000 + 1000 * 60 * 60 * 24 * 2,
            duration: 1000 * 60 * 60 * 24 * 7,
            bids: []
        }
    }
    return car
}

function _createDemoCar6() {
    const startPrice = makeRandomInt(20000, 40000)
    const _id = '66666'
    const car = {
        vendor: 'Mercedes-Benz',
        model: 'G550',
        bodyStyle: 'SUV',
        year: 2017,
        transmission: 'Automatic',
        drivetrain: '4WD/AWD',
        mileage: 5500,
        engine: '4.0L Turbocharged V8',
        exteriorColor: 'Obsidian Black Metallic',
        interiorColor: 'Black',
        desc: 'THIS... is a 2017 Mercedes-Benz G550 4×4², finished in Obsidian Black with a black interior.',
        equipments: [
            '22-inch wheels',
            'Adjustable suspension system',
            'Portal axles',
            'AMG carbon fiber exterior trim'],
        owner: makeRandomUser(usersDemo),
        imgUrls: [
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/2.jpg',
            'images/' + _id + '/3.jpg',
            'images/' + _id + '/1.jpg',
            'images/' + _id + '/4.jpg'],
        location: {
            address: 'Fort Worth, TX 76108',
            lat: 35.648659,
            lng: -78.385597
        },
        comments: [],
        likes:[],
        auction:
        {
            startPrice: startPrice,
            status: 'active',
            createdAt: Date.now() - 604800000 + 1000 * 60 * 60 * 24 * 4,
            duration: 1000 * 60 * 60 * 24 * 7,
            bids: []
        }
    }
    return car
}
