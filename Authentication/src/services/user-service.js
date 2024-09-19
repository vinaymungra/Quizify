const { UserRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSignature, ValidatePassword } = require('../utils');
const { APIError } = require('../utils/app-errors')


class UserService {

    constructor(){
        this.repository = new UserRepository();
    }

    async SignIn(userInputs){

        const { email, password } = userInputs;
        
        try {
            
            const existingUser = await this.repository.FindByEmail({ email});

            if(existingUser){
            
                const validPassword = await ValidatePassword(password, existingUser.password, 10);
                
                if(validPassword){
                    const token = await GenerateSignature({ email: existingUser.email, _id: existingUser._id});
                    return FormateData({id: existingUser._id, token });
                } 
            }
    
            return FormateData(null);

        } catch (err) {

            throw new APIError('Data Not found', err)
        }

       
    }

    async SignUp(userInputs){
        
        const { email, password } = userInputs;
        
        try{           
            let userPassword = await GeneratePassword(password, 10);

            const existingUser = await this.repository.FindByEmail({ email});
            if (existingUser) {
                return  FormateData({
                    success: false,
                    message: "Email already exists. Please login in to continue.",
                });
            }
            const newUser = await this.repository.CreateUser({ email, password: userPassword});
            
            const token = await GenerateSignature({ email: email, _id: newUser._id});

            return FormateData({id: newUser._id, token });

        } catch(err){
            throw new APIError('Data Not found', err)
        }

    }
}

module.exports = UserService;