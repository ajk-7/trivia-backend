import {parse} from 'csv-parse';
import * as fs from "node:fs";
import * as path from "node:path";
import Question from "../db/question";


function formatNumber(number: string) {
   return parseInt(number, 10)
       .toLocaleString('en-US', {
       });
}

function getOtherRecords(records: string[][], relevantIndex: number, excludedData: string): string[] {
   return records
       .map(r => r[relevantIndex].trim())
       .filter((r) => r !== excludedData.trim())
       .map((value) => ({value, random: Math.random()}))
       .sort((a, b) => (a.random - b.random))
       .map(({value}) => value)
       .slice(0, 3);
}

async function* importCapitals() {
   const records: string[][] = [];
   const parser = fs.createReadStream(path.join(__dirname, "initialData", "cities", "capital_cities.csv"))
       .pipe(parse({fromLine: 2}))
   for await (const record of parser) {
      records.push(<string[]> record);
   }

   // Generate the "In which country is ..." questions
   for(const record of records) {
      yield new Question({
         title: `In which country is ${record[2]}?`,
         type: 'cityInCountry',
         icon: '🏙️',
         correctAnswer: record[1],
         incorrectAnswers: getOtherRecords(records, 1, record[1])
      })
   }

   parser.destroy();
}

async function* importMegaCities() {
   const records: string[][] = [];
   const parser = fs.createReadStream(path.join(__dirname, "initialData", "cities", "mega_cities.csv"))
       .pipe(parse({fromLine: 2}))
   for await (const record of parser) {
      records.push(<string[]> record);
   }

   // Generate the "What is the population of ..." questions
   for(const record of records) {
      yield new Question({
         title: `What is the population of ${record[0]} (${record[1]})?`,
         type: 'populationInCity',
         icon: '🌆',
         correctAnswer: formatNumber(record[2]),
         incorrectAnswers: getOtherRecords(records, 2, record[2])
             .map(formatNumber)
      })
   }

   parser.destroy();
}


async function* importMountainRanges() {
   const meterToFootConversionRate = 3.2808399;

   const records: string[][] = [];
   const parser = fs.createReadStream(path.join(__dirname, "initialData", "cities", "mountain_ranges.csv"))
       .pipe(parse({fromLine: 2}))
   for await (const record of parser) {
      records.push(<string[]> record);
   }

   // Generate the "In which country is the mountain ..." questions
   for(const record of records) {
      yield new Question({
         title: `In which country is the mountain "${record[1]}" (${record[0]})?`,
         type: 'countryOfMountain',
         icon: '⛰️',
         correctAnswer: record[3],
         incorrectAnswers: getOtherRecords(records, 3, record[3])
      })
   }

   // Generate the "How tall is the mountain ..." questions
   function formatHeight(height: string) {
      const heightNumber = parseInt(height, 10);
      const heightInFeet = Math.round(meterToFootConversionRate * heightNumber);
      return `${heightNumber} m (${heightInFeet} ft)`
   }
   for(const record of records) {
      yield new Question({
         title: `How tall is the mountain "${record[1]}" (${record[0]})?`,
         type: 'heightOfMountain',
         icon: '🏔️',
         correctAnswer: formatHeight(record[2]),
         incorrectAnswers: getOtherRecords(records, 2, record[2])
             .map(formatHeight)
      })
   }

   parser.destroy();
}

export default async function() {
   // await Question.collection.drop();
   const countDocuments = await Question.countDocuments()

   if (countDocuments === 0) {
      console.log(`No questions found in DB... triggering import procedure...`);
      const questions = [];
      for await (const question of importCapitals()) {
         questions.push(question);
      }
      for await (const question of importMegaCities()) {
         questions.push(question);
      }
      for await (const question of importMountainRanges()) {
         questions.push(question);
      }
      await Question.collection.insertMany(questions);
      console.log(`Inserted ${questions.length} documents...`);

   }
}