
import { StatusCodes } from 'http-status-codes';

const health = (_req, res)=> {
  res.status(StatusCodes.OK).send('Review service is healthy and OK.');
};

export { health };