export enum Roles {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Status {
  PENDING = 'PENDING',
  PROCESS = 'PROCESS',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
}

export enum Rating {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
}

export enum Complaint {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum Payment_type {
  CASH = 'CASH',
  CARD = 'CARD',
}

export enum Wallet_type {
  HUMO = 'HUMO',
  UZCARD = 'UZCARD',
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
}
