import envConfig from '@/config';
import { locales } from '@/constants/locale';

export const getOauthGoogleUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};
export const generatePaths = (base: string | string[]): string[] => {
  if (Array.isArray(base)) {
    return locales.flatMap((lang) => base.map((path) => `/${lang}${path}`));
  }
  return locales.map((lang) => `/${lang}${base}`);
};
