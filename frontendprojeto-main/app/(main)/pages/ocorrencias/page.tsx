'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { OcorrenciasService } from "../../../../service/OcorrenciasService";
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useRouter } from 'next/navigation';

const nivelUrgenciaOptions = [
    { label: 'Circunstancial', value: 'CIRCUNSTANCIAL' },
    { label: 'Urgente', value: 'URGENTE' },
    { label: 'Importante', value: 'IMPORTANTE' }
];

const OcorrenciasFormsPage = () => {
    const [ocorrencias, setOcorrencias] = useState({
        id: 0,
        presenca: false,
        motivoFalta: '',
        horaExtra: false,
        motivoHoraExtra: '',
        nivelUrgencia: 'NULL',
        ocorrencia: '',
        imagem: false 
    });

    const toast = useRef<Toast>(null);
    const ocorrenciasService = useMemo(() => new OcorrenciasService(), []);
    const router = useRouter();

    useEffect(() => {
        ocorrenciasService.manterConexao()
            .then(() => {
                console.log("Conexão mantida com sucesso");
            })
            .catch(error => {
                console.error("Erro ao manter a conexão", error);
            });
    }, [ocorrenciasService]);

    const handleSubmit = async () => {
        try {
            const response = await ocorrenciasService.envioOcorrencias(ocorrencias);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Dados enviados com sucesso!',
                life: 3000
            });
            localStorage.removeItem('TOKEN_APLICACAO_FRONTEND');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Motivo obrigatório se houve falta ou hora extra.';
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: errorMessage,
                life: 3000
            });
        }
    };

    const SubmitAndImage = async () => {
        try {
            const response = await ocorrenciasService.envioOcorrencias(ocorrencias);
            const idGerado = response.data.id; // Captura o ID da resposta
            
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Dados enviados com sucesso!',
                life: 3000
            });
            
            router.push(`/pages/imagem/${idGerado}`); // Redireciona para a página de imagem
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Motivo obrigatório se houve falta ou hora extra.';
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: errorMessage,
                life: 3000
            });
        }
    };

    const handlePresenceChange = (presence: boolean) => {
        setOcorrencias(prevState => ({ ...prevState, presenca: presence }));
    };

    const handleHoraExtraChange = (horaExtra: boolean) => {
        setOcorrencias(prevState => ({ ...prevState, horaExtra }));
    };

    const handleImagemChange = (imagem: boolean) => {
        setOcorrencias(prevState => ({ ...prevState, imagem }));
    };

    const handleOcorrenciasChange = (field: string, value: any) => {
        setOcorrencias(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    return (
        <div className="card p-fluid">
            <Toast ref={toast} />

            <h5>Formulário de Ocorrências Gerais</h5>
            <Accordion>
                <AccordionTab header="As ocorrências são enviadas via Email">
                    <div className="p-field">
                        <label htmlFor="presenca" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Presença:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${ocorrencias.presenca ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handlePresenceChange(true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: ocorrencias.presenca ? '#28a745' : 'transparent',
                                    color: ocorrencias.presenca ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!ocorrencias.presenca ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handlePresenceChange(false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: !ocorrencias.presenca ? '#dc3545' : 'transparent',
                                    color: !ocorrencias.presenca ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                        <label htmlFor="motivoFalta" style={{ display: 'block', marginTop: '12px', marginBottom: '4px', color: '#6c757d' }}>
                            Motivo:
                        </label>
                        <InputTextarea
                            id="motivoFalta"
                            rows={3}
                            cols={30}
                            value={ocorrencias.motivoFalta}
                            onChange={(e) => handleOcorrenciasChange('motivoFalta', e.target.value)}
                            disabled={ocorrencias.presenca}
                            style={{
                                marginTop: '8px',
                                border: ocorrencias.presenca ? '1px solid red' : '1px solid #ccc',
                                backgroundColor: '#f9f9f9'
                            }}
                            placeholder=""
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="horaExtra" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Hora Extra:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${ocorrencias.horaExtra ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleHoraExtraChange(true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: ocorrencias.horaExtra ? '#28a745' : 'transparent',
                                    color: ocorrencias.horaExtra ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!ocorrencias.horaExtra ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleHoraExtraChange(false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: !ocorrencias.horaExtra ? '#dc3545' : 'transparent',
                                    color: !ocorrencias.horaExtra ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                        <label htmlFor="motivoHoraExtra" style={{ display: 'block', marginTop: '12px', marginBottom: '4px', color: '#6c757d' }}>
                            Motivo:
                        </label>
                        <InputTextarea
                            id="motivoHoraExtra"
                            rows={3}
                            cols={30}
                            value={ocorrencias.motivoHoraExtra}
                            onChange={(e) => handleOcorrenciasChange('motivoHoraExtra', e.target.value)}
                            disabled={!ocorrencias.horaExtra}
                            style={{
                                marginTop: '8px',
                                border: !ocorrencias.horaExtra ? '1px solid red' : '1px solid #ccc',
                                backgroundColor: '#f9f9f9'
                            }}
                            placeholder=""
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="nivelUrgencia" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Nível de Urgência:
                        </label>
                        <Dropdown
                            id="nivelUrgencia"
                            optionLabel="label"
                            value={ocorrencias.nivelUrgencia}
                            options={nivelUrgenciaOptions}
                            onChange={(e) => handleOcorrenciasChange('nivelUrgencia', e.value)}
                            placeholder="Selecione"
                            className="w-full md:w-30rem mb-5"
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="ocorrencia" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Descreva sua Ocorrência:
                        </label>
                        <InputTextarea
                            id="ocorrencia"
                            rows={3}
                            cols={30}
                            value={ocorrencias.ocorrencia}
                            onChange={(e) => handleOcorrenciasChange('ocorrencia', e.target.value)}
                            style={{ marginTop: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
                        />
                    </div>

                    <div className="p-field">
                        <h5></h5>
                        <label htmlFor="imagem" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Deseja enviar uma imagem?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${ocorrencias.imagem ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleImagemChange(true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: ocorrencias.imagem ? '#28a745' : 'transparent',
                                    color: ocorrencias.imagem ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!ocorrencias.imagem ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleImagemChange(false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: !ocorrencias.imagem ? '#dc3545' : 'transparent',
                                    color: !ocorrencias.imagem ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                    </div>

                    <label htmlFor="imagem" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                        Salvar Forms e Anexar Foto:
                    </label>
                    <Button label="Envio Imagem" icon="pi pi-upload" severity="help" onClick={SubmitAndImage} 
                        style={{ width: 'auto', minWidth: '100px' }} disabled={!ocorrencias.imagem} />
                </AccordionTab>
            </Accordion>

            <div className="p-field">
                <Button label="Enviar" icon="pi pi-check" onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default OcorrenciasFormsPage;
