import { LoginRequest } from '../model/LoginRequest';
import { logger } from '../utils/Logger';
const BaseAPI = require("./BaseAPI");
require ('custom-env').env(true);

class SessionHeader extends BaseAPI{
    constructor(){
        super({}, process.env.ZED_API_BASE_URL);
    }

    async getSessionHeader(loginRequest, headers = {}){
        if(loginRequest instanceof LoginRequest){
            logger.info(`>>> API POST ${process.env.ZED_API_BASE_URL} with body `, loginRequest);
            const result = await this.post(process.env.ZED_API_BASE_PATH + process.env.LOGIN_PATH, loginRequest, headers);
            if(result.ok){
               return result;
            }else{
               throw new Error(`Error when calling API : `, result.error);
            }
        }else{
            return {}
        }
    }

}
module.exports = new SessionHeader();