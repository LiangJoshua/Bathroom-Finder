// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    bathroomName: {type: String, required: true},
    gender: {type: String, required: true},
    rating: {type: Number, required: true},
    avgRating: {type: Number, required: true},
    ratingCount: {type: Number, required: true},
    location: {type: [Number], required: true}, // [Long, Lat]
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updatedAt = now;
    if(!this.createdAt) {
        this.createdAt = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
UserSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "bathrom"
module.exports = mongoose.model('bathroom', UserSchema);
