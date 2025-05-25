
import React, { useState, useEffect, useCallback } from 'react';
import { getInscriptionData } from '../services/ordiscanApi';
import type { AppInscriptionData } from '../types';
import OrdinalCard from './OrdinalCard';

interface NftItem {
  id: string;
  name: string; // Fallback name for loading/error states, and now for display name fallback
  data: AppInscriptionData | null;
  isLoading: boolean;
  error: string | null;
}

// C.H.I.D.O. is removed as it will have its own page.
const initialNfts: NftItem[] = [
  { id: '96591617', name: 'Bitcoin Drip Kimono', data: null, isLoading: true, error: null },
  { id: '96591705', name: 'BTC Tracksuit', data: null, isLoading: true, error: null },
];

// Placeholder Card for loading state
const LoadingCard: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl text-slate-300 flex flex-col items-center text-center border border-slate-700 shadow-lg min-h-[580px] justify-center h-full">
    <h3 className="text-2xl font-bold mb-3 text-slate-100">{title}</h3>
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
    <p className="text-slate-400">Loading inscription data...</p>
  </div>
);

// Placeholder Card for error state
const ErrorCard: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="bg-red-900/50 backdrop-blur-sm p-6 rounded-xl text-red-200 flex flex-col items-center text-center border border-red-700 shadow-lg min-h-[580px] justify-center h-full">
    <h3 className="text-2xl font-bold mb-3 text-red-100">{title}</h3>
    <svg className="w-12 h-12 text-red-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <p className="text-sm">{message}</p>
    <p className="text-xs mt-2 text-red-300">Please try refreshing the page or check console for details.</p>
  </div>
);


const OrdinalsPage: React.FC = () => {
  const [nfts, setNfts] = useState<NftItem[]>(initialNfts);

  const fetchAllNfts = useCallback(async () => {
    // Ensure initialNfts is not empty before mapping
    if (initialNfts.length === 0) {
      setNfts([]); // Set to empty array if no NFTs to fetch
      return;
    }
    const promises = initialNfts.map(async (nftToFetch) => {
      try {
        // Pass nftToFetch.name as the defaultNameFromList argument
        const data = await getInscriptionData(nftToFetch.id, nftToFetch.name);
        return { ...nftToFetch, data, isLoading: false, error: null };
      } catch (err) {
        if (err instanceof Error) {
          console.error(`Error fetching data for ${nftToFetch.name} (ID: ${nftToFetch.id}):`, err.message);
        } else {
          console.error(`Error fetching data for ${nftToFetch.name} (ID: ${nftToFetch.id}):`, err);
        }

        let errorMessage = 'An unknown error occurred.';
        if (err instanceof Error) {
          errorMessage = err.message; 
        } else {
          errorMessage = `An unexpected error occurred while fetching ${nftToFetch.name}: ${String(err)}`;
        }
        return { ...nftToFetch, data: null, isLoading: false, error: errorMessage };
      }
    });
    
    const results = await Promise.all(promises);
    setNfts(results);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    fetchAllNfts();
  }, [fetchAllNfts]);

  if (nfts.length === 0 && initialNfts.length > 0) { // Still loading initial batch if nfts is empty but initialNfts wasn't
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4 text-slate-300">Loading marketplace items...</p>
      </div>
    );
  }
  
  if (nfts.length === 0 && initialNfts.length === 0) { // No items configured for marketplace
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mt-4 text-slate-300 text-xl">No items currently listed in the marketplace.</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10"> {/* Adjusted to lg:grid-cols-2 for 2 items */}
        {nfts.map((nft) => {
          if (nft.isLoading) {
            return <LoadingCard key={`loading-${nft.id}`} title={nft.name} />;
          }
          if (nft.error) {
            return <ErrorCard key={`error-${nft.id}`} title={nft.name} message={nft.error} />;
          }
          if (nft.data) {
            return <OrdinalCard key={nft.data.id} data={nft.data} />;
          }
          // Fallback for when data is null but not loading and no error (should ideally not happen if fetch completes)
          return (
            <OrdinalCard 
              key={`nodata-${nft.id}`} 
              title={nft.name} 
              description="No data available for this inscription. The API might be down or the inscription data is missing."
              externalLink={`https://ordiscan.com/inscription/${nft.id}`}
              imageUrl={`https://picsum.photos/seed/${nft.id}/240/320`} // Adjusted placeholder to match card aspect ratio
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrdinalsPage;
