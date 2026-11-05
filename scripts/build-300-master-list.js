const fs = require('fs');

const original61 = [
  'Taylor Swift', 'Ariana Grande', 'Shawn Mendes', 'Ed Sheeran', 'Tate McRae', 'Martin Garrix', 'Troye Sivan',
  'The Chainsmokers', 'Bebe Rexha', 'Selena Gomez', 'Marshmello', '5 Seconds of Summer', 'Kygo', 'Coldplay',
  'The Script', 'OneRepublic', 'The Vamps', 'Jonas Blue', 'Lauv', "Why Don't We", 'Charlie Puth',
  'Alessia Cara', 'Zedd', 'Hailee Steinfeld', 'Alesso', 'Maroon 5', 'Katy Perry', 'Khalid', 'Justin Bieber',
  'One Direction', 'Liam Payne', 'Harry Styles', 'Zayn', 'Louis Tomlinson', 'Niall Horan', 'Rita Ora',
  'Nicki Minaj', 'Dove Cameron', 'Bella Poarch', 'Rihanna', 'Sabrina Carpenter', 'David Kushner', 'Dua Lipa',
  'Little Mix', 'Demi Lovato', 'Sam Smith', 'Camila Cabello', 'Clean Bandit', 'Imagine Dragons', 'Post Malone',
  'The Weeknd', 'Miley Cyrus', 'Bruno Mars', 'Cheat Codes', 'Julia Michaels', 'Justin Timberlake', 'Sia',
  'Avicii', 'Sandro Cavazza', 'Alan Walker', 'Shakira'
];

const countryArtists = [
  'Luke Combs', 'Morgan Wallen', 'Zach Bryan', 'Chris Stapleton', 'Carrie Underwood',
  'Dolly Parton', 'Johnny Cash', 'Shania Twain', 'Keith Urban', 'Blake Shelton',
  'Kacey Musgraves', 'Tim McGraw', 'Kenny Chesney', 'Florida Georgia Line', 'Thomas Rhett',
  'Kane Brown', 'Jason Aldean', 'Miranda Lambert', 'Brad Paisley', 'Lainey Wilson',
  'Cody Johnson', 'Bailey Zimmerman', 'Jelly Roll', 'Dan + Shay', 'Rascal Flatts'
];

