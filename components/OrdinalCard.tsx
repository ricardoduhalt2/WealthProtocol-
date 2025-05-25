import React, { useState, useMemo } from 'react';
import type { AppInscriptionData } from '../types';

// Import components
import PurchaseModal from './PurchaseModal';
import ContentModal from './ContentModal';
import ChidoModal from './ChidoModal';

export interface OrdinalCardProps {
  data?: AppInscriptionData | null;
  title?: string;
  description?: string;
  imageUrl?: string;
  externalLink?: string; // Kept for potential future use or if some cards have non-modal links
}

const KIMONO_INSCRIPTION_NUMBER_STR = '96591617';
const BITCOIN_DRIP_INSCRIPTION_NUMBER_STR = '96591705'; // Bitcoin Drip Hoodie and Tracksuit
const CHIDO_INSCRIPTION_NUMBER_STR = '96587318'; // CHIDO - Solo visualización en Ordiscan

const KIMONO_GAMMA_URL = 'https://gamma.io/inscription/c0bb140ce535587908a24ba51a092d3bd5d2448387053bbe0b50227db5c4c4b0i0';
const BITCOIN_DRIP_GAMMA_URL = 'https://gamma.io/inscription/06042d72185f956ef0cfa67c065c779b69a95d61f649f6dcdbae0b463e1d1597i0';

