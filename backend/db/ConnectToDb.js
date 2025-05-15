import mongoose from 'mongoose'

const ConnectToDb=async(req,res)=>{
    try {
        const db=await mongoose.connect("mongodb://localhost:27017/");
        if(db)
        {
            console.log("mongodb connected");
        }
        
    } catch (error) {
        console.log(error);
    }
}

export default ConnectToDb;