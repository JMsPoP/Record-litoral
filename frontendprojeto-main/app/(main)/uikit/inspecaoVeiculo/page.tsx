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
import { AdminInspecaoVeiculoService } from '../../../../service/AdminInspecaoVeiculoService';

const InspecaoVeiculo = () => {
    // Estado inicial do objeto InspecaoVeiculo
    const inspecaoVeiculoVazio: Projeto.InspecaoVeiculo = {
        id: 0,
        veiculo: '',
        verificar_Condicoes: false,
        danos: false,
        tipo_Danos_Veiculo: '',
        kmInicial: '',
        kmFinal: '',
        obs: ''
    };

    // Variáveis de estado
    const [inspecaoVeiculos, setInspecaoVeiculos] = useState<Projeto.InspecaoVeiculo[]>([]);
    const [inspecaoVeiculoDialog, setInspecaoVeiculoDialog] = useState(false);
    const [deleteInspecaoVeiculoDialog, setDeleteInspecaoVeiculoDialog] = useState(false);
    const [inspecaoVeiculo, setInspecaoVeiculo] = useState<Projeto.InspecaoVeiculo>(inspecaoVeiculoVazio);
    const [selectedEditors, setSelectedEditors] = useState<Projeto.InspecaoVeiculo[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true); 
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    
    const adminInspecaoVeiculoService = useMemo(() => new AdminInspecaoVeiculoService(), []);

    // Buscar todos os veículos ao montar o componente
    useEffect(() => {
        adminInspecaoVeiculoService.listarTodos()
            .then((response) => {
                console.log(response.data);
                setInspecaoVeiculos(response.data || []); // Corrigido aqui
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [adminInspecaoVeiculoService]);

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
    const idBodyTemplate = (rowData: Projeto.InspecaoVeiculo) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const veiculoBodyTemplate = (rowData: Projeto.InspecaoVeiculo) => (
        <>
            <span className="p-column-title">Veículo</span>
            {rowData.veiculo || ''}
        </>
    );

    const condicoesBodyTemplate = (rowData: Projeto.InspecaoVeiculo) => (
        <>
            <span className="p-column-title">Verificou Condições?</span>
            {rowData.verificar_Condicoes ? 'Sim' : 'Não'}
        </>
    );

    const danosBodyTemplate = (rowData: Projeto.InspecaoVeiculo) => (
        <>
            <span className="p-column-title">Danos?</span>
            {rowData.danos ? 'Sim' : 'Não'}
        </>
    );

    const danosVeiculoBodyTemplate = (rowData: Projeto.InspecaoVeiculo) => (
        <>
            <span className="p-column-title">Tipo Danos Veículo</span>
            {rowData.tipo_Danos_Veiculo || ''}
        </>
    );

    const kmInicialBodyTemplate = (rowData: Projeto.InspecaoVeiculo) => (
        <>
            <span className="p-column-title">KM Inicial</span>
            {rowData.kmInicial || ''}
        </>
    );

    const kmFinalBodyTemplate = (rowData: Projeto.InspecaoVeiculo) => (
        <>
            <span className="p-column-title">KM Final</span>
            {rowData.kmFinal || ''}
        </>
    );

    const obsVeiculoBodyTemplate = (rowData: Projeto.InspecaoVeiculo) => (
        <>
            <span className="p-column-title">Obs Veículo</span>
            {rowData.obs || ''}
        </>
    );

    // Cabeçalho da DataTable
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Inspeção Veículo</h5>
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
                    value={inspecaoVeiculos} // Correto
                    selection={selectedEditors}
                    onSelectionChange={(e) => setSelectedEditors(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    header={header}
                    responsiveLayout="scroll"
                    emptyMessage="Nenhum envio de Inspeção Veículo encontrado."
                >
                    <Column headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }} body={idBodyTemplate} />
                    <Column header="Código" body={idBodyTemplate} />
                    <Column header="Veículo" body={veiculoBodyTemplate} />
                    <Column header="Verificou Condições?" body={condicoesBodyTemplate} />
                    <Column header="Danos?" body={danosBodyTemplate} />
                    <Column header="Tipo Danos Veículo" body={danosVeiculoBodyTemplate} />
                    <Column header="KM Inicial" body={kmInicialBodyTemplate} />
                    <Column header="KM Final" body={kmFinalBodyTemplate} />
                    <Column header="Obs Veículo" body={obsVeiculoBodyTemplate} />
                </DataTable>
            )}
        </div>
    );
};

export default InspecaoVeiculo;
