import axios from "axios";
import { BaseService } from "./BaseService";



export class CameraService extends BaseService {

    constructor(){
        super("/camera/forms");
    }
    

    /*
    envioCamera(camera: Projeto.Camera){
        return axiosInstance.post("/camera/forms", camera);
    }*/
}