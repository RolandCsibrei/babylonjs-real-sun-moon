const starnames = [
  'Cedric',
  'Deltakosh',
  'Evgeni',
  'Mawa',
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
  'Mawa',
  'Necips',
  'Pirate JC',
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
  'Mawa',
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
  'Cedric',
  'Deltakosh',
  'Evgeni',
  'Mawa',
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
  'Mawa',
  'Deltakosh',
  'Evgeni',
  'Thank you David!',
  'Mawa',
  'Necips',
  'Pirate JC',
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
  'Mawa',
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
  'Thank you David!',
  'Deltakosh',
  'Evgeni',
  'Mawa',
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
