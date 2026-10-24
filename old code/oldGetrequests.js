// import mongoose from 'mongoose';
// import { createGetOne } from '@/src/lib/GET';
// import User from '@/src/models/User';

// // Initialize the query with your User schema config
// export const getUserById = createGetOne(User, {
//   populateFields: [], // Automatically fills relational fields
//   validateId: true,
//   restrictedFields: [],
//   defaultFields: 'name email avatar role plan billing status'
// });

// import { createGetAll } from '@/src/lib/GET';
// import User from '@/src/models/User';

// // Initialize the query with your User schema config
// export const getUsers = createGetAll(User, {
//   searchableFields: ['name', 'role', 'plan', 'billing', "status"],
//   populateFields: [], // Automatically fills relational fields
//   defaultLimit: 5,
//   allowedFilterFields: ['name', 'role', 'plan', 'billing', "status"] // Whitelist specific filter inputs
// });