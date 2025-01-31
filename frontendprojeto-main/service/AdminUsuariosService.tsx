import axios from "axios";
import { BaseService } from "./BaseService";


export class AdminUsuariosService extends BaseService {

    constructor(){
        super("/admin/usuarios");
    }

}