const OrdinalCard: React.FC<OrdinalCardProps> = ({ data, title, description, imageUrl, externalLink }) => {
  // Modal configuration for iframe content
  const [modalConfig, setModalConfig] = useState<{ title: string; iframeSrc?: string } | null>(null);
  // State for modals
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showChidoModal, setShowChidoModal] = useState(false);

  const displayTitle = data?.displayName || title || 'Ordinal NFT';
  const displayDescription = data?.displayDescription || description || 'No description available.';

  let primaryImageUrl = data?.metadataImage;
  const isContentUrlImage = data?.contentType?.startsWith('image/');
  if (!primaryImageUrl && isContentUrlImage && data?.contentUrl) {
    primaryImageUrl = data.contentUrl;
  }
  if (!primaryImageUrl && imageUrl) {
    primaryImageUrl = imageUrl;
  }

  const displayContentType = data?.contentType;
  // displayLink will be primarily used for the modal's iframeSrc for non-Kimono/Tracksuit items
  const displayLink = data?.rawScanLink; 
  const displayAttributes = data?.attributes;
  const inscriptionNumber = data?.number;
  const ownerAddress = data?.ownerAddress;

  const showImage = !!primaryImageUrl;

  // Check if this is a purchasable NFT (like the Kimono or Bitcoin Drip)
  const isPurchasable = useMemo(() => {
    if (!data) return false;
    return [
      'c0bb140ce535587908a24ba51a092d3bd5d2448387053bbe0b50227db5c4c4b0i0', // Kimono
      '06042d72185f956ef0cfa67c065c779b69a95d61f649f6dcdbae0b463e1d1597i0'  // Bitcoin Drip Hoodie and Tracksuit (verificado)
    ].includes(data.id);
  }, [data]);

  const handleViewContentAction = () => {
    if (!data) return;
    
    // Handle CHIDO - Open custom modal
    if (String(data.number) === CHIDO_INSCRIPTION_NUMBER_STR) {
      setShowChidoModal(true);
      return;
    }
    
    if (isPurchasable) {
      // Open purchase modal for purchasable items
      setShowPurchaseModal(true);
      return;
    }
    
    // Handle Kimono NFT - open in modal
    if (String(data.number) === KIMONO_INSCRIPTION_NUMBER_STR) {
      setModalConfig({
        title: `Buy ${data.displayName} on Gamma.io`,
        iframeSrc: KIMONO_GAMMA_URL,
      });
      return;
    }
    
    // Handle Bitcoin Drip Hoodie and Tracksuit - open in modal
    if (String(data.number) === BITCOIN_DRIP_INSCRIPTION_NUMBER_STR) {
      setModalConfig({
        title: `Buy ${data.displayName} on Gamma.io`,
        iframeSrc: BITCOIN_DRIP_GAMMA_URL,
      });
      return;
    }
    
    // Default behavior for other content
    if (data.contentUrl) {
      window.open(data.contentUrl, '_blank', 'noopener,noreferrer');
    } else if (data.rawScanLink) {
      window.open(data.rawScanLink, '_blank', 'noopener,noreferrer');
    }
  };
  
  const inscriptionNumberStr = data ? String(data.number) : null;
  // Determine if the "BUY NOW" button should be shown.
  // It's shown if it's a Kimono/Tracksuit, or if there's a general displayLink (rawScanLink)
  // or an externalLink prop was passed.
  const canBuyOrViewContent = 
    (inscriptionNumberStr === KIMONO_INSCRIPTION_NUMBER_STR) ||
    (inscriptionNumberStr === BITCOIN_DRIP_INSCRIPTION_NUMBER_STR) ||
    (inscriptionNumberStr === CHIDO_INSCRIPTION_NUMBER_STR) ||
    !!displayLink ||  // data.rawScanLink
    !!externalLink;   // Prop directly passed

  return (
    <>
      <div className="group bg-slate-800/70 backdrop-blur-md p-6 rounded-xl text-slate-200 flex flex-col items-center text-center border border-slate-700/80 hover:border-pink-500/70 transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-2 min-h-[580px] h-full">
        <h3 className="text-2xl lg:text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-pink-400 to-purple-400 min-h-[60px]">
          {displayTitle}
        </h3>

        {showImage ? (
          <img
            src={primaryImageUrl}
            alt={displayTitle}
            className="w-60 h-80 object-cover rounded-lg mb-5 border-2 border-slate-600 group-hover:border-sky-500/70 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-sky-500/30"
            onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/error/240/320')}
          />
        ) : data?.contentUrl ? (
          <div className="w-60 h-80 flex flex-col items-center justify-center bg-slate-700 rounded-lg mb-5 p-4 border-2 border-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-slate-300 font-mono break-all">Type: {displayContentType}</p>
            <p className="text-xs text-slate-400 mt-1">Non-image content</p>
            {data?.metadataImage && <p className="text-xs text-slate-500 mt-1">(Metadata image available but might have failed to load)</p>}
          </div>
        ) : (
          <div className="w-60 h-80 flex items-center justify-center bg-slate-700 rounded-lg mb-5 border-2 border-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <p className="text-slate-300 mb-5 text-sm leading-relaxed flex-grow min-h-[60px] overflow-y-auto px-1">
          {displayDescription}
        </p>

        {inscriptionNumber && (
          <p className="text-purple-400/80 text-xs mb-1 font-mono">Inscription #: {inscriptionNumber}</p>
        )}
        {ownerAddress && ownerAddress !== 'N/A' ? (
          <p className="text-purple-400/80 text-xs mb-3 font-mono truncate w-full px-2" title={ownerAddress}>
            Owner: {ownerAddress.startsWith('bc1') || ownerAddress.startsWith('1') || ownerAddress.startsWith('3') ? 
              `${ownerAddress.substring(0, 6)}...${ownerAddress.substring(ownerAddress.length - 4)}` : 
              ownerAddress}
          </p>
        ) : (
          <p className="text-purple-400/80 text-xs mb-3 italic opacity-70">Owner: Not available</p>
        )}

        {displayAttributes && displayAttributes.length > 0 && (
          <div className="mt-3 mb-4 w-full text-left max-h-28 overflow-y-auto px-1 rounded-md bg-slate-700/30 py-2">
            <h4 className="text-xs font-semibold text-sky-300 mb-1 px-2">Attributes:</h4>
            <ul className="space-y-1 px-2">
              {displayAttributes.map((attr, index) => (
                <li key={index} className="text-xs text-slate-300 bg-slate-700/70 px-2 py-1 rounded">
                  <span className="font-medium text-sky-400">{attr.trait_type}:</span> {String(attr.value)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {canBuyOrViewContent && (
          <button
            type="button"
            onClick={handleViewContentAction}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
          >
            {String(data?.number) === CHIDO_INSCRIPTION_NUMBER_STR ? 'VIEW ON ORDSCAN' : isPurchasable ? 'BUY NOW' : 'VIEW CONTENT'}
          </button>
        )}
      </div>

      {/* Purchase Modal for purchasable NFTs */}
      {data && isPurchasable && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          inscriptionId={data.id}
          title={data.displayName || 'Unnamed NFT'}
          price={
            data.id === '06042d72185f956ef0cfa67c065c779b69a95d61f649f6dcdbae0b463e1d1597i0' 
              ? '0.0044' // Bitcoin Drip Hoodie and Tracksuit price
              : '0.00525' // Default price for other items (Kimono)
          }
          sellerAddress={data.ownerAddress || 'Unknown'}
        />
      )}
      
      {/* Chido Modal */}
      {data && (
        <ChidoModal
          isOpen={showChidoModal}
          onClose={() => setShowChidoModal(false)}
          title={data.displayName || 'CHIDO Inscription'}
          inscriptionId={CHIDO_INSCRIPTION_NUMBER_STR}
        />
      )}
      
      {/* Content Modal for iframe content */}
      {modalConfig && (
        <ContentModal
          isOpen={!!modalConfig}
          onClose={() => setModalConfig(null)}
          title={modalConfig.title}
          iframeSrc={modalConfig.iframeSrc}
        />
      )}
    </>
  );
};

export default OrdinalCard;