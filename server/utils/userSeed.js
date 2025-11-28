export const userSeed = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123', // Will be hashed by pre-save hook
    fullName: 'Admin User',
    role: 'admin',
    address: {
      street: '123 Admin St',
      city: 'Admin City',
      state: 'Admin State',
      zipCode: '12345',
      country: 'Admin Country'
    }
  },
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe',
    role: 'user',
    address: {
      street: '456 User St',
      city: 'User City',
      state: 'User State',
      zipCode: '67890',
      country: 'User Country'
    }
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    fullName: 'Jane Doe',
    role: 'user',
    address: {
      street: '789 User Ave',
      city: 'User Town',
      state: 'User State',
      zipCode: '54321',
      country: 'User Country'
    }
  }
];
