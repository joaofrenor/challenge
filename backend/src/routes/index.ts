import { Router } from 'express';

import userRoutes from './user.routes';
import sessionsRoutes from './sessions.routes';
import placesRoutes from './places.routes';
import votesRoutes from './vote.routes';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/places', ensureAuthenticated, placesRoutes);
routes.use('/votes', votesRoutes);

export default routes;
