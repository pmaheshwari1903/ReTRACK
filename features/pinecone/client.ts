import { Pinecone } from '@pinecone-database/pinecone';

let pinecone : Pinecone | null = null;

export function getPineconeClient() {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY || '',
        });
    }
    return pinecone.index({name: process.env.PINECONE_INDEX_NAME || ''});
}
