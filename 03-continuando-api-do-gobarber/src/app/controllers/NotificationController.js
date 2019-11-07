import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
    async index(request, response) {
        const checkUserProvider = await User.findOne({
            where: {
                id: request.userId,
                provider: true,
            },
        });
        if (!checkUserProvider) {
            return response
                .status(401)
                .json({ error: 'Only provider can load notifications' });
        }

        const notifications = await Notification.find({ user: request.userId })
            .sort({ createdAt: 'desc' })
            .limit(20);
        return response.json(notifications);
    }
}

export default new NotificationController();
