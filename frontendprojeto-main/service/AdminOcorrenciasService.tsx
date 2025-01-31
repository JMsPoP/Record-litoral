import axios from "axios";
import { BaseService } from "./BaseService";


export class AdminOcorrenciasService extends BaseService {

    constructor(){
        super("/admin/ocorrencias");
    }

}