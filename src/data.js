
import {Answer} from './Answer.js'

export const subjects = [

  {id: 657, date: new Date("2022-05-15"), name: "Frontex EU-Verordnung", hash: "2022-05_2", outcome: Answer.Yes},
  {id: 656, date: new Date("2022-05-15"), name: "Änderung des Transplantationsgesetzes", hash: "2022-05_3", outcome: Answer.Yes},
  {id: 655, date: new Date("2022-05-15"), name: "Änderung des Filmgesetzes", hash: "2022-05_1", outcome: Answer.Yes},

  {id: 654, date: new Date("2022-02-13"), name: "Massnahmenpaket zugunsten der Medien", hash: "2022-02_3", outcome: Answer.No},
  {id: 653, date: new Date("2022-02-13"), name: "Änderung Bundesgesetzes Stempelabgaben", hash: "2022-02_2", outcome: Answer.No},
  {id: 652, date: new Date("2022-02-13"), name: "Kinder ohne Tabakwerbung", hash: "2022-02_1", outcome: Answer.Yes},
  {id: 651, date: new Date("2022-02-13"), name: "Tierversuchsverbotsinitiative", hash: "2022-02_4", outcome: Answer.No},

  // is this right with the ids? pflege and justiz may be swapped
  {id: 650, date: new Date("2021-11-28"), name: "Covid-19-Gesetz #2", hash: "2021-11_1", outcome: Answer.Yes},
  {id: 649, date: new Date("2021-11-28"), name: "Justiz-Initiative", hash: "2021-11_2", outcome: Answer.No},
  {id: 648, date: new Date("2021-11-28"), name: "Pflegeinitiative", hash: "2021-11_3", outcome: Answer.Yes},

  {id: 647, date: new Date("2021-09-26"), name: "Ehe für Alle", outcome: Answer.Yes, hash: "2021-09_1"},
  {id: 646, date: new Date("2021-09-26"), name: "Löhne entlasten, Kapital gerecht besteuern", outcome: Answer.No, hash: "2021-09_2"},

  {id: 645, date: new Date("2021-06-13"), name: "Anti-Terror-Gesetz", outcome: Answer.Yes, hash: "2021-06_1"},
  {id: 644, date: new Date("2021-06-13"), name: "CO2-Gesetz", outcome: Answer.No, hash: "2021-06_5"},
  {id: 643, date: new Date("2021-06-13"), name: "Covid-19-Gesetz #1", outcome: Answer.Yes, hash: "2021-06_4"},
  {id: 642, date: new Date("2021-06-13"), name: "Pestizid-Initiative", outcome: Answer.No, hash: "2021-06_3"},
  {id: 641, date: new Date("2021-06-13"), name: "Trinkwasser-Initiative", outcome: Answer.No, hash: "2021-06_2"},

  {id: 640, date: new Date("2021-03-07"), name: "Freihandelsabkommen Indonesien", outcome: Answer.Yes, hash: "2021-03_3"},
  {id: 639, date: new Date("2021-03-07"), name: "E-ID Gesetz", outcome: Answer.No, hash: "2021-03_2"},
  {id: 638, date: new Date("2021-03-07"), name: "Verhüllungsverbot", outcome: Answer.Yes, hash: "2021-03_1"},

  {id: 637, date: new Date("2020-11-29"), name: "Kriegsgeschäfte-Initiative", outcome: Answer.No, hash: "2020-11_1"},
  {id: 636, date: new Date("2020-11-29"), name: "Konzernverantwortungs-Initiative", outcome: Answer.No, hash: "2020-11_2"},

  {id: 635, date: new Date("2020-09-27"), name: "Kampfjetbeschaffung", outcome: Answer.Yes, hash: "2020-09_4"},
  {id: 634, date: new Date("2020-09-27"), name: "Vaterschaftsurlaub", outcome: Answer.Yes, hash: "2020-09_2"},
  {id: 633, date: new Date("2020-09-27"), name: "Kinderzulagen", outcome: Answer.No, hash: "2020-09_1"},
  {id: 632, date: new Date("2020-09-27"), name: "Jagdgesetz (Wolf)", outcome: Answer.No, hash: "2020-09_3"},
  {id: 631, date: new Date("2020-09-27"), name: "Begrenzungsinitiative", outcome: Answer.No, hash: "2020-09_5"},
];

