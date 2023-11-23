const express = require('express');
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

let lastPostTimestamp = new Date().toISOString();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});

const users = {
  user1: {
    password: 'testpass',
  },
};

app.post('/login', (req, res) => {
  const { username, hashedPassword } = req.body;
  const user = users[username];
  if (user && hashAndEncodeBase64(user.password) === hashedPassword) {
    const successMessage = encryptWithPassword('Login successful!', user.password);
    res.send(successMessage);
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.post('/post-data', (req, res) => {
  const { encryptedData, username, timestamp } = req.body;
  const user = users[username];
  const decryptedTimestamp = decryptWithPassword(timestamp,user.password);

  if (lastPostTimestamp && new Date(decryptedTimestamp) > new Date(lastPostTimestamp)) {
    const decryptedData = decryptWithPassword(encryptedData, user.password);
  
    console.log('Decrypted data:', decryptedData);
  
    lastPostTimestamp = decryptedTimestamp;
  
    res.send('Data received successfully');
    
  } else {
    res.status(401).send('Unauthorized: Timestamp mismatch');
    return;
  }
});

function encryptWithPassword(data, password) {
  const encryptedData = CryptoJS.AES.encrypt(data, password).toString();
  return encryptedData;
}

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

function hashAndEncodeBase64(data) {
  const base64Encoded = Buffer.from(data, 'utf-8').toString('base64');
  const hash = CryptoJS.SHA256(base64Encoded).toString(CryptoJS.enc.Base64);
  return hash;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
