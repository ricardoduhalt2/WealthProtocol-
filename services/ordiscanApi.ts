
import { Ordiscan } from 'ordiscan';
import type { AppInscriptionData, OrdinalMetadata, OrdinalAttribute } from '../types';

// Interfaz extendida para manejar los tipos de la API de Ordiscan
interface OrdiscanInscriptionData {
  inscription_id: string;
  inscription_number: number | string;
  address?: string;
  owner?: string | { address: string };
  owner_address?: string;
  ownerAddress?: string;
  content_type?: string;
  content_url?: string;
  genesis_timestamp?: string;
  metadata?: any;
  // Otras propiedades que pueda devolver la API
  [key: string]: any;
}

// Base URL for constructing links to Ordiscan website (e.g., raw scan link)
const ORDISCAN_WEBSITE_URL = 'https://ordiscan.com';

// API Key for Ordiscan - using the key provided by the user.
const ORDISCAN_API_KEY = 'b3ef6298-cad9-4b1b-8a17-cfee82d66af1';

let ordiscanClient: Ordiscan | null = null;

if (ORDISCAN_API_KEY) {
  try {
    ordiscanClient = new Ordiscan(ORDISCAN_API_KEY);
    console.info('Ordiscan SDK initialized successfully.');
  } catch (error) {
    console.error("Failed to initialize Ordiscan SDK:", error);
  }
} else {
  console.warn(
    'Ordiscan API key is not set. ' +
    'Ordiscan SDK could not be initialized. API calls will likely fail.'
  );
}

// --- Custom Metadata for Specific NFTs ---
const KIMONO_INSCRIPTION_NUMBER_STR = '96591617';
const TRACKSUIT_INSCRIPTION_NUMBER_STR = '96591705';

const bitcoinDripKimonoMetadataRaw = {
  "item": {
    "name": "Bitcoin Drip Kimono",
    "theme": "Fashion as artwork and tangible asset",
    "creator": {
      "name": "Wealth Protocol",
      "affiliation": "Afro Village"
    },
    "features": [
      "Rich emerald-green fabric",
      "Bold gold Bitcoin emblems",
      "Ordinals inscribed on the Bitcoin blockchain",
      "Symbolizes sovereignty and wealth generation",
      "Part of Afro Village's mission for Black and Brown communities"
    ],
    "symbolism": "Ownership of the future and financial sovereignty",
    "exhibition": {
      "status": "On display",
      "location": "Museum of Contemporary Art in Cancun (MACQ)"
    },
    "description": "The Bitcoin Drip Kimono is more than couture—it's a statement of sovereignty. This garment features ordinals inscribed on the Bitcoin blockchain, unlocking ownership of the physical garment. It is a rich emerald-green kimono adorned with bold gold Bitcoin emblems. Created by Wealth Protocol, the fashion arm of Afro Village, this piece embodies Afrovillage’s mission to generate wealth and abundance for Black and Brown communities. It is not just wearable art but also a tangible asset, serving as an invitation to own the future."
  }
};

const btcTracksuitMetadataRaw = {
  "item": {
    "name": "Bitcoin Drip Hoodie and Tracksuit",
    "theme": "Fashion as a bridge between art and finance",
    "creator": {
      "name": "Wealth Protocol",
      "affiliation": "Afro Village"
    },
    "features": [
      "Black hoodie with gold accents",
      "Gold buttons and drawstrings",
      "Matching black tracksuit pants",
      "Prominent Bitcoin emblem on the thigh",
      "Black gloves and boots",
      "Ordinals inscribed on the Bitcoin blockchain",
      "Symbolizes financial innovation and sovereignty"
    ],
    "symbolism": "Empowerment through digital ownership and financial inclusion",
    "exhibition": {
      "status": "On display",
      "location": "Museum of Contemporary Art in Cancun (MACQ)"
    },
    "description": "The Bitcoin Drip Hoodie and Tracksuit is a bold fashion statement where streetwear meets luxury and decentralized finance (DeFi), blending luxury with blockchain technology. This ordinal unlocks ownership of an ensemble featuring a sleek black hoodie adorned with BTC accents, symbolizing innovation. The tracksuit includes matching pants with Bitcoin emblems, reinforcing its connection to cryptocurrency culture. Created by Wealth Protocol, this collection embodies Afrovillage’s mission to merge fashion with financial sovereignty, offering wearers a tangible link to the future of digital assets."
  }
};

