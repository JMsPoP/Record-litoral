/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Projeto } from '../../../../types/types';
import { AdminOcorrenciasService } from '../../../../service/AdminOcorrenciasService';
import { useRouter } from 'next/navigation';

const Ocorrencias = () => {
    // Estado inicial do objeto Ocorrencias
    const ocorrenciasVazio: Projeto.Ocorrencias = {
        id: 0,
        usuario: { nome: '', login: '', senha: '', email: '', situacao: '', roles: '' },
        presenca: null,
        motivoFalta: '',
        horaExtra: null,
        motivoHoraExtra: '',
        nivelUrgencia: '',
        ocorrencia: '',
        imagem: null
    };

    // Variáveis de estado
    const [ocorrencia, setOcorrencia] = useState<Projeto.Ocorrencias[]>([]);
    const [selectedOcorrencias, setSelectedOcorrencias] = useState<Projeto.Ocorrencias[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    
    const adminOcorrenciasService = useMemo(() => new AdminOcorrenciasService(), []);

    // Buscar todas as ocorrências ao montar o componente
    useEffect(() => {
        adminOcorrenciasService.listarTodos()
            .then((response) => {
                console.log(response.data);
                setOcorrencia(response.data || []); // Garante que é sempre um array
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [adminOcorrenciasService]);

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" />
            <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    // Templates para o corpo da coluna
    const idBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const usuarioBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Usuário</span>
            {rowData.usuario?.nome || 'Não identificado'}
        </>
    );

    const presencaBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Presença</span>
            {rowData.presenca ? 'Sim' : 'Não'}
        </>
    );

    const motivoFaltaBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Motivo Falta</span>
            {rowData.motivoFalta || ''}
        </>
    );

    const horaExtraBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Hora Extra</span>
            {rowData.horaExtra ? 'Sim' : 'Não'}
        </>
    );

    const motivoHoraExtraBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Motivo Hora Extra</span>
            {rowData.motivoHoraExtra || ''}
        </>
    );

    const nivelUrgenciaBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Nível de Urgência</span>
            {rowData.nivelUrgencia || ''}
        </>
    );

    const ocorrenciaBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Ocorrência</span>
            {rowData.ocorrencia || ''}
        </>
    );

    const imagemBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Imagem?</span>
            {rowData.imagem === true ? 'Contem Imagem' : ''} 
            {rowData.imagem === false ? '' : ''}
        </>
    );

    const router = useRouter();

    const imagensBodyTemplate = (rowData: Projeto.Ocorrencias) => (
        <>
            <span className="p-column-title">Imagens</span>
            
            <Button 
                icon="pi pi-image" 
                className="p-button-rounded p-button-help mr-2"  
                onClick={() => router.push(`/pages/imagem/${rowData.id}`)} 
            />
        </>
    );

    // Cabeçalho da DataTable
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Ocorrências</h5>
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
                <p>Loading...</p>
            ) : (
                <DataTable
                    ref={dt}
                    value={ocorrencia} // Corrigido para usar o array de ocorrências
                    selection={selectedOcorrencias}
                    onSelectionChange={(e) => setSelectedOcorrencias(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    header={header}
                    responsiveLayout="scroll"
                    emptyMessage="Nenhum envio de Ocorrências encontrado."
                >
                    <Column headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }} body={idBodyTemplate} />
                    <Column header="Código" body={idBodyTemplate} />
                    <Column header="Usuário" body={usuarioBodyTemplate} />
                    <Column header="Presença" body={presencaBodyTemplate} />
                    <Column header="Motivo Falta" body={motivoFaltaBodyTemplate} />
                    <Column header="Hora Extra" body={horaExtraBodyTemplate} />
                    <Column header="Motivo Hora Extra" body={motivoHoraExtraBodyTemplate} />
                    <Column header="Nível de Urgência" body={nivelUrgenciaBodyTemplate} />
                    <Column header="Ocorrência" body={ocorrenciaBodyTemplate} />
                    <Column header="Imagem?" body={imagemBodyTemplate} />
                    <Column header="Imagens" body={imagensBodyTemplate} />
                </DataTable>
            )}
        </div>
    );
};

export default Ocorrencias;
