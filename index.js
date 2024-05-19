var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var csv = require('csvtojson');
require('dotenv/config');
var upload = multer({ dest: 'uploads/' });
var dataModel = require('./models/data.js');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true });
    const db=mongoose.connection;
    db.on("error",console.error.bind(console,"connection error:"));
    db.once('open',()=>{
        console.log('Database Connected');
    })


app.get('/', async(req, res) => {
    
   const data=await dataModel.find({});
   var arm=[]
   data.forEach(function(data){
    var ob={}
    ob.name=data.name;
    ob.email=data.email;
    ob.property=data.property;
    arm.push(ob)
    console.log(data.name,data.email,data.property);
});
res.send({message:arm});
});
app.post('/', upload.single('file'), (req, res, next) => {
    var success=0;
    var errorr=0;
    var total=0;
    csv()
    .fromFile(req.file.path)
    .then((jsonObj)=>{
        var army = [];
        for(var i = 0;i<jsonObj.length;i++){
            var obj={};
            console.log(jsonObj[i])
            obj.name=jsonObj[i]['name'];
            obj.email=jsonObj[i]['email'];
            obj.property=jsonObj[i]['city'];
            var cnt=0;
          
            
            const here=db.collection("data").find({email: obj.email}, function(err, result) {
                if(err){
                    console.log(err);
                    
                }
                else{cnt++; console.log("this is result");}
               
              });
          
           
            //var count=dataModel.count({ email: obj.email });
            if(cnt==0){
            army.push(obj);}
        }
        dataModel.insertMany(army).then(function(){
           
            success++;
            console.log("iamhere",jsonObj.length-army.length)
            res.status(200).send({
                message: `Successfully Uploaded:${army.length}, error:${jsonObj.length-army.length}, total:{jsonobj.length}`
            });
            
        }).catch(function(error){
            errorr++;
            res.status(500).send({
                message: "failure",
                error
            });
            
        });
    }).catch((error) => {
        console.log("Success:",success);
    console.log("Error:",errorr);
        res.status(500).send({
            message: "failure",
            error
        });
    })
    
});


app.listen('3000' || process.env.PORT, err => {
    if (err)
        throw err
    console.log('Server started!')
});``