const bcrypt = require('bcrypt');

// Hash a password
const hashPassword = async (password) => {
    const saltRounds = 10; // The higher the number, the more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Compare a plain text password with a hashed password
const verifyPassword = async (plainPassword, hashedPassword) => {
    console.log('p = ', plainPassword)
    console.log('h = ', hashedPassword)
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('iS password mathc = ', isMatch)
    return isMatch;
};


module.exports = { hashPassword, verifyPassword }
