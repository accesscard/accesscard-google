import { GoogleGenAI, Modality } from '@google/genai';
import React, { useState } from 'react';
import { UploadIcon } from '../components/icons/UploadIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { ArrowDownIcon } from '../components/icons/ArrowDownIcon';

const ImageEditorScreen: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditedImage(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const generateImage = async () => {
    if (!originalImage || !prompt) {
      setError("Por favor, sube una imagen y escribe una instrucción.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const response = await fetch(originalImage);
      const blob = await response.blob();
      const base64Data = await blobToBase64(blob);

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: blob.type,
        },
      };

      const textPart = { text: prompt };

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const firstPart = result.candidates?.[0]?.content?.parts?.[0];
      if (firstPart && firstPart.inlineData) {
        const base64ImageBytes = firstPart.inlineData.data;
        const mimeType = firstPart.inlineData.mimeType;
        const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
        setEditedImage(imageUrl);
      } else {
        throw new Error("No se pudo generar la imagen. Intenta con otra instrucción.");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Ocurrió un error al generar la imagen.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-6 pt-16 text-white min-h-screen">
      <h1 className="text-3xl font-bold">AI Studio</h1>
      <p className="text-gray-400 mt-1">Edita imágenes con el poder de Gemini.</p>

      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Input Side */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20 space-y-4">
              <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-amber-400 hover:bg-white/5 transition-colors">
                      {originalImage ? (
                          <img src={originalImage} alt="Original" className="w-full h-auto max-h-60 object-contain rounded-lg" />
                      ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                              <UploadIcon className="w-12 h-12 mb-2" />
                              <span className="font-semibold">Sube una imagen</span>
                              <span className="text-sm">o arrastra y suelta</span>
                          </div>
                      )}
                  </div>
              </label>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

              <div>
                <label htmlFor="prompt" className="text-sm font-medium text-gray-300 mb-2 block">2. Escribe tu instrucción</label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: 'Añade un filtro retro' o 'Cambia el fondo a una playa'"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  rows={3}
                  disabled={!originalImage}
                />
              </div>

              <button
                  onClick={generateImage}
                  disabled={isLoading || !originalImage || !prompt}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isLoading ? 'Generando...' : 'Generar'}
                  {!isLoading && <SparklesIcon className="w-5 h-5" />}
              </button>
            </div>
            {/* Output Side */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20 flex items-center justify-center min-h-[400px]">
                {isLoading && (
                    <div className="text-center text-gray-400 animate-pulse">
                        <SparklesIcon className="w-16 h-16 mx-auto mb-4" />
                        <p>El AI está trabajando...</p>
                    </div>
                )}
                {!isLoading && editedImage && (
                  <div className="w-full text-center">
                    <img src={editedImage} alt="Edited" className="w-full h-auto max-h-80 object-contain rounded-lg mb-4" />
                    <a 
                      href={editedImage} 
                      download="edited-image.png"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/90 text-black font-bold rounded-lg text-sm hover:bg-white transition-transform hover:scale-105"
                    >
                      <ArrowDownIcon className="w-4 h-4" />
                      Descargar
                    </a>
                  </div>
                )}
                 {!isLoading && !editedImage && (
                     <div className="text-center text-gray-500">
                        <p>La imagen editada aparecerá aquí.</p>
                    </div>
                 )}
                 {error && <p className="text-red-400 text-center">{error}</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorScreen;
