const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Quitar el campo *password* del json
userSchema.methods.toJSON = function() {
    let usuario = this;
    let usuarioObject = usuario.toObject();
    delete usuarioObject.password;

    return usuarioObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);