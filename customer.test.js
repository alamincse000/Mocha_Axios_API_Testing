const axios = require('axios')
const { expect } = require('chai')
const fs = require('fs')
const { env } = require('process')
const envVariables = require('./env.json')
const { rand } = require('./randomId')
const { faker } = require('@faker-js/faker');
const { Console } = require('console')
const exp = require('constants')
describe('Customer login API', async () => {
    //  create customer login
    it('Customer can do login successfully', async () => {
        var { data } = await axios.post(`${envVariables.baseUrl}/user/login`, {

            "email": "salman@grr.la",
            "password": "1234"
        },
            {
                Headers: {
                    'Content-Type': 'application/json'

                }
            })
        console.log(data)
        envVariables.token = data.token
        fs.writeFileSync('./env.json', JSON.stringify(envVariables))
        expect(data.message).contains('Login successfully')

    })

    var id;
    it("User can view list if having proper authorization", async () => {
        var { data } = await axios.get(`${envVariables.baseUrl}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token
            }
        })
        console.log(data)

        id = data.users[0].id;
        console.log(data.users[0].id)
        expect(data.message).contains('User list')

    })

    it("User can view list if having incorrecet authorization", async () => {
        try {
            await axios.get(`${envVariables.baseUrl}/user/list`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '345345345'
                }

            })
        }
        catch (error) {
            console.log(error);
            expect(error).to.exist;
        }

    })

    it('User can not login if having empty token', async () => {

        try {
            axios.get(`${envVariables.baseUrl}/user/list`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ''

                }


            })
        }
        catch (error) {
            Console.log(Error)
            expect(Error).TO.exist
        }


    })


    it('User can search list if having correct authorization', async () => {
        var { data } = await axios.get(`${envVariables.baseUrl}/user/search?id=${id}`, {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']

            }

        })
        console.log(data.user.id)

    })

    it('Search user for invalid id ', async () => {
        var response = await axios.get(`${envVariables.baseUrl}/user/search?id=34534`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        // console.log(data.user.name);
        expect(response.status).equals(200);
        expect(response.data.user).equals(null)

    })

    it('Search user for invalid secret key', async () => {

        try {
            await axios.get(`${envVariables.baseUrl}/user/search?id=${id}`, {

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token,
                    'X-AUTH-SECRET-KEY': 'kdjggksldfls'

                }
            })
        }

        catch (error) {
            console.log(error)
            expect(error).to.exist

        }
    })

    it('Create new user', async () => {
        var { data } = await axios.post(`${envVariables.baseUrl}/user/create`,
            {
                "name": `${faker.name.firstName()} ${faker.name.lastName()}`,
                "email": `test${rand(10000, 99999)}@test.com`,
                "password": `p@${rand(10000, 99999)}`,
                "phone_number": `017566${rand(10000, 99999)}`,
                "nid": "199582147900",
                "role": "Customer"

            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token,
                    'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']

                }

            })
        console.log(data)
        expect(data.message).contains('User created successfully')
        envVariables.id = data.user.id
        envVariables.name = data.user.name
        envVariables.email = data.user.email
        envVariables.phoneNumber = data.user.phone_number
        fs.writeFileSync('./env.json', JSON.stringify(envVariables))
    })

    it(' Create user for exit', async () => {
        var { data } = await axios.post(`${envVariables.baseUrl}/user/create`,
            {
                id: 173,
                name: 'Vildan',
                email: 'vildan.balaban@example.com',
                password: 'buckley',
                phone_number: '(211)-021-9290',
                nid: 'f3450363-ee39-4b51-bc29-ec0bb322131e',
                role: 'Customer',
                createdAt: '2022-02-08T19:21:18.000Z',
                updatedAt: '2022-02-08T19:21:18.000Z',
                balance: 0

            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token,
                    'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']

                }

            })
        console.log(data)
        // expect(data.status).equals(208)
        expect(data.message).contains('User already exists')


    })


    it('User can do update list', async () => {
        var { data } = await axios.put(`${envVariables.baseUrl}/user/update/${id}`, {
            id: 171,
            name: 'Albert',
            email: 'albert.lynch@example.com',
            password: 'epsilon',
            phone_number: '(666)-034-4140',
            nid: '087a5fa7-4132-4c7f-a519-2bc7aaa05661',
            role: 'Customer'
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token,
                    'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']

                }

            })
        console.log(data)
        expect(data.message).contains('User updated successfully')
    })

    it('User can do patch update list', async () => {
        var { data } = await axios.patch(`${envVariables.baseUrl}/user/update/${id}`, {

            phone_number: '01773003468',

        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token,
                    'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']

                }

            })
        console.log(data)
        expect(data.message).contains('User updated successfully')
    })

    it('User can delete properly', async () => {
        var { data } = await axios.delete(`${envVariables.baseUrl}/user/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']


            }
        })
        console.log(data)
        expect(data.message).contains('User deleted successfully')
    })



})