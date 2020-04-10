export const uiTexts = {
  haendlerlogin_title: 'Händler Login',
  haendlerlogin_noch_kein_konto: 'Noch kein Konto? Dann gehts',
  haendlerlogin_noch_kein_konto_linktext: 'hier lang',
  haendlerlogin_passwort_vergessen: 'Passwort vergessen?',
  email: 'E-Mail',
  anmelden: 'Anmelden',
  password: { de: 'Passwort', en: 'Password' },
  umkreissuche_userlocation_text:
    'gib eine PLZ oder Ort ein (oder aktiviere GPS)',
  umkreissuche_userlocation_gpsenabled: ' (mein Standort)',
};

export type TextValue =
  | string
  | {
      de: string;
      en: string;
    };
export type TextKey = keyof typeof uiTexts;
