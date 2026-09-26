// =============================================================================
// SWEDISH CALENDAR & THEME DAYS ENGINE (ENGLISH INTERFACE)
// =============================================================================

export interface SwedishDayIntel {
    isRedDay: boolean;
    isKlamdag: boolean;
    isFlagDay: boolean;
    holidayName: string | null;
    namedays: string;
}

// -----------------------------------------------------------------------------
// 1. COMPLETE SVENSKA AKADEMIENS NAMNSDAGAR (ALL 365 DAYS)
// -----------------------------------------------------------------------------
const SWEDISH_NAMNSDAGAR: Record<string, string> = {
    '01-01': 'Nyårsdagen', '01-02': 'Svea', '01-03': 'Alfred, Alfrida', '01-04': 'Rut', '01-05': 'Hanna, Hannele',
    '01-06': 'Kasper, Melker, Baltsar', '01-07': 'August, Augusta', '01-08': 'Erland', '01-09': 'Gunnar, Gunder',
    '01-10': 'Sigurd, Sigbritt', '01-11': 'Jan, Jannike', '01-12': 'Frideborg, Fridolf', '01-13': 'Knut',
    '01-14': 'Felix, Felicia', '01-15': 'Laura, Lorentz', '01-16': 'Hjalmar, Helmer', '01-17': 'Anton, Tony',
    '01-18': 'Hilda, Hildur', '01-19': 'Henrik', '01-20': 'Fabian, Sebastian', '01-21': 'Agnes, Agneta',
    '01-22': 'Vincent, Viktor', '01-23': 'Frej, Freja', '01-24': 'Erika', '01-25': 'Paul, Pål', '01-26': 'Bodil, Boel',
    '01-27': 'Göte, Göta', '01-28': 'Karl, Karla', '01-29': 'Valter, Vilma', '01-30': 'Gunhild, Gunilla', '01-31': 'Ivar, Joar',

    '02-01': 'Max, Maximilian', '02-02': 'Kyndelsmässodagen', '02-03': 'Disa, Hjördis', '02-04': 'Ansgar, Anselm',
    '02-05': 'Agata, Agda', '02-06': 'Dorotea, Doris', '02-07': 'Rikard, Dick', '02-08': 'Berta, Bert',
    '02-09': 'Fanny, Franciska', '02-10': 'Iris', '02-11': 'Yngve, Inge', '02-12': 'Evelina, Evy', '02-13': 'Agne, Ove',
    '02-14': 'Valentin', '02-15': 'Sigfrid', '02-16': 'Julia, Julius', '02-17': 'Alexandra, Sandra', '02-18': 'Frida, Fritiof',
    '02-19': 'Gabriella, Ella', '02-20': 'Vivianne', '02-21': 'Hilding', '02-22': 'Pia', '02-23': 'Torsten, Torun',
    '02-24': 'Mattias, Mats', '02-25': 'Sigvard, Sivert', '02-26': 'Torgny, Torkel', '02-27': 'Lage', '02-28': 'Maria',
    '02-29': 'Skottdagen',

    '03-01': 'Albin, Elvira', '03-02': 'Ernst, Erna', '03-03': 'Gunborg, Gunvor', '03-04': 'Adrian, Adriana',
    '03-05': 'Tora, Tove', '03-06': 'Ebba, Ebbe', '03-07': 'Camilla', '03-08': 'Siv, Saga', '03-09': 'Torbjörn, Torleif',
    '03-10': 'Edla, Ada', '03-11': 'Edvin, Egon', '03-12': 'Viktoria', '03-13': 'Greger', '03-14': 'Matilda, Maud',
    '03-15': 'Kristoffer, Christel', '03-16': 'Herbert, Gilbert', '03-17': 'Gertrud', '03-18': 'Edvard, Edmund',
    '03-19': 'Josef, Josefina', '03-20': 'Joakim, Kim', '03-21': 'Bengt', '03-22': 'Kennet, Kent', '03-23': 'Gerda, Gerd',
    '03-24': 'Gabriel, Rafael', '03-25': 'Mary, Marion', '03-26': 'Emanuel', '03-27': 'Rudolf, Ralf',
    '03-28': 'Malkolm, Morgan', '03-29': 'Jonas, Jens', '03-30': 'Holger, Holmfrid', '03-31': 'Ester',

    '04-01': 'Harald, Hervor', '04-02': 'Gudmund, Ingemund', '04-03': 'Ferdinand, Nanna', '04-04': 'Marianne, Marlene',
    '04-05': 'Irene, Irja', '04-06': 'Vilhelm, Helmi', '04-07': 'Irma, Irmelin', '04-08': 'Nadja, Tanja',
    '04-09': 'Otto, Ottilia', '04-10': 'Ingvar, Ingvor', '04-11': 'Ulf, Ylva', '04-12': 'Liv', '04-13': 'Artur, Douglas',
    '04-14': 'Tiburtius', '04-15': 'Olivia, Oliver', '04-16': 'Patrik, Patricia', '04-17': 'Elias, Elis',
    '04-18': 'Valdemar, Volmar', '04-19': 'Olaus, Ola', '04-20': 'Amalia, Amelie', '04-21': 'Anneli, Annika',
    '04-22': 'Allan, Glenn', '04-23': 'Georg, Göran', '04-24': 'Vega', '04-25': 'Markus', '04-26': 'Teresia, Terese',
    '04-27': 'Engelbrekt', '04-28': 'Ture, Tyra', '04-29': 'Tyko', '04-30': 'Mariana',

    '05-01': 'Valborg', '05-02': 'Filip, Filippa', '05-03': 'John, Jane', '05-04': 'Monika, Mona',
    '05-05': 'Gotthard, Erhard', '05-06': 'Marit, Rita', '05-07': 'Carina, Carita', '05-08': 'Åke',
    '05-09': 'Reidar, Reidun', '05-10': 'Esbjörn, Styrbjörn', '05-11': 'Märta, Märit', '05-12': 'Charlotta, Lotta',
    '05-13': 'Linnea, Linn', '05-14': 'Halvard, Halvar', '05-15': 'Sofia, Sonja', '05-16': 'Ronald, Ronny',
    '05-17': 'Rebecka, Ruben', '05-18': 'Erik', '05-19': 'Maj, Majken', '05-20': 'Karolina, Carola',
    '05-21': 'Konstantin, Conny', '05-22': 'Hemming, Henning', '05-23': 'Desideria, Desirée', '05-24': 'Ivan, Vanja',
    '05-25': 'Urban', '05-26': 'Vilhelmina, Helmy', '05-27': 'Beda, Blenda', '05-28': 'Ingeborg, Gittan',
    '05-29': 'Jeanette, Jenny', '05-30': 'Vera, Veronika', '05-31': 'Petronella, Pernilla',

    '06-01': 'Gun, Gunnel', '06-02': 'Rutger, Roger', '06-03': 'Ingemar, Gudmar', '06-04': 'Solbritt, Solveig',
    '06-05': 'Bo', '06-06': 'Gustav, Gösta', '06-07': 'Robert, Robin', '06-08': 'Evert, Eilert', '06-09': 'Börje, Birger',
    '06-10': 'Svante, Boris', '06-11': 'Bertil, Berthold', '06-12': 'Eskil', '06-13': 'Aina, Aino', '06-14': 'Håkan, Hakon',
    '06-15': 'Margit, Margot', '06-16': 'Axel, Axelina', '06-17': 'Torborg, Torvald', '06-18': 'Björn, Bjarne',
    '06-19': 'Germund, Görel', '06-20': 'Linda', '06-21': 'Alf, Alvar', '06-22': 'Paulina, Paula', '06-23': 'Adolf, Alice',
    '06-24': 'Johannes Döparens dag', '06-25': 'David, Salomon', '06-26': 'Rakel, Lea', '06-27': 'Selma, Fingal',
    '06-28': 'Leo', '06-29': 'Peter, Petra', '06-30': 'Elof, Leif',

    '07-01': 'Aron, Mirjam', '07-02': 'Rosa, Rosita', '07-03': 'Aurora', '07-04': 'Ulrika, Ulla', '07-05': 'Laila, Ritva',
    '07-06': 'Esaias, Jessika', '07-07': 'Klas', '07-08': 'Kjell', '07-09': 'Jörgen, Örjan', '07-10': 'André, Andrea',
    '07-11': 'Eleonora, Ellinor', '07-12': 'Herman, Hermine', '07-13': 'Joel, Judit', '07-14': 'Folke',
    '07-15': 'Ragnhild, Ragnvald', '07-16': 'Reinhold, Reine', '07-17': 'Bruno', '07-18': 'Fredrik, Fritz',
    '07-19': 'Sara', '07-20': 'Margareta, Greta', '07-21': 'Johanna', '07-22': 'Magdalena, Madeleine',
    '07-23': 'Emma, Emmy', '07-24': 'Kristina, Kerstin', '07-25': 'Jakob', '07-26': 'Jesper, Jasmine',
    '07-27': 'Marta', '07-28': 'Botvid, Seved', '07-29': 'Olof', '07-30': 'Algot', '07-31': 'Helena, Elin',

    '08-01': 'Per', '08-02': 'Karin, Kajsa', '08-03': 'Tage', '08-04': 'Arne, Arnold', '08-05': 'Ulrik, Alrik',
    '08-06': 'Alfons, Inez', '08-07': 'Dennis, Denise', '08-08': 'Silvia, Sylvia', '08-09': 'Roland', '08-10': 'Lars',
    '08-11': 'Susanna', '08-12': 'Klara', '08-13': 'Kaj', '08-14': 'Uno', '08-15': 'Stella, Estelle', '08-16': 'Brynolf',
    '08-17': 'Verner, Valter', '08-18': 'Ellen, Lena', '08-19': 'Magnus, Måns', '08-20': 'Bernhard, Bernt',
    '08-21': 'Jon, Jonna', '08-22': 'Henrietta, Henrika', '08-23': 'Signe, Signhild', '08-24': 'Bartolomeus',
    '08-25': 'Lovisa, Louise', '08-26': 'Östen', '08-27': 'Rolf, Raoul', '08-28': 'Fatima, Leila', '08-29': 'Hans, Hampus',
    '08-30': 'Albert, Albertina', '08-31': 'Arvid, Vidar',

    '09-01': 'Sam, Samuel', '09-02': 'Justus, Justina', '09-03': 'Alfhild, Alva', '09-04': 'Gisela',
    '09-05': 'Adela, Heidi', '09-06': 'Lilian, Lilly', '09-07': 'Regina, Roy', '09-08': 'Alma, Hulda',
    '09-09': 'Anita, Annette', '09-10': 'Tord, Turid', '09-11': 'Dagny, Helny', '09-12': 'Åsa, Åslög',
    '09-13': 'Sture', '09-14': 'Ida, Ronja', '09-15': 'Sigrid, Siri', '09-16': 'Dag, Daga', '09-17': 'Hildegard, Magnhild',
    '09-18': 'Orvar', '09-19': 'Fredrika', '09-20': 'Elise, Lisa', '09-21': 'Matteus', '09-22': 'Maurits, Moritz',
    '09-23': 'Tekla, Tea', '09-24': 'Gerhard, Gert', '09-25': 'Tryggve', '09-26': 'Enar, Einar', '09-27': 'Dagmar, Rigmor',
    '09-28': 'Lennart, Leonard', '09-29': 'Mikael, Mikaela', '09-30': 'Helge',

    '10-01': 'Ragnar, Ragna', '10-02': 'Ludvig, Love', '10-03': 'Evald, Osvald', '10-04': 'Frans, Frank',
    '10-05': 'Bror', '10-06': 'Jenny, Jennifer', '10-07': 'Birgitta, Britta', '10-08': 'Nils', '10-09': 'Ingrid, Inger',
    '10-10': 'Harry, Harriet', '10-11': 'Erling, Jarl', '10-12': 'Valfrid, Manfred', '10-13': 'Berit, Birgit',
    '10-14': 'Stellan', '10-15': 'Hedvig, Hillevi', '10-16': 'Finn', '10-17': 'Antonia, Toini', '10-18': 'Lukas',
    '10-19': 'Tore, Tor', '10-20': 'Sibylla', '10-21': 'Ursula, Yrsa', '10-22': 'Marika, Marita', '10-23': 'Severin, Sören',
    '10-24': 'Evert, Evald', '10-25': 'Inga, Ingalill', '10-26': 'Amanda, Rasmus', '10-27': 'Sabina',
    '10-28': 'Simon, Simone', '10-29': 'Viola', '10-30': 'Elsa, Isabella', '10-31': 'Edit, Edgar',

    '11-01': 'Allhelgonadagen', '11-02': 'Tobias', '11-03': 'Hubert, Hugo', '11-04': 'Sverker', '11-05': 'Eugen, Eugenia',
    '11-06': 'Gustav Adolf', '11-07': 'Ingegerd, Ingela', '11-08': 'Vendela', '11-09': 'Teodor, Teodora',
    '11-10': 'Martin, Martina', '11-11': 'Mårten', '11-12': 'Konrad, Kurt', '11-13': 'Kristian, Krister',
    '11-14': 'Emil, Emilia', '11-15': 'Leopold', '11-16': 'Vibeke, Viveka', '11-17': 'Naemi, Naima',
    '11-18': 'Lillemor, Moa', '11-19': 'Elisabet, Lisbet', '11-20': 'Pontus, Marina', '11-21': 'Helga, Olga',
    '11-22': 'Cecilia, Sissela', '11-23': 'Klemens', '11-24': 'Gudrun, Rune', '11-25': 'Katarina, Katja',
    '11-26': 'Linus', '11-27': 'Astrid, Asta', '11-28': 'Malte', '11-29': 'Sune', '11-30': 'Andreas, Anders',

    '12-01': 'Oskar, Ossian', '12-02': 'Beata, Beatrice', '12-03': 'Lydia', '12-04': 'Barbara, Barbro',
    '12-05': 'Sven', '12-06': 'Nikolaus, Niklas', '12-07': 'Angela, Angelika', '12-08': 'Virginia',
    '12-09': 'Anna', '12-10': 'Malin, Malena', '12-11': 'Daniel, Daniela', '12-12': 'Alexander, Alexis',
    '12-13': 'Lucia', '12-14': 'Sten, Sixten', '12-15': 'Gottfrid', '12-16': 'Assar', '12-17': 'Stig',
    '12-18': 'Abraham', '12-19': 'Isak', '12-20': 'Israel, Moses', '12-21': 'Tomas', '12-22': 'Natanael, Jonatan',
    '12-23': 'Adam', '12-24': 'Eva', '12-25': 'Juldagen', '12-26': 'Stefan, Staffan', '12-27': 'Johannes, Johan',
    '12-28': 'Värnlösa barns dag', '12-29': 'Natalia, Natalie', '12-30': 'Abel, Set', '12-31': 'Sylvester'
};