// Helper function to transform the custom JSON "item" to an object suitable for parseMetadata
const transformCustomMetadataToParseableObject = (customItemData: any): Partial<OrdinalMetadata> => {
  if (!customItemData) {
    return {};
  }
  const item = customItemData;
  const attributes: OrdinalAttribute[] = [];

  if (item.theme) {
    attributes.push({ trait_type: 'Theme', value: item.theme });
  }
  if (item.creator) {
    if (item.creator.name) {
      attributes.push({ trait_type: 'Creator', value: item.creator.name });
    }
    if (item.creator.affiliation) {
      attributes.push({ trait_type: 'Affiliation', value: item.creator.affiliation });
    }
  }
  if (Array.isArray(item.features)) {
    item.features.forEach((feature: string, index: number) => {
      attributes.push({ trait_type: `Feature ${index + 1}`, value: feature });
    });
  }
  if (item.symbolism) {
    attributes.push({ trait_type: 'Symbolism', value: item.symbolism });
  }
  if (item.exhibition) {
    if (item.exhibition.status) {
      attributes.push({ trait_type: 'Exhibition Status', value: item.exhibition.status });
    }
    if (item.exhibition.location) {
      attributes.push({ trait_type: 'Exhibition Location', value: item.exhibition.location });
    }
  }

  return {
    name: item.name?.toString(),
    description: item.description?.toString(),
    attributes: attributes.length > 0 ? attributes : undefined,
    // 'image' is not part of this custom structure.
    // Other fields from 'item' could be added if they should be preserved at the top level of OrdinalMetadata
  };
};
// --- End of Custom Metadata ---


const parseMetadata = (
  metadataInput: any,
): OrdinalMetadata => {
  let parsed: any = {};
  let successfullyParsedAsObject = false;

  const attemptParse = (data: any): boolean => {
    if (typeof data === 'object' && data !== null) {
      parsed = data; // Directly use the object if it's already one (e.g., from transformCustomMetadataToParseableObject)
      return true;
    }
    if (typeof data === 'string') {
      try {
        parsed = JSON.parse(data);
        return true;
      } catch (e) {
        if (data.trim().length > 0) {
             parsed = { description: data };
        } else {
            parsed = {}; 
        }
        return false;
      }
    }
    return false;
  };

  if (metadataInput) {
    successfullyParsedAsObject = attemptParse(metadataInput);
  }
  
  if (!successfullyParsedAsObject && Object.keys(parsed).length === 0) {
     parsed = {};
  }

  let attributes: OrdinalAttribute[] = [];
  // If 'parsed' (from custom metadata or Ordiscan) already has a well-formed 'attributes' array, use it.
  // Otherwise, parse from what might be Ordiscan's 'attributes' structure.
  if (Array.isArray(parsed.attributes)) {
    attributes = parsed.attributes.map((attr: any) => {
      if (typeof attr === 'object' && attr !== null && 'trait_type' in attr && typeof attr.value !== 'undefined') {
        return { trait_type: String(attr.trait_type), value: attr.value };
      }
      // Fallback for less structured attributes, though custom transformed data should be structured.
      return {
        trait_type: typeof attr === 'string' ? attr : (attr?.trait_type?.toString() || 'Attribute'),
        value: attr?.value ?? (typeof attr !== 'object' && attr !== null ? attr : 'unknown')
      };
    }).filter((attr: any): attr is OrdinalAttribute => attr.trait_type && typeof attr.value !== 'undefined');
  }

  return {
    name: parsed.name?.toString(),
    description: parsed.description?.toString(),
    image: parsed.image?.toString(),
    attributes: attributes.length > 0 ? attributes : undefined,
    ...Object.fromEntries(Object.entries(parsed).filter(([key]) => !['name', 'description', 'attributes', 'image'].includes(key)))
  };
};


