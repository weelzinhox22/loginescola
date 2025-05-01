// This is a mock server file for Netlify deployment
// It prevents build errors related to server dependencies

console.log('This is a mock server file for Netlify deployment');
console.log('The actual server code is not used in the Netlify deployment');

// Export empty objects to satisfy imports
export const mockServer = {
  start: () => console.log('Mock server started'),
  stop: () => console.log('Mock server stopped')
};

export default mockServer; 