const promptArtists = [
  'Billie Eilish', 'Olivia Rodrigo', 'Lorde', 'Lana Del Rey', 'Lady Gaga', 'Beyoncé', 'Adele', 'Britney Spears',
  'Christina Aguilera', 'Kelly Clarkson', 'Demi Moore', 'P!nk', 'Gwen Stefani', 'Avril Lavigne', 'Hilary Duff',
  'Jennifer Lopez', 'Alicia Keys', 'SZA', 'Halsey', 'Madison Beer', 'Becky G', 'Anne-Marie',
  'Zara Larsson', 'Tove Lo', 'Ellie Goulding', 'BØRNS', 'Conan Gray', 'Benson Boone', 'Gracie Abrams',
  'Chappell Roan', 'Reneé Rapp', 'RAYE', 'FKA twigs', 'Jorja Smith', 'Kehlani', 'Summer Walker', 'H.E.R.',
  'Normani', 'Tinashe', 'Coco Jones', 'Victoria Monét', 'Jazmine Sullivan', 'Daniel Caesar', 'Giveon',
  'Frank Ocean', 'Miguel', 'Usher', 'Chris Brown', 'Ne-Yo', 'Trey Songz', 'John Legend',
  'Mary J. Blige', 'Lauryn Hill', 'Erykah Badu', 'Brandy', 'Monica', 'Aaliyah',
  'Drake', 'Kendrick Lamar', 'J. Cole', 'Travis Scott', 'Kanye West', 'Eminem', 'Jay-Z', 'Nas',
  'Lil Wayne', 'Future', 'Metro Boomin', '21 Savage', 'Don Toliver', 'Playboi Carti', 'Tyler, The Creator',
  'A$AP Rocky', 'Lil Uzi Vert', 'Lil Baby', 'Gunna', 'Young Thug', 'Roddy Ricch', 'Jack Harlow',
  'Doja Cat', 'Megan Thee Stallion', 'Cardi B', 'Ice Spice', 'Latto', 'Saweetie',
  'Flo Milli', 'Nicki Nicole', 'Central Cee', 'Stormzy', 'Dave', 'Skepta', 'NF', 'Logic',
  'Macklemore', 'G-Eazy', 'Machine Gun Kelly',
  'David Guetta', 'Calvin Harris', 'Tiësto', 'Armin van Buuren', 'Hardwell', 'Dimitri Vegas & Like Mike',
  'Afrojack', 'Steve Aoki', 'Don Diablo', 'Nicky Romero', 'Oliver Heldens', 'R3HAB', 'KSHMR',
  'W&W', 'Swedish House Mafia', 'Axwell', 'Sebastian Ingrosso', 'Eric Prydz', 'Deadmau5',
  'Porter Robinson', 'Madeon', 'ODESZA', 'Flume', 'Disclosure', 'SG Lewis', 'Purple Disco Machine',
  'Fisher', 'Fred again..', 'Skrillex', 'Diplo', 'Major Lazer', 'DJ Snake', 'Lost Frequencies',
  'Robin Schulz', 'Sigala',
  'The 1975', 'Arctic Monkeys', 'The Neighbourhood', 'Twenty One Pilots', 'Panic! at the Disco',
  'Fall Out Boy', 'Paramore', 'Linkin Park', 'Green Day',
  'The Killers', 'Kings of Leon', 'Foster the People', 'Walk the Moon', 'The Fray', 'Keane',
  'Snow Patrol', 'Kodaline', 'Bastille', 'Of Monsters and Men', 'Mumford & Sons', 'The Lumineers',
  'Florence + The Machine', 'Hozier', 'Glass Animals', 'Cage the Elephant', 'Tame Impala', 'The Strokes',
  'Gorillaz', 'Radiohead', 'Oasis', 'Blur', 'The Beatles', 'Queen', 'Bon Jovi', 'Aerosmith',
  "Guns N' Roses",
  'BTS', 'BLACKPINK', 'TWICE', 'EXO', 'SEVENTEEN', 'Stray Kids', 'ENHYPEN', 'TXT',
  'ATEEZ', 'NCT 127', 'NCT DREAM', 'Red Velvet', 'aespa', 'LE SSERAFIM', 'NewJeans',
  'IVE', 'ITZY', '(G)I-DLE', 'BABYMONSTER', 'RIIZE', 'BIGBANG', "Girls' Generation",
  'SHINee', 'IU', 'Taeyeon', 'Jung Kook', 'Jimin', 'Lisa', 'ROSÉ', 'Jisoo',
  'James Arthur', 'Lewis Capaldi', 'James Bay', 'Passenger', 'George Ezra', 'Tom Odell',
  'Alec Benjamin', 'Jeremy Zucker', 'Alexander 23', 'JP Saxe', 'Dean Lewis', 'Matt Maltese',
  'Stephen Sanchez', 'Michael Bublé', 'Jason Mraz', 'Jack Johnson', 'Norah Jones', 'Damien Rice',
  'Vance Joy', 'Dermot Kennedy',
  'Bad Bunny', 'J Balvin', 'Maluma', 'Karol G', 'Rosalía', 'Enrique Iglesias',
  'Ricky Martin', 'Luis Fonsi', 'Daddy Yankee',
  'Ben&Ben', 'Moira Dela Torre', 'Zack Tabudlo', 'December Avenue', 'SB19'
];

const supplementaryAcousticAndPop = [
  'Noah Kahan', 'Teddy Swims', 'Finneas', 'Labrinth', 'Troye Sivan',
  'Cigarettes After Sex', 'Mac DeMarco', 'Dominic Fike', 'The Weeknd',
  'Rex Orange County', 'Clairo', 'Beabadoobee', 'Phoebe Bridgers', 'Boygenius',
  'Mitski', 'Joji', 'Calum Scott', 'Dean Lewis', 'Alec Benjamin',
  'Sam Fender', 'Declan McKenna', 'Yungblud', 'Twenty One Pilots', '5 Seconds of Summer',
  'The Black Keys', 'Red Hot Chili Peppers', 'Foo Fighters', 'Nirvana', 'Radiohead',
  'AC/DC', 'Fleetwood Mac', 'Elton John', 'David Bowie', 'Prince', 'Michael Jackson',
  'Madonna', 'George Michael', 'Phil Collins', 'Genesis', 'The Police', 'Sting',
  'U2', 'R.E.M.', 'The Smiths', 'The Cure', 'Depeche Mode', 'Daft Punk',
  'Justice', 'The Chemical Brothers', 'Fatboy Slim', 'Moby', 'Kygo'
];

const masterList = [];
const seen = new Set();

function addArtist(name) {
  if (!name) return;
  const clean = name.trim();
  const lower = clean.toLowerCase();
  if (!seen.has(lower)) {
    seen.add(lower);
    masterList.push(clean);
  }
}

// 1. All original 61 artists
original61.forEach(addArtist);

// 2. All 25 Country artists
countryArtists.forEach(addArtist);

// 3. All additional prompt artists
promptArtists.forEach(addArtist);

// 4. Fill to exactly 300 unique artists
supplementaryAcousticAndPop.forEach((name) => {
  if (masterList.length < 300) {
    addArtist(name);
  }
});

console.log('Final Master List Count:', masterList.length);
fs.writeFileSync('scripts/master-300-artists.json', JSON.stringify(masterList, null, 2), 'utf8');
console.log('Saved to scripts/master-300-artists.json');

