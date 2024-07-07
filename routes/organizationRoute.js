import { Router } from 'express';
import {
    getUserOrganisations,
    getOrganisationById,
    createOrganisation,
    addUserToOrganisation
} from '../controller/organizationController.js';
import  {authenticate} from '../middleware/auth.js';


const router = Router();


router.get('/organisations', authenticate, getUserOrganisations);
router.get('/organisations/:orgId', authenticate, getOrganisationById);
router.post('/organisations', authenticate, createOrganisation);
router.post('/organisations/:orgId/users', authenticate, addUserToOrganisation);

export default router;
