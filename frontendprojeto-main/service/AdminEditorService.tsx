import axios from "axios";
import { BaseService } from "./BaseService";


export class AdminEditorService extends BaseService {

    constructor(){
        super("/admin/editor");
    }

}