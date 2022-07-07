export const LoginUrl = (from?: string): string => `/stage/login?__c=_dialog&from=${encodeURIComponent(from || '')}`;
export const GuestHomeUrl: string = '/stage/login?__c=_dialog';
export const AdminHomeUrl: string = '/admin/dashboard/workplace';
export const FavoritesUrlStorageKey: string = 'EluxFavoritesUrl';
