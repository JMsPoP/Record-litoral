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
import { AdminUsuariosService } from '../../../../service/AdminUsuariosService';
import { Dropdown } from 'primereact/dropdown';

const Usuario = () => {
    // Initial empty user object
    const usuarioVazio: Projeto.Usuario = {
        id: 0,
        nome: '',
        login: '',
        senha: '',
        email: '',
        situacao: '',
        roles: ''
    };

    // State variables
    const [usuarios, setUsuarios] = useState<Projeto.Usuario[] | null>(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Projeto.Usuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    
    // Available roles and statuses
    const rolesDisponiveis = [
        { label: 'Câmera', value: 'CAMERA' },
        { label: 'Editor', value: 'EDITOR' },
        { label: 'Operador de VT', value: 'OP_VT' },
        { label: 'Operador de GC', value: 'OP_GC' },
        { label: 'Operador de Áudio', value: 'OP_AUDIO' },
        { label: 'Diretor de Imagem', value: 'DIRETOR_IMAGEM' },
        { label: 'Câmera de Estúdio', value: 'CAMERA_ESTUDIO' }
    ];
    
    const situacoesDisponiveis = [
        { label: 'Ativo', value: 'A' },
        { label: 'Pendente', value: 'P' },
        { label: 'Inativo', value: 'I' }
    ];

    const adminUsuariosService = useMemo(() => new AdminUsuariosService(), []);

    // Fetch all users on component mount
    useEffect(() => {
        if (!usuarios) {
            adminUsuariosService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setUsuarios(response.data);
                }).catch((error) => {
                    console.error(error);
                });
        }
    }, [adminUsuariosService, usuarios]);

    // Open new user dialog
    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    // Hide dialogs
    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuariosDialog(false);
    };

    // Save user data
    const saveUsuario = () => {
        setSubmitted(true);

        if (!usuario.id) {
            adminUsuariosService.inserir(usuario)
                .then(() => {
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Usuário cadastrado com sucesso!'
                    });
                }).catch((error) => {
                    console.error(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar! ' + error.data.message
                    });
                });
        } else {
            adminUsuariosService.alterar(usuario)
                .then(() => {
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Usuário alterado com sucesso!'
                    });
                }).catch((error) => {
                    console.error(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar! ' + error.data.message
                    });
                });
        }
    }

    const editUsuario = (usuario: Projeto.Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Projeto.Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        if (usuario.id) {
            adminUsuariosService.excluir(usuario.id).then(() => {
                setUsuario(usuarioVazio);
                setDeleteUsuarioDialog(false);
                setUsuarios(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Usuário deletado com sucesso!',
                    life: 3000
                });
            }).catch(() => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar o usuário!',
                    life: 3000
                });
            });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    // Confirm delete selected users
    /*const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };*/

    // Delete selected users
    const deleteSelectedUsuarios = () => {
        Promise.all(selectedUsuarios.map(async (_usuario) => {
            if (_usuario.id) {
                await adminUsuariosService.excluir(_usuario.id);
            }
        })).then(() => {
            setUsuarios(null);
            setSelectedUsuarios([]);
            setDeleteUsuariosDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Usuários deletados com sucesso!',
                life: 3000
            });
        }).catch(() => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao deletar usuários!',
                life: 3000
            });
        });
    };

   /*const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: val,
        }));
    };*/


    const onDropdownChange = (e: { value: any }, name: string) => {
        const val = e.value;
        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: val,
        }));
    };

    // Toolbar templates
   /* const leftToolbarTemplate = () => (
        <React.Fragment>
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios.length)} />
            </div>
        </React.Fragment>
    );*/

    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    // Column body templates
    const idBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Código</span>
            {rowData.id}
        </>
    );

    const nomeBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Nome</span>
            {rowData.nome}
        </>
    );


    const emailBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Email</span>
            {rowData.email}
        </>
    );

    
    const cargosBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Cargo</span>
            {rowData.roles}
        </>
    );

    const situacaoBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <span className="p-column-title">Situação</span>
            {rowData.situacao}
        </>
    );


    const actionBodyTemplate = (rowData: Projeto.Usuario) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />        </>
    );

    // DataTable header
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    // Dialog footers
    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />
            <Button label="Salvar" icon="pi pi-check" onClick={saveUsuario} />
        </>
    );

    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideDeleteUsuarioDialog} className="p-button-text" />
            <Button label="Deletar" icon="pi pi-check" onClick={deleteUsuario} />
        </>
    );

    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideDeleteUsuariosDialog} className="p-button-text" />
            <Button label="Deletar" icon="pi pi-check" onClick={deleteSelectedUsuarios} />
        </>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <Toolbar className="mb-4" /*left={leftToolbarTemplate}*/ right={rightToolbarTemplate} />
            <DataTable
                ref={dt}
                value={usuarios}
                selection={selectedUsuarios}
                onSelectionChange={(e) => setSelectedUsuarios(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                globalFilter={globalFilter}
                header={header}
                responsiveLayout="scroll"
                emptyMessage="Nenhum usuário encontrado."
            >
                <Column headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }} body={(rowData) => <div>{rowData.id}</div>} />
                <Column header="Código" body={idBodyTemplate} />
                <Column header="Nome" body={nomeBodyTemplate} />
                <Column header="Email" body={emailBodyTemplate} />
                <Column header="Cargo" body={cargosBodyTemplate} />
                <Column header="Situação" body={situacaoBodyTemplate} />
                <Column header="Ações" body={actionBodyTemplate} />


            </DataTable>

            {/* User Dialog */}
            <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Dados do Usuário" modal footer={usuarioDialogFooter} onHide={hideDialog}>

                <div className="field">
                    <label htmlFor="situacao">Situação</label>
                    <Dropdown id="situacao" value={usuario.situacao} onChange={(e) => onDropdownChange(e, 'situacao')} options={situacoesDisponiveis} required placeholder="Selecione" />
                    {submitted && !usuario.situacao && <small className="p-error">A situação é obrigatória.</small>}
                </div>

                <div className="field">
                    <label htmlFor="roles">Função</label>
                    <Dropdown id="roles" value={usuario.roles} onChange={(e) => onDropdownChange(e, 'roles')} options={rolesDisponiveis} required placeholder="Selecione" />
                    {submitted && !usuario.roles && <small className="p-error">A função é obrigatória.</small>}
                </div>
            </Dialog>

        </div>
    );
};

export default Usuario;
