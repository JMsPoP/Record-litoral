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
import { AdminRetrancasService } from '../../../../service/AdminRetrancasService';
import { Dropdown } from 'primereact/dropdown';

const retranca = () => {
    // Initial empty camera object
    const retrancaVazio: Projeto.Retranca = {
        id: 0,
        retranca: '',
        cidade: '',
        horaExtra: false,
        execucao: true,
        motivo: '',
        status: ''
    };

    // State variables
    const [retrancas, setRetrancas] = useState<Projeto.Retranca[]>([]); // Changed from null to empty array
    const [retranca, setRetranca] = useState<Projeto.Retranca>(retrancaVazio);
    const [selectedRetrancas, setSelectedRetrancas] = useState<Projeto.Retranca[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    
    const adminRetrancaService = useMemo(() => new AdminRetrancasService(), []);

    // Fetch all cameras on component mount
    useEffect(() => {
        adminRetrancaService.listarTodos()
            .then((response) => {
                console.log(response.data);
                setRetrancas(response.data || []); // Corrigido aqui
                setLoading(false); // Set loading to false after fetching
            })
            .catch((error) => {
                console.error(error);
                setLoading(false); // Set loading to false on error
            });
    }, [adminRetrancaService]);

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
    const idBodyTemplate = (rowData: Projeto.Retranca) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const retrancaBodyTemplate = (rowData: Projeto.Retranca) => (
        <>
            <span className="p-column-title">Retrancas</span>
            {rowData.retranca || ''}
        </>
    );

    const cidadeBodyTemplate = (rowData: Projeto.Retranca) => (
        <>
            <span className="p-column-title">Cidade</span>
            {rowData.cidade || ''}
        </>
    );

    const horaExtraBodyTemplate = (rowData: Projeto.Retranca) => (
        <>
            <span className="p-column-title">Hora Extra</span>
            {rowData.horaExtra ? 'Sim' : 'Não'}
        </>
    );

    const execucaoBodyTemplate = (rowData: Projeto.Retranca) => (
        <>
            <span className="p-column-title">Execução</span>
            {rowData.execucao ? 'Sim' : 'Não'}
        </>
    );

    const motivoRetrancaBodyTemplate = (rowData: Projeto.Retranca) => (
        <>
            <span className="p-column-title">Motivo Retranca</span>
            {rowData.motivo || ''}
        </>
    );

    const statusRetrancaBodyTemplate = (rowData: Projeto.Retranca) => (
        <>
            <span className="p-column-title">Status Retranca</span>
            {rowData.status || ''}
        </>
    );

    // DataTable header
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Retranca</h5>
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
                    value={retrancas} // Correct data binding
                    selection={selectedRetrancas}
                    onSelectionChange={(e) => setSelectedRetrancas(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    header={header}
                    responsiveLayout="scroll"
                    emptyMessage="Nenhum envio de Retranca encontrado."
                >
                    <Column headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }} body={idBodyTemplate} />
                    <Column header="Código" body={idBodyTemplate} />
                    <Column header="Retranca" body={retrancaBodyTemplate} />
                    <Column header="Cidade" body={cidadeBodyTemplate} />
                    <Column header="Hora Extra" body={horaExtraBodyTemplate} />
                    <Column header="Execução" body={execucaoBodyTemplate} />
                    <Column header="Motivo Retranca" body={motivoRetrancaBodyTemplate} />
                    <Column header="Status Retranca" body={statusRetrancaBodyTemplate} />


                </DataTable>
            )}
        </div>
    );
};

export default retranca;
