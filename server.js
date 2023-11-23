// m5kro - 2023
const express = require('express');
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
// Set initial timestamp
let lastPostTimestamp = new Date().toISOString();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});

// List of users and passwords, passwords need to be in plaintext to be used as pre shared key
const users = {
  user1: {
    password: 'testpass',
  },
};

// Login section
app.post('/login', (req, res) => {
  // Get the username and hashed password from the POST data
  const { username, hashedPassword } = req.body;
  const user = users[username];
  // Compare the hashed password
  if (user && hashAndEncodeBase64(user.password) === hashedPassword) {
    // Respond with encrypted success message to ensure chain is working
    const successMessage = encryptWithPassword('Login successful!', user.password);
    res.send(successMessage);
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.post('/post-data', (req, res) => {
  // Get the encrypted POST data and encrypted timestamp
  const { encryptedData, username, timestamp } = req.body;
  const user = users[username];
  // Decrypt the timestamp
  const decryptedTimestamp = decryptWithPassword(timestamp,user.password);

  // Compare the timestamp to last post timestamp
  if (lastPostTimestamp && new Date(decryptedTimestamp) > new Date(lastPostTimestamp)) {
    // If the current timestamp is after the last post timestamp then it is ligitimate
    const decryptedData = decryptWithPassword(encryptedData, user.password);
  
    console.log('Decrypted data:', decryptedData);
  
    lastPostTimestamp = decryptedTimestamp;
  
    res.send('Data received successfully');
    
  } else {
    // If the current timestamp is before or equal to last post timestamp then it is a replay attack
    // If the current timestamp is malformed then the data has been tampered with
    res.status(401).send('Unauthorized: Timestamp mismatch');
    return;
  }
});

// Encrypt the data in AES using the password as the pre shared key
function encryptWithPassword(data, password) {
  const encryptedData = CryptoJS.AES.encrypt(data, password).toString();
  return encryptedData;
}

// Decrypt the data in AES using the password as the pre shared key
function decryptWithPassword(encryptedData, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error('Decryption error:', error.message);
    return 'Decryption failed';
  }
}

// Encode the password in base 64 first then hash to mitigate precomputed hash cracking
function hashAndEncodeBase64(data) {
  const base64Encoded = Buffer.from(data, 'utf-8').toString('base64');
  const hash = CryptoJS.SHA256(base64Encoded).toString(CryptoJS.enc.Base64);
  return hash;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
