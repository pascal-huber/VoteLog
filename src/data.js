
import {Answer} from './Answer.js'

export const subjects = [

  {id: 16, date: "2021-09-26", name: "Löhne entlasten, Kapital gerecht besteuern"},
  {id: 15, date: "2021-09-26", name: "Ehe für Alle"},

  {id: 14, date: "2021-06-13", name: "Anti-Terror-Gesetz", outcome: Answer.Yes},
  {id: 13, date: "2021-06-13", name: "Trinkwasser-Initiative", outcome: Answer.No},
  {id: 12, date: "2021-06-13", name: "Pestizid-Initiative", outcome: Answer.No},
  {id: 11, date: "2021-06-13", name: "Covid-Gesetz", outcome: Answer.Yes},
  {id: 10, date: "2021-06-13", name: "CO2-Gesetz", outcome: Answer.No},

  {id: 9, date: "2021-03-07", name: "Ja zum Verhüllungsverbot", outcome: Answer.Yes},
  {id: 8, date: "2021-03-07", name: "E-ID Gesetz", outcome: Answer.No},
  {id: 7, date: "2021-03-07", name: "Wirtschaftspartnerschaftsabkommen Indonesien", outcome: Answer.Yes},

  {id: 6, date: "2020-11-29", name: "Für ein Verbot der Finanzierung vo Kriegsmaterialproduzenten", outcome: Answer.No},
  {id: 5, date: "2020-11-29", name: "Für verantwortungsolle Unternemen - zum Schutz von Mensch und Umwelt", outcome: Answer.No},

  {id: 4, date: "2020-09-27", name: "Kinderzulagen", outcome: Answer.No},
  {id: 3, date: "2020-09-27", name: "Vaterschaftsurlaub", outcome: Answer.Yes},
  {id: 2, date: "2020-09-27", name: "Jagdgesetz (Wolf)", outcome: Answer.No},
  {id: 1, date: "2020-09-27", name: "Kampfjetbeschaffung", outcome: Answer.Yes},
  {id: 0, date: "2020-09-27", name: "Begrenzungsinitiative", outcome: Answer.No},
];

export const parties = [
  {
    id: 0,
    name: "SP",
    votes: [
      {id: 0, answer: Answer.No},
      {id: 1, answer: Answer.No},
      {id: 2, answer: Answer.No},
      {id: 3, answer: Answer.Yes},
      {id: 4, answer: Answer.No},

      {id: 5, answer: Answer.Novote},
      {id: 6, answer: Answer.Novote},

      {id: 7, answer: Answer.No},
      {id: 8, answer: Answer.No},
      {id: 9, answer: Answer.No},

      {id: 10, answer: Answer.Yes},
      {id: 11, answer: Answer.Yes},
      {id: 12, answer: Answer.Yes},
      {id: 13, answer: Answer.Yes},
      {id: 14, answer: Answer.Yes},
    ]
  },{
    id: 1,
    name: "GP"
  },{
    id: 2,
    name: "GLP"
  },{
    id: 3,
    name: "CVP"
  },{
    id: 4,
    name: "FDP"
  },{
    id: 9,
    name: "SVP",
    votes: [
      {id: 0, answer: Answer.Yes},
      {id: 1, answer: Answer.Yes},
      {id: 2, answer: Answer.Yes},
      {id: 3, answer: Answer.No},
      {id: 4, answer: Answer.Yes},
    ]
  },
];
