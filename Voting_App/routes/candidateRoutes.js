const express = require('express');
const router = express.Router();
const User = require('../models/user');
const{jwtAuthMiddleware, generateToken} = require('../jwt');
const Candidate = require('../models/candidate');
const { config } = require('dotenv');


const checkAdminRole = async(userID) => {
    try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
    }catch(err){
        return false;
    }
}

//to add a candidate
router.post('/', jwtAuthMiddleware,  async (req,res) => {
    try{

        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User is not admin'});
        }

        const data = req.body

        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({response: response});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
        
    }
})

router.put('/:candidateID', jwtAuthMiddleware, async (req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User is not admin'});
        }

        const candidateID = req.params.candidateID;
        const updatedCandidateData = req.body;

        const response = await Person.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new:true,
            runValidators: true,
        })

        if(!response){
            return res.status(404).json({error : 'Candidate not found'});
        }

        console.log('Candidate data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

router.delete('/:candidateID', jwtAuthMiddleware, async (req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User is not admin'});
        }

        const candidateID = req.params.candidateID;

        const response = await Person.findByIdAndDelete(candidateID);

        if(!response){
            return res.status(404).json({error : 'Candidate not found'});
        }

        console.log('Candidate data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})


router.post('/vote/:candidateID', jwtAuthMiddleware, async (req,res)=>{
    //no admin can vote
    //user can only vote once

    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message:'Candidate not found'});
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        if(user.isVoted){
            res.status(400).json({message: "You have already voted"});
        }
        if(user.role == 'admin'){
            res.status(403).json({message:'Admin is not allowed'});
        }

        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        //update user document

        user.isVoted = true
        await user.save();

        res.status(200).json({message: 'Vote Recorded Succeessfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});  
    }
});

//vote count
router.get('/vote/count', async (req,res) => {
    try{
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        })

        return res.status(200).json(voteRecord);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'}); 
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await Candidate.find();
        console.log('data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
