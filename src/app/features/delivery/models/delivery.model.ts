// src/app/features/delivery/models/delivery.model.ts

export enum DeliveryStatus {
  DELIVERED = 'DELIVERED',
  IN_RETURNING = 'IN_RETURNING',
  RETURNED = 'RETURNED',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export enum DeliveryManStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  OFFLINE = 'OFFLINE'
}

export interface DeliveryGuy {
  id: number;
  name: string;
  phone: string;
  status: DeliveryManStatus;
  activeDeliveries: number;
  lastUpdated: string;
}

export interface Delivery {
  id: number;
  rentalId: number;
  renterId: number;
  ownerId: number;
  itemId: number;
  renterAddress: string;
  ownerAddress: string;
  renterName: string;
  ownerName: string;
  renterPhone: string;
  ownerPhone: string;
  status: DeliveryStatus;
  deliveryCost: number;
  type: string; // "FORWARD" or "RETURN"
  startDate?: string;
  scheduledStartTime?: string;
  assignedDeliveryGuy: DeliveryGuy | null;
  started: boolean;
  createdDate: string;
  lastModifiedDate: string;
}

export interface DeliveryDetailsResponse {
  id: number;
  rentalId?: number;
  type: string;
  status: string;
  pickupName: string;
  pickupAddress: string;
  pickupPhone: string;
  dropoffName: string;
  dropoffAddress: string;
  dropoffPhone: string;
  deliveryGuyName: string;
  deliveryCost: number;
  createdDate: string;
  lastModifiedDate: string;
}
