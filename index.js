// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Optionally perform cleanup tasks here
    process.exit(1); // Exit the process with a non-zero code to indicate an error
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // Optionally perform cleanup tasks here
  });

const qrcode = require('qrcode-terminal');
const { Client, Location, List, Buttons, LocalAuth,MessageMedia} = require('whatsapp-web.js');
const mime = require('mime-types');
var fetchVideoInfo = require('youtube-infofix');
var YouTubeVideoId = require('youtube-video-id');
const Downloader = require("nodejs-file-downloader");
const tinyurl = require("tinyurl-shorten");
const corona = require("covid19-earth");
const CC = require('currency-converter-lt')
//const download = require('download');

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');



const client = new Client();

client.on('qr', (qr) => {
  // Display the QR code in the terminal
  console.log('Scan the following QR code to log in:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);



// First sample reply of message
    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } 




    //Anti Link
    else if (msg.body.startsWith('http')) {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.delete(true)
        }
    }







   //confirm that admi
    else if (msg.body.startsWith('ttp')) {
       const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
	          console.log("I am admin in this group");
              msg.reply('yes')
}

    }





    //image to sticker
    else if (msg.body.startsWith('.sticker')) {
        const quotedMsg = await msg.getQuotedMessage();
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            if(quotedMsg.hasMedia){
                quotedMsg.downloadMedia().then(media => {
                    if (media) {
                        const mediaPath = './downloaded-media/';
                        if (!fs.existsSync(mediaPath)) {
                            fs.mkdirSync(mediaPath);
                        }
                        const extension = mime.extension(media.mimetype);
                        const filename = new Date().getTime();
                        const fullFilename = mediaPath + filename + '.' + extension;
                        // Save to file
                        try {
                            fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                            console.log('File downloaded successfully!', fullFilename);
                            console.log(fullFilename);
                            MessageMedia.fromFilePath(filePath = fullFilename)
                            client.sendMessage(msg.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true,stickerAuthor:"Created By Bot",stickerName:"Stickers"} )
                            fs.unlinkSync(fullFilename)
                            console.log(`File Deleted successfully!`,);
                        } catch (err) {
                            console.log('Failed to save the file:', err);
                            console.log(`File Deleted successfully!`,);
                        }
                    }
                })
            }else{
                msg.reply('Please Reply to and image...')
            }
          }
    }





     //image to sticker
     else if (msg.body.startsWith('.audio')) {
        const quotedMsg = await msg.getQuotedMessage();
        const groupChat = await msg.getChat();
        const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
        if (botChatObj.isAdmin) {
            if (quotedMsg.hasMedia) {
                quotedMsg.downloadMedia().then(media => {
                    if (media) {
                        const mediaPath = './downloaded-media/';
                        if (!fs.existsSync(mediaPath)) {
                            fs.mkdirSync(mediaPath);
                        }
                        const extension = mime.extension(media.mimetype);
                        const filename = new Date().getTime();
                        const fullFilename = mediaPath + filename + '.' + extension;
                        // Save to file
                        try {
                            fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                            console.log('File downloaded successfully!', fullFilename);
                            console.log(fullFilename);
    
                            const inputVideoPath = fullFilename; // Replace with the path to your input video file
                            const outputAudioPath = './downloaded-media/audio.mp3'; // Replace with the desired output audio file path
    
                            // Convert video to audio
                            ffmpeg(inputVideoPath)
                                .output(outputAudioPath)
                                .noVideo()
                                .audioCodec('libmp3lame')
                                .on('end', () => {
                                    console.log('Audio conversion complete!');
                                    const media = MessageMedia.fromFilePath(outputAudioPath);
                                    msg.reply(media);
                                    fs.unlinkSync(fullFilename);
                                    fs.unlinkSync(outputAudioPath);
                                    console.log(`Files Deleted successfully!`);
                                })
                                .on('error', (err) => {
                                    console.error('Error during audio conversion:', err.message);
                                    fs.unlinkSync(fullFilename);
                                    console.log(`Files Deleted successfully!`);
                                })
                                .run();
                        } catch (err) {
                            console.log('Failed to save the file:', err);
                            console.log(`File Deleted successfully!`);
                        }
                    }
                }).catch(err => {
                    console.error('Error during media download:', err.message);
                });
            } else {
                msg.reply('Please reply to an image...');
            }
        }
    }
    

   


    //help send
    else if (msg.body.startsWith('.help')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const contact = await msg.getContact();
            const chat = await msg.getChat();
            chat.sendMessage(`Helo  @${contact.number}! `+'\n'+'*Here are the Commands list*'
            +'\n'+'-------------------------'+'\n'+'*1* 👉 *Currency Converter*'+'\n'+'*Usage:* .cc[from]to[to][amount]'+'\n'+'*Example:* .ccpkrtousd23'+'\n'+'-------------------------'+'\n'
            +'\n'+'*2* 👉 *Youtube Thumbnail Download*'+'\n'+'*Usage:* .ytp[space][video link]'+'\n'+'*Example:* .ytp https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n'
            +'\n'+'*3* 👉 *Youtube video Information*'+'\n'+'*Usage:* .ytinfo[space][video link]'+'\n'+'*Example:* .ytinfo https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n'
            +'\n'+'*4* 👉 *Link Shotner*'+'\n'+'*Usage:* .surl[space][url]'+'\n'+'*Example:* .surl https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n', {
                mentions: [contact]
            });
          }
    }






