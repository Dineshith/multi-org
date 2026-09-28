import bcrypt from "bcryptjs";

// const password = "superAdmin@456";
const password = "orgAdmin1@456";

const hash = await bcrypt.hash(password, 10);

console.log(hash);
