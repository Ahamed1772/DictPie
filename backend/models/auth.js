import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    AuthId: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      // match: [/^\d{10}$/, "Phone number must be 10 digits"], // adjust regex as needed
    },
    confirmationCode: {
      type: String,
    },
    codeExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false
    }
},
{
    timestamps: true
}
);

//sending only user data except password field
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // remove password field
  return user;
};

//autodelete user if it is not verified
UserSchema.index(
  { codeExpires: 1 },
  { 
    expireAfterSeconds: 0,
    partialFilterExpression: { isVerified: false }  //only delete unverified users
  }
)

//virtual relationship between user and message
UserSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "user",
});

const User = mongoose.model('User', UserSchema);
export default User;