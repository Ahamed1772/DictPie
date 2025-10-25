import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, FileText, Volume2, Bookmark, Link as LinkIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import TranslateDashboardButton from "../Components/TranslateButton";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [normalResult, setNormalResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const debounceTimeout = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      removeCookie("jwt", { path: "/" });
      toast.success("Successfully logged out!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleLogout = (e) => { e.preventDefault(); logoutMutate(); }

  const handleSearch = async (word = query) => {
    if (!word) return;
    try {
      setLoading(true);
      const [normalRes, aiRes] = await Promise.all([
        axiosInstance.get("/message/simple", { params: { item: word } }),
        axiosInstance.get("/message/ai/meaning", { params: { item: word } }),
      ]);
      setNormalResult(normalRes.data.data);
      setAiResult(aiRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally { setLoading(false); }
  };

  const playAudio = (url) => { if(url) new Audio(url).play(); }

  const { mutate: saveMutate } = useMutation({
    mutationFn: async () => axiosInstance.post("/data/save", { word: query, FetchMeaning: normalResult, AiMeaning: aiResult }),
    onSuccess: () => { toast.success(`${query} successfully saved`); navigate("/mySavedGallery"); },
    onError: (err) => toast.error(err.response?.data?.message),
  });
  const saveDatabase = () => saveMutate();

  const fetchSuggestions = async (value) => {
    if (!value) return [];
    try {
      const res = await fetch(`https://api.datamuse.com/sug?s=${value}`);
      const data = await res.json();
      return data.map(item => item.word);
    } catch (err) { console.error(err); return []; }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      if(value.length > 1) setSuggestions(await fetchSuggestions(value));
      else setSuggestions([]);
    }, 300);
  };

  const handleSuggestionClick = (word) => { setQuery(word); setSuggestions([]); handleSearch(word); }

  const WordBlock = ({ data, playAudio, isAi }) => {
    if(!data) return null;
    return (
      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex-1 relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl sm:text-3xl font-bold text-yellow-900">{data.word}</h3>
          {data.audio && <button onClick={() => playAudio(data.audio)} className="bg-yellow-200 hover:bg-yellow-300 p-2 rounded-full transition"><Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-800"/></button>}
        </div>

        <p className="text-gray-600 italic mb-3">{data.pronunciation}</p>

        <div className="space-y-3">
          {data.definition?.map((def,i)=>(
            <div key={i} className="border-l-4 border-yellow-400 pl-3 sm:pl-4">
              <p className="font-medium">{def.definition}</p>
              {def.example && <p className="text-sm sm:text-base text-gray-500">“{def.example}”</p>}
            </div>
          ))}
          {data.synonyms?.length>0 && <p className="text-sm sm:text-base text-green-600"><strong>Synonyms:</strong> {data.synonyms.join(", ")}</p>}
          {data.antonyms?.length>0 && <p className="text-sm sm:text-base text-red-600"><strong>Antonyms:</strong> {data.antonyms.join(", ")}</p>}
        </div>

        <TranslateDashboardButton wordData={data} isAi={isAi} />

        {!isAi && data.url && (
          <div className="absolute bottom-3 right-3">
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-800 bg-blue-100 px-2 sm:px-3 py-1 rounded-lg shadow-md transition text-sm sm:text-base">
              <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Source
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 flex flex-col">
      {loading && <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50"><ClipLoader color="#F59E0B" size={60} /></div>}

      <header className="w-full shadow-md bg-yellow-400 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="w-1/3"></div>
        <h1 className="text-xl sm:text-2xl font-bold text-yellow-900 text-center w-1/3">DictPie</h1>
        <div className="w-1/3 flex justify-end">
          <button onClick={handleLogout} className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5"/> LogOut
          </button>
        </div>
      </header>

      <main className="relative flex-grow flex flex-col items-center text-center px-4 sm:px-6 py-6">
        <h2 className="text-2xl sm:text-4xl font-semibold text-yellow-800 mb-6 sm:mb-8">Welcome to DictPie 🧠</h2>

        {/* Search Input */}
        <div className="w-full max-w-xl mb-4 sm:mb-6 relative">
          <input type="text" value={query} onChange={handleInputChange} placeholder="Search for a word..." className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-md border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"/>
          {suggestions.length>0 && (
            <ul className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-xl max-h-48 sm:max-h-64 overflow-y-auto z-10 text-left text-sm sm:text-base">
              {suggestions.map((word,i)=><li key={i} className="px-3 sm:px-4 py-2 hover:bg-yellow-100 cursor-pointer" onClick={()=>handleSuggestionClick(word)}>{word}</li>)}
            </ul>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button onClick={()=>handleSearch()} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">Search</button>
          <button onClick={()=>navigate("/mySavedGallery")} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition"><FileText className="w-4 h-4 sm:w-5 sm:h-5"/> My Word Gallery</button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full max-w-6xl">
          <WordBlock data={normalResult} playAudio={playAudio} isAi={false} />
          <WordBlock data={aiResult} playAudio={playAudio} isAi={true} />
        </div>

        {(normalResult || aiResult) && (
          <div className="mt-4 sm:mt-6 flex justify-center">
            <button onClick={saveDatabase} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition">
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5"/> Save
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard;
