import { create } from 'ipfs-http-client';

// Configure IPFS client
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const uploadToIPFS = async (file) => {
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`Upload progress: ${prog}`)
    });
    
    const url = `https://ipfs.io/ipfs/${added.path}`;
    return {
      cid: added.path,
      url: url
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const uploadMetadataToIPFS = async (metadata) => {
  try {
    const data = JSON.stringify(metadata);
    const added = await client.add(data);
    
    const url = `https://ipfs.io/ipfs/${added.path}`;
    return {
      cid: added.path,
      url: url
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
};

export const getIPFSGatewayURL = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

// Fallback IPFS client for development (using public gateway)
const publicClient = create({
  host: 'ipfs.io',
  port: 443,
  protocol: 'https',
});

export const uploadToPublicIPFS = async (file) => {
  try {
    const added = await publicClient.add(file);
    const url = `https://ipfs.io/ipfs/${added.path}`;
    return {
      cid: added.path,
      url: url
    };
  } catch (error) {
    console.error('Error uploading to public IPFS:', error);
    throw error;
  }
};

export const uploadMetadataToPublicIPFS = async (metadata) => {
  try {
    const data = JSON.stringify(metadata);
    const added = await publicClient.add(data);
    const url = `https://ipfs.io/ipfs/${added.path}`;
    return {
      cid: added.path,
      url: url
    };
  } catch (error) {
    console.error('Error uploading metadata to public IPFS:', error);
    throw error;
  }
}; 