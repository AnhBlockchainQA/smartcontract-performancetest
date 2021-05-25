require ('custom-env').env(true);
class LoginRequest{
    constructor(){}

    static toJson(){
        return {
            "public_message": process.env.PUBLIC_ADDRESS,
            "signed_message": process.env.SIGN_MESSAGE
        }
    } 
}

module.exports = { LoginRequest };