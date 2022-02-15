const express = require('express');
const {PermissionMiddlewareCreator} = require('forest-express-sequelize');
const {projects} = require('../models');
const S3Helper = require('../services/s3-helper');
const P = require('bluebird');


const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('projects');

// This file contains the logic of every route in Forest Admin for the collection projects:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a Project
function uploadImage(projectID, image, key, imageName) {

    //upload the files using the helper
    let url = new S3Helper().upload(image, `projects/${imageName}`)
        .then((response) => response["Location"]);

    //once the file is uploaded, update the relevant company field with the file id
    let project = projects.findByPk(projectID);

    return P.all([url, project])
        .then((result) => {
            let url = result[0]
            let project = result[1]
            project[key] = url;
            return project.save();
        })
        .catch((e) => e);
}

router.post('/actions/upload-images', permissionMiddlewareCreator.smartAction(), (req, res) => {
    // Get the current company id
    const projectID = req.body.data.attributes.ids[0];
    console.log(req)

    // Get the values of the input fields entered by the admin user.
    const attrs = req.body.data.attributes.values;
    const image = attrs['image'];
    const thumbnail = attrs['thumbnail'];
    const imageName = image.split(";", 3)[1].split("=")[1]
    const thumbnailName = thumbnail.split(/[;=]+/, 3)[2]

    P.all([uploadImage(projectID, image, 'image', imageName), uploadImage(projectID, thumbnail, 'thumbnail', thumbnailName),])
        .then(() => {
            // Once the upload is finished, send a success message to the admin user in the UI.
            return res.send({success: 'images are successfully uploaded.'});
        });
});

router.post('/projects', permissionMiddlewareCreator.create(), (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
    next();
});

// Update a Project
router.put('/projects/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
    next();
});

// Delete a Project
router.delete('/projects/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
    next();
});

// Get a list of Projects
router.get('/projects', permissionMiddlewareCreator.list(), (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
    next();
});

// Get a number of Projects
router.get('/projects/count', permissionMiddlewareCreator.list(), (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
    next();
});

// Get a Project
router.get('/projects/\\b(?!count\\b):recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
    next();
});

// Export a list of Projects
router.get('/projects.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
    next();
});

// Delete a list of Projects
router.delete('/projects', permissionMiddlewareCreator.delete(), (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
    next();
});

module.exports = router;
