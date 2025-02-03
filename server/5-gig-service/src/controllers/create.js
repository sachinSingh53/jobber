import { gigCreateSchema } from '../schemes/gig.js';
import { uploads } from '@sachinsingh53/jobber-shared';
import { BadRequestError } from '@sachinsingh53/jobber-shared';
import { createGig } from '../services/gig-service.js';
import { StatusCodes } from 'http-status-codes';
import { getDocumentCount } from '../elasticsearch.js';
const gig = async (req, res) => {
    const { error } = gigCreateSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message, ' Create seller() method error');
    }

    const result = uploads(req.body.coverImage);

    if (!result.public_id) {
        throw new BadRequestError('File upload error try again', 'create gig method');
    }
    const count = await getDocumentCount('gigs');

    const gig = {
        sellerId: req.body.sellerId,
        username: req.currentUser.username,
        email: req.currentUser.email,
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        subCategories: req.body.subCategories,
        tags: req.body.tags,
        price: req.body.price,
        expectedDelivery: req.body.expectedDelivery,
        basicTitle: req.body.basicTitle,
        basicDescription: req.body.basicDescription,
        coverImage: `${result?.secure_url}`,
        sortId: count + 1
    }

    const createdGig = await createGig(gig);

    res.status(StatusCodes.CREATED).json({
        message:'gig Created',
        gig: createdGig
    })
}
export{gig};