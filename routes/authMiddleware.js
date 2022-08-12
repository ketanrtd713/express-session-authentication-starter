
module.exports.isAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.status(401).json({msg:"You are not authorised"})
    }
}

module.exports.isAdmin = (req, res, next) =>{
    // until now he is authenticated so user hoga in req object
    if(req.isAuthenticated() && req.user.admin){
        next()
    }
    else{
        res.status(401).json({msg:"You are not authorised"})
    }
}