// -----------------------------------------------------------------------------
// 2. MASSIVE SWEDISH TEMADAGAR & TRADITIONS DATABASE
// -----------------------------------------------------------------------------
const SWEDISH_THEME_DAYS: Record<string, { name: string; isFlagDay: boolean }> = {
    '01-01': { name: 'Nyårsdagen · Internationella pizzadagen', isFlagDay: true },
    '01-02': { name: 'Världsdagen för introverta', isFlagDay: false },
    '01-03': { name: 'J.R.R. Tolkien-dagen', isFlagDay: false },
    '01-04': { name: 'Punktskriftens dag', isFlagDay: false },
    '01-05': { name: 'Trettondagsafton', isFlagDay: false },
    '01-06': { name: 'Trettondedag jul', isFlagDay: false },
    '01-07': { name: 'Temadagens dag', isFlagDay: false },
    '01-13': { name: 'Tjugondag Knut (Julgransplundring)', isFlagDay: false },
    '01-15': { name: 'Tulpanens dag', isFlagDay: false },
    '01-16': { name: 'Het och stark mat-dagen', isFlagDay: false },
    '01-19': { name: 'Popcorndagen', isFlagDay: false },
    '01-21': { name: 'Kramens dag', isFlagDay: false },
    '01-22': { name: 'Vinets dag', isFlagDay: false },
    '01-24': { name: 'Internationella utbildningsdagen', isFlagDay: false },
    '01-27': { name: 'Förintelsens minnesdag', isFlagDay: false },
    '01-28': { name: 'Konungens namnsdag', isFlagDay: true },
    '01-29': { name: 'Veganska pizzadagen', isFlagDay: false },
    '01-30': { name: 'Croissantens dag', isFlagDay: false },

    '02-01': { name: 'Vegetariska dagen', isFlagDay: false },
    '02-02': { name: 'Internationella våtmarksdagen', isFlagDay: false },
    '02-03': { name: 'Morotskakans dag', isFlagDay: false },
    '02-04': { name: 'Världscancerdagen', isFlagDay: false },
    '02-05': { name: 'Nutelladagen', isFlagDay: false },
    '02-06': { name: 'Samernas nationaldag', isFlagDay: true },
    '02-09': { name: 'Äppelknyckardagen', isFlagDay: false },
    '02-12': { name: 'Darwindagen', isFlagDay: false },
    '02-14': { name: 'Alla hjärtans dag (Valentine\'s Day)', isFlagDay: false },
    '02-15': { name: 'Geléhallonens dag', isFlagDay: false },
    '02-18': { name: 'Fotens dag', isFlagDay: false },
    '02-21': { name: 'Internationella modersmålsdagen', isFlagDay: false },
    '02-24': { name: 'Sverigefinnarnas dag', isFlagDay: false },
    '02-25': { name: 'Grapefruktens dag', isFlagDay: false },
    '02-27': { name: 'Internationella isbjörnsdagen', isFlagDay: false },

    '03-01': { name: 'Pannkaksdagen', isFlagDay: false },
    '03-03': { name: 'Mandelbiskvins dag', isFlagDay: false },
    '03-08': { name: 'Internationella kvinnodagen', isFlagDay: false },
    '03-09': { name: 'Tomatsåsens dag', isFlagDay: false },
    '03-12': { name: 'Kronprinsessans namnsdag', isFlagDay: true },
    '03-13': { name: 'Mazarindagen', isFlagDay: false },
    '03-14': { name: 'Pi-dagen (Matematikdagen)', isFlagDay: false },
    '03-17': { name: 'Saint Patrick\'s Day', isFlagDay: false },
    '03-20': { name: 'Vårdagjämningen · Internationella glädjedagen', isFlagDay: false },
    '03-21': { name: 'Rocka sockorna · Världspoesidagen', isFlagDay: false },
    '03-22': { name: 'Världsvattendagen', isFlagDay: false },
    '03-23': { name: 'Världsmeteorologidagen', isFlagDay: false },
    '03-25': { name: 'Våffeldagen', isFlagDay: false },
    '03-31': { name: 'World Backup Day', isFlagDay: false },

    '04-01': { name: 'Första april (April Fools)', isFlagDay: false },
    '04-04': { name: 'Morotsdagen', isFlagDay: false },
    '04-07': { name: 'Världshälsodagen', isFlagDay: false },
    '04-08': { name: 'Romernas internationella dag', isFlagDay: false },
    '04-09': { name: 'Gin & Tonic-dagen', isFlagDay: false },
    '04-12': { name: 'Lakritsdagen', isFlagDay: false },
    '04-14': { name: 'Tiburtiusdagen (Sommarens början)', isFlagDay: false },
    '04-20': { name: 'Polkagrisens dag', isFlagDay: false },
    '04-22': { name: 'Jordens dag (Earth Day)', isFlagDay: false },
    '04-23': { name: 'Världsbokdagen', isFlagDay: false },
    '04-28': { name: 'Arbetsmiljödagen', isFlagDay: false },
    '04-29': { name: 'Svenska friluftsdagen · Dansens dag', isFlagDay: false },
    '04-30': { name: 'Valborgsmässoafton · Konungens födelsedag', isFlagDay: true },

    '05-01': { name: 'Första maj', isFlagDay: true },
    '05-04': { name: 'Star Wars-dagen (May the 4th)', isFlagDay: false },
    '05-05': { name: 'Internationella kebabdagen', isFlagDay: false },
    '05-08': { name: 'Coca-Cola-dagen', isFlagDay: false },
    '05-09': { name: 'Europadagen', isFlagDay: false },
    '05-11': { name: 'Chokladbollens dag', isFlagDay: false },
    '05-13': { name: 'Barnens dag', isFlagDay: false },
    '05-14': { name: 'Teckenspråkets dag', isFlagDay: false },
    '05-15': { name: 'Kardemummabullens dag', isFlagDay: false },
    '05-17': { name: 'Norges nationaldag (17 maj)', isFlagDay: false },
    '05-20': { name: 'Världsbidagen', isFlagDay: false },
    '05-22': { name: 'Picknickens dag', isFlagDay: false },
    '05-25': { name: 'Handduksdagen (Nörddagen)', isFlagDay: false },
    '05-27': { name: 'Muffinsdagen', isFlagDay: false },
    '05-28': { name: 'Internationella hamburgardagen', isFlagDay: false },
    '05-29': { name: 'Veterandagen', isFlagDay: true },

    '06-01': { name: 'Mjölkens dag', isFlagDay: false },
    '06-05': { name: 'Världsmiljödagen', isFlagDay: false },
    '06-06': { name: 'Sveriges nationaldag', isFlagDay: true },
    '06-08': { name: 'Världshavsdagen', isFlagDay: false },
    '06-14': { name: 'Internationella blodgivardagen', isFlagDay: false },
    '06-18': { name: 'Internationella sushi-dagen', isFlagDay: false },
    '06-21': { name: 'Sommarsolståndet (Årets längsta dag)', isFlagDay: false },

    '07-06': { name: 'Internationella kyssdagen', isFlagDay: false },
    '07-13': { name: 'Paltdagen', isFlagDay: false },
    '07-14': { name: 'Kronprinsessans födelsedag', isFlagDay: true },
    '07-15': { name: 'Ölets dag', isFlagDay: false },
    '07-23': { name: 'Varmkorvens dag', isFlagDay: false },
    '07-29': { name: 'Lasagnens dag', isFlagDay: false },

    '08-08': { name: 'Drottningens namnsdag', isFlagDay: true },
    '08-13': { name: 'Vänsterhäntas dag', isFlagDay: false },
    '08-19': { name: 'Luftballongens dag', isFlagDay: false },
    '08-20': { name: 'Honungens dag', isFlagDay: false },
    '08-23': { name: 'Köttbullens dag', isFlagDay: false },
    '08-28': { name: 'Kräftskivedagen', isFlagDay: false },

    '09-01': { name: 'Svampens dag', isFlagDay: false },
    '09-11': { name: 'Kebabens dag', isFlagDay: false },
    '09-12': { name: 'Kaffebullens dag', isFlagDay: false },
    '09-19': { name: 'Internationella piratdagen', isFlagDay: false },
    '09-22': { name: 'Bilfria dagen', isFlagDay: false },
    '09-23': { name: 'Höstdagjämningen', isFlagDay: false },
    '09-25': { name: 'Äpplets dag', isFlagDay: false },
    '09-26': { name: 'Lösgodisets dag · Europeiska språkdagen', isFlagDay: false },
    '09-29': { name: 'Kaffets dag', isFlagDay: false },

    '10-01': { name: 'Internationella vegetariska dagen', isFlagDay: false },
    '10-04': { name: 'Kanelbullens dag', isFlagDay: false },
    '10-10': { name: 'Grötens dag', isFlagDay: false },
    '10-11': { name: 'Äppelmustens dag', isFlagDay: false },
    '10-14': { name: 'Räkmackans dag', isFlagDay: false },
    '10-16': { name: 'Världsbröddagen', isFlagDay: false },
    '10-24': { name: 'FN-dagen', isFlagDay: true },
    '10-25': { name: 'Världspastadagen', isFlagDay: false },
    '10-31': { name: 'Halloween', isFlagDay: false },

    '11-06': { name: 'Gustav Adolfsdagen', isFlagDay: true },
    '11-07': { name: 'Kladdkakans dag', isFlagDay: false },
    '11-10': { name: 'Mårtensafton', isFlagDay: false },
    '11-11': { name: 'Chokladens dag', isFlagDay: false },
    '11-13': { name: 'Smörgåstårtans dag', isFlagDay: false },
    '11-14': { name: 'Ostkakans dag', isFlagDay: false },
    '11-18': { name: 'Vodkans dag', isFlagDay: false },
    '11-19': { name: 'Internationella mansdagen', isFlagDay: false },
    '11-20': { name: 'Barnkonventionens dag', isFlagDay: false },
    '11-22': { name: 'Wienerbrödets dag', isFlagDay: false },
    '11-30': { name: 'Kåldolmens dag', isFlagDay: false },

    '12-01': { name: 'Brandvarnardagen', isFlagDay: false },
    '12-09': { name: 'Pepparkakans dag', isFlagDay: false },
    '12-10': { name: 'Nobeldagen', isFlagDay: true },
    '12-13': { name: 'Lucia', isFlagDay: false },
    '12-21': { name: 'Vintersolståndet (Årets kortaste dag)', isFlagDay: false },
    '12-23': { name: 'Drottningens födelsedag', isFlagDay: true },
    '12-24': { name: 'Julafton (Christmas Eve)', isFlagDay: false },
    '12-25': { name: 'Juldagen (Christmas Day)', isFlagDay: true },
    '12-26': { name: 'Annandag jul (Boxing Day)', isFlagDay: false },
    '12-31': { name: 'Nyårsafton (New Year\'s Eve)', isFlagDay: false }
};

