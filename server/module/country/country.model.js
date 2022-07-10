const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    shortName: {
      type: String,
      trim: true,
      maxLength: 4,
      uppercase: true,
      required: true
    }
  },
  {
    collection: 'country',
    timestamps: true
  }
);

// add plugin that converts mongoose to json
countrySchema.plugin(toJSON);
countrySchema.plugin(paginate);

countrySchema.index({ name: 1 });

countrySchema.method({});

countrySchema.statics.isNameTaken = async function isNameTakenFn(name, excludeCountryId) {
  const country = await this.findOne({ name, _id: { $ne: excludeCountryId } });
  return !!country;
};

const Country = mongoose.model('country', countrySchema);

module.exports = Country;
