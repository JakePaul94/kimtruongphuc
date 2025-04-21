export type UserAttributes = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string | null;
  phoneNumber?: string | null;
  department?: string | null;
  firstLogin: boolean;
  accountStatus?: string;
  reportingManagerId?: number | null;
  permissions?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  country?: string | null;
  registrationDate?: string; // Thêm trường registrationDate
  lastUpdatedAt?: string | null; // Thêm trường lastUpdatedAt
  createdAt?: string;
  updatedAt?: string;
};

export type UserWithoutIdAttributes = Omit<UserAttributes, 'id'>;
