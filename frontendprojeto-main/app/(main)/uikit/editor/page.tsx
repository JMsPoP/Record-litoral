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
import { AdminEditorService } from '../../../../service/AdminEditorService';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';


const Editor = () => {
    // Initial empty camera object
    const editorVazio: Projeto.EditorView = {
        id: 0,
        usuario: { nome: '', login: '', senha: '', email: '', situacao: '', roles: '' },
        presenca: false,
        motivo: '',
        escolhaRetranca: null,
        criarRetranca: {
            id: 0,
            retranca: '',
            cidade: '',
            horaExtra: null,
            execucao: null,
            motivo: ''
        },
        retrancaExistente: {
            id: 0,
            retrancaEscolhida: '',
            horaExtra: null,
            execucao: null,
            motivo: ''
        },
        ocorrencias: {
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
    const [editors, setEditors] = useState<Projeto.EditorView[]>([]); // Changed from null to empty array
    const [editorDialog, seteditorDialog] = useState(false);
    const [deleteEditorDialog, setDeleteEditorDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [editor, setEditor] = useState<Projeto.EditorView>(editorVazio);
    const [selectedEditors, setSelectedEditors] = useState<Projeto.EditorView[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    
    const adminEditorService = useMemo(() => new AdminEditorService(), []);

    // Fetch all cameras on component mount
    useEffect(() => {
        adminEditorService.listarTodos()
            .then((response) => {
                console.log(response.data);
                setEditors(response.data || []); // Ensure it's always an array
                setLoading(false); // Set loading to false after fetching
            })
            .catch((error) => {
                console.error(error);
                setLoading(false); // Set loading to false on error
            });
    }, [adminEditorService]);

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
    const idBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const usuarioBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Usuário</span>
            {rowData.usuario.nome || 'Não identificado'}
        </>
    );

    const presencaBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Presença</span>
            {rowData.presenca ? 'Sim' : 'Não'}
        </>
    );

    const motivoBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Motivo Falta</span>
            {rowData.motivo || ''}
        </>
    );

    const escolhaRetrancaBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Escolha</span>
            {rowData.escolhaRetranca ? 'Criar Retranca' : 'Escolher Retranca Existente'}
        </>
    );



    const retrancaBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Retrancas</span>
            {rowData.criarRetranca?.retranca || ''}
        </>
    );

    const cidadeBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Cidade</span>
            {rowData.criarRetranca?.cidade || ''}
        </>
    );

    const horaExtraBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Hora Extra</span>
            {rowData.criarRetranca?.horaExtra === true ? 'Sim' : ''}
            {rowData.criarRetranca?.horaExtra === false ? 'Não' : ''}

        </>
    );

    const execucaoBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Execução</span>
            {rowData.criarRetranca?.execucao === true ? 'Sim' : ''}
            {rowData.criarRetranca?.execucao === false ? 'Não' : ''}
        </>
    );

    const motivoRetrancaBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Motivo Retranca</span>
            {rowData.criarRetranca?.motivo || ''}
        </>
    );

    const RetrancaEscolhidaBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Retranca Escolhida </span>
            {rowData.retrancaExistente?.retrancaEscolhida.retranca || ''}
        </>
    );


    const horaExtraRetrancaExistenteBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Hora Extra</span>
            {rowData.retrancaExistente?.horaExtra === true ? 'Sim' : ''}
            {rowData.retrancaExistente?.horaExtra === false ? 'Não' : ''}
        </>
    );

    const execucaoRetrancaExistenteBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Execução</span>
            {rowData.retrancaExistente?.execucao === true ? 'Sim' : ''}
            {rowData.retrancaExistente?.execucao === false ? 'Não' : ''}

        </>
    );

    const motivoRetrancaExistenteBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Motivo Retranca</span>
            {rowData.retrancaExistente?.motivo || ''}
        </>
    );

    const nivelUrgenciaBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Nível de Urgência</span>
            {rowData.ocorrencias?.nivelUrgencia || ''}
        </>
    );

    const ocorrenciaBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Ocorrência</span>
            {rowData.ocorrencias?.ocorrencia || ''}
        </>
    );

    const imagemBodyTemplate = (rowData: Projeto.EditorView) => (
        <>
            <span className="p-column-title">Imagem?</span>
            {rowData.ocorrencias?.imagem === true ? 'Contem Imagem' : ''} 
            {rowData.ocorrencias?.imagem === false ? '' : ''}
        </>
    );

    const router = useRouter();
    
    const imagensBodyTemplate = (rowData: Projeto.EditorView) => (
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
            {loading ? (
                <p>Loading...</p> // Loading message
            ) : (
                <DataTable
                    ref={dt}
                    value={editors} // Correct data binding
                    selection={selectedEditors}
                    onSelectionChange={(e) => setSelectedEditors(e.value)}
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
                    <Column header="Escolha" body={escolhaRetrancaBodyTemplate} />
                    <Column header="Retrancas" body={retrancaBodyTemplate} />
                    <Column header="Cidade" body={cidadeBodyTemplate} />
                    <Column header="Hora Extra" body={horaExtraBodyTemplate} />
                    <Column header="Execução" body={execucaoBodyTemplate} />
                    <Column header="Motivo Não Execução Retranca" body={motivoRetrancaBodyTemplate} />

                    <Column header="Retranca Escolhida" body={RetrancaEscolhidaBodyTemplate} />

                    <Column header="Hora Extra" body={horaExtraRetrancaExistenteBodyTemplate} />
                    <Column header="Execução" body={execucaoRetrancaExistenteBodyTemplate} />
                    <Column header="Motivo Não Execução Retranca" body={motivoRetrancaExistenteBodyTemplate} />
                    <Column header="Nível de Urgência" body={nivelUrgenciaBodyTemplate} />
                    <Column header="Ocorrência" body={ocorrenciaBodyTemplate} />
                    <Column header="Imagem?" body={imagemBodyTemplate} />
                    <Column header="Imagens" body={imagensBodyTemplate} />
                </DataTable>
            )}
        </div>
    );
};

export default Editor;
