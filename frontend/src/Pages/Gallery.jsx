
import React from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import { useNavigate } from 'react-router-dom'
import { Volume2, ArrowLeft, Trash2, Link as LinkIcon } from 'lucide-react'

const Gallery = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const { data: savedWords, error, isLoading } = useQuery({
    queryKey: ["savedWords"],
    queryFn: async () => {
      const response = await axiosInstance.get('/data/get');
      return response.data.data;
    }
  });

  const playAudio = (url) => { if(url) new Audio(url).play(); }

  const { mutate } = useMutation({
    mutationFn: async (word) => axiosInstance.delete('/data/del', { data: { word } }),
    onSuccess: (_, word) => { toast.success(`${word} deleted!`); queryClient.invalidateQueries({ queryKey: ["savedWords"] }); },
    onError: (error) => { toast.error(error.response?.data?.message || "Error deleting word"); },
  });

  const deleteItem = (item) => { mutate(item.word); }

  const MeaningBlock = ({ title, data, playAudio }) => {
    if(!data) return null;
    return (
      <div className="bg-gray-50 p-3 sm:p-4 rounded-xl shadow-inner mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base sm:text-lg font-bold text-yellow-800">{title}</h3>
          {data.audio && <button onClick={()=>playAudio(data.audio)} className="bg-yellow-200 hover:bg-yellow-300 p-1 sm:p-2 rounded-full transition"><Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-800"/></button>}
        </div>
        <p className="text-gray-600 italic mb-2 text-sm sm:text-base">{data.pronunciation}</p>
        <div className="space-y-2 sm:space-y-3">
          {data.definition?.map((def, i)=>(
            <div key={i} className="border-l-4 border-yellow-400 pl-2 sm:pl-3">
              <p className="text-gray-800 text-sm sm:text-base">{def.definition}</p>
              {def.example && <p className="text-xs sm:text-sm text-gray-500">“{def.example}”</p>}
            </div>
          ))}
        </div>
        {data.synonyms?.length>0 && <p className="text-xs sm:text-sm text-green-600 mt-1"><strong>Synonyms:</strong> {data.synonyms.join(", ")}</p>}
        {data.antonyms?.length>0 && <p className="text-xs sm:text-sm text-red-600 mt-1"><strong>Antonyms:</strong> {data.antonyms.join(", ")}</p>}
        {data.url && (
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm mt-2">
            <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4"/> Source
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 flex flex-col">
      <header className="w-full shadow-md bg-yellow-400 px-4 sm:px-6 py-3 flex items-center justify-between">
        <button onClick={goBack} className="flex items-center gap-1 sm:gap-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5"/> Back
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-yellow-900 text-center flex-1">DictPie Words Gallery</h1>
        <div className="w-16 sm:w-20"></div>
      </header>

      <main className="flex-grow p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {isLoading && <p className="text-gray-700 col-span-full text-center text-sm sm:text-base">Loading your saved words...</p>}
        {savedWords?.length === 0 && !isLoading && <p className="text-gray-700 col-span-full text-center text-sm sm:text-base">No words saved yet.</p>}
        {savedWords?.map(item => (
          <div key={item._id} className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col hover:scale-105 transform transition">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-900 mb-3">{item.word}</h2>
            <MeaningBlock title="Dictionary Meaning" data={item.meaning.FetchMeaning} playAudio={playAudio}/>
            <MeaningBlock title="AI Meaning" data={item.meaning.AiMeaning} playAudio={playAudio}/>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">Saved on: {new Date(item.createdAt).toLocaleString()}</p>
            <button onClick={()=>deleteItem(item)} className="ml-auto mt-2 p-1 rounded-full hover:bg-red-100 transition" title="Delete">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-red-700"/>
            </button>
          </div>
        ))}
      </main>
    </div>
  )
}

export default Gallery;
