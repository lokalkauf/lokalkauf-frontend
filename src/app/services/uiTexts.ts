/*eslint max-len: ["error", { "ignoreStrings": true }]*/
export const uiTexts = {
  haendlerlogin_title: 'Händler Login',
  haendlerlogin_noch_kein_konto: 'Noch kein Konto? Dann gehts',
  haendlerlogin_noch_kein_konto_linktext: 'hier lang',
  haendlerlogin_passwort_vergessen: 'Passwort vergessen?',
  email: 'E-Mail',
  anmelden: 'Anmelden',
  password: { de: 'Passwort', en: 'Password' },
  rote_infobox: 'Unsere Plattform befindet sich in der Pilotphase.',
  umkreissuche_userlocation_text: 'Deinen Wohnort finden / Postleitzahlsuche',
  umkreissuche_userlocation_gpsenabled: ' (mein Standort)',
  start_button_geschaeft_suchen: 'Geschäft suchen',
  start_zusammen_headline: 'Wir bringen Euch wieder zusammen!',
  start_zusammen_text:
    'Du möchtest lieber bei Deinem Lieblingsladen oder Lieblingsrestaurant um die Ecke ' +
    'bestellen oder Dich beliefern lassen und damit lokale Geschäfte unterstützen?' +
    '<br /><br />Du bist ein lokaler Einzelhändler oder Gastronom und möchtest online mehr Kunden erreichen?' +
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
  start_wirvsvirus_headline: 'Im offiziellen Solution Enabler Programm von',
  testimonal_1_testee: 'Christiane Hesse – Casabiente, Wiesbaden',
  testimonal_1_testimonial:
    'Es gibt Berge, über die man hinüber muss, sonst geht der Weg nicht weiter (Ludwig Thoma) ' +
    ' – Danke an lokalkauf für die großartige Unterstützung!',
  testimonal_2_testee: 'Achim Düster, Düster Herrenmoden, Brühl',
  testimonal_2_testimonial:
    'Lokalkauf gefällt mir sehr gut. Vor allem die einfache Bedienung' +
    ' für mich als Händler und für meine Kunden finde ich gelungen.',
  textSearch_placeholder: 'Tu ma suchen',
};

export type TextValue =
  | string
  | {
      de: string;
      en: string;
    };
export type TextKey = keyof typeof uiTexts;
