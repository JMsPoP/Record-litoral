import axios from "axios";
import { BaseService } from "./BaseService";



export class EditorService extends BaseService {

    constructor(){
        super("/editor/forms");
    }
}    