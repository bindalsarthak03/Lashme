const mongoose = require('mongoose');

const FollowTallySchema = new mongoose.Schema({
    followee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports=mongoose.model("FollowTally",FollowTallySchema);