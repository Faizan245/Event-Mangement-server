const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
  },
  { timestamps: true }
);


  
  userSchema.methods.matchPassword = async function (enteredPassword) {
    
    
    const result = await bcrypt.compare(enteredPassword, this.password);
    
    return result;
  };
  

module.exports = mongoose.model('User', userSchema);