const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./User')

const tourSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must be less or equal to 40 characters'],
            minlength: [10, 'A tour name must have more or equal to 10 characters'],
            // validate: [validator.isAlpha, 'Tour name must only contain characters']
        },
        slug: String,

        duration: {
            type: Number,
            required: [true, "A must have a duration "]
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10)/10  //4.6666, 46.666,  47, 4.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    //this only point to current doc on new document creation
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have an image cover']
        },
        images: [String],

        startDates: [Date],

        secretTour: {
            type: Boolean,
            default: false
        },

        startLocation: {
            //GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    });



// Document Middleware: runs before .save() $ .create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true});
    next();
});

//connecting users with tour by embedding
tourSchema.pre('save', async function (next) {
    const guidesPromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidesPromises)

    next();
})

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

//Query Middleware
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true}})

    this.start = Date.now();
    next()
})
tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
})

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
})

module.exports = mongoose.model('Tour', tourSchema);