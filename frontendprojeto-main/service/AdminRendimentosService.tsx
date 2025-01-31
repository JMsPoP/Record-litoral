import axios from "axios";
import { BaseService } from "./BaseService";


export class AdminRedimentosService extends BaseService {

    constructor(){
        super("/admin/rendimento");
    }

}