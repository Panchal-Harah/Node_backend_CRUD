const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = 3001;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/update', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


//  For allowing cors
app.use(cors({
    methods: ['GET', 'POST'],       // Only allow certain HTTP methods
    allowedHeaders: ['Content-Type'], // Only allow certain headers
    origin: '*', // Restrict access to a specific origin
}));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const RegistrationDataSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    dob: String,
    gender: String,
    password: String
});

const FormData = mongoose.model('FormData', RegistrationDataSchema);
app.post('/registrationForm', async (req, res) => {
    const forms = req.body;
    console.log(forms,"form data to save");
    const newFormData = new FormData(forms);
    // console.log(newFormData,"New form data");
    const savedItem = await newFormData.save()
    res.status(201).json(savedItem);
})

// show data

app.get('/registrationForm', async (req, res) => {
    const newFormData = await FormData.find();
    res.status(201).json(newFormData)
    console.log(newFormData);
})

app.post('/registrationFormDelete',async(req, res) => {
    await FormData.deleteOne({_id:new Object(req.body.value)})
    res.status(201).json('deleted');
})

app.post('/registrationFormUpdate',async(req,res)=> {
    let userId = req.body.userId
    await FormData.findOneAndUpdate({_id:new Object(userId)},  {$set:
    {fname:req.body.fname,lname:req.body.lname,email:req.body.email,dob:req.body.dob,gender:req.body.gender,password:req.body.password}})
    res.status(201).json("Updated");
})