// -----------------------------------------------------------------------------
// 3. ASTRONOMICAL EASTER & MOVABLE SWEDISH OCCASIONS
// -----------------------------------------------------------------------------
function getEasterSunday(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function formatDateKey(d: Date): string {
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface DynamicHolidays {
    redDays: Map<string, string>;
    specialDays: Map<string, { name: string; isFlagDay: boolean }>;
}

function computeDynamicHolidaysForYear(year: number): DynamicHolidays {
    const redDays = new Map<string, string>();
    const specialDays = new Map<string, { name: string; isFlagDay: boolean }>();

    // Fixed Röda Dagar
    redDays.set('01-01', 'Nyårsdagen');
    redDays.set('01-06', 'Trettondedag jul');
    redDays.set('05-01', 'Första maj');
    redDays.set('06-06', 'Sveriges nationaldag');
    redDays.set('12-24', 'Julafton');
    redDays.set('12-25', 'Juldagen');
    redDays.set('12-26', 'Annandag jul');
    redDays.set('12-31', 'Nyårsafton');

    const easter = getEasterSunday(year);
    const addDays = (base: Date, days: number): Date => new Date(base.getTime() + days * 86400000);

    // Movable Easter & Spring Cycle
    const fettisdagen = addDays(easter, -47);
    specialDays.set(formatDateKey(fettisdagen), { name: 'Fettisdagen (Semlans dag)', isFlagDay: false });

    const skartorsdag = addDays(easter, -3);
    specialDays.set(formatDateKey(skartorsdag), { name: 'Skärtorsdagen', isFlagDay: false });

    const langfredag = addDays(easter, -2);
    redDays.set(formatDateKey(langfredag), 'Långfredagen');

    const paskafton = addDays(easter, -1);
    specialDays.set(formatDateKey(paskafton), { name: 'Påskafton', isFlagDay: false });

    redDays.set(formatDateKey(easter), 'Påskdagen');
    specialDays.set(formatDateKey(easter), { name: 'Påskdagen', isFlagDay: true });

    const annandagPask = addDays(easter, 1);
    redDays.set(formatDateKey(annandagPask), 'Annandag påsk');

    const kristiHimmelsfard = addDays(easter, 39); // Always Thursday
    redDays.set(formatDateKey(kristiHimmelsfard), 'Kristi himmelsfärdsdag');

    const pingstafton = addDays(easter, 48);
    specialDays.set(formatDateKey(pingstafton), { name: 'Pingstafton', isFlagDay: false });

    const pingstdagen = addDays(easter, 49); // Always Sunday
    redDays.set(formatDateKey(pingstdagen), 'Pingstdagen');
    specialDays.set(formatDateKey(pingstdagen), { name: 'Pingstdagen', isFlagDay: true });

    // Fössta tossdan i mars (First Thursday of March)
    const mar1 = new Date(year, 2, 1);
    const firstThursDay = 1 + ((4 - mar1.getDay() + 7) % 7);
    const fosstaTossda = new Date(year, 2, firstThursDay);
    specialDays.set(formatDateKey(fosstaTossda), { name: 'Fössta tossdan i mars (Massipantåta)', isFlagDay: false });

    // Mors dag (Last Sunday in May)
    for (let day = 31; day >= 25; day--) {
        const testD = new Date(year, 4, day);
        if (testD.getDay() === 0) {
            specialDays.set(formatDateKey(testD), { name: 'Mors dag (Mother\'s Day)', isFlagDay: false });
            break;
        }
    }

    // Fars dag (Second Sunday in November)
    let sundayCount = 0;
    for (let day = 1; day <= 14; day++) {
        const testD = new Date(year, 10, day);
        if (testD.getDay() === 0) {
            sundayCount++;
            if (sundayCount === 2) {
                specialDays.set(formatDateKey(testD), { name: 'Fars dag (Father\'s Day)', isFlagDay: false });
                break;
            }
        }
    }

    // Midsommar (Saturday between June 20 and June 26)
    for (let day = 20; day <= 26; day++) {
        const testD = new Date(year, 5, day);
        if (testD.getDay() === 6) {
            redDays.set(formatDateKey(testD), 'Midsommardagen');
            specialDays.set(formatDateKey(testD), { name: 'Midsommardagen', isFlagDay: true });

            const afton = addDays(testD, -1);
            redDays.set(formatDateKey(afton), 'Midsommarafton');
            specialDays.set(formatDateKey(afton), { name: 'Midsommarafton', isFlagDay: false });
            break;
        }
    }

    // Alla helgons dag (Saturday between October 31 and November 6)
    for (let day = 31; day <= 37; day++) {
        const testD = day === 31 ? new Date(year, 9, 31) : new Date(year, 10, day - 31);
        if (testD.getDay() === 6) {
            redDays.set(formatDateKey(testD), 'Alla helgons dag');
            const afton = addDays(testD, -1);
            specialDays.set(formatDateKey(afton), { name: 'Allhelgonaafton', isFlagDay: false });
            break;
        }
    }

    return { redDays, specialDays };
}

// -----------------------------------------------------------------------------
// 4. DAY INTELLIGENCE QUERY
// -----------------------------------------------------------------------------
const holidaysCache = new Map<number, DynamicHolidays>();

function getHolidaysForYear(year: number): DynamicHolidays {
    let data = holidaysCache.get(year);
    if (!data) {
        data = computeDynamicHolidaysForYear(year);
        holidaysCache.set(year, data);
    }
    return data;
}

export function isRedDayDate(d: Date): boolean {
    if (d.getDay() === 0) return true;
    const data = getHolidaysForYear(d.getFullYear());
    return data.redDays.has(formatDateKey(d));
}

export function getDayInfo(d: Date): SwedishDayIntel {
    const y = d.getFullYear();
    const key = formatDateKey(d);
    const data = getHolidaysForYear(y);

    const isSunday = d.getDay() === 0;
    const holidayFromMap = data.redDays.get(key) ?? null;
    const isRedDay = Boolean(holidayFromMap) || isSunday;

    // Bridge Day (Klämdag) Calculation
    let isKlamdag = false;
    let klamdagNote = '';
    const dayOfWeek = d.getDay();

    if (!isRedDay) {
        if (dayOfWeek === 5) {
            const thurs = new Date(d.getTime() - 86400000);
            if (isRedDayDate(thurs)) {
                isKlamdag = true;
                klamdagNote = 'Bridge Day (Klämdag)';
            }
        } else if (dayOfWeek === 1) {
            const tues = new Date(d.getTime() + 86400000);
            if (isRedDayDate(tues)) {
                isKlamdag = true;
                klamdagNote = 'Bridge Day (Klämdag)';
            }
        }
    }

    const specialEntry = data.specialDays.get(key) || SWEDISH_THEME_DAYS[key];
    const isFlagDay = specialEntry?.isFlagDay ?? false;
    const namedays = SWEDISH_NAMNSDAGAR[key] || 'No name day';

    let headline: string | null = null;
    if (holidayFromMap) {
        headline = isFlagDay ? `${holidayFromMap} 🇸🇪` : holidayFromMap;
    } else if (isKlamdag) {
        headline = klamdagNote;
    } else if (specialEntry) {
        headline = isFlagDay ? `${specialEntry.name} 🇸🇪` : specialEntry.name;
    }

    return {
        isRedDay,
        isKlamdag,
        isFlagDay,
        holidayName: headline,
        namedays
    };
}

// -----------------------------------------------------------------------------
// 5. CALENDAR COMPONENT INITIALIZER (ENGLISH UI)
// -----------------------------------------------------------------------------
export function initCalendar(onSelectDate: (dateStr: string, activeDeadlines: string[]) => void): () => void {
    const grid = document.getElementById('cal-days-grid');
    const headerTitle = document.getElementById('cal-header-title');
    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');
    const selectedLabel = document.getElementById('cal-selected-label');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let viewDate = new Date();
    let selectedDate = new Date();

    function render(): void {
        if (!grid || !headerTitle) return;
        grid.innerHTML = '';

        const y = viewDate.getFullYear();
        const m = viewDate.getMonth();
        headerTitle.textContent = `${months[m]} ${y}`;

        let deadlineMap: Record<string, string[]> = {};
        const saved = localStorage.getItem('everything_deadlines_v2');
        if (saved) {
            try {
                const list = JSON.parse(saved) as Array<{ title: string; dueDate: string }>;
                list.forEach(item => {
                    deadlineMap[item.dueDate] = deadlineMap[item.dueDate] || [];
                    deadlineMap[item.dueDate]?.push(item.title);
                });
            } catch {
                deadlineMap = {};
            }
        }

        const firstDayIdx = (new Date(y, m, 1).getDay() + 6) % 7;
        const daysInCurrent = new Date(y, m + 1, 0).getDate();
        const daysInPrev = new Date(y, m, 0).getDate();

        // Prev month filler
        for (let i = firstDayIdx; i > 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell outside-month';
            cell.textContent = String(daysInPrev - i + 1);
            grid.appendChild(cell);
        }

        // Current month
        for (let i = 1; i <= daysInCurrent; i++) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell';
            cell.textContent = String(i);

            const thisDate = new Date(y, m, i);
            const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const intel = getDayInfo(thisDate);

            // Red day: bold red. Klämdag: soft muted red.
            if (intel.isRedDay) {
                cell.classList.add('red-day');
            } else if (intel.isKlamdag) {
                cell.classList.add('klam-day');
                cell.title = 'Bridge Day (Klämdag)';
            }

            if (intel.isFlagDay) {
                cell.classList.add('flag-day');
            }

            const dayDeadlines = deadlineMap[dateStr] || [];
            if (dayDeadlines.length > 0) {
                cell.classList.add('has-deadline');
                cell.title = `Deadlines: ${dayDeadlines.join(', ')}`;
            }

            if (
                selectedDate.getDate() === i &&
                selectedDate.getMonth() === m &&
                selectedDate.getFullYear() === y
            ) {
                cell.classList.add('active-day');
            }

            cell.addEventListener('click', () => {
                selectedDate = new Date(y, m, i);
                render();
                if (selectedLabel) {
                    selectedLabel.textContent = `${monthsShort[m]} ${i}, ${y}`;
                }
                onSelectDate(dateStr, dayDeadlines);
            });

            grid.appendChild(cell);
        }

        if (selectedLabel) {
            selectedLabel.textContent = `${monthsShort[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
        }
    }

    prevBtn?.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        render();
    });

    nextBtn?.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        render();
    });

    render();
    return render;
}