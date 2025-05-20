import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

//.pre allows us to do something before it is saved in the database
//in this case hash the password before its saved in the database 
userSchema.pre('save', async function (next) { //Has the password been changed or newly added?
  if (!this.isModified('password')) { 
    next(); //If no change to the password (e.g., user updated their name), then it skips hashing and moves on.
  }

  //If the password is new or updated, it continues — and you hash it. 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;

