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
  umkreissuche_userlocation_text: 'Wohnort oder Postleitzahl',
  umkreissuche_userlocation_gpsenabled: ' (mein Standort)',
  start_button_geschaeft_suchen: 'Geschäft finden',
  start_zusammen_headline: 'Buy local - Act global',
  start_zusammen_text:
    'Finde Deine Lieblingsprodukte direkt bei Dir in der Nähe und unterstütze beim Kauf nicht nur ' +
    'den Händler und Gastronom vor Ort, sondern Deine ganze Community.' +
    '<br /><br />Du bist ein lokaler Einzelhändler oder Gastronom und möchtest online mehr Kunden erreichen?' +
    '<br />Wir helfen Dir!',
  start_button_haender_anmelden: 'Geschäftsprofil anlegen',
  start_button_haender_bearbeiten: 'Geschäftsprofil bearbeiten',
  start_mission_headline: 'Unsere Mission',
  start_mission_text:
    'Wir glauben, dass der lokale Handel globale Auswirkungen hat.Wir glauben, dass jedes Geschäft um die Ecke ' +
    'wichtig für unser Leben, für unsere lokale Gemeinschaft und für unsere globale Gesellschaft ist.' +
    '<br /><br />Wir haben eine einfach zu bedienende und kostenlose Plattform geschaffen, die den lokalen Einzelhandel ' +
    'digital mit den Bürgern verbindet und die lokale Region nachhaltig unterstützt, indem sie ein Bewusstsein für den ' +
    'lokalen Einzelhandel und die Gastronomie schafft.' +
    '<br /><br />Wir sind das digitale Schaufenster des lokalen, stationären Einzelhandels, der Restaurants und der Geschäfte ' +
    'um die Ecke. Als Team, als Plattform und als Verein engagieren wir uns für den lokalen Einzelhandel.',
  start_mission_aboutus: 'Mehr über uns erfahren',
  start_ikl_headline: 'Setz mit uns ein Zeichen für Deine Stadt #ichkaufelokal',
  start_ikl_subheadline:
    'Du willst, dass es weiterhin all die Geschäfte gibt, die Deine Stadt ausmachen?' +
    '<br />Du kannst etwas dafür tun!',
  start_ikl_text:
    'Lade Dir spannende Filter und Profil-Rahmen herunter und zeige auf Social Media ' +
    'Flagge für den lokalen Einzelhandel und die Gastronomie!' +
    '<br />Das und noch einiges mehr findest Du auf unserer Kampangnenseite #ichkaufelokal. ' +
    '<br /><br /><a href="https://www.ichkaufelokal.org/" target="_blank" rel="noopener noreferrer" class="fancy-link">Zur Kampagne</a>',
  start_wirvsvirus_headline: 'Im offiziellen Solution Enabler Programm von',
  start_presse_headline: 'Aktuelle Pressemeldungen',
  start_presse_1_date: '29.03.2020',
  start_presse_1_title:
    'Dies Projekte helfen Geschäften und Restaurants in der Corona-Krise',
  start_presse_1_content:
    'Fast alle Geschäfte sind geschlossen. Bars oder Cafés müssen Wege finden, trotz Corona Umsätze ' +
    'zu erzielen. Hilfe bekommen sie von Kreativen und Digitalexperten. Einige sind einem Aufruf der Regierung gefolgt.',
  start_presse_1_link:
    'https://www.welt.de/wirtschaft/gruenderszene/article206873211/Corona-Krise-Diese-Projekte-helfen-Geschaeften-und-Restaurants.html',
  start_presse_2_date: '29.03.2020',
  start_presse_2_title:
    'Läden geschlossen – und jetzt? Was Händler tun können!',
  start_presse_2_content:
    'Handel muss nicht zwangsläufig in einem Ladengeschäft stattfinden – diese Erkenntnis ist während der ' +
    'Corona-Krise notwendiger denn je.  Schon mehr als jeder zweite Einzelhändler bietet seine Produkte bereits online an.',
  start_presse_2_link: 'https://www.bitkom.org/Themen/Corona/Handel',
  start_presse_3_date: '23.07.2020',
  start_presse_3_title:
    '#WirVsVirus – the world’s biggest online hackathon – the nine teams selected for its Solution Builder',
  start_presse_3_content:
    'We caught up with representatives from three of these fledgling organisations: lokalkauf; quarano; and RemedyMatch, to hear ' +
    'about their innovative solutions to COVID-19-related problems.',
  start_presse_3_link:
    'https://berlin.impacthub.net/wirvsvirus-solutionbuilder/',
  start_presse_artikel: 'Artikel lesen',
  start_presse_alle_artikel: 'Alle Pressemitteilungen ansehen',
  testimonal_1_testee: 'Christiane Hesse – Casabiente, Wiesbaden',
  testimonal_1_testimonial:
    'Es gibt Berge, über die man hinüber muss, sonst geht der Weg nicht weiter (Ludwig Thoma) ' +
    ' – Danke an lokalkauf für die großartige Unterstützung!',
  testimonal_2_testee: 'Achim Düster, Düster Herrenmoden, Brühl',
  testimonal_2_testimonial:
    'Lokalkauf gefällt mir sehr gut. Vor allem die einfache Bedienung' +
    ' für mich als Händler und für meine Kunden finde ich gelungen.',
  textSearch_placeholder: 'Händlersuche',
  start_searchbottom_headline:
    'Überzeugt? <br />Dann entdecke unsere Händler und Geschäfte!',
  licence_odbl_general_text:
    'Diese Daten stehen unter Open Data Commons Open Database Lizenz, ',
  licence_odbl_url_text: ' &copy OpenStreetMap-Mitwirkende.',
  licence_odbl_url: 'https://www.openstreetmap.org/copyright',
};

export type TextValue =
  | string
  | {
      de: string;
      en: string;
    };
export type TextKey = keyof typeof uiTexts;