export const getInscriptionData = async (
  inscriptionIdOrNumber: string,
  defaultNameFromList?: string
): Promise<AppInscriptionData> => {
  if (!ordiscanClient) {
    console.error('Ordiscan SDK not initialized. API Key might be missing, invalid, or initialization failed.');
    throw new Error('Ordiscan API client is not available. Check API key configuration and console logs.');
  }

  try {
    // Hacer un type assertion para decirle a TypeScript que sabemos la estructura de los datos
    const sdkData = await ordiscanClient.inscription.getInfo(inscriptionIdOrNumber) as unknown as OrdiscanInscriptionData;

    if (!sdkData || typeof sdkData !== 'object') {
        console.error(`Invalid data received from Ordiscan SDK for ${inscriptionIdOrNumber}:`, sdkData);
        throw new Error(`Received invalid or empty data from Ordiscan SDK for inscription ${inscriptionIdOrNumber}.`);
    }
    
    let metadataInputForParser: any;

    if (inscriptionIdOrNumber === KIMONO_INSCRIPTION_NUMBER_STR && bitcoinDripKimonoMetadataRaw.item) {
      metadataInputForParser = transformCustomMetadataToParseableObject(bitcoinDripKimonoMetadataRaw.item);
    } else if (inscriptionIdOrNumber === TRACKSUIT_INSCRIPTION_NUMBER_STR && btcTracksuitMetadataRaw.item) {
      metadataInputForParser = transformCustomMetadataToParseableObject(btcTracksuitMetadataRaw.item);
    } else {
      metadataInputForParser = sdkData.metadata; 
    }
    
    const processedMetadata = parseMetadata(metadataInputForParser);
    
    let displayName = processedMetadata.name;
    if (!displayName && defaultNameFromList) {
      displayName = defaultNameFromList;
    }
    if (!displayName) {
      displayName = `Inscription #${sdkData.inscription_number || inscriptionIdOrNumber}`;
    }
    
    const displayDescription = processedMetadata.description || 'No specific description available.';
    
    let finalContentUrl = sdkData.content_url;
    if (!finalContentUrl && sdkData.inscription_id) {
        console.warn(`No content_url from SDK for ${inscriptionIdOrNumber}, constructing fallback from inscription_id.`);
        finalContentUrl = `${ORDISCAN_WEBSITE_URL}/content/${sdkData.inscription_id}`;
    } else if (!finalContentUrl) {
        console.warn(`No content_url or inscription_id from SDK for ${inscriptionIdOrNumber} to construct content URL. Display might be affected.`);
        finalContentUrl = `${ORDISCAN_WEBSITE_URL}/inscription/${inscriptionIdOrNumber}`;
    }
    
    // Obtener la dirección del propietario de la respuesta de la API
    // La API de Ordiscan parece usar 'owner' como un string con la dirección
    let ownerAddress = 'N/A';
    if (sdkData.owner && typeof sdkData.owner === 'string') {
      ownerAddress = sdkData.owner;
    } else if (sdkData.owner_address) {
      ownerAddress = sdkData.owner_address;
    } else if (sdkData.ownerAddress) {
      ownerAddress = sdkData.ownerAddress;
    } else if (sdkData.address) {
      ownerAddress = sdkData.address;
    }
    
    return {
      id: sdkData.inscription_id || inscriptionIdOrNumber,
      number: typeof sdkData.inscription_number === 'number' ? sdkData.inscription_number : 
             (typeof sdkData.inscription_number === 'string' ? parseInt(sdkData.inscription_number, 10) || 0 : 0),
      ownerAddress: ownerAddress,
      contentType: sdkData.content_type || 'application/octet-stream',
      contentUrl: finalContentUrl,
      displayName: displayName,
      displayDescription: displayDescription,
      attributes: processedMetadata.attributes,
      metadataImage: processedMetadata.image,
      rawScanLink: `${ORDISCAN_WEBSITE_URL}/inscription/${sdkData.inscription_id || inscriptionIdOrNumber}`,
      timestamp: (sdkData.genesis_timestamp || sdkData.timestamp) ? 
                new Date(sdkData.genesis_timestamp || sdkData.timestamp).toISOString() : 
                new Date().toISOString(),
    };

  } catch (error: any) { 
    console.error(`Error fetching inscription data for ${inscriptionIdOrNumber} using Ordiscan SDK:`, error);
    
    let errorMessage = error?.message || 'An unknown error occurred with the Ordiscan SDK.';
    if (error?.response?.status === 404 || error?.message?.toLowerCase().includes('not found') || error?.message?.includes('404')) {
        errorMessage = `Inscription ${inscriptionIdOrNumber} not found via Ordiscan SDK.`;
    } else if (error?.message?.toLowerCase().includes('failed to fetch') || error?.message?.toLowerCase().includes('networkerror')) {
        errorMessage = `Network error while fetching ${inscriptionIdOrNumber}: ${error.message}. This could be a CORS policy issue with the API or a network connectivity problem. Please check your browser console (Network tab) for more details.`;
    } else if (error?.message?.includes('API key') || error?.message?.includes('Unauthorized')) {
        errorMessage = `Ordiscan API request failed for ${inscriptionIdOrNumber}, potentially due to an invalid API key or insufficient permissions: ${error.message}`;
    }
    
    throw new Error(`Failed to fetch or process inscription ${inscriptionIdOrNumber} using Ordiscan SDK: ${errorMessage}`);
  }
};