export const parties = [
  {
    id: 0,
    name: "SP",
    votes: [
      {id: 631, answer: Answer.No},
      {id: 635, answer: Answer.No},
      {id: 632, answer: Answer.No},
      {id: 634, answer: Answer.Yes},
      {id: 633, answer: Answer.No},
      {id: 636, answer: Answer.Yes},
      {id: 637, answer: Answer.Yes},
      {id: 640, answer: Answer.No},
      {id: 639, answer: Answer.No},
      {id: 638, answer: Answer.No},
      {id: 644, answer: Answer.Yes},
      {id: 643, answer: Answer.Yes},
      {id: 642, answer: Answer.Yes},
      {id: 641, answer: Answer.Yes},
      {id: 645, answer: Answer.No},
      {id: 647, answer: Answer.Yes},
      {id: 646, answer: Answer.Yes},

      {id: 650, answer: Answer.Yes},
      {id: 649, answer: Answer.Yes},
      {id: 648, answer: Answer.No},

      {id: 652, answer: Answer.Yes},
      {id: 653, answer: Answer.No},
      {id: 654, answer: Answer.Yes},
      {id: 651, answer: Answer.No},

      {id: 655, answer: Answer.Yes},
    ]
  },{
    id: 1,
    name: "GP",
    votes: [
      {id: 631, answer: Answer.No},
      {id: 635, answer: Answer.No},
      {id: 632, answer: Answer.No},
      {id: 634, answer: Answer.Yes},
      {id: 633, answer: Answer.No},
      {id: 636, answer: Answer.Yes},
      {id: 637, answer: Answer.Yes},
      {id: 640, answer: Answer.No},
      {id: 639, answer: Answer.No},
      {id: 638, answer: Answer.No},
      {id: 644, answer: Answer.Yes},
      {id: 643, answer: Answer.Yes},
      {id: 642, answer: Answer.Yes},
      {id: 641, answer: Answer.Yes},
      {id: 645, answer: Answer.No},
      {id: 647, answer: Answer.Yes},
      {id: 646, answer: Answer.Yes},

      {id: 650, answer: Answer.Yes}, // is this right?
      {id: 649, answer: Answer.Yes},
      {id: 648, answer: Answer.No},

      {id: 652, answer: Answer.Yes},
      {id: 653, answer: Answer.No},
      {id: 654, answer: Answer.Yes},
      {id: 651, answer: Answer.No},

      {id: 655, answer: Answer.Yes},
    ]
  },{
    id: 2,
    name: "GLP",
    votes: [
      {id: 631, answer: Answer.No},
      {id: 635, answer: Answer.Yes},
      {id: 632, answer: Answer.No},
      {id: 634, answer: Answer.Yes},
      {id: 633, answer: Answer.No},
      {id: 636, answer: Answer.Yes},
      {id: 637, answer: Answer.No},
      {id: 640, answer: Answer.Yes},
      {id: 639, answer: Answer.No},
      {id: 638, answer: Answer.No},
      {id: 644, answer: Answer.Yes},
      {id: 643, answer: Answer.Yes},
      {id: 642, answer: Answer.Abstention},
      {id: 641, answer: Answer.Yes},
      {id: 645, answer: Answer.No},
      {id: 647, answer: Answer.Yes},
      {id: 646, answer: Answer.No},
      {id: 650, answer: Answer.Yes},
      {id: 649, answer: Answer.Yes},
      {id: 648, answer: Answer.No},
      {id: 652, answer: Answer.Yes},
      {id: 653, answer: Answer.Yes},
      {id: 654, answer: Answer.Yes},
      {id: 651, answer: Answer.No},

      {id: 655, answer: Answer.Yes},
    ]
  },{
  //   id: 3,
  //   name: "EVP",
  //   votes: [
  //     {id: 631, answer: Answer.No},
  //     {id: 635, answer: Answer.Yes},
  //     {id: 632, answer: Answer.No},
  //     {id: 634, answer: Answer.Yes},
  //     {id: 633, answer: Answer.Yes},
  //     {id: 636, answer: Answer.Yes},
  //     {id: 637, answer: Answer.Yes},
  //     {id: 640, answer: Answer.No},
  //     {id: 639, answer: Answer.Yes},
  //     {id: 638, answer: Answer.Abstention},
  //     {id: 644, answer: Answer.Yes},
  //     {id: 643, answer: Answer.Yes},
  //     {id: 642, answer: Answer.Yes},
  //     {id: 641, answer: Answer.Yes},
  //     {id: 645, answer: Answer.Yes},
  //     {id: 647, answer: Answer.No},
  //     {id: 646, answer: Answer.Yes},
  //   ]
  // },{
  //   id: 4,
  //   name: "BDP",
  //   votes: [
  //     {id: 631, answer: Answer.No},
  //     {id: 635, answer: Answer.Yes},
  //     {id: 632, answer: Answer.Yes},
  //     {id: 634, answer: Answer.Yes},
  //     {id: 633, answer: Answer.Yes},
  //     {id: 636, answer: Answer.Yes},
  //     {id: 637, answer: Answer.No},
  //     {id: 640, answer: Answer.Novote},
  //     {id: 639, answer: Answer.Novote},
  //     {id: 638, answer: Answer.Novote},
  //     {id: 644, answer: Answer.Novote},
  //     {id: 643, answer: Answer.Novote},
  //     {id: 642, answer: Answer.Novote},
  //     {id: 641, answer: Answer.Novote},
  //     {id: 645, answer: Answer.Novote},
  //   ]
  // },{
    id: 5,
    name: "CVP",
    votes: [
      {id: 631, answer: Answer.No},
      {id: 635, answer: Answer.Yes},
      {id: 632, answer: Answer.Yes},
      {id: 634, answer: Answer.Yes},
      {id: 633, answer: Answer.Yes},
      {id: 636, answer: Answer.No},
      {id: 637, answer: Answer.No},
      {id: 640, answer: Answer.Yes},
      {id: 639, answer: Answer.Yes},
      {id: 638, answer: Answer.No},
      {id: 644, answer: Answer.Yes},
      {id: 643, answer: Answer.Yes},
      {id: 642, answer: Answer.No},
      {id: 641, answer: Answer.No},
      {id: 645, answer: Answer.Yes},
      {id: 647, answer: Answer.Yes}, // why not on website?
      {id: 646, answer: Answer.No},

      {id: 650, answer: Answer.Yes},
      {id: 649, answer: Answer.Abstention},
      {id: 648, answer: Answer.No},

      {id: 655, answer: Answer.Yes},
    ]
  },{
    id: 6,
    name: "FDP",
    votes: [
      {id: 631, answer: Answer.No},
      {id: 635, answer: Answer.Yes},
      {id: 632, answer: Answer.Yes},
      {id: 634, answer: Answer.No},
      {id: 633, answer: Answer.Yes},
      {id: 636, answer: Answer.No},
      {id: 637, answer: Answer.No},
      {id: 640, answer: Answer.Yes},
      {id: 639, answer: Answer.Yes},
      {id: 638, answer: Answer.No},
      {id: 644, answer: Answer.Yes},
      {id: 643, answer: Answer.Yes},
      {id: 642, answer: Answer.No},
      {id: 641, answer: Answer.No},
      {id: 645, answer: Answer.Yes},
      {id: 647, answer: Answer.Yes},
      {id: 646, answer: Answer.No},
      {id: 650, answer: Answer.Yes},
      {id: 649, answer: Answer.No},
      {id: 648, answer: Answer.No},

      {id: 652, answer: Answer.No},
      {id: 653, answer: Answer.Yes},
      {id: 654, answer: Answer.No},
      {id: 651, answer: Answer.No},

      {id: 655, answer: Answer.No},
    ]
  },{
  //   id: 6,
  //   name: "EDU",
  //   votes: [
  //     {id: 631, answer: Answer.Novote},
  //     {id: 635, answer: Answer.Novote},
  //     {id: 632, answer: Answer.Novote},
  //     {id: 634, answer: Answer.Novote},
  //     {id: 633, answer: Answer.Novote},
  //     {id: 636, answer: Answer.Novote},
  //     {id: 637, answer: Answer.Novote},
  //     {id: 640, answer: Answer.Yes},
  //     {id: 639, answer: Answer.No},
  //     {id: 638, answer: Answer.Yes},
  //     {id: 644, answer: Answer.No},
  //     {id: 643, answer: Answer.No},
  //     {id: 642, answer: Answer.No},
  //     {id: 641, answer: Answer.No},
  //     {id: 645, answer: Answer.Abstention},
  //     {id: 647, answer: Answer.No},
  //     {id: 646, answer: Answer.No},
  //   ]
  // },{
    id: 8,
    name: "SVP",
    votes: [
      {id: 631, answer: Answer.Yes},
      {id: 635, answer: Answer.Yes},
      {id: 632, answer: Answer.Yes},
      {id: 634, answer: Answer.No},
      {id: 633, answer: Answer.Yes},
      {id: 636, answer: Answer.No},
      {id: 637, answer: Answer.No},
      {id: 640, answer: Answer.Yes},
      {id: 639, answer: Answer.Yes},
      {id: 638, answer: Answer.Yes},
      {id: 644, answer: Answer.No},
      {id: 643, answer: Answer.Abstention},
      {id: 642, answer: Answer.No},
      {id: 641, answer: Answer.No},
      {id: 645, answer: Answer.Yes},
      {id: 647, answer: Answer.No},
      {id: 646, answer: Answer.No},

      {id: 650, answer: Answer.Abstention},
      {id: 649, answer: Answer.No},
      {id: 648, answer: Answer.No},

      // {id: 652, answer: Answer.No},
      // {id: 653, answer: Answer.Yes},
      {id: 654, answer: Answer.No},
      // {id: 651, answer: Answer.No},
      //
      //
      {id: 655, answer: Answer.No},
    ]
  },
];
