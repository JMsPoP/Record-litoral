declare namespace Projeto {
    type Usuario = {
        id?: number;
        nome: string;
        login: string;
        senha: string;
        email: string;
        situacao: string;
        roles: String;
    };

    type Verificador = {
        UUID: string;
    }


    type Camera = {
        id?: number;
        presenca: boolean;
        motivo?: string | null;
        servico: Array<{
            id?: number;
            equipeSemAtividade?: boolean | null;
            tipoSemAtividade?: string | null;
            notaCoberta: boolean;
            reporter: string;
            outros?: string | null;
        }>;
        equipamento: Array<{
            id?: number;
            kitCamera: string;
            equipamentoCamera: string;
            bateriaCamera: string;
            pilhas: string;
            mochilink: boolean;
            obs?: string | null;
        }>;
        inspecaoVeiculo: Array<{
            id?: number;
            veiculo: string;
            verificar_Condicoes: boolean;
            danos: boolean;
            tipo_Danos_Veiculo: String;
            kmInicial: string;
            kmFinal: string;
            obs?: string | null;
        }>;
        links: boolean;
        retranca: Array<{
            id?: number;
            retranca: string;
            cidade: string;
            horaExtra?: boolean | null;
            execucao: boolean;
            motivo?: string | null;
        }>;
        ocorrencias: Array<{
            id?: number;
            nivelUrgencia: string;
            ocorrencia: string;
            imagem: boolean | null;
        }>;
    }



    type Editor = {
        id?: number;
        presenca: boolean;
        motivo?: string | null;
        escolhaRetranca: boolean;
        criarRetranca: Array<{
            id?: number;
            retranca: string;
            cidade: string;
            horaExtra?: boolean | null;
            execucao: boolean;
            motivo?: string | null;
            imagem: boolean | null;
        }>;
        retrancaExistente: Array<{
            id?: number;
            retrancaEscolhida?: criarRetranca;
            horaExtra?: boolean | null;
            execucao: boolean;
            motivo?: string | null;
        }>;
        ocorrencias: Array<{
            id?: number;
            nivelUrgencia: string;
            ocorrencia: string;
            imagem: boolean | null;
        }>;
    }

    type Ocorrencias = {
        id?: number;
        usuario:  Usuario;
        presenca: boolean | null;
        motivoFalta?: string | null;
        horaExtra: boolean | null;
        motivoHoraExtra?: string | null;
        nivelUrgencia: string;
        ocorrencia: string;
        imagem: boolean | null;
    }









    type Servico = {
        id?: number;
        equipeSemAtividade?: boolean | null;
        tipoSemAtividade?: string | null;
        notaCoberta: boolean | null;
        reporter: string;
        outros?: string | null;
    }

    type Equipamento = {
        id?: number;
        kitCamera: string;
        equipamentoCamera: string;
        bateriaCamera: string;
        pilhas: string;
        mochilink: boolean | null;
        obs?: string | null;
    }

    type InspecaoVeiculo = {
        id?: number;
        veiculo: string;
        verificar_Condicoes: boolean | null;
        danos: boolean | null;
        tipo_Danos_Veiculo: String;
        kmInicial: string;
        kmFinal: string;
        obs?: string | null;
    }

    type Retranca = {
        id?: number;
        retranca: string;
        cidade: string;
        horaExtra?: boolean | null;
        execucao: boolean | null;
        motivo?: string | null;
        status?: string | null;
    }

    type CameraView = {
        id?: number;
        usuario: Usuario;
        presenca: boolean | null;
        motivo?: string | null;
        servico: Servico;
        equipamento: Equipamento;
        inspecaoVeiculo: InspecaoVeiculo;
        links: boolean | null;
        retranca: Retranca;
        ocorrencias: Ocorrencias;
    }

    type RetrancaExistente = {
        id?: number;
        retrancaEscolhida?: criarRetranca.retranca;
        horaExtra?: boolean | null;
        execucao: boolean | null;
        motivo?: string | null;
    }

    type EditorView = {
        id?: number;
        usuario:  Usuario;
        presenca: boolean | null;
        motivo?: string | null;
        escolhaRetranca: boolean | null;
        criarRetranca: Retranca;
        retrancaExistente: RetrancaExistente;
        ocorrencias: Ocorrencias;
    }


    type RendimentoView = {
        id?: number;
        usuario: Usuario;
        faltas: number;
        equipe_sem_atividade: number;
        envios: number;
        envios_sucesso: number;
        hora_extras: number;
        nao_hora_extra: number;
    }
}