//storing phone number
    const path = require('path');
    const fs = require("fs");
    
    function isPhoneNumberExist(phoneData, phoneNumber) {
      return phoneData.some((data) => data.phoneNumber === phoneNumber);
    }
    
    function storePhoneNumberAndBalance(phoneNumber, balance) {
      const data = { phoneNumber, balance };
      const filePath = path.join(__dirname, 'phone_data.json');
    
      fs.readFile(filePath, 'utf8', (err, jsonData) => {
        let phoneData = [];
    
        if (!err) {
          try {
            phoneData = JSON.parse(jsonData);
          } catch (parseError) {
            console.error('Error parsing existing JSON data:', parseError);
          }
        }
    
        if (isPhoneNumberExist(phoneData, phoneNumber)) {
          console.log('Phone number already exists. Data not stored.');
        } else {
          phoneData.push(data);
    
          fs.writeFile(filePath, JSON.stringify(phoneData, null, 2), (writeErr) => {
            if (writeErr) {
              console.error('Error writing to JSON file:', writeErr);
            } else {
              console.log('Data stored successfully!');
            }
          });
        }
      });
    }
    




   //storing phone
   if (msg.body) {
        const senderNumber = msg.from;
        const input = senderNumber;
        const phoneNumberRegex = /(\d+)/;
        const match = input.match(phoneNumberRegex);
        if (match && match[1]) {
        const phoneNumber = match[1];
        console.log("Phone Number:", phoneNumber);
        const balance = 0;
        storePhoneNumberAndBalance(phoneNumber, balance);  
        } else {
        console.log("Phone number not found.");
            }   
}


   //show balance
   if (msg.body.startsWith('.balance')) {
    const senderNumber = msg.from;
    const input = senderNumber;
    const phoneNumberRegex = /(\d+)/;
    const match = input.match(phoneNumberRegex);
    if (match && match[1]) {
    const phoneNumber = match[1];
    console.log("Phone Number:", phoneNumber);
    const chat = await msg.getChat();
    
    const inputPhoneNumber = phoneNumber; // The phone number for which you want to check the balance
function getBalance(phoneNumber) {
  const data = fs.readFileSync('phone_data.json', 'utf8');
  const users = JSON.parse(data);
  const user = users.find((user) => user.phoneNumber === phoneNumber);
  if (user) {
    return user.balance;
  } else {
    return null;
  }
}
const balance = getBalance(inputPhoneNumber);
if (balance !== null) {
  console.log(`Balance for phone number ${inputPhoneNumber}: ${balance}`);
  msg.reply('*Your current balance is*: '+ balance + " USD")
} else {
  console.log(`Phone number ${inputPhoneNumber} not found.`);
}



    } else {
    console.log("Phone number not found.");
        }   
}




    //Commands
    else if (msg.body.startsWith('Commands')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const contact = await msg.getContact();
            const chat = await msg.getChat();
            chat.sendMessage(`Helo  @${contact.number}! `+'\n'+'*Here are the Commands list*'
            +'\n'+'-------------------------'+'\n'+'*1* 👉 *Currency Converter*'+'\n'+'*Usage:* .cc[from]to[to][amount]'+'\n'+'*Example:* .ccpkrtousd23'+'\n'+'-------------------------'+'\n'
            +'\n'+'*2* 👉 *Youtube Thumbnail Download*'+'\n'+'*Usage:* .ytp[space][video link]'+'\n'+'*Example:* .ytp https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n'
            +'\n'+'*3* 👉 *Youtube video Information*'+'\n'+'*Usage:* .ytinfo[space][video link]'+'\n'+'*Example:* .ytinfo https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n'
            +'\n'+'*4* 👉 *Link Shotner*'+'\n'+'*Usage:* .surl[space][url]'+'\n'+'*Example:* .surl https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n', {
                mentions: [contact]
            });    
          }
    }







// getting youtube video information
    else if (msg.body.startsWith('.ytinfo')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const give = msg.body.slice(8);
            const id = YouTubeVideoId(give);
            fetchVideoInfo(id, function (err, videoInfo) {
                if (err) throw new Error(err);
                msg.reply('*Title* 👉 '+videoInfo['title']+'\n\n'+'*Views* 👉'+ videoInfo['views']+'\n\n'+
                '*Description* 👉 '+videoInfo['description']+'\n\n'+'*Channel Id* 👉 '+videoInfo['channelId']+'\n\n'+
                '*Thumbnail Url* 👉 '+videoInfo['thumbnailUrl']+'\n\n'+'*Date Published* 👉 '+videoInfo['datePublished']+'\n\n'+
                '*Catagory* 👉 '+videoInfo['genre']);
              });
    
          }
    }



