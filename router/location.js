const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
// const multer = require('multer');
const Location = require('../db/models/location');


//( /user/register) in order to register user
router.post("/create", async (req, res) => {

    // Our register location logic starts here
    try {
        // Get user input
        const { user_id, address_line1, address_line2, city, postal_code, country } = req.body;
        // Validate user input
        if (!(user_id && address_line1 && city)) {
            return res.status(400).json({ code: 400, message: 'All input is required' });
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldLocarion = await Location.findOne({ user_id });

        if (oldLocarion) {
            return res.status(400).json({ code: 400, message: 'User Already have location. Please Update' });
            // return res.status(409).send("User Already Exist. Please Login");
        }

        //user validated
        const value = {
            user_id: user_id,
            location:
            {
                type: "Point",
                coordinates: [
                    -122.5,
                    37.7
                ]

            },
            address_line1: address_line1,
            address_line2: address_line2,
            city: city, // sanitize: convert email to lowercase
            postal_code: postal_code,
            country: country
        };
        const baselocation = new Location(value);
        // validation
        var error = baselocation.validateSync();
        if (error) {
            return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
            // return res.status(409).send("Validatioan error");
        }
        const location = await baselocation.save();
        if (location.err) {
            return res.status(409).json({ code: 409, message: 'Save error', error: location.err });            
        }
        res.status(201).json(location);
    } catch (err) {
        userLogger.error(err);
        // console.log(err);
    }
    // Our location logic ends here
});
//( /user/update/:id) in order to update specific user
router.post("/update/:id", async (req, res) => {

    const id = req.params.id;
    //id check
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(422).json({
            message: 'Id is not valid',
            error: id,
        });
    }
    const { user_id, address_line1, address_line2, city, postal_code, country } = req.body;
    // const value = authorSchema.validate(req.body);

    // Validate if user exist in our database
    const location = await Location.findById(id);

    if (location) {
        return res.status(400).json({ code: 400, message: 'No location' });
        // return res.status(409).send("User Already Exist. Please Login");
    }
    const newValues = {
        user_id: user_id,
        location:
        {
            type: "Point",
            coordinates: [
                -122.5,
                37.7
            ]

        },
        address_line1: address_line1,
        address_line2: address_line2,
        city: city, // sanitize: convert email to lowercase
        postal_code: postal_code,
        country: country
    };

    const baselocation = new Location(newValues);
    // validation
    const error = baselocation.validateSync();
    if (error) {
        return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
        // return res.status(409).send("Validatioan error");
    }

    // this only needed for development, in deployment is not real function
    const locations = await Location.findOneAndUpdate({ _id: id }, newValues);

    if (locations.err) {
        return res.status(500).json({ code: 500, message: 'There as not any locationss yet', error: err })
    }
    else {
        return res.status(200).json({ code: 200, message: 'locations exist and updated', oldlocations: locations })
    };
});
//( /user/delete/:id) in order to delete specific user
router.delete("/delete/:id", async (req, res) => {

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(422).json({
            message: 'Id is not valid',
            error: id,
        });
    }

    // this only needed for development, in deployment is not real function
    const location = await Location.findOneAndDelete({ _id: id });
    // console.log(location) 
    if (!location) {
        return res.status(500).json({ code: 500, message: 'There as not any locations yet', error: location })
    };
    if (location.err) {
        return res.status(500).json({ code: 500, message: 'There as not any locations yet', error: location })
    }
    else {
        return res.status(200).json({ code: 200, message: 'user exist and deleted', deleted_user: location })
    };
});
//( /getone/:id) in order to get specific client
router.get("/getone/:id", async (req, res) => {

    const id = req.params.id;
    // id valid chech
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(422).json({
            message: 'Id is not valid',
            error: id,
        });
    }
    // console.log(req)
    // userLogger.info(req.header)
    // this only needed for development, in deployment is not real function
    const location = await Location.find({ _id: id });

    if (location.err) {
        return res.status(500).json({ code: 500, message: 'There as not any locations yet', error: err })
    }
    else {
        return res.status(200).json({ code: 200, message: 'location exist', location: location })
    };
});
module.exports = router;