import bcrypt from 'bcryptjs'

const users = [
    {
        name: "Admin user",
        email: "admin@proshop.com",
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: "Jonas Jonaitis",
        email: "jonas@proshop.com",
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: "Petras Petraitis",
        email: "petras@proshop.com",
        password: bcrypt.hashSync('123456', 10),
    },
];

export default users