//storing rdps
const registeredUsersFile = 'registered_users.json';
function loadRegisteredUsers() {
  try {
    const data = fs.readFileSync(registeredUsersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function saveRegisteredUsers(users) {
  fs.writeFileSync(registeredUsersFile, JSON.stringify(users, null, 2));
}
function generateId() {
  const usedIds = new Set(loadRegisteredUsers().map(user => user.id));
  let id = Math.floor(Math.random() * 1000000) + 1;
  while (usedIds.has(id)) {
    id = Math.floor(Math.random() * 1000000) + 1;
  }
  return id;
}
function registerUser(ram, core, duration, price ,stock) {
  const users = loadRegisteredUsers();
  const id = generateId();
  users.push({ id, ram, core, duration, price, stock}); // Save with modified variable names
  saveRegisteredUsers(users);
  console.log(`User ${ram} registered with ID: ${id}`);
}
function deleteUser(id) {
  let users = loadRegisteredUsers();
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  if (users.length === initialLength) {
    console.log(`User with ID ${id} not found.`);
    return;
  }
  saveRegisteredUsers(users);
  console.log(`User with ID ${id} deleted.`);
}





// subtract balance
if (msg.body.startsWith('.subal')) {
  const groupChat = await msg.getChat();
 const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
    if (botChatObj.isAdmin){
      const give = msg.body;
      // Read phone data and deposit request JSON files
const phoneData = require('./phone_data.json');
const depositRequests = require('./deposit_request.json');
// Get input from user in the format: .upbal phonenumber amount transaction_id OR .subal phonenumber amount transaction_id
const userInput = give; // Replace with your input
const commandParts = userInput.split(' ');
if (commandParts.length !== 4) {
  console.log('Invalid command format.');
} else {
  const operation = commandParts[0];
  const phoneNumber = commandParts[1];
  const amount = parseFloat(commandParts[2]);
  const transactionId = commandParts[3];

  const phoneEntry = phoneData.find(entry => entry.phoneNumber === phoneNumber);
  if (phoneEntry) {
    const depositRequest = depositRequests.find(request => request.transaction_id === transactionId);
    if (depositRequest) {
      const exchangeRate = depositRequest.exchange_rate;

      if (operation === '.upbal') {
        // Update the balance by adding
        const updatedBalance = parseFloat(phoneEntry.balance) + amount / exchangeRate;
        phoneEntry.balance = updatedBalance.toFixed(3); // Round to three decimal places
      } else if (operation === '.subal') {
        // Update the balance by subtracting
        const updatedBalance = parseFloat(phoneEntry.balance) - amount / exchangeRate;
        phoneEntry.balance = updatedBalance.toFixed(3); // Round to three decimal places
      } else {
        console.log('Invalid operation.');
        return;
      }

      // Write updated phone data back to phone_data.json
      fs.writeFileSync('phone_data.json', JSON.stringify(phoneData, null, 2));

      console.log('Balance updated successfully.');
      console.log(`New balance for ${phoneNumber}: ${phoneEntry.balance}`);
      msg.reply("Balance for " + phoneNumber +" updated \nnew balance is "+`*${phoneEntry.balance} USD*`);
    } else {
      console.log('Transaction ID not found in deposit requests.');
      msg.reply('Transaction ID not found in deposit requests.')
    }
  } else {
    console.log('Phone number not found in phone data.');
    msg.reply('Phone number not found in phone data.')
  }
}

    }
}











// update balance
if (msg.body.startsWith('.upbal')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
       // Read phone data and deposit request JSON files
const phoneData = require('./phone_data.json');
const depositRequests = require('./deposit_request.json');
// Get input from user in the format: .upbal phonenumber amount transaction_id OR .subal phonenumber amount transaction_id
const userInput = give; // Replace with your input
const commandParts = userInput.split(' ');
if (commandParts.length !== 4) {
  console.log('Invalid command format.');
} else {
  const operation = commandParts[0];
  const phoneNumber = commandParts[1];
  const amount = parseFloat(commandParts[2]);
  const transactionId = commandParts[3];

  const phoneEntry = phoneData.find(entry => entry.phoneNumber === phoneNumber);
  if (phoneEntry) {
    const depositRequest = depositRequests.find(request => request.transaction_id === transactionId);
    if (depositRequest) {
      const exchangeRate = depositRequest.exchange_rate;

      if (operation === '.upbal') {
        // Update the balance by adding
        const updatedBalance = parseFloat(phoneEntry.balance) + amount / exchangeRate;
        phoneEntry.balance = updatedBalance.toFixed(3); // Round to three decimal places
      } else if (operation === '.subal') {
        // Update the balance by subtracting
        const updatedBalance = parseFloat(phoneEntry.balance) - amount / exchangeRate;
        phoneEntry.balance = updatedBalance.toFixed(3); // Round to three decimal places
      } else {
        console.log('Invalid operation.');
        return;
      }

      // Write updated phone data back to phone_data.json
      fs.writeFileSync('phone_data.json', JSON.stringify(phoneData, null, 2));

      console.log('Balance updated successfully.');
      console.log(`New balance for ${phoneNumber}: ${phoneEntry.balance}`);
      msg.reply("Balance for " + phoneNumber +" updated \nnew balance is "+`*${phoneEntry.balance} USD*`);
    } else {
      console.log('Transaction ID not found in deposit requests.');
      msg.reply('Transaction ID not found in deposit requests.')
    }
  } else {
    console.log('Phone number not found in phone data.');
    msg.reply('Phone number not found in phone data.')
  }
}
 
      }
}















// add gmail
if (msg.body.startsWith('.addgmailprice')) {
  const groupChat = await msg.getChat();
 const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
    if (botChatObj.isAdmin){
      const give = msg.body;
      // Define the entire command as a single variable
const fullCommand = give;
// Split the command into parts
const commandParts = fullCommand.split(' ');
if (commandParts.length !== 3 || commandParts[0] !== '.addgmailprice') {
  console.log('Invalid command format.');
  
}
const country = commandParts[1];
const price = parseFloat(commandParts[2]);
// Load existing data if the file exists
const filePath = path.join(__dirname, 'gmail_price.json');
let existingData = [];
try {
  const data = fs.readFileSync(filePath, 'utf8');
  existingData = JSON.parse(data);
} catch (error) {
  // File doesn't exist or couldn't be read, that's okay
}
// Update or add the price for the country
const newData = {
  country: country,
  price: price
};
const newDataIndex = existingData.findIndex(item => item.country === country);
if (newDataIndex !== -1) {
  existingData[newDataIndex] = newData;
} else {
  existingData.push(newData);
}
// Write the updated data to the JSON file
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
console.log('Data updated in the file.');
msg.reply(`The price of *${country}* gmail updated => *${price}*`)
  }
}













// add gmail
if (msg.body.startsWith('.addgmail')) {
  const groupChat = await msg.getChat();
 const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
    if (botChatObj.isAdmin){
      const give = msg.body;
      // Define the entire command as a single variable
const fullCommand = give;
// Split the command into parts
const commandParts = fullCommand.split(' ');
if (commandParts.length !== 4 || commandParts[0] !== '.addgmail') {
  console.log('Invalid command format.');
  process.exit(1);
}
const country = commandParts[1];
const email = commandParts[2];
const password = commandParts[3];
// Generate random 5-digit ID
const randomId = Math.floor(10000 + Math.random() * 90000);
// Data to be saved
const newData = {
  id: randomId,
  country: country,
  email: email,
  password: password
};
// Load existing data if the file exists
const filePath = path.join(__dirname, 'gmail_list.json');
let existingData = [];
try {
  const data = fs.readFileSync(filePath, 'utf8');
  existingData = JSON.parse(data);
} catch (error) {
  // File doesn't exist or couldn't be read, that's okay
}

// Add the new data
existingData.push(newData);

// Write the updated data to the JSON file
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
console.log('Data added to the file.');
msg.reply(`A new gmail was added successfully..\n*Gmail =>* ${email}\n*Password =>* ${password}\n*Country =>* ${country}`)


    }
}
















// add rdp
if (msg.body.startsWith('.addrdp')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
        function parseRegisterCommand(input) {
            const registerRegex = /\.addrdp\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/;
            const match = input.match(registerRegex);
            if (match) {
              const [, name, email, password, phone, stock] = match;
              return { name, email, password, phone, stock };
            }
            return null;
          }
          const inputString = give;
          const registrationData = parseRegisterCommand(inputString);
          if (registrationData) {
            const { name, email, password, phone, stock } = registrationData;
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Phone:', phone);
            console.log('Stock:', stock);
            registerUser(name,email,password,phone,stock);
            msg.reply("Rdp add successfully..")
          } else {
            console.log('Invalid input format.');
          }
      }
}







// all give rdp
if (msg.body.startsWith('.allgiverdp')) {
  const groupChat = await msg.getChat();
 const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
    if (botChatObj.isAdmin){
      const give = msg.body;
      const command = give;
    // Read the data from the JSON file
    fs.readFile('user_rdp.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
    } else {
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.length === 0) {
                console.log('No RDP data found.');
                msg.reply('RDP not found..')
            } else {
                console.log('RDP data:');
                jsonData.forEach((rdpData, index) => {
                    console.log(`Entry ${index + 1}:`);
                    console.log(`ID: ${rdpData.id}`);
                    console.log(`Phone Number: ${rdpData.phoneNumber}`);
                    console.log(`IP Address: ${rdpData.ipAddress}`);
                    console.log(`Username: ${rdpData.username}`);
                    console.log(`Password: ${rdpData.password}`);
                    console.log(`Status: ${rdpData.status}`);
                    console.log('--------------------------');
                    msg.reply(`*ID =>* ${rdpData.id}\n*Phone Number =>* ${rdpData.phoneNumber}\n*IP Address =>* ${rdpData.ipAddress}\n*Username =>* ${rdpData.username}\n*Password =>* ${rdpData.password}\n*Status =>* ${rdpData.status}\n`)
                });
            }
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
        }
    }
});
      
    }
}







