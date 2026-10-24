// src/services/dataService.js
import { connectDB } from '@/src/lib/mongoose';

// -- the following code is an attempt to create a global get request for either a list or an item by id  --
// this code is not specific to any schema. you will decide which field are used when you use it (either for search, sort, ..etc) 


export const createGetAll = (Model, options = {}) => {
  const {
    searchableFields = [],
    populateFields = [],
    defaultSort = { createdAt: -1 },
    defaultLimit = 10,
    maxLimit = 100,
    allowedFilterFields = [], 
  } = options;

  // 💡 Accepts Next.js plain searchParams objects natively
  return async (queryParams = {}) => {
    try {
      // 1. Ensure Mongoose is securely connected
      await connectDB();

      // ── 2. Build Filter Object (support gte, gt, lte, lt) ──
      let filter = { ...queryParams };
      const excluded = ['page', 'sort', 'limit', 'fields', 'search'];
      excluded.forEach(el => delete filter[el]);

      // Convert operators (age[gte]=25 → age: { $gte: 25 })
      let filterStr = JSON.stringify(filter);
      filterStr = filterStr.replace(/\b(gte|gt|lte|lt|in|nin|eq)\b/g, match => `$${match}`);
      filter = JSON.parse(filterStr);

      // Whitelist filter fields if provided
      if (allowedFilterFields.length) {
        Object.keys(filter).forEach(key => {
          if (!allowedFilterFields.includes(key)) delete filter[key];
        });
      }

      // ── 3. Initiate Mongoose Query ──
      let query = Model.find(filter);

      // ── 4. Handle Text Search ──
      if (queryParams.search && searchableFields.length) {
        const searchRegex = new RegExp(queryParams.search, 'i');
        query = query.or(
          searchableFields.map(field => ({ [field]: searchRegex }))
        );
      }

      // ── 5. Setup Sorting ──
      if (queryParams.sort) {
        const sortBy = queryParams.sort.split(',').reduce((acc, field) => {
          field.startsWith('-')
            ? (acc[field.slice(1)] = -1)
            : (acc[field] = 1);
          return acc;
        }, {});
        query = query.sort(sortBy);
      } else {
        query = query.sort(defaultSort);
      }

      // ── 6. Field Limiting (Select fields) ──
      if (queryParams.fields) {
        const fields = queryParams.fields.split(',').join(' ');
        query = query.select(fields);
      }

      // ── 7. Pagination Calculations ──
      const page = parseInt(queryParams.page) || 1;
      const limit = Math.min(parseInt(queryParams.limit) || defaultLimit, maxLimit);
      const skip = (page - 1) * limit;

      const total = await Model.countDocuments(filter);

      // Execute query, run population rules, and convert documents to plain JavaScript objects
      const docs = await query
        .skip(skip)
        .limit(limit)
        .populate(populateFields)
        .lean(); // 👈 Crucial to bypass heavy Mongoose binary wrappers

      // ── 8. Next.js Serialization Normalization ──
      // Converts MongoDB ObjectIDs and Date types to clean strings so Next.js doesn't throw a rendering error
      const serializedDocs = docs.map(doc => {
        const item = { ...doc };
        if (doc._id) item._id = doc._id.toString();
        
        // Convert any sub-document IDs or nested date stamps
        Object.keys(item).forEach(key => {
          if (item[key] && typeof item[key] === 'object' && item[key]._id) {
            item[key]._id = item[key]._id.toString();
          }
          if (item[key] instanceof Date) {
            item[key] = item[key].toISOString();
          }
        });
        return item;
      });

      return {
        status: 'success',
        results: serializedDocs.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: serializedDocs
      };
    } catch (err) {
      console.error(`Error in Mongoose createGetAll for model ${Model.modelName}:`, err);
      return { status: 'error', message: err.message || 'Database execution failed' };
    }
  };
};

/*
You can pass just 2 arguments (the Mongoose model + optional config), and it instantly handles:

1. Listing all records (GET /resource)

2. Full filtering (?name=john&age[gte]=25)

3. Search across multiple fields (search=john)

4. Sorting (?sort=-createdBy)

5. Pagination (?page=2&limit=20)

6. Field selection collect data with only these specific fields  (?fields=name,email)

7. Population for relations (if there is refs between models)

8. Proper error handling + clean JSON response with metadata

*/



// test previous code

// Users – validate _id and user (e.g. ?createdBy=...)
/*
router.get(
  '/',
  createGetAll(User, {
    searchableFields: ['name', 'email'],
    populateFields: [''],
    allowedFilterFields: ['name', 'email', 'createdBy']
  })
);

/* TESTING */

// these are the options lets test, of course these fields come from Model schema

