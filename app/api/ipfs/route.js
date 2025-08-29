import { NextResponse } from 'next/server';
import { Web3Storage, File as Web3File } from 'web3.storage';
import { NFTStorage, File as NFTFile } from 'nft.storage';

export const runtime = 'nodejs';

// Initialize storage clients
const getWeb3StorageClient = () => {
  const token = process.env.WEB3_STORAGE_TOKEN;
  return token ? new Web3Storage({ token }) : null;
};

const getNFTStorageClient = () => {
  const token = process.env.NFT_STORAGE_TOKEN;
  return token ? new NFTStorage({ token }) : null;
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = file.name || 'uploaded-file';
    
    let cid = null;
    let error = null;

    // Try Web3.Storage first
    const web3Client = getWeb3StorageClient();
    if (web3Client) {
      try {
        const web3File = new Web3File([buffer], fileName);
        cid = await web3Client.put([web3File]);
        console.log('Uploaded to Web3.Storage:', cid);
      } catch (err) {
        console.error('Web3.Storage upload failed:', err);
        error = err.message;
      }
    }

    // If Web3.Storage failed or not available, try NFT.Storage
    if (!cid) {
      const nftClient = getNFTStorageClient();
      if (nftClient) {
        try {
          const nftFile = new NFTFile([buffer], fileName);
          cid = await nftClient.storeBlob(nftFile);
          console.log('Uploaded to NFT.Storage:', cid);
        } catch (err) {
          console.error('NFT.Storage upload failed:', err);
          error = err.message;
        }
      }
    }

    // If both failed, return error
    if (!cid) {
      const errorMessage = error || 'No IPFS storage providers configured';
      return NextResponse.json({ 
        error: errorMessage,
        message: 'Please configure WEB3_STORAGE_TOKEN or NFT_STORAGE_TOKEN in your .env.local file'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      cid,
      url: `https://ipfs.io/ipfs/${cid}`,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('IPFS upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error.message 
    }, { status: 500 });
  }
}
