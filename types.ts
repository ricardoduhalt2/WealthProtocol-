
export interface OrdinalAttribute {
  trait_type: string;
  value: string | number;
}

export interface OrdinalMetadata {
  name?: string;
  description?: string;
  image?: string; // Added to explicitly type the image field if present in metadata
  attributes?: OrdinalAttribute[];
  [key: string]: any; // Allow other properties as metadata can be diverse
}

// Type for processed/standardized inscription data used in the app
export interface AppInscriptionData {
  id: string; // inscription_id
  number: number;
  ownerAddress: string;
  contentUrl: string; // Full URL to content from API's content_url
  contentType: string;
  displayName: string;
  displayDescription: string;
  attributes?: OrdinalAttribute[];
  metadataImage?: string; // URL for an image specified within the metadata
  rawScanLink: string; // Link to ordiscan.com/inscription/...
  timestamp: string; // ISO date string for potential display
}