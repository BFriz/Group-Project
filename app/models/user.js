// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
mongoose.connect("mongodb://localhost/moodsdb"); // random moodsdb title, should i change?

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
  //   display_name: {type: String, required: true},
  //   dob: {type: String, required: true, required: true},  // or "date" type?  see note on DOB vs Set age
  //   gender: {type: String, required: true, required: true},
  // // looking_for: {type: String, default: ''}, this will be next step as it requires validation with gender
  //   profile_pic_url: {type: String, default: '' },
  //   all_pics_url: {type: Array, default: [] },

  //  // dynamic attributes
  //   mood: {type: String, default: ''}, // see note on validations on the mood
  //   location: {type: String, default: ''}, // TBD if it is String

  //   // uncertainty on the below, need to double check the self-referencing
  //   likes: [],
  //   dislikes: [],
  //   matches: []
    // matches: [{
    //   type: mongoose.Schema.Types.ObjectId, ref: 'User'
    // }],

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
// module.exports = mongoose.model('User', userSchema);
// // creating a mongoose Food model to allow us to instantiate new food documents;
var User = mongoose.model('User', userSchema);

// // making food object available to other enviroments
module.exports.User = User;


// // NOTES - NOTES - NOTES - NOTES NOTES - NOTES

// // Dates - see http://mongoosejs.com/docs/schematypes.html
// // Built-in Date methods are not hooked into the mongoose change tracking logic which in English means
// // that if you use a Date in your document and modify it with a method like setMonth(), mongoose will be 
// // unaware of this change and doc.save() will not persist this modification. If you must modify Date types 
// // using built-in methods, tell mongoose about the change with doc.markModified('pathToYourDate') before saving.

// // need to Add validations on the mood: can only be within a pre-selected set 
// // -> AVOID anyone fiddling with the html source and creating a new mood

// // where to put the password?

