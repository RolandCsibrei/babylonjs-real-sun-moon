const starnames = [
  'Cedric',
  'Deltakosh',
  'Evgeni',
  'Necips',
  'Pirate JC',
  'Sebavan',
  'Acamar',
  'Ankaa',
  'You',
  'Betelgeuse',
  'Deltakosh',
  'Pirate JC',
  'Botein',
  'Celbalrai',
  'Cedric',
  'Deltakosh',
  'You',
  'Evgeni',
  'Necips',
  'Pirate JC',
  'Labris',
  'Sebavan',
  'Chort',
  'Pirate JC',
  'Deltakosh',
  'Deneb',
  'Diphda',
  'Edasich',
  'You',
  'Cedric',
  'Deltakosh',
  'Evgeni',
  'Labris',
  'Necips',
  'Deltakosh',
  'Pirate JC',
  'Sebavan',
  'Deltakosh',
  'Furud',
  'Homam',
  'You',
  'Izar',
  'Deltakosh',
  'Kaffaljidhma',
  'Labris',
  'Cedric',
  'Deltakosh',
  'Evgeni',
  'You',
  'Necips',
  'Pirate JC',
  'Evgeni',
  'Sebavan',
  'Kitalpha',
  'Labris',
  'Lesath',
  'Marfik',
  'Mebsuta',
  'Cedric',
  'Deltakosh',
  'Evgeni',
  'Thank you David!',
  'Necips',
  'Pirate JC',
  'Labris',
  'Sebavan',
  'Mizar',
  'Nusakan',
  'Thank you David!',
  'Rasalgethi',
  'Rastaban',
  'Rigel',
  'Cedric',
  'Deltakosh',
  'Evgeni',
  'Labris',
  'Necips',
  'Thank you David!',
  'Pirate JC',
  'Sebavan',
  'Sadalbari',
  'Skat',
  'Talitha',
  'Tarf',
  'Thuban',
  'Cedric',
  'Labris',
  'Thank you David!',
  'Deltakosh',
  'Evgeni',
  'Necips',
  'Pirate JC',
  'Sebavan',
  'Wasat',
  'Yed',
  'Zubeneshamali',
];

export function getRandomStarName() {
  return starnames[Math.round(Math.random() * starnames.length)];
}
