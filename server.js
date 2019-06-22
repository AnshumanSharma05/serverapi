const express=require("express");
const bodyParser= require("body-parser");
const app=express();
app.use(bodyParser.json());
const cors= require("cors");
const knex=require("knex")
const postgres=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'bel'
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
	res.send(postgres.users);
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


app.listen(3000,()=>{
	console.log("app is running on port 3000")
})


