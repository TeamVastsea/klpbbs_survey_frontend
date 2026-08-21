export interface User {
  uid: string;
  username: string;
  admin: boolean;
}

export interface ManagedUser extends User {
  disabled: boolean;
  logged_in: boolean;
}
