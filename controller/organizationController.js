import UserOrganisation from "../models/userOrgModel.js";
import Organisation from "../models/organizationModel.js"; 


export const getUserOrganisations = async (req, res) => {
    try {
        const userId = req.user.id; 

        const organisations = await Organisation.findAll({
            include: {
                model: UserOrganisation,
                where: { userId: userId },
                attributes: []
            },
            attributes: ['orgId', 'name', 'description']
        });

        return res.status(200).json({
            status: 'success',
            message: 'Organisations retrieved successfully',
            data: { organisations }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};


export const getOrganisationById = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        const userId = req.user.id; 

        const organisation = await Organisation.findOne({
            where: { orgId: orgId },
            include: {
                model: UserOrganisation,
                where: { userId: userId },
                attributes: []
            },
            attributes: ['orgId', 'name', 'description']
        });

        if (!organisation) {
            return res.status(404).json({
                status: 'error',
                message: 'Organisation not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Organisation details retrieved successfully',
            data: organisation
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Create a new organisation
export const createOrganisation = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.userId; 

        if (!name) {
            return res.status(400).json({
                status: 'Bad Request',
                message: 'Name is required'
            });
        }

        const organisation = await Organisation.create({
            name,
            description
        });

        // await UserOrganisation.create({
        //     userId,
        //     orgId: organisation.orgId
        // });

        return res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: organisation
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Add a user to a specific organisation
export const addUserToOrganisation = async (req, res) => {
    try {
        const { userId } = req.body;
        const orgId = req.params.orgId;

        await UserOrganisation.create({
            userId,
            orgId
        });

        return res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