/* 
searchableFields: ['name', 'email'],
populateFields: [],
allowedFilterFields: ['name', 'email', 'createdAt']

Case 1 Basic list
GET '/get-users-list'

Case 2 pagination
GET /get-users-list?page=2&limit=5
show the second page 2, limit by 15 items per page

Case 3 Sort
GET /get-users-list?sort=-createdBy,name
sort by newest first, then by name asc
i would add only one param here  

Case 4 field selection 
GET /get-users-list?fields=name,email,createdBy
get data only with the specified fields associated by user
in other words get user data list but load only these specific fields from the entire user data the other ignore it

Case 5 simple equality filter
GET /get-users-list?status=active
return users while this status field  match active word

our schema here doesnt include such field but point is taken

* useful if we want to get user data that match specific value (number or string) of a specific field

* in filters notice than we already decided which fields can be filtered in the options object

Case 6 Range filter
GET /get-users-list?age[gte]=25&age[lte]=40
return user where age field is between 25 and 40

our schema here doesnt include such field but point is taken

* useful if we want to get user data that are greater or smaller (as a number) value than a specific field
* like price or age limit filter

you can set a min only by (gte greater or equal)
GET /get-users-list?age[gte]=25
or max value by (lte lower or equal)
GET /get-users-list?age[lte]=40

gte greater or equal, lte lower or equal, gt greater than, lt lower than, there is others but thats enough now

* in filters notice than we already decided which fields can b
e filtered in the options object

Case 7 search                                           
GET /get-users-list?search=john
we already decided which fields can be filtered in the options object which is in this example is name and email
search name and email fields for the word provided case-sensitive and searchs for the word in the name, matches even for part of the name not exact match which is better

Case 8 Combined
GET /get-users-list?search=anna&age[gte]=30&sort=-createdBy&limit=8&fields=name,email,age
search by name or email partly matches anna and with age field greater or equal to 30 then sort asc by createdBy field and retrieve only name,email and age field from the document

*/

import mongoose from 'mongoose';

/**
 * Agnostic Library function to get one document by ID
 * Works in Express, Next.js, Fastify, Server Actions, etc.
 */
export const createGetOne = (Model, options = {}) => {
  const {
    populateFields = [],
    validateId = true,
    defaultFields = null, 
    restrictedFields = [], 
    alwaysExclude = ['__v'],
  } = options;

  // The returned function takes raw arguments instead of framework req/res objects
  return async (id) => {
    // 1. Optional but recommended validation
    if (validateId && !mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid ID format. Must be a 24-character hexadecimal string.');
      error.statusCode = 400; // attach metadata for whatever framework handles this later
      throw error;
    }

     // 1.1 Ensure Mongoose is securely connected
    await connectDB();

    // ── Build the query ──
    let query = Model.findById(id);

    // ── 2. Apply field projection ──
    let projection = null;
    if (defaultFields) {
      projection = {};
      let fieldsToInclude = [];

      if (typeof defaultFields === 'string') {
        fieldsToInclude = defaultFields.split(/\s+/).filter(Boolean);
      } else if (typeof defaultFields === 'object' && defaultFields !== null) {
        fieldsToInclude = Object.keys(defaultFields).filter(k => defaultFields[k] !== 0);
      }

      fieldsToInclude.forEach(field => {
        if (field.startsWith('-')) {
          const realField = field.slice(1);
          if (realField === '_id') {
            projection._id = 0;
          } else {
            console.warn(`Ignoring exclusion '${field}' in inclusion projection`);
          }
        } else {
          projection[field] = 1;
        }
      });

      [...restrictedFields, ...alwaysExclude].forEach(field => {
        delete projection[field];
      });
    } else {
      projection = {};
      [...alwaysExclude, ...restrictedFields].forEach(field => {
        projection[field] = 0;
      });
    }

    if (projection && Object.keys(projection).length > 0) {
      query = query.select(projection);
    }

    // ── 3. Population ──
    if (populateFields.length > 0) {
      query = query.populate(populateFields);
    }

    const doc = await query;

    if (!doc) {
      const error = new Error('No document found with that ID');
      error.statusCode = 404;
      throw error;
    }

    // ── 4. Return pure data ──
    return {
      status: 'success',
      data: doc
    };
  };
};


/* to test
// Most common – turn validation ON
router.get('/:id', createGetOne(User, {
  populateFields: ['posts'],
  validateId: true   // explicit or just omit (defaults true)
}));

/* TESTING */

/*
lets test this

this request returns different results based on the options object

// Basic – allow any fields
router.get('/:id', createGetOne(User, {
  populateFields: [],
  validateId: true,
}));


// retrieve all fields except restricted fields (very useful for users endpoint!)
router.get('get-user-by-id/:id', createGetOne(User, {
  populateFields: [],
  validateId: true,
  restrictedFields: ['password', 'refreshToken', 'internalNotes'],
}));

// With default fields will retrieve only the specifiedfield by default
router.get('get-user-by-id/:id', createGetOne(User, {
  populateFields: [],                                           
  validateId: true,
  defaultFields: 'name email role createdBy',
}));

// with both options combined retrieve only the specifiedfield by default and ban any access to restricted fields

router.get('/get-user-by-id/:id', createGetOne(User, {
  populateFields: [],
  validateId: true,
  restrictedFields: ['password', 'apiKey', 'permissions', 'updatedAt', 'kyc', '_id', 'auth'],
  defaultFields: 'name email role createdBy',
}));

*/