// all give rdp
if (msg.body.startsWith('.getrdp')) {
  const groupChat = await msg.getChat();
 const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
    if (botChatObj.isAdmin){
      const give = msg.body;
      const command = give;

// Read the data from the JSON file
fs.readFile('user_rdp.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
    } else {
        try {
            const jsonData = JSON.parse(data);
            const phoneNumberToSearch = command.split(' ')[1];

            const matchingData = jsonData.filter((rdpData) => rdpData.phoneNumber === phoneNumberToSearch);

            if (matchingData.length > 0) {
                console.log('RDP data for phone number', phoneNumberToSearch, ':');
                matchingData.forEach((entry, index) => {
                    console.log(`Entry ${index + 1}:`);
                    console.log(`ID: ${entry.id}`);
                    console.log(`IP Address: ${entry.ipAddress}`);
                    console.log(`Username: ${entry.username}`);
                    console.log(`Password: ${entry.password}`);
                    console.log(`Status: ${entry.status}`);
                    console.log('--------------------------');
                    msg.reply(`*ID =>* ${entry.id}\n*Phone Number =>* ${phoneNumberToSearch}\n*IP Address =>* ${entry.ipAddress}\n*Username =>* ${entry.username}\n*Password =>* ${entry.password}\n*Status =>* ${entry.status}\n`)
                });
            } else {
                console.log('No RDP data found for phone number', phoneNumberToSearch);
                msg.reply('No RDP data found for phone number'+ phoneNumberToSearch)
            }
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
        }
    }
});
 
}};










//give rdp deatils

if (msg.body.startsWith('.giverdp')) {
  const groupChat = await msg.getChat();
 const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
    if (botChatObj.isAdmin){
      const give = msg.body;
      const command = give;
// Parse the command
const commandParts = command.split(' ');
if (commandParts.length !== 6 || commandParts[0] !== '.giverdp') {
    console.log('Invalid command format');
    process.exit(1);
}
const phoneNumber = commandParts[1];
const ipAddress = commandParts[2];
const username = commandParts[3];
const password = commandParts[4];
const status = commandParts[5];
// Generate a random 5-digit ID
const id = Math.floor(Math.random() * 90000) + 10000;
// Create an object for the new data
const rdpData = {
    id: id,
    phoneNumber: phoneNumber,
    ipAddress: ipAddress,
    username: username,
    password: password,
    status: status
};
// Read the existing data from the JSON file (if it exists)
let existingData = [];
const jsonFilePath = path.join(__dirname, 'user_rdp.json');
if (fs.existsSync(jsonFilePath)) {
    try {
        const fileData = fs.readFileSync(jsonFilePath, 'utf8');
        if (fileData) {
            existingData = JSON.parse(fileData);
        }
    } catch (error) {
        console.error('Error parsing existing JSON data:', error.message);
        process.exit(1);
    }
}
// Append the new data to the existing data
existingData.push(rdpData);
// Convert the updated data to JSON format
const jsonData = JSON.stringify(existingData, null, 4);
// Write the updated JSON data back to the file
fs.writeFile(jsonFilePath, jsonData, 'utf8', (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('New RDP data appended to user_rdp.json');
        msg.reply("RDP details addedd successfully. and send to the user...")
        const targetPhoneNumber = phoneNumber;

        // Replace 'Your message here' with the actual message you want to send
        const message = `*Your RDP Details*\n\n *IP =>* ${ipAddress}\n*Username =>* ${username}\n*Password =>* ${password}\n*ID =>* ${id}\n\n *Note =>* If there is any issue kindly send message *.issue ${id} your_message*`;

        // Find the chat by phone number
        client.getChatById(targetPhoneNumber + '@c.us').then((chat) => {
        chat.sendMessage(message);
        }).catch((error) => {
    console.error('Error sending message:', error);
        });
            }
});

    }
}







//delete rdp
else if (msg.body.startsWith('.delrdp')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body.slice(8);
        const idd = parseInt(give)
        deleteUser(idd)
        msg.reply('*'+give+'*' + ' RDP deleted successfully..')
          } else {
            msg.reply("Invalid ID")
            console.log('Invalid input format.');
          }
      }







//to see order of specfic number
else if (msg.body.startsWith('.order')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
        // Step 1: Parse JSON data
const jsonData = fs.readFileSync('buying.json');
const buyingData = JSON.parse(jsonData);
// Step 2: Function to filter data based on phoneNumber and status
function findOrderByPhoneNumberAndStatus(phoneNumber, status) {
  return buyingData.filter(
    (order) => order.phoneNumber === phoneNumber && order.status === status
  );
}
// Step 3: Function to print the filtered data
function printOrders(orders) {
  orders.forEach((order) => {
    console.log('Order Details:');
    console.log('Date:', order.date);
    console.log('PhoneNumber:', order.phoneNumber);
    console.log('Item ID:', order.item.id);
    console.log('Item RAM:', order.item.ram);
    console.log('Item Core:', order.item.core);
    console.log('Quantity:', order.item.quantity);
    console.log('Total Cost:', order.totalCost);
    console.log('Status:', order.status);
    console.log('Duration:', order.item.duration);
    console.log('---------------------------');
    // Function to convert date and time format
function formatDateAndTime(inputDate) {
    const dateObject = new Date(inputDate);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    const time = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `${month}-${day}-${year} ${time}`;
  }
  // Input date and time in the current format
  const inputDateTime = order.date;
  // Convert and print the date and time in the desired format
  const formattedDateTime = formatDateAndTime(inputDateTime);
  console.log(formattedDateTime);
  
    msg.reply('*Order No # '+order.item.id+'*\n\n*Date =>* '+formattedDateTime+'\n*PhoneNumber =>* '+order.phoneNumber+'\n*RAM =>* '+order.item.ram+'\n*Core =>* '+order.item.core+'\n*Quantity =>* '+order.item.quantity+'\n*Total Cost =>* '+order.totalCost+' PKR'+'\n*Duration =>* '+order.item.duration+'\n*Status =>* '+order.status)
  });
}
// Input from the command line arguments
const input = give;
const [command, phoneNumber, status] = input.split(' ');

if (command === '.order') {
  // Find and print the corresponding data
  const filteredOrders = findOrderByPhoneNumberAndStatus(phoneNumber, status);
  printOrders(filteredOrders);
} else {
  console.log('Invalid command. Please use ".order phonenumber status" format.');
  msg.reply('Invalid command. Please use ".order phonenumber status" format.')
}
          } else {
            msg.reply("Invalid ID")
            console.log('Invalid input format.');
          }
      }








      //to see order of specfic number
else if (msg.body.startsWith('.allorder')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
        // Step 1: Parse JSON data
const jsonData = fs.readFileSync('buying.json');
const buyingData = JSON.parse(jsonData);
// Step 2: Function to filter data based on phoneNumber and status
function findOrderByPhoneNumberAndStatus(status) {
  return buyingData.filter(
    (order) => order.status === status
  );
}
// Step 3: Function to print the filtered data
function printOrders(orders) {
  orders.forEach((order) => {
    console.log('Order Details:');
    console.log('Date:', order.date);
    console.log('PhoneNumber:', order.phoneNumber);
    console.log('Item ID:', order.item.id);
    console.log('Item RAM:', order.item.ram);
    console.log('Item Core:', order.item.core);
    console.log('Quantity:', order.item.quantity);
    console.log('Total Cost:', order.totalCost);
    console.log('Status:', order.status);
    console.log('Duration:', order.item.duration);
    console.log('---------------------------');
    // Function to convert date and time format
function formatDateAndTime(inputDate) {
    const dateObject = new Date(inputDate);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    const time = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `${month}-${day}-${year} ${time}`;
  }
  // Input date and time in the current format
  const inputDateTime = order.date;
  // Convert and print the date and time in the desired format
  const formattedDateTime = formatDateAndTime(inputDateTime);
  console.log(formattedDateTime);
    msg.reply('   *Order Number # '+order.item.id+'*\n\n*Date =>* '+formattedDateTime+'\n*Phone Number =>* +'+order.phoneNumber+'\n*RAM =>* '+order.item.ram+'\n*Core =>* '+order.item.core+'\n*Quantity =>* '+order.item.quantity+'\n*Total Cost =>* '+order.totalCost+' USD'+'\n*Duration =>* '+order.item.duration+'\n*Status =>* '+order.status)
  });
}
// Input from the command line arguments
const input = give;
const [command, status] = input.split(' ');

if (command === '.allorder') {
  // Find and print the corresponding data
  const filteredOrders = findOrderByPhoneNumberAndStatus(status);
  printOrders(filteredOrders);
} else {
  console.log('Invalid command. Please use ".order phonenumber status" format.');
  msg.reply('Invalid command. Please use ".order status" format.')
}
          } else {
            msg.reply("Invalid ID")
            console.log('Invalid input format.');
          }
      }












//show all gmails
else if (msg.body.startsWith('.shgmail')) {
       const give = msg.body;
       const fullCommand = give;
// Split the command into parts
const commandParts = fullCommand.split(' ');
if (commandParts.length !== 2 || commandParts[0] !== '.shgmail') {
  console.log('Invalid command format.');
  
}
const targetCountry = commandParts[1];
// Load data from the JSON file
const filePath = path.join(__dirname, 'gmail_list.json');
let existingData = [];

try {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    if (data.trim() !== '') {
      existingData = JSON.parse(data);
    } else {
      console.log('No data available.');
      msg.reply("No Gmails Stock Available Now..")
      
    }
  } else {
    console.log('No data available.');
    msg.reply("No Gmails Stock Available Now..")
    
  }
} catch (error) {
  console.log('Error reading or parsing the file:', error.message);
  
}
// Load data from the gmail_price.json file
const priceFilePath = path.join(__dirname, 'gmail_price.json');
let priceData = {};

try {
  if (fs.existsSync(priceFilePath)) {
    const priceFileData = fs.readFileSync(priceFilePath, 'utf8');
    priceData = JSON.parse(priceFileData);
  }
} catch (error) {
  console.log('Error reading or parsing the price file:', error.message);
  
}
// Calculate stock by country
const stockByCountry = {};
for (const item of existingData) {
  if (!stockByCountry[item.country]) {
    stockByCountry[item.country] = 1;
  } else {
    stockByCountry[item.country]++;
  }
}
// Print all country names, corresponding stock, and price
if (targetCountry === 'all') {
  if (Object.keys(stockByCountry).length === 0) {
    console.log('No data available.');
    msg.reply("No Gmails Stock Available Now..")
  } else {
    for (const country in stockByCountry) {
      const stock = stockByCountry[country];
      const price = priceData[country] || 'Price not available';
      console.log(`Country: ${country}, Stock: ${stock}, Price: ${price}`);
      msg.reply(`*Country =>* ${country}\n*Stock =>* ${stock}\n*Price =>* ${price}\n..............\n`)
    }
  }
} else {
  if (existingData.length === 0) {
    console.log('No data available.');
    msg.reply("No Gmails Stock Available Now..")
  } else {
    const stock = stockByCountry[targetCountry] || 0;
    const price = priceData[targetCountry] || 'Price not available';
    console.log(`Country: ${targetCountry}, Stock: ${stock}, Price: ${price}`);
    msg.reply(`*Country =>* ${targetCountry}\n*Stock =>* ${stock}\n*Price =>* ${price}\n..............\n`)
  }
}

      }



//deposit message fora accounts
else if (msg.body.startsWith('.deposit')) {
  const chat = await msg.getChat();
  let currencyConverter = new CC()
    currencyConverter.from('usd').to('pkr').amount(1).convert().then((response) => {
      chat.sendMessage(`*Easypaisa*\n*Account Number =>* 03139079227\n*Account Name =>* Ahmad Hassan\n*Exchange Rate =>* 1 USD to *${response}* PKR\n\n After sending the payment send_message *.addmoney transction_id*`)
      })
          
    }



//deposit request send
else if (msg.body.startsWith('.addmoney')) {
  const chat = await msg.getChat();
  let currencyConverter = new CC()
    currencyConverter.from('usd').to('pkr').amount(1).convert().then((response) => {
      const senderNumber = msg.from;
        const input = senderNumber;
        const phoneNumberRegex = /(\d+)/;
        const match = input.match(phoneNumberRegex);
        if (match && match[1]) {
          const phoneNumber = match[1];
          const give = msg.body;
          console.log("Phone Number:", phoneNumber);
          
          // Simulating receiving a command
const command = give;
const phone_number = phoneNumber;
const transaction_iddd = give.split(' ')[1];
// Define the deposit request object
const depositRequest = {
    transaction_id: command.split(' ')[1],
    phone_number: phone_number,
    exchange_rate: response
};
// Read existing data from the JSON file (if it exists)
let existingData = [];
const jsonFilePath = 'deposit_request.json';

// Append the new deposit request to the existing data
existingData.push(depositRequest);
// Convert the updated data to JSON format
const jsonData = JSON.stringify(existingData, null, 4);
// Write the updated JSON data back to the file
fs.writeFile(jsonFilePath, jsonData, 'utf8', (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('New deposit request saved to deposit_request.json');
        msg.reply(`Your Deposit request has been submitted successfully..\nPlease wait atleast 5 minutes to verify transction_id\n*Exchange Rate =>* 1 USD to *${response}* PKR\nYour balance will be added automatically..\nTo check balance type *.balance*`)
        const groupName = 'Demo';
// Replace 'Your message here' with the actual message you want to send
const message = `A Deposit Request has been placed..\n*Phone number =>* ${phone_number}\n*Exchange Rate =>* 1 USD to *${response}* PKR\n*Transaction_id =>* ${transaction_iddd}`;
// Find the group chat by name
client.getChats().then((chats) => {
    const groupChat = chats.find((chat) => chat.isGroup && chat.name === groupName);
    if (groupChat) {
        groupChat.sendMessage(message);
    } else {
        console.log('Group not found:', groupName);
    }
}).catch((error) => {
    console.error('Error sending message:', error);
});

    }
});

        } else {
          console.log("Phone number not found.");
        }
      

      
      })
          
    }





      //buy rdp
      function generateRandomId() {
        return Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
      }
      const stockDataFile = 'registered_users.json';
      const phoneDataFile = 'phone_data.json';
      const buyingFile = 'buying.json';
      
      function loadStockData() {
        try {
          const data = fs.readFileSync(stockDataFile, 'utf8');
          return JSON.parse(data);
        } catch (err) {
          return [];
        }
      }
      
      function loadPhoneData() {
        try {
          const data = fs.readFileSync(phoneDataFile, 'utf8');
          return JSON.parse(data);
        } catch (err) {
          return [];
        }
      }
      
      function saveBuyingData(data) {
        fs.writeFileSync(buyingFile, JSON.stringify(data, null, 2));
      }
      
      function buyItem(command, phoneNumber) {
        const [_, id, quantity] = command.match(/\.buy\s+(\d+)\s+(\d+)/);
      
        const stockData = loadStockData();
        const phoneData = loadPhoneData();
      
        const itemIndex = stockData.findIndex((item) => item.id === parseInt(id, 10));
      
        if (itemIndex === -1) {
          console.log(`Item with ID ${id} not found.`);
          msg.reply(`Item with ID ${id} not found.`)
          return;
        }
      
        const item = stockData[itemIndex];
      
        if (item.stock < parseInt(quantity, 10)) {
          console.log(`Not enough stock for item with ID ${id}.`);
          msg.reply(`Not enough stock for item with ID ${id}.`);
          return;
        }
      
        const totalCost = item.price * parseInt(quantity, 10);
        const phoneIndex = phoneData.findIndex((entry) => entry.phoneNumber === phoneNumber);
      
        if (phoneIndex === -1) {
          console.log(`Phone number ${phoneNumber} not found.`);
          return;
        }
      
        const phone = phoneData[phoneIndex];
      
        if (phone.balance < totalCost) {
          console.log(`Not enough balance for phone number ${phoneNumber}.`);
          msg.reply("Not enough balance");
          return;
        }
      
        // Update the stock quantity
        stockData[itemIndex].stock -= parseInt(quantity, 10);
        saveStockData(stockData);
      
        // Update the phone balance
        phoneData[phoneIndex].balance -= totalCost;
        savePhoneData(phoneData);
      
        const itemId = generateRandomId(); // Generate a random 5-digit ID
        const purchaseData = {
          date: new Date().toISOString(),
          phoneNumber,
          item: {
            id: itemId, // Use the generated random ID for the purchased item
            ram: item.ram,
            core: item.core,
            duration: item.duration,
            price: item.price,
            quantity: parseInt(quantity, 10),
          },
          totalCost,
          status: 'pending'
        };
      
        // Append the purchase data to buying.json
        const buyingData = loadBuyingData();
        buyingData.push(purchaseData);
        saveBuyingData(buyingData);
      
        console.log(`Purchase completed successfully.`);
        msg.reply(`you have successfully bought Order no: *${itemId}*\n Please wait 5 minutes rdp details will be send to you automatically...`);
        // Read the content of the JSON file
fs.readFile('buying.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading data.json:', err);
    return;
  }
  const jsonData = JSON.parse(data);
  const idToFind = itemId; // Change this to the desired ID
  const matchingEntries = jsonData.filter(entry => entry.item.id === idToFind);
  if (matchingEntries.length > 0) {
    console.log(`Matching Entries Found for ID ${idToFind}:`);
    matchingEntries.forEach((entry, index) => {
      console.log(`Entry ${index + 1}:`);
      console.log("Date:", entry.date);
      console.log("Phone Number:", entry.phoneNumber);
      console.log("ID:", entry.item.id);
      console.log("RAM:", entry.item.ram);
      console.log("Core:", entry.item.core);
      console.log("Duration:", entry.item.duration);
      console.log("Price:", entry.item.price);
      console.log("Quantity:", entry.item.quantity);
      console.log("Total Cost:", entry.totalCost);
      console.log("Status:", entry.status);
      console.log("----------");
      const groupName = 'Demo';
      // Replace 'Your message here' with the actual message you want to send
      const message = `A Buying Request has been placed Order no => *${itemId}*\n*Phone number =>* ${entry.phoneNumber}\n*Date =>* ${entry.date}\n*Ram =>* ${entry.item.ram}\n*Core =>* ${entry.item.core}\n*Duration =>* ${entry.item.duration}\n*Quantity =>* ${entry.item.quantity}\n*Total Cost =>* ${entry.totalCost} USD\n*Status =>* ${entry.status}`;
      // Find the group chat by name
      client.getChats().then((chats) => {
          const groupChat = chats.find((chat) => chat.isGroup && chat.name === groupName);
          if (groupChat) {
              groupChat.sendMessage(message);
          } else {
              console.log('Group not found:', groupName);
          }
      }).catch((error) => {
          console.error('Error sending message:', error);
      });
    });
  } else {
    console.log("No matching entries found for ID:", idToFind);
  }
})
      }
      
      function loadBuyingData() {
        try {
          const data = fs.readFileSync(buyingFile, 'utf8');
          return JSON.parse(data);
        } catch (err) {
          return [];
        }
      }
      
      function saveStockData(data) {
        fs.writeFileSync(stockDataFile, JSON.stringify(data, null, 2));
      }
      
      function savePhoneData(data) {
        fs.writeFileSync(phoneDataFile, JSON.stringify(data, null, 2));
      }
      
     
      
      if (msg.body.startsWith('.buy')) {
        const give = msg.body;
        const senderNumber = msg.from;
        const input = senderNumber;
        const phoneNumberRegex = /(\d+)/;
        const match = input.match(phoneNumberRegex);
        if (match && match[1]) {
          const phoneNumber = match[1];
          console.log("Phone Number:", phoneNumber);
          buyItem(give, phoneNumber);
        } else {
          console.log("Phone number not found.");
        }
      }
      





