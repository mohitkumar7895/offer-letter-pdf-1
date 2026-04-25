import mongoose, { Schema, Document } from 'mongoose';
import { IClient, IDomainDetails, ClientStatus, HostingProvider } from '../types/client';

export interface IClientDocument extends Omit<IClient, '_id'>, Document {}

const DomainDetailsSchema = new Schema<IDomainDetails>({
  domainName: { type: String, trim: true },
  businessName: { type: String, trim: true },
  category: { type: String, trim: true },
  renewalDate: { type: Date }, // Domain Expiry Date
  domainRegistrar: { type: String, trim: true }, // Domain Company
  hostingExpiryDate: { type: Date },
  hostingCompany: { type: String, trim: true },
  hostingProvider: { 
    type: String, 
    enum: ['Provider', 'Others'],
  },
  remarks: { type: String, trim: true },
}, { _id: false });


const ClientSchema = new Schema<IClientDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    domainDetails: {
      type: DomainDetailsSchema,
      default: {},
    },
    status: {
      type: String,
      enum: ['Work in Progress', 'Pending', 'Completed (Live)', 'Expired / Not Working'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.models.Client || mongoose.model<IClientDocument>('Client', ClientSchema);

export default Client;
