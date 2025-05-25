
import React, { useState, useEffect, useCallback } from 'react';
import { getInscriptionData } from '../services/ordiscanApi';
import type { AppInscriptionData } from '../types';
import OrdinalCard from './OrdinalCard';

const CHIDO_NFT_ID = '96587318';
const CHIDO_NFT_NAME = 'C.H.I.D.O.';

const ChidoPage: React.FC = () => {
  const [chidoData, setChidoData] = useState<AppInscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChidoData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInscriptionData(CHIDO_NFT_ID, CHIDO_NFT_NAME);
      setChidoData(data);
    } catch (err) {
      console.error(`Error fetching data for ${CHIDO_NFT_NAME} (ID: ${CHIDO_NFT_ID}):`, err);
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = `An unexpected error occurred while fetching ${CHIDO_NFT_NAME}: ${String(err)}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChidoData();
  }, [fetchChidoData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        {isLoading && (
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl text-slate-300 flex flex-col items-center text-center border border-slate-700 shadow-lg min-h-[580px] justify-center w-full max-w-md">
            <h3 className="text-2xl font-bold mb-3 text-slate-100">{CHIDO_NFT_NAME}</h3>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-slate-400">Loading C.H.I.D.O. data...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="bg-red-900/50 backdrop-blur-sm p-6 rounded-xl text-red-200 flex flex-col items-center text-center border border-red-700 shadow-lg min-h-[580px] justify-center w-full max-w-md">
            <h3 className="text-2xl font-bold mb-3 text-red-100">{CHIDO_NFT_NAME}</h3>
            <svg className="w-12 h-12 text-red-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2 text-red-300">Please try refreshing the page or check console for details.</p>
          </div>
        )}
        {chidoData && !isLoading && !error && (
          <div className="w-full max-w-lg"> {/* Constrain width for a single card display */}
            <OrdinalCard data={chidoData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChidoPage;
