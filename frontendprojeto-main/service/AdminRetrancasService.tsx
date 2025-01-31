import axios from "axios";
import { BaseService } from "./BaseService";


export class AdminRetrancasService extends BaseService {

    constructor(){
        super("/admin/retranca");
    }

}