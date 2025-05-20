import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Furqaan',
    email: 'furqaan@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Faizaan',
    email: 'faizaan@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;