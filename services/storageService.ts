fetch('https://api.github.com/gists/YOUR_GIST_ID', {
  method: 'PATCH', // The action: "update this data"
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'token YOUR_GITHUB_PAT',   // Credentials for write access
    'Content-Type': 'application/json',          // Declares we are sending JSON data
  },
  body: JSON.stringify(payload), // The actual data being sent
});
