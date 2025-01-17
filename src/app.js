const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
// const Totalentries = require("./models/totalentries");
// const school1 = require("./models/totalentries");
// const school2 = require("./models/totalentries");
// const school3 = require("./models/totalentries");
// const school4 = require("./models/totalentries");1
// const deos = require("./models/totalentries");
const Schooladmins = require("./models/schooladmins");
const School1 = require("./models/school1");
const School2 = require("./models/school2");
const School3 = require("./models/school3");
const School4 = require("./models/school4");
const Deos = require("./models/schooladmins");
const auth = require("./auth");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
require("./db/connect");
// require("./db/connectd1");
// require("./db/connectd2");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

app.get("/",auth,(req,res)=>{
  res.send("index");
});

app.get("/index2",auth , (req,res)=>{
    res.send("index2");
});
app.get("/login",(req,res)=>{
  res.sendFile(path.join(__dirname, "../public/login.html"));
});
app.get("/district",(req,res)=>{
  res.sendFile(path.join(__dirname, "../public/district.html"));
});
app.get("/school",(req,res)=>{
  res.sendFile(path.join(__dirname, "../public/school.html"));
});
// const createToken = async()=>{
//   const token = await jwt.sign({_id : "650b1a613fd8c74515f95815"},"abcdefghijklmnopqrstuvwxyz12345678");
//   console.log(token);

//   const userVer = await jwt.verify(token , "abcdefghijklmnopqrstuvwxyz12345678");
//   console.log(userVer);
// }
// createToken();

//login auth
// app.post("/login",async(req,res)=>{
//   try{
//     const email = req.body.email;
//     const password = req.body.password;
//     console.log(email);
//     console.log(password);
//     console.log("upto this");
//     const id = await schooladmins.findOne({userID : email})


    
//     if (!id) {
//       res.status(401).send("User not found"); // User not found
//     } 
//     else if(id.password == password){
//         // const adminName = id.name;
//         // const adminDesig = id.designation;
//         // const adminSchool = id.schoolName;
//         // const adminSchoolId = id.schoolId;
//         // const adminDistrict = id.district;
//         // res.status(201).send("index");

//         // req.session.adminSchoolId = adminSchoolId; // Example using Express session

//       // Redirect to the form page where the user can add data
//       const token = await id.generateAuth();
//       console.log("the token part is " + token);
//       res.send("index");

//     }else{
//         res.status(401).send("Invalid username and password");
//     }
//   }
//   catch(error){
//     res.status(400).send("Internal Server Error: " + error.message)
//   }
// });

// app.post("/",(req,res)=>{
//   const adminSchoolId = req.session.adminSchoolId;
// })

app.post("/login", async (req, res) => {
  try {
    const username = req.body.userID;
    const password = req.body.password;

    const user = await Schooladmins.findOne({_id:username});
    console.log(user);
    if (!user) {
      console.log("User not found");
      res.status(401).send("User not found");
    } else if (user.password == password) {
      // const token = await user.generateAuth();
      // console.log("Token:", token);
      const token = user.schoolId;
      console.log(token);
      res.cookie("jwt" , token);
      console.log(`this is the cookie stored : ${req.cookies.jwt}`);
      res.sendFile(path.join(__dirname, "../public/school.html"));
    } else {
      console.log("Invalid password");
      res.status(401).send("Invalid username and password");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Internal Server Error: " + error.message);
  }
});





app.post("/index2",async (req,res)=>{
    try{
              // const password = req.body.password;
        // const cpassword = req.body.confirmpassword;
        const collectionName = req.cookies.jwt;
        console.log(collectionName);
        const collectionMapping = {
          school1: School1, // Adjust these names to match your actual models
          school2: School2,
          school3: School3,
          school4: School4,
        };
        if (collectionName in collectionMapping) {
          const Model = collectionMapping[collectionName];
             const newEntry = new Model({
                    sname : req.body.sname,
                    fname : req.body.fname,
                    mname : req.body.mname,
                    schname : req.body.schname,
                    fage : req.body.fage,
                    selectreason : req.body.selectreason,
                    selectclass : req.body.selectclass,
                    selectgender : req.body.selectgender,
                    selectcategory : req.body.selectcategory,
                    fphone : req.body.fphone,
                    address : req.body.address,
                    block : req.body.block,
                    district : req.body.district,
                    rollno : req.body.rollno,
             })

            const added = await newEntry.save();
            console.log(added);
            res.status(201).sendFile(path.join(__dirname, "../public/index.html"));} else {
              // Handle the case where the collectionName is not found
              res.status(400).send("Invalid collection name");
            }

    }
    catch(error){
        res.status(400).send(error);
        }
})

//logic mainnnnnn  


app.get("/api/data",async(req,res)=>{


    try {
      const collectionName = req.cookies.jwt;
      console.log(collectionName);
      const collectionMapping = {
        school1: School1, // Adjust these names to match your actual models
        school2: School2,
        school3: School3,
        school4: School4,
      };

      if (collectionName in collectionMapping) {
        const Model = collectionMapping[collectionName];
        const count = await Model.find().countDocuments()
        const count_poverty = await Model.find({selectreason:"Poverty"}).countDocuments()
        const count_childMarriage= await Model.find({selectreason:"child marriage"}).countDocuments()
        const count_healthIssue= await Model.find({selectreason:"health_issues"}).countDocuments()
        const count_Bullying = await Model.find({selectreason:"bullying"}).countDocuments()
        const count_FemaleChild = await Model.find({selectreason:"Girl_child"}).countDocuments()
        const count_lackInterest = await Model.find({selectreason:"lack of interest"}).countDocuments()
        const count_boys = await Model.find({selectgender:"male"}).countDocuments()
        const count_girls = await Model.find({selectgender:"female"}).countDocuments()
       
        const projection = { sname: 1, fname: 1, address: 1 ,fage: 1,selectgender: 1,selectreason: 1};

        // Find all documents with the specified projection
        const documents = await Model.find({}, projection);
        console.log(documents);
        // const admin_designation = await Schooladmins.find({selectgender:"female"}).countDocuments()
        // const admin_school = await Schooladmins.find({selectgender:"female"}).countDocuments()

        const data = {
            pieChartLabels: ['poverty', 'childMarriage', 'healthIssue','Bullying','FemaleChild','Lack OF Interest'],
            pieChartData: [count_poverty,count_childMarriage,count_healthIssue,count_Bullying,count_FemaleChild,count_lackInterest],
            pieChartColors: ['#EBE4D1','#26577C','#E55604','#FFCC70','#FFB000','green'],
            total: count,
            boys : count_boys, 
            girls: count_girls,
            student_details: documents
          };
        //   console.log(Totalentries.countDocuments({selectreason:"Poverty"}));
    
        //   res.json(pieChartData);
          res.json(data);
        console.log(count_FemaleChild);
      } else {
        // Handle the case where the collectionName is not found
        res.status(400).send("Invalid collection name");
      }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
});



app.listen(port,()=>{
    console.log("server is running on port 3000");
})
