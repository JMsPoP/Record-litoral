/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Projeto } from '../../../../types/types';
import { AdminCameraService } from '../../../../service/AdminCamerasService';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';

const Camera = () => {
    // Initial empty camera object
    const cameraVazio: Projeto.CameraView = {
        id: 0,
        usuario: {nome: '', login: '', senha: '', email: '',situacao: '', roles: ''},
        presenca: false,
        motivo: '',
        servico: 
            {
                id: 0,
                equipeSemAtividade: null,
                tipoSemAtividade: '',
                notaCoberta: null,
                reporter: '',
                outros: '',
            }
        ,
        equipamento: 
            {
                id: 0,
                kitCamera: '',
                equipamentoCamera: '',
                bateriaCamera: '',
                pilhas: '',
                mochilink: null,
                obs: ''
            }
        ,
        inspecaoVeiculo: 
            {
                id: 0,
                veiculo: '',
                verificar_Condicoes: null,
                danos: null,
                tipo_Danos_Veiculo: '',
                kmInicial: '',
                kmFinal: '',
                obs: ''
            }
        ,
        links: null,
        retranca: 
            {
                id: 0,
                retranca: '',
                cidade: '',
                horaExtra: null,
                execucao: null,
                motivo: ''
            }
        ,
        ocorrencias: 
            {
                id: 0,
                usuario: { nome: '', login: '', senha: '', email: '', situacao: '', roles: '' },
                presenca: null,
                motivoFalta: '',
                horaExtra: null,
                motivoHoraExtra: '',
                nivelUrgencia: '',
                ocorrencia: '',
                imagem: null
            }
        
    };

    // State variables
    const [cameras, setCameras] = useState<Projeto.CameraView[] | null>(null);
    const [cameraDialog, setcameraDialog] = useState(false);
    const [deleteCameraDialog, setDeleteCameraDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [camera, setCamera] = useState<Projeto.CameraView>(cameraVazio);
    const [selectedCameras, setSelectedCameras] = useState<Projeto.CameraView[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    
    const adminCameraService = useMemo(() => new AdminCameraService(), []);

    // Fetch all cameras on component mount
    useEffect(() => {
        if (!cameras) {
            adminCameraService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setCameras(response.data);
                }).catch((error) => {
                    console.error(error);
                });
        }
    }, [adminCameraService, cameras]);

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" />
            <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    // Column body templates
    const idBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const usuarioBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Usuário</span>
            {rowData.usuario.nome || 'Não identificado'}
        </>
    );

    const presencaBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Presença</span>
            {rowData.presenca ? 'Sim' : 'Não'}
        </>
    );

    const motivoBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Motivo Falta</span>
            {rowData.motivo || ''}
        </>
    );

    const equipeSemAtividadeBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Equipe Sem Atividade?</span>
            {rowData.servico?.equipeSemAtividade === true ? 'Sim' : ''} 
            {rowData.servico?.equipeSemAtividade === false ? 'Não' : ''}

        </>
    );

    const tipoServicoBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Motivo Falta Atividade</span>
            {rowData.servico?.tipoSemAtividade || ''}
        </>
    );

    const notaCobertaBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Nota Coberta</span>
            {rowData.servico?.notaCoberta === true ? 'Sim' : ''} 
            {rowData.servico?.notaCoberta === false ? 'Não' : ''}

            
        </>
    );

    const reporterBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Reporter</span>
            {rowData.servico?.reporter || ''}
        </>
    );

    const outrosBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Outros</span>
            {rowData.servico?.outros || ''}
        </>
    );

    const kitCameraBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Kit Câmera</span>
            {rowData.equipamento?.kitCamera || ''}
        </>
    );

    const equipamentoCameraBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Equipamento Câmera</span>
            {rowData.equipamento?.equipamentoCamera || ''}
        </>
    );

    const bateriaCameraBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Bateria</span>
            {rowData.equipamento?.bateriaCamera || ''}
        </>
    );

    const pilhasBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Pilhas</span>
            {rowData.equipamento?.pilhas || ''}
        </>
    );

    const mochilinkBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Mochilink</span>
            {rowData.equipamento?.mochilink === true ? 'Sim' : ''} 
            {rowData.equipamento?.mochilink === false ? 'Não' : ''}

        </>
    );

    const obsEquipamentoBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Obs Equipamento</span>
            {rowData.equipamento?.obs || ''}
        </>
    );

    const veiculoBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Veículo</span>
            {rowData.inspecaoVeiculo?.veiculo || ''}
        </>
    );

    const condicoesBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Verificou Condições?</span>
            {rowData.inspecaoVeiculo?.verificar_Condicoes === true ? 'Sim' : ''} 
            {rowData.inspecaoVeiculo?.verificar_Condicoes === false ? 'Não' : ''}
        </>
    );

    const danosBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Danos?</span>
            {rowData.inspecaoVeiculo?.danos === true ? 'Sim' : ''} 
            {rowData.inspecaoVeiculo?.danos === false ? 'Não' : ''}

        </>
    );

    const danosVeiculoBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Tipo Danos Veículo</span>
            {rowData.inspecaoVeiculo?.tipo_Danos_Veiculo || ''}
        </>
    );

    const kmInicialBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">KM Inicial</span>
            {rowData.inspecaoVeiculo?.kmInicial || ''}
        </>
    );

    const kmFinalBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">KM Final</span>
            {rowData.inspecaoVeiculo?.kmFinal || ''}
        </>
    );

    const obsVeiculoBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Obs Veículo</span>
            {rowData.inspecaoVeiculo?.obs || ''}
        </>
    );

    const retrancaBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Retrancas</span>
            {rowData.retranca?.retranca || ''}
        </>
    );

    const cidadeBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Cidade</span>
            {rowData.retranca?.cidade || ''}
        </>
    );

    const horaExtraBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Hora Extra</span>
            {rowData.retranca?.horaExtra === true ? 'Sim' : ''} 
            {rowData.retranca?.horaExtra === false ? 'Não' : ''}
        </>
    );

    const execucaoBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Execução</span>
            {rowData.retranca?.execucao === true ? 'Sim' : ''} 
            {rowData.retranca?.execucao === false ? 'Não' : ''}
        </>
    );

    const motivoRetrancaBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Motivo Não Execução Retranca</span>
            {rowData.retranca?.motivo || ''}
        </>
    );

    const nivelUrgenciaBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Nível de Urgência</span>
            {rowData.ocorrencias?.nivelUrgencia || ''}
        </>
    );

    const ocorrenciaBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Ocorrência</span>
            {rowData.ocorrencias?.ocorrencia || ''}
        </>
    );

    const imagemBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Imagem?</span>
            {rowData.ocorrencias?.imagem === true ? 'Contem Imagem' : ''} 
            {rowData.ocorrencias?.imagem === false ? '' : ''}
        </>
    );

    const router = useRouter();

    const imagensBodyTemplate = (rowData: Projeto.CameraView) => (
        <>
            <span className="p-column-title">Imagens</span>
            
            <Button 
                icon="pi pi-image" 
                className="p-button-rounded p-button-help mr-2"  
                onClick={() => router.push(`/pages/imagem/${rowData.ocorrencias?.id}`)} 
            />
        </>
    );
    



    // DataTable header
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Câmeras</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <Toolbar className="mb-4" right={rightToolbarTemplate} />
            <DataTable
                ref={dt}
                value={cameras}
                selection={selectedCameras}
                onSelectionChange={(e) => setSelectedCameras(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                globalFilter={globalFilter}
                header={header}
                responsiveLayout="scroll"
                emptyMessage="Nenhum envio de câmera encontrado."
            >
                <Column headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }} body={idBodyTemplate} />
                <Column header="Código" body={idBodyTemplate} />
                <Column header="Usuário" body={usuarioBodyTemplate} />
                <Column header="Presença" body={presencaBodyTemplate} />
                <Column header="Motivo Falta" body={motivoBodyTemplate} />
                <Column header="Equipe Sem Atividade?" body={equipeSemAtividadeBodyTemplate} />
                <Column header="Motivo Falta Atividade" body={tipoServicoBodyTemplate} />
                <Column header="Outros" body={outrosBodyTemplate} />
                <Column header="Nota Coberta" body={notaCobertaBodyTemplate} />
                <Column header="Reporter" body={reporterBodyTemplate} />
                <Column header="Kit Câmera" body={kitCameraBodyTemplate} />
                <Column header="Equipamento Câmera" body={equipamentoCameraBodyTemplate} />
                <Column header="Bateria" body={bateriaCameraBodyTemplate} />
                <Column header="Pilhas" body={pilhasBodyTemplate} />
                <Column header="Mochilink" body={mochilinkBodyTemplate} />
                <Column header="Obs Equipamento" body={obsEquipamentoBodyTemplate} />
                <Column header="Veículo" body={veiculoBodyTemplate} />
                <Column header="Verificou Condições?" body={condicoesBodyTemplate} />
                <Column header="Danos?" body={danosBodyTemplate} />
                <Column header="Tipo Danos Veículo" body={danosVeiculoBodyTemplate} />
                <Column header="KM Inicial" body={kmInicialBodyTemplate} />
                <Column header="KM Final" body={kmFinalBodyTemplate} />
                <Column header="Obs Veículo" body={obsVeiculoBodyTemplate} />
                <Column header="Retranca" body={retrancaBodyTemplate} />
                <Column header="Cidade" body={cidadeBodyTemplate} />
                <Column header="Hora Extra" body={horaExtraBodyTemplate} />
                <Column header="Execução" body={execucaoBodyTemplate} />
                <Column header="Motivo Não Execução Retranca" body={motivoRetrancaBodyTemplate} />
                <Column header="Nível de Urgência" body={nivelUrgenciaBodyTemplate} />
                <Column header="Ocorrência" body={ocorrenciaBodyTemplate} />
                <Column header="Imagem?" body={imagemBodyTemplate} />
                <Column header="Imagens" body={imagensBodyTemplate} />
            </DataTable>
        </div>
    );
};

export default Camera;