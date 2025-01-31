import axios from "axios";
import { BaseService } from "./BaseService";


export class AdminCameraService extends BaseService {

    constructor(){
        super("/admin/camera");
    }

}