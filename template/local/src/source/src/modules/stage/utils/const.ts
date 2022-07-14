export const DialogPageClassname: string = '_dialog';
export const LoginUrl = (from?: string): string => `/stage/login?__c=${DialogPageClassname}&from=${encodeURIComponent(from || '')}`;
export const GuestHomeUrl: string = `/stage/login?__c=${DialogPageClassname}`;
export const AdminHomeUrl: string = '/admin/dashboard/workplace';
export const FavoritesUrlStorageKey: string = 'EluxFavoritesUrl';
