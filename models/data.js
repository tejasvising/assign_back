var mongoose = require('mongoose');
var dataSchema = new mongoose.Schema({
    name: String,
    email: { type: String,  unique: true },
    property: String
});

// dataSchema.path('email').validate(function(value, done) {
//     this.model('data').count({ email: value }, function(err, count) {
//         if (err) {
//             return done(err);
//         } 
//         // If `count` is greater than zero, "invalidate"
//         done(!count);
//     });
// }, 'Email already exists');
module.exports = new mongoose.model('data', dataSchema);