// thumbnail download
else if (msg.body.startsWith('.ytp')) {
    const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const give = msg.body.slice(5);
            const id = YouTubeVideoId(give);
            const contact = await msg.getContact();
            const chat = await msg.getChat();
            fetchVideoInfo(id, async function (err, videoInfo) {
                if (err) throw new Error(err);
                const thumbnal = await MessageMedia.fromUrl(videoInfo['thumbnailUrl']);
                msg.reply(thumbnal)
              });
          }
}    











    // Downloading direct 
    else if (msg.body.startsWith('.d')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const urll = msg.body.slice(3);
        (async () => {//Wrapping the code with an async function, just for the sake of example.
    const downloader = new Downloader({
      url: urll,//If the file name already exists, a new file with the name 200MB1.zip is created.    
      directory: "./downloads",    
    })
    try {
     const as =  await downloader.download();      
     const filesa =  as['filePath'];
     const media = MessageMedia.fromFilePath(filesa);
     await msg.reply(media);
     fs.unlink(filesa, (err) => {});
    } catch (error) {//IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
      //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
      msg.reply('downloading error')
    } 
})();
           msg.reply('downloading please wait...')  
          }
    }











    // short url
    else if (msg.body.startsWith('.surl')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const giveurl = msg.body.slice(6);
            (async () => {
                shorturl = await tinyurl(giveurl);
                msg.reply('*Here is your short url:* '+'\n\n' + shorturl);
              })();
          }    
    }



    // corna
    else if (msg.body.startsWith('.corna')) {
        const country = msg.body.slice(7);
        async function example() {
            let cases = await corona.country(country); // Country Data
            let caseses = '*Country* 👉 '+cases['country']+'\n'+'*Total Cases* 👉 '+cases['totalCases']
            +'\n'+'*New Cases* 👉 '+cases['newCases']+'\n'+'*Total Deaths* 👉 '+cases['totalDeaths']+'\n'+
            '*Total Recovered* 👉 '+cases['totalRecovered']+'\n'+'*Active Cases* 👉 '+cases['activeCases']+'\n'+
            '*Critical Cases* 👉 '+cases['criticalCase']+'\n'+'*Total Tests* 👉 '+cases['totalTests']
            msg.reply(caseses);           
          }
          example()
    }




    // exchange rate
    else if (msg.body.startsWith('.cc')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const contact = await msg.getContact();
        const chat = await msg.getChat();
        const from = msg.body.slice(3,6).toUpperCase();
        const to = msg.body.slice(8,11).toUpperCase();
        const getamount = msg.body.slice(11);
        const amount = Number(getamount)
        let currencyConverter = new CC()
        currencyConverter.from(from).to(to).amount(amount).convert().then((response) => {
            chat.sendMessage(`@${contact.number}!`+'\n\n'+'*'+amount+'*'+' '+from+' '+' 👉 '+'*'+response+'*'+' '+to, {
                mentions: [contact]
            });
      })
          }   
    }



    





});


client.initialize();
