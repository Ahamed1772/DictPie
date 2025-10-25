import React, { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import languages from "../lib/languages";

const TranslateDashboardButton = ({ wordData, isAi }) => {
  const [selectedLang, setSelectedLang] = useState("ta");
  const [translatedData, setTranslatedData] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // ✅ Ensure wordData is always in the backend’s expected format
      const formattedWordData = {
        word: wordData.word,
        meanings: wordData.meanings
          ? wordData.meanings // already correct format
          : [
              {
                partOfSpeech: wordData.partOfSpeech || "unknown",
                definitions: wordData.definition || [], // wrap definitions
              },
            ],
      };

      const res = await axiosInstance.post("/message/translate", {
        wordData: formattedWordData,
        language: selectedLang,
        type: isAi ? "ai" : "normal",
      });
      return res.data;
    },
    onSuccess: (data) => {
      setTranslatedData(data.data);
      toast.success("Translated successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Translation failed");
    },
  });

  return (
    <div className="mt-6">
      {/* Controls */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="border rounded-xl px-3 py-2 text-lg shadow-md"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => mutate()}
          disabled={isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition ${
            isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Translating...
            </>
          ) : (
            <>
              <Globe className="w-5 h-5" /> Translate
            </>
          )}
        </button>
      </div>

      {/* Translated Output */}
      {translatedData && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl shadow-md text-left">
          {translatedData.meanings?.map((meaning, mi) => (
            <div key={mi} className="mb-4">
              {/* Word */}
              <h3 className="font-bold text-lg mb-2">
                {meaning.text.translatedWord}
              </h3>

              {/* Definitions */}
              {meaning.definitions?.map((def, di) => (
                <div key={di} className="mb-2">
                  <p className="font-medium">
                    {def.text.translatedDefinition}
                  </p>
                  {def.text.translatedExample && (
                    <p className="text-sm text-gray-600 italic">
                      “{def.text.translatedExample}”
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranslateDashboardButton;
