import { faker } from '@faker-js/faker';
import{getRandomBuyers} from '../../services/buyer-service.js'
import{createSeller,getSellerByEmail} from '../../services/seller-service.js'
import { BadRequestError } from '@sachinsingh53/jobber-shared';
import { v4 as uuidv4 } from 'uuid'; 

import { StatusCodes } from 'http-status-codes';

const seed = async (req, res) => {
    const { count } = req.params;
    const buyers = await getRandomBuyers(parseInt(count, 10));
    
    for (let i = 0; i < buyers.length; i++) {
        const buyer = buyers[i];
        const checkIfSellerExist = await getSellerByEmail(`${buyer.email}`);
        if (checkIfSellerExist) {
            throw new BadRequestError('Seller already exist.', 'SellerSeed seller() method error');
        }
        const basicDescription = faker.commerce.productDescription();
        const skills = ['Programming', 'Web development', 'Mobile development', 'Proof reading', 'UI/UX', 'Data Science', 'Financial modeling', 'Data analysis'];
        const seller = {
            profilePublicId: uuidv4(),
            fullName: faker.person.fullName(),
            username: buyer.username,
            email: buyer.email,
            description: basicDescription.length <= 250 ? basicDescription : basicDescription.slice(0, 250),
            oneliner: faker.word.words({ count: { min: 5, max: 10 } }),
            skills: skills.slice(0, Math.floor(Math.random() * 4) + 1),
            languages: [
                { 'language': 'English', 'level': 'Native' },
                { 'language': 'Spnish', 'level': 'Basic' },
                { 'language': 'German', 'level': 'Basic' },
            ],
            responseTime: parseInt(faker.commerce.price({ min: 1, max: 5, dec: 0 })),
            experience: randomExperiences(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
            education: randomEducation(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
            socialLinks: ['https://kickchatapp.com', 'http://youtube.com', 'https://facebook.com'],
            certificates: [
                {
                    'name': 'Flutter App Developer',
                    'from': 'Flutter Academy',
                    'year': 2021
                },
                {
                    'name': 'Android App Developer',
                    'from': '2019',
                    'year': 2020
                },
                {
                    'name': 'IOS App Developer',
                    'from': 'Apple Inc.',
                    'year': 2019
                }
            ]
        };

        await createSeller(seller);
    }
    res.status(StatusCodes.CREATED).json({ message: 'Sellers created successfully' });
};



const randomExperiences = (count) => {
    const result = [];
    for (let i = 0; i < count; i++) {
        const randomStartYear = [2020, 2021, 2022, 2023, 2024, 2025];
        const randomEndYear = ['Present', '2024', '2025', '2026', '2027'];
        const endYear = randomEndYear[Math.floor(Math.random(0.9) * randomEndYear.length)];
        const experience = {
            company: faker.company.name(),
            title: faker.person.jobTitle(),
            startDate: `${faker.date.month()} ${randomStartYear[Math.floor(Math.random(0.9) * randomStartYear.length)]}`,
            endDate: endYear === 'Present' ? 'Present' : `${faker.date.month()} ${endYear}`,
            description: faker.commerce.productDescription().slice(0, 100),
            currentlyWorkingHere: endYear === 'Present'
        };
        result.push(experience);
    }
    return result;
};

const randomEducation = (count) => {
    const result = [];
    for (let i = 0; i < count; i++) {
        const randomYear = [2020, 2021, 2022, 2023, 2024, 2025];
        const education = {
            country: faker.location.country(),
            university: faker.person.jobTitle(),
            title: faker.person.jobTitle(),
            major: `${faker.person.jobArea()} ${faker.person.jobDescriptor()}`,
            year: `${randomYear[Math.floor(Math.random(0.9) * randomYear.length)]}`,
        };
        result.push(education);
    }
    return result;
};

export {
    seed
}