    'use client';

    import React, { useEffect, useMemo, useRef, useState } from 'react';
    import { Accordion, AccordionTab } from 'primereact/accordion';
    import { InputText } from 'primereact/inputtext';
    import { Button } from 'primereact/button';
    import { InputTextarea } from 'primereact/inputtextarea';
    import { Toast } from 'primereact/toast';
    import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
    import { EditorService } from '../../../../service/EditorService';
    import { UsuarioService } from '../../../../service/UsuarioService';
    import { useRouter } from 'next/navigation';




const nivelUrgenciaOptions = [
    {label: 'Circunstancial', value: 'CIRCUNSTANCIAL'},
    {label: 'Urgente', value: 'URGENTE'},
    {label: 'Importante', value: 'IMPORTANTE'}

];


    const EditorFormsPage = () => {
        const [editor, setEditor] = useState({
            id: 0,
            presenca: false,
            motivo: '',
            escolhaRetranca: false,
            criarRetranca: [
                {
                    id: 0,
                    retranca: '',
                    cidade: '',
                    horaExtra: false,
                    execucao: true,
                    motivo: ''
                }
            ],
            retrancaExistente: [
                {
                    id: 0,
                    retrancaEscolhida: '',
                    horaExtra: false,
                    execucao: true,
                    motivo: ''
                }
            ],
            ocorrencias:[
                {
                    id: 0,
                    nivelUrgencia: 'NULL',
                    ocorrencia: '',
                    imagem: false
                }
            ]
        });

        const toast = useRef<Toast>(null);
        const [retrancaExistenteOptions, setRetrancaExistenteOptions] = useState<Projeto.Usuario[]>([]);
        const editorService = useMemo(() => new EditorService(), []);
        const usuarioService = useMemo(() => new UsuarioService(), []);


        useEffect(() => {
            // Carregar as opções de retranca existente do banco de dados
            
            editorService.listarTodos()
                .then((response) => {
                    setRetrancaExistenteOptions(response.data); // Ajuste conforme a estrutura dos dados retornados
                })
                .catch(error => {
                    console.error(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de retrancas existentes!',
                    });
                });
        }, [editorService]);


        useEffect(() => {
            // Chama manterConexao ao abrir a página
            editorService.manterConexao()
                .then(() => {
                    console.log("Conexão mantida com sucesso");
                })
                .catch(error => {
                    console.error("Erro ao manter a conexão", error);
                });
        }, []);

        const onSelectRetrancaEscolhidaChange = (value: any, index: number) => {
            let updatedRetrancaExistente = [...editor.retrancaExistente];
            updatedRetrancaExistente[index].retrancaEscolhida = value;
            setEditor(prevState => ({
                ...prevState,
                retrancaExistente: updatedRetrancaExistente
            }));
        };

        const handleOcorrenciasChange = (field: string, value: any) => {
            setEditor(prevState => ({
                ...prevState,
                ocorrencias: [
                    {
                        ...prevState.ocorrencias[0],
                        [field]: value
                    }
                ]
            }));
        };


        const handleSubmit = async () => {
            try {
                const response = await editorService.envioEditor(editor);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Dados enviados com sucesso!',
                    life: 3000
                });
                localStorage.removeItem('TOKEN_APLICACAO_FRONTEND');
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Se Faltou ou Não pode Executar, Motivo OBRIGATORIO.';
                
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: errorMessage,
                    life: 3000
    
                });
            }
        };

        const router = useRouter();

        const SubmitAndImage = async () => {
            try {
                const response = await editorService.envioEditor(editor);
                console.log(response.data); // Verifique a estrutura da resposta
        
                // Captura o ID da ocorrência diretamente
                const idGerado = response.data.ocorrencias?.id; // Acessa o ID da ocorrência
                
                if (!idGerado) {
                    throw new Error('ID da ocorrência não encontrado');
                }
        
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Dados enviados com sucesso!',
                    life: 3000
                });
        
                router.push(`/pages/imagem/${idGerado}`); // Redireciona para a página de imagem
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'Erro ao enviar os dados.';
                localStorage.removeItem('TOKEN_APLICACAO_FRONTEND');
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: errorMessage,
                    life: 3000
                });
            }
        };

        const handlePresenceChange = (presence: boolean) => {
            setEditor({ ...editor, presenca: presence });
        };

        const handleEscolhaRetrancaChange = (value: boolean) => {
            setEditor({ ...editor, escolhaRetranca: value });
        };

        const handleRetrancaChange = (index: number, field: string, value: string | boolean) => {
            setEditor(prevState => ({
                ...prevState,
                criarRetranca: prevState.criarRetranca.map((retranca, i) =>
                    i === index ? { ...retranca, [field]: value } : retranca
                )
            }));
        };

        const handleRetrancaExistenteChange = (index: number, field: string, value: string | boolean) => {
            setEditor(prevState => ({
                ...prevState,
                retrancaExistente: prevState.retrancaExistente.map((retranca, i) =>
                    i === index ? { ...retranca, [field]: value } : retranca
                )
            }));
        };

        const handleImagemChange = (imagem: boolean) => {
            setEditor(prevState => ({
                ...prevState,
                ocorrencias: [
                    {
                        ...prevState.ocorrencias[0],
                        imagem: imagem
                    }
                ]
            }));
        };
        

        return (
            <div className="card p-fluid">
                <Toast ref={toast} />

                <h5>Formulário de Editor</h5>
                <Accordion>
                    {/* Presença */}
                    <AccordionTab header="Presença?">
                        <div className="p-field">
                            <label htmlFor="presenca" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                                Presença:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    icon="pi pi-check"
                                    className={`p-button-rounded ${editor.presenca ? 'p-button-success' : 'p-button-outlined'}`}
                                    onClick={() => handlePresenceChange(true)}
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #ccc',
                                        backgroundColor: editor.presenca ? '#28a745' : 'transparent',
                                        color: editor.presenca ? '#fff' : '#28a745'
                                    }}
                                />
                                <Button
                                    icon="pi pi-times"
                                    className={`p-button-rounded ${!editor.presenca ? 'p-button-danger' : 'p-button-outlined'}`}
                                    onClick={() => handlePresenceChange(false)}
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #ccc',
                                        backgroundColor: !editor.presenca ? '#dc3545' : 'transparent',
                                        color: !editor.presenca ? '#fff' : '#dc3545'
                                    }}
                                />
                            </div>
                            <label htmlFor="motivo" style={{ display: 'block', marginTop: '12px', marginBottom: '4px', color: '#6c757d' }}>
                                Motivo:
                            </label>
                            <InputTextarea
                                id="motivo"
                                rows={3}
                                cols={30}
                                value={editor.motivo}
                                onChange={(e) => setEditor({ ...editor, motivo: e.target.value })}
                                disabled={editor.presenca}  // Campo desabilitado quando presenca é true
                                style={{
                                    marginTop: '8px',
                                    border: editor.presenca ? '1px solid red' : '1px solid #ccc',
                                    backgroundColor: '#f9f9f9'
                                }}
                                placeholder=""
                            />
                        </div>
                    </AccordionTab>

                    {/* Escolha Retranca */}
                    <AccordionTab header="Escolha Retranca" disabled={!editor.presenca}>
                        <div className="p-field">
                            <label htmlFor="escolhaRetranca" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                                Escolha Retranca:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    icon="pi pi-check"
                                    className={`p-button-rounded ${editor.escolhaRetranca ? 'p-button-success' : 'p-button-outlined'}`}
                                    onClick={() => handleEscolhaRetrancaChange(true)}
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #ccc',
                                        backgroundColor: editor.escolhaRetranca ? '#28a745' : 'transparent',
                                        color: editor.escolhaRetranca ? '#fff' : '#28a745'
                                    }}
                                />
                                <Button
                                    icon="pi pi-times"
                                    className={`p-button-rounded ${!editor.escolhaRetranca ? 'p-button-danger' : 'p-button-outlined'}`}
                                    onClick={() => handleEscolhaRetrancaChange(false)}
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #ccc',
                                        backgroundColor: !editor.escolhaRetranca ? '#dc3545' : 'transparent',
                                        color: !editor.escolhaRetranca ? '#fff' : '#dc3545'
                                    }}
                                />
                            </div>
                        </div>
                    </AccordionTab>

                    {/* Criar Retranca */}
                    <AccordionTab header="Criar Retranca" disabled={!editor.presenca || !editor.escolhaRetranca}>
                        {editor.criarRetranca.map((retranca, index) => (
                            <div key={index}>
                                <div className="p-field">
                                    <label htmlFor={`retranca-${index}`}>Retranca</label>
                                    <InputText
                                        id={`retranca-${index}`}
                                        value={retranca.retranca}
                                        onChange={(e) => handleRetrancaChange(index, 'retranca', e.target.value)}
                                        disabled={!editor.presenca || !editor.escolhaRetranca}
                                    />
                                </div>

                                <div className="p-field">
                                    <label htmlFor={`cidade-${index}`}>Cidade</label>
                                    <InputText
                                        id={`cidade-${index}`}
                                        value={retranca.cidade}
                                        onChange={(e) => handleRetrancaChange(index, 'cidade', e.target.value)}
                                        disabled={!editor.presenca || !editor.escolhaRetranca}
                                    />
                                </div>

                                <div className="p-field">
                                    <label htmlFor={`horaExtra-${index}`}>Hora Extra</label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            icon="pi pi-check"
                                            className={`p-button-rounded ${retranca.horaExtra ? 'p-button-success' : 'p-button-outlined'}`}
                                            onClick={() => handleRetrancaChange(index, 'horaExtra', true)}
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #ccc',
                                                backgroundColor: retranca.horaExtra ? '#28a745' : 'transparent',
                                                color: retranca.horaExtra ? '#fff' : '#28a745'
                                            }}
                                        />
                                        <Button
                                            icon="pi pi-times"
                                            className={`p-button-rounded ${!retranca.horaExtra ? 'p-button-danger' : 'p-button-outlined'}`}
                                            onClick={() => handleRetrancaChange(index, 'horaExtra', false)}
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #ccc',
                                                backgroundColor: !retranca.horaExtra ? '#dc3545' : 'transparent',
                                                color: !retranca.horaExtra ? '#fff' : '#dc3545'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="p-field">
                                    <label htmlFor={`execucao-${index}`}>Execução</label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            icon="pi pi-check"
                                            className={`p-button-rounded ${retranca.execucao ? 'p-button-success' : 'p-button-outlined'}`}
                                            onClick={() => handleRetrancaChange(index, 'execucao', true)}
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #ccc',
                                                backgroundColor: retranca.execucao ? '#28a745' : 'transparent',
                                                color: retranca.execucao ? '#fff' : '#28a745'
                                            }}
                                        />
                                        <Button
                                            icon="pi pi-times"
                                            className={`p-button-rounded ${!retranca.execucao ? 'p-button-danger' : 'p-button-outlined'}`}
                                            onClick={() => handleRetrancaChange(index, 'execucao', false)}
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #ccc',
                                                backgroundColor: !retranca.execucao ? '#dc3545' : 'transparent',
                                                color: !retranca.execucao ? '#fff' : '#dc3545'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="p-field">
                                    <label htmlFor={`motivo-${index}`} style={{ display: 'block', marginTop: '12px', marginBottom: '4px', color: '#6c757d' }}>
                                        Motivo:
                                    </label>
                                    <InputTextarea
                                        id={`motivo-${index}`}
                                        rows={3}
                                        cols={30}
                                        value={retranca.motivo}
                                        onChange={(e) => handleRetrancaChange(index, 'motivo', e.target.value)}
                                        disabled={retranca.execucao}  // Campo desabilitado quando execucao é true
                                        style={{
                                            marginTop: '8px',
                                            border: retranca.execucao ? '1px solid red' : '1px solid #ccc',
                                            backgroundColor: '#f9f9f9'
                                        }}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        ))}
                    </AccordionTab>

                    {/* Retranca Existente */}
                    <AccordionTab header="Retranca Existente" disabled={!editor.presenca || editor.escolhaRetranca}>
                        {editor.retrancaExistente.map((retranca, index) => (
                            <div key={index}>
                                <div className="p-field">
                                    <label htmlFor={`retrancaEscolhida-${index}`}>Retranca Escolhida:</label>
                                    <Dropdown
                                        id={`retrancaEscolhida-${index}`}
                                        optionLabel="descricao" // Campo que será exibido
                                        optionValue="id"        // Campo que será usado como valor
                                        value={retranca.retrancaEscolhida} // Aqui deve ser o ID da retranca selecionada
                                        options={retrancaExistenteOptions} // Array com as opções da retranca
                                        filter
                                        onChange={(e: DropdownChangeEvent) => onSelectRetrancaEscolhidaChange(e.value, index)}
                                        placeholder='Selecione uma Retranca...'
                                    />
                                    {editor.retrancaExistente[index].retrancaEscolhida === '' && (
                                        <small className="p-invalid">Escolher Retranca é obrigatório.</small>
                                    )}
                                </div>
                                <div className="p-field">
                                    <label htmlFor={`horaExtra-${index}`}>Hora Extra</label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            icon="pi pi-check"
                                            className={`p-button-rounded ${retranca.horaExtra ? 'p-button-success' : 'p-button-outlined'}`}
                                            onClick={() => handleRetrancaExistenteChange(index, 'horaExtra', true)}
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #ccc',
                                                backgroundColor: retranca.horaExtra ? '#28a745' : 'transparent',
                                                color: retranca.horaExtra ? '#fff' : '#28a745'
                                            }}
                                        />
                                        <Button
                                            icon="pi pi-times"
                                            className={`p-button-rounded ${!retranca.horaExtra ? 'p-button-danger' : 'p-button-outlined'}`}
                                            onClick={() => handleRetrancaExistenteChange(index, 'horaExtra', false)}
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #ccc',
                                                backgroundColor: !retranca.horaExtra ? '#dc3545' : 'transparent',
                                                color: !retranca.horaExtra ? '#fff' : '#dc3545'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="p-field">
                                    <label htmlFor={`execucao-${index}`}>Execução</label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            icon="pi pi-check"
                                            className={`p-button-rounded ${retranca.execucao ? 'p-button-success' : 'p-button-outlined'}`}
                                            onClick={() => handleRetrancaExistenteChange(index, 'execucao', true)}
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #ccc',
                                                backgroundColor: retranca.execucao ? '#28a745' : 'transparent',
                                                color: retranca.execucao ? '#fff' : '#28a745'
                                            }}
                                        />
                                        <Button
                                            icon="pi pi-times"
                                            className={`p-button-rounded ${!retranca.execucao ? 'p-button-danger' : 'p-button-outlined'}`}
                                            onClick={() => handleRetrancaExistenteChange(index, 'execucao', false)}
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #ccc',
                                                backgroundColor: !retranca.execucao ? '#dc3545' : 'transparent',
                                                color: !retranca.execucao ? '#fff' : '#dc3545'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="p-field">
                                    <label htmlFor={`motivo-${index}`} style={{ display: 'block', marginTop: '12px', marginBottom: '4px', color: '#6c757d' }}>
                                        Motivo:
                                    </label>
                                    <InputTextarea
                                        id={`motivo-${index}`}
                                        rows={3}
                                        cols={30}
                                        value={retranca.motivo}
                                        onChange={(e) => handleRetrancaExistenteChange(index, 'motivo', e.target.value)}
                                        disabled={retranca.execucao}  // Campo desabilitado quando execucao é true
                                        style={{
                                            marginTop: '8px',
                                            border: retranca.execucao ? '1px solid red' : '1px solid #ccc',
                                            backgroundColor: '#f9f9f9'
                                        }}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        ))}
                    </AccordionTab>



                    <AccordionTab header="Ocorrências: Envio via Email">
                    <div className="p-field">
                        <label htmlFor="nivelUrgencia" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Status da ocorrêcia
                        </label>
                        <Dropdown
                            id="nivelUrgencia"
                            optionLabel="label"
                            value={editor.ocorrencias[0].nivelUrgencia}
                            options={nivelUrgenciaOptions}
                            onChange={(e) => handleOcorrenciasChange('nivelUrgencia', e.value)}
                            placeholder="Selecione "
                            className="w-full md:w-30rem mb-5"
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="ocorrencia" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Descreva sua Ocorrência
                        </label>
                        <InputTextarea
                            id="ocorrencia"
                            rows={3}
                            cols={30}
                            value={editor.ocorrencias[0].ocorrencia}
                            onChange={(e) => handleOcorrenciasChange('ocorrencia', e.target.value)}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '10px',
                                height: '100px'
                            }}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="imagem" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Deseja enviar uma imagem?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${editor.ocorrencias[0].imagem ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleImagemChange(true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: editor.ocorrencias[0].imagem ? '#28a745' : 'transparent',
                                    color: editor.ocorrencias[0].imagem ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!editor.ocorrencias[0].imagem? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleImagemChange(false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: !editor.ocorrencias[0].imagem ? '#dc3545' : 'transparent',
                                    color: !editor.ocorrencias[0].imagem ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                    </div>

                    <label htmlFor="imagem" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                        Salvar Forms e Anexar Foto:
                    </label>
                    <Button label="Envio Imagem" icon="pi pi-upload" severity="help" onClick={SubmitAndImage} 
                        style={{ width: 'auto', minWidth: '100px' }} disabled={!editor.ocorrencias[0].imagem} />
                </AccordionTab>
                </Accordion>

                <Button label="Enviar" icon="pi pi-check" onClick={handleSubmit} />
            </div>
        );
    };

    export default EditorFormsPage;
