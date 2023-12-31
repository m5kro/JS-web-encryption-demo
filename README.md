# JS-web-encryption-demo
A demo/proof of concept for encrypting web pages with JS. <br>
Heres a diagram of how this works: <br>
Server sends Login Page with JS --> Client sends username + hashed password --> Server checks hash <br>
<br>
If password is correct: <br>
Server saves login timestamp --> Server encrypts data (ex. admin page) with password as key --> Client recives and decrypts data with password <br>
 <br>
Post data: <br>
Client sends any post data encrypted with password + timestamp encrypted with password --> Server decrypts post data --> Server checks timestamp to prevent replay attacks --> Server updates last post timestamp <br>
<be>
<h1>How to Run</h1>
In the terminal run: <br>
npm install<br>
node server.js<br>
<br>
go to http://127.0.0.1:3000/ <br>
<br>
login with username: user1<br>
password: testpass<br>
<br>
run mitm or other interception to test encryption<br>
<br>
use test post to check encryption after login<br>
<br>
<h1>What this is for</h1>
Most people will see this project and think, doesn't HTTPS already stop the MITM issue? Yes, HTTPS does encrypt web pages and it does it better. However, there are still sites using unencrypted HTTP. I'm refering to local login pages, like router admin pages or printer login pages. Many of these are using pain HTTP or self signed HTTPS certificates, which are vulnerable to MITM attacks.<br>
<br>
<h1>What this Protects Against</h1>
This implementation will help protect against some forms of MITM: <br>
It will prevent attackers from seeing the data sent unless they know the clients password. <br>
If done right it can also encrypt HTML data. <br>
By checking timestamp of each POST message, replay attacks are mitigated. <br>
<br>
<h1>What this DOES NOT Protect Against</h1>
The biggest issue with plain HTTP is an attackers ability to completely modify the data. By redirecting to a phishing site, removing the encryption JS, or injecting their own JS, the attacker can easily bypass the encryption protocol. It also doesn't encrypt data during signup/registration, as there is no pre shared key.<br>
<br>
<h1>Verdict</h1>
HTTPS should always be preffered over this method. It's able to stop all the MITM methods I mentioned above and its already proven technology. But when HTTPS is not an option, I think this is better than nothing. <br>
