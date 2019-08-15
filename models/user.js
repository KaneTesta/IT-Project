var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    user_id: {
        type: String,
        require: [true, 'An user needs an id']
    },
    display_name: String
});

mongoose.model('user', userSchema, 'users');
