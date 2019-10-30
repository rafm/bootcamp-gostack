import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

export default async (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');
    // const token = authHeader.split(' ')[1]; // It can also be written in this way, as JS does not throw ArrayIndexOutOfBoundsException like Java = )

    try {
        const decodedToken = await promisify(jwt.verify)(
            token,
            authConfig.secret
        );

        request.userId = decodedToken.id;

        return next();
    } catch (err) {
        return response.status(401).json({ error: 'Token invalid' });
    }
};
