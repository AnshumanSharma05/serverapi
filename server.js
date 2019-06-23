const express=require("express");
const bodyParser= require("body-parser");
const app=express();
app.use(bodyParser.json());
const cors= require("cors");
const knex=require("knex")
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


function downloadFile(auth) {const drive = google.drive({version: "v3", auth});
 var fileId = "https://drive.google.com/open?id=1sIvOo3hb7XhhVNaZsyOKUEXBRR3C4Sn3";
 var dest = fs.createWriteStream("./1.pdf");
 // example code here
 
}




// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
     
      });
	var dest = fs.createWriteStream("./1.pdf");
	drive.files.get({fileId:"1sIvOo3hb7XhhVNaZsyOKUEXBRR3C4Sn3", mimeType: 'application/pdf'}, {responseType: "stream"},
	function(err, res){
   res.data
   .on("end", () => {
      console.log("Done");
   })
   .on("error", err => {
      console.log("Error", err);
   })
   .pipe(dest);
   console.log(res)
});

    } else {
      console.log('No files found.');
    }
  });
}



const postgres=knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

console.log(postgres.select('*').from('users'));
app.use(cors())



app.get('/profile/:id',(req,res)=>{
	const {id} =req.params;
	let found=false;
	postgres.select('*').from('users').then(user=>{
		console.log(user);
	})
	if(!found){
		res.status(400).json("Not found");
	}
})

app.get('/',(req,res)=>{
	res.send("it is working");
})
app.post("/signin",(req,res)=>{
	postgres.select('email','hash').from("login")
	.where('email','=',req.body.email)
	.then(data=>{
		if (req.body.password===data[0].hash){
			postgres.select("*").from('users').where('email','=',req.body.email)
			.then(user=>{
				res.json(user[0])
			})
			.catch(err=>res.status(400).json("unable to get the user"))
		} else{
			res.status(400).json("Wrong id or password")

		}
		
			})
	 .catch(err=>res.status(400).json('wrong credentias'))
})


app.listen(process.env.PORT || 3000,()=>{
	console.log(`app is running on port ${process.env.PORT}`)
})


downloadFile("token.json")

