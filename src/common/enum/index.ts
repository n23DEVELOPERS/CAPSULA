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

export enum BookDoctorStatus {
  PENDING = 'PENDING',
  PROCESS = 'PROCESS',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}



export enum SendRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
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

export enum DoctorSpeciality {
  CARDIOLOGIST = 'CARDIOLOGIST', // Yurak shifokori
  DERMATOLOGIST = 'DERMATOLOGIST', // Teri kasalliklari bo‘yicha
  NEUROLOGIST = 'NEUROLOGIST', // Asab tizimi bo‘yicha
  PEDIATRICIAN = 'PEDIATRICIAN', // Bolalar shifokori
  ORTHOPEDIC = 'ORTHOPEDIC', // Suyak va bo‘g‘im shifokori
  GYNECOLOGIST = 'GYNECOLOGIST', // Ayollar shifokori
  UROLOGIST = 'UROLOGIST', // Siydik tizimi shifokori
  ENDOCRINOLOGIST = 'ENDOCRINOLOGIST', // Gormon tizimi bo‘yicha
  PSYCHIATRIST = 'PSYCHIATRIST', // Ruhiy kasalliklar bo‘yicha
  RADIOLOGIST = 'RADIOLOGIST', // Rentgen va MRI bo‘yicha
  ONCOLOGIST = 'ONCOLOGIST', // Saraton kasalliklari bo‘yicha
  OPHTHALMOLOGIST = 'OPHTHALMOLOGIST', // Ko‘z shifokori
  OTOLARYNGOLOGIST = 'OTOLARYNGOLOGIST', // Quloq-burun-tomoq shifokori
  DENTIST = 'DENTIST', // Tish shifokori
  SURGEON = 'SURGEON', // Jarroh
  NEPHROLOGIST = 'NEPHROLOGIST', // Buyrak kasalliklari bo‘yicha
  HEMATOLOGIST = 'HEMATOLOGIST', // Qon tizimi bo‘yicha
  GASTROENTEROLOGIST = 'GASTROENTEROLOGIST', // Oshqozon-ichak tizimi bo‘yicha
}
