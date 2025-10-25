import httpStatus from 'http-status-codes'
import dotenv from 'dotenv'
dotenv.config();

//this free api 
export const fetchItem = async(req,res) => {
    try {
        const {item} = req.query;
        const collection = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${item}`)
        .then((response) => {
            if (!response.ok){
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Could't collect the word.Please try again later buddy"
                });
            }
            return response.json()
        })
        .then((data) => {
            return data
        })
        // ✅ Extract main properties
        const { word, phonetic: pronunciation, phonetics ,sourceUrls, meanings } = collection[0];
        // ✅ Collect definitions, synonyms, antonyms
        //  // ---- transformation logic ----
        const transformed = meanings.reduce(
            (acc, item) => {
                acc.synonyms.push(...(item.synonyms || []));
                acc.antonyms.push(...(item.antonyms || []));
                item.definitions.forEach((def) => {
                    acc.definitions.push({
                        definition: def.definition,
                        example: def.example || null,
                    });
                    if (def.synonyms) acc.synonyms.push(...def.synonyms);
                    if (def.antonyms) acc.antonyms.push(...def.antonyms);
                });
                return acc;
            },
            { synonyms: [], antonyms: [], definitions: [] }
        );
        // remove duplicates
        transformed.synonyms = [...new Set(transformed.synonyms)];
        transformed.antonyms = [...new Set(transformed.antonyms)];
        const wholeData = {
            word:  word,
            pronunciation: pronunciation,
            audio: phonetics[0].audio,
            url: sourceUrls[0],
            definition: transformed.definitions,
            synonyms: transformed.synonyms,
            antonyms: transformed.antonyms
        }
        //successful
        res.status(httpStatus.OK).json({
            success: true,
            message: "successfully got the meaning of the word",
            data: wholeData
        })

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetchItem route in message controller",
            error: error.message
        })
    }
}


//this openai-free package
// import OpenAI from 'openai'
// export const fetchAiMeaning = async(req, res) => {
//     try {
//         const openai = new OpenAI({
//             apiKey: ""
//         });

//         const { word } = req.body;
//         const prompt = `Define the word "${word}" as if for a dictionary. Provide part of speech, pronunciation, and a brief example.`;
//         const response = await  openai.chat.completions.create({
//             model: 'gpt-4', // or 'gpt-3.5-turbo'
//             messages: [{ role: 'user', content: prompt }],
//         });
//         res.status(httpStatus.OK).json({
//             success: true,
//             message: "successfully fetched",
//             data: response
//         })
//     } catch (error) {
//         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Error fetchAiMeaning route in message controller",
//             error: error.message
//         })
//     }
// }


import {GoogleGenAI} from '@google/genai';
import { syncIndexes } from 'mongoose';
export const fetchMean = async(req, res) => {
    try {
        const {item} =req.query;
        const GEMINI_API_KEY  = process.env.GOOGLE_AI_API_KEY;
        const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
        const prompt =  `
                        You are a dictionary assistant. 
                        Given a word, return **all major meanings** of that word in **valid JSON only**, with each definition paired with a unique example sentence. 
                        Also include pronunciation, synonyms, and antonyms.

                        The JSON format must be exactly:

                        {
                            "word": "<the input word>",
                            "pronunciation": "<IPA pronunciation>",
                        "definitions": [
                            {
                              "definition": "<definition 1 in simple English>",
                              "example": "<example sentence 1>"
                            },
                            {
                              "definition": "<definition 2 in simple English>",
                              "example": "<example sentence 2>"
                            }
                            // Include as many major definitions as possible
                        ],
                        "synonyms": ["<synonym1>", "<synonym2>", "..."],
                        "antonyms": ["<antonym1>", "<antonym2>", "..."]
                        }

                        **Important instructions:**
                        - Include **all common meanings** of the word, not just one.
                        - Provide a **distinct example sentence for each definition**.
                        - Only return **valid JSON**, no extra commentary, no markdown.
                        - Be concise but clear.

                        Now process the word: ${item}`;
                        
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: prompt
        });
        const rawText = response.candidates[0].content.parts[0].text;
        const cleanText = rawText.replace(/```json|```/g, ""); // remove backticks if present
        const dictData = JSON.parse(cleanText);
        const { word, pronunciation, definitions, synonyms, antonyms } = dictData;
        const wholeData = {
            word: word,
            pronunciation: pronunciation,
            definition: definitions,
            synonyms: synonyms,
            antonyms: antonyms
        };
        res.status(httpStatus.OK).json({
            success: true,
            message: "successfully fetched the data",
            data: wholeData
        })
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetchItem route in message controller",
            error: error.message
        })
    }
}