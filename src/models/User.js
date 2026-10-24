// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     match: /^\+\d{10,15}$/
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   },
//   role: {
//     type: String,
//     required: true,
//     enum: ['supplierAdmin', 'supplierModerator', 'admin', 'superAdmin', 'driver'],
//     default: 'supplierAdmin'
//   },
//   supplierId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Supplier',
//   },
//   apiKey: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   permissions: [{
//     resource: {
//       type: String,
//       required: true,
//       enum: ['users', 'suppliers', 'customers', 'orders', 'payments', 'analytics', 'kyc', 'sms', 'logistics']
//     },
//     actions: [{
//       type: String,
//       required: true,
//       enum: ['read', 'write', 'delete', 'updatePermissions', 'verify', 'assign', 'updateStatus', 'flag']
//     }]
//   }],
//   kyc: {
//     idType: {
//       type: String,
//       enum: ['passport', 'nationalId', 'driversLicense']
//     },
//     idNumber: {
//       type: String,
//     },
//     documentUrl: {
//       type: String,
//     },
//     verified: {
//       type: Boolean,
//       default: false
//     },
//     verifiedAt: { type: Date },
//     verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
//   },
//   auth: {
//     otp: { type: String }, // Store hashed OTP
//     otpExpires: { type: Date },
//     uniqueId: { type: String },  
//     // uniqueId: { type: String, unique: true },  
//     // unique start with P000 then 5 numbers acquired from _id
//     password: {type: String},
//     secretCode: { type: String }, 
//     masterKey: { type: String }
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Update timestamp
// userSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// export default mongoose.models.User || mongoose.model('User', userSchema);

import mongoose from 'mongoose';

delete mongoose.models.User;
// delete mongoose.modelSchemas.User;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Prevents duplicate email signups
      lowercase: true, // Automatically converts emails to lowercase
      trim: true,
      // Regular expression to validate standard email formats
      match: [/^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/, 'Please fill a valid email address']
    },
    avatar: {
      type: String,
      // Stores the URL string pointing to the image file or CDN link
      default: 'https://example.com' 
    },
    role: {
      type: String,
      enum: {
        values: ['Admin', 'Editor', 'Subscriber', 'Maintainer', 'Guest'],
        message: '{VALUE} is not a valid role'
      },
      default: 'guest'
    },
    plan: {
      type: String,
      enum: {
        values: ['Free', 'Basic', 'Pro', 'Team', 'Enterprise'],
        message: '{VALUE} is not a valid plan'
      },
      default: 'free'
    },
    billing: {
      type: String,
      enum: {
        values: ['Debit', 'Card', 'Cash', 'Paypal'],
        message: '{VALUE} is not a valid billing method'
      },
      required: [true, 'Billing method is required']
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'pending', 'suspended', 'inactive'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending'
    },
    joinedDate: {
      type: Date,
      default: Date.now 
    }
  },
  {
    versionKey: false 
  }
);

const User = mongoose.model('User', userSchema);

export default User;
