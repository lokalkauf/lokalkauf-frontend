export const uiTexts = {
  haendlerlogin_title: 'Händler Login',
  haendlerlogin_noch_kein_konto: 'Noch kein Konto? Dann gehts',
  haendlerlogin_noch_kein_konto_linktext: 'hier lang',
  haendlerlogin_passwort_vergessen: 'Passwort vergessen?',
  email: 'E-Mail',
  anmelden: 'Anmelden',
  password: { de: 'Passwort', en: 'Password' },
  umkreissuche_userlocation_text: 'Deinen Wohnort finden / Postleitzahlsuche',
  umkreissuche_userlocation_gpsenabled: ' (mein Standort)',
  start_button_geschaeft_suchen: 'Geschäft suchen',
  start_zusammen_headline: 'Wir bringen Euch wieder zusammen!',
  start_zusammen_text:
    'Du kannst bei Deinem Lieblingsladen, Lieblings-Restaurant oder Café um die Ecke nicht mehr einkaufen? ' +
    '<br />Du bist ein lokaler Einzelhändler oder Gastronom und musstest Deinen Laden schließen?' +
    '<br />Wir helfen Euch!',
  start_button_haender_anmelden: 'Geschäftsprofil anlegen',
  start_button_haender_bearbeiten: 'Geschäftsprofil bearbeiten',
  start_mission_headline: 'Unsere Mission',
  start_mission_text:
    'Wir vermissen es so sehr, zusammen essen zu gehen, zu reden sowie zu lachen und dann ab in die nächste ' +
    'Bar auf einen Drink weiterzuziehen. Wir vermissen das entspannte Bummeln in der Stadt und das Stück Kuchen ' +
    'mit einem Kaffee in unserem Lieblings-Café.' +
    '<br /><br />Wir wollen, dass es unsere Lieblingsläden, Lieblingsrestaurants und das Geschäft um die Ecke auch ' +
    'nach der Coronakrise noch gibt. Daher unterstützt uns, um lokal zu unterstützen.' +
    '<br />lokalkauf – kauft lokal' +
    '<br /><br />Wir wollen eine kostenlose Plattform schaffen, die den lokalen Einzelhandel und die Gastronomie ' +
    'mit den Bürgern digital verbindet und dabei nachhaltig unterstützt, die Coronakrise zu bewältigen',
};

export type TextValue =
  | string
  | {
      de: string;
      en: string;
    };
export type TextKey = keyof typeof uiTexts;
