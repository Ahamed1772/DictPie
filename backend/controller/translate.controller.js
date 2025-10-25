import httpStatus from 'http-status-codes';
import translate from 'google-translate-api-x';
import googleTTS from 'google-tts-api';

export const translateMeaning = async (req, res) => {
  try {
    const { wordData, language } = req.body;

    if (!wordData || !language) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "wordData and language are required"
      });
    }

    // Translate word only once
    const translatedWord = await translate(wordData.word, { to: language });

    const translatedMeanings = [];

    for (const meaning of wordData.meanings) {
      const translatedDefinitions = [];

      for (const def of meaning.definitions) {
        const translatedDefinition = await translate(def.definition, { to: language });
        const translatedExample = def.example ? await translate(def.example, { to: language }) : { text: "" };

        // Use getAllAudioUrls for long text
        const definitionAudioUrls = googleTTS.getAllAudioUrls(translatedDefinition.text, { lang: language, slow: false });
        const exampleAudioUrls = translatedExample.text
          ? googleTTS.getAllAudioUrls(translatedExample.text, { lang: language, slow: false })
          : null;

        translatedDefinitions.push({
          text: {
            translatedDefinition: translatedDefinition.text,
            translatedExample: translatedExample.text || "",
          },
          audio: {
            definition: definitionAudioUrls,  // Array of URLs
            example: exampleAudioUrls,        // Array of URLs or null
          },
        });
      }

      translatedMeanings.push({
        text: {
          translatedWord: translatedWord.text,
        },
        audio: {
          word: googleTTS.getAllAudioUrls(translatedWord.text, { lang: language, slow: false }), // Array of URLs
        },
        definitions: translatedDefinitions,
      });
    }

    res.status(httpStatus.ACCEPTED).json({
      success: true,
      message: "Successfully translated the message",
      data: {
        meanings: translatedMeanings,
      },
    });
  } catch (error) {
    console.error("Error in translateMeaning:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error in translateMeaning route",
      error: error.message,
    });
  }
};
