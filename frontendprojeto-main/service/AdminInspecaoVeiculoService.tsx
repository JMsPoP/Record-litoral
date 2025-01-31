import axios from "axios";
import { BaseService } from "./BaseService";


export class AdminInspecaoVeiculoService extends BaseService {

    constructor(){
        super("/admin/inspecaoVeiculo");
    }

}