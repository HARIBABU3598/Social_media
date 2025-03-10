export const createPost=async(requestAnimationFrame,res)=>{
    try {
        const {text}=requestAnimationFrame.body;
        
    } catch (error) {
        console.log(`error in create post controller: ${error}`);
        res.status(500).json({error:"internal server error"})
        
    }
}