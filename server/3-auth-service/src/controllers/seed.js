import crypto from 'crypto';
import { createUser, getUserByUsernameOrEmail } from '../services/auth-service.js';
import { faker } from '@faker-js/faker';
import { BadRequestError} from '@sachinsingh53/jobber-shared';
import{firstLetterUppercase, lowerCase } from '@sachinsingh53/jobber-shared'
import { generateUsername } from 'unique-username-generator';
import { v4 as uuidV4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

async function create(req, res) {
  const { count } = req.params;
  const usernames = [];
  
  for (let i = 0; i < parseInt(count, 10); i++) {
    const username = generateUsername('', 0, 12);
    usernames.push(firstLetterUppercase(username));
  }

  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    const email = faker.internet.email();
    const password = 'qwerty';
    const country = faker.location.country();
    const profilePicture = faker.image.urlPicsumPhotos();
    const checkIfUserExist = await getUserByUsernameOrEmail(username, email);
    
    if (checkIfUserExist) {
      throw new BadRequestError('Invalid credentials. Email or Username', 'Seed create() method error');
    }
    
    const profilePublicId = uuidV4();
    const randomBytes = await new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
    const randomCharacters = randomBytes.toString('hex');
    const emailVerified = Math.random() >= 0.5;
    
    const authData = {
      username: firstLetterUppercase(username),
      email: lowerCase(email),
      profilePublicId,
      password,
      country,
      profilePicture,
      emailVerificationToken: randomCharacters,
      emailVerified
    };
    
    await createUser(authData);
  }
  
  res.status(StatusCodes.OK).json({ message: 'Seed users created successfully.' });
}


export{
    create
}