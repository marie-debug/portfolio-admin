const {collection} = require('forest-express-sequelize');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('projects', {
    actions: [
        {
            name: 'Upload images',
            type: 'single',
            fields: [{
                field: 'image',
                description: '',
                type: 'File',
                isRequired: true,
            }, {
                field: 'thumbnail',
                description: '',
                type: 'File',
                isRequired: true,
            }],
        },
    ],
    fields: [],
    segments: [],

});
