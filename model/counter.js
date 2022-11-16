var mongoose = require("mongoose");
var { Schema } = mongoose;

const counterSchema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

counterSchema.index({ _id: 1, seq: 1 }, { unique: true });

const counterModel = mongoose.model("counter", counterSchema);
const autoIncrementModelID = function (modelName, doc, next) {
  counterModel.findByIdAndUpdate(
    modelName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
    function (error, counter) {
      // The callback
      if (error) return next(error);
      //   console.log(doc);
      doc._id = counter.seq;

      console.log("Counter doc", doc);
      next();
    }
  );
};

module.exports = { autoIncrementModelID, counterModel };
