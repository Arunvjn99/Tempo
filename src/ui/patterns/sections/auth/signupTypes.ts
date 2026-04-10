export interface SignupCompanyOption {
  id: string;
  name: string;
}

export interface SignupFormErrors {
  name?: string;
  location?: string;
  companyId?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
