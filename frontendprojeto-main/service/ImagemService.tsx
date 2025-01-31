import axios from "axios";
import { BaseService } from "./BaseService";

export class ImagemService extends BaseService {

    constructor(){
        super("http://localhost:8080/ocorrencias/imagem");
    }


}    