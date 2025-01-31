'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { CameraService } from '../../../../service/CameraService';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';



// Define as opções do Dropdown
const serviceOptions = [
    { label: 'Falta de Veículo', value: 'FALTA_VEICULO' },
    { label: 'Falta de Auxiliar Motorista', value: 'FALTA_AUXILIAR_MOTORISTA' },
    { label: 'Falta de Equipamentos', value: 'FALTA_EQUIPAMENTOS' },
    { label: 'Não Houve Pauta ou Matéria', value: 'NAO_HOUVE_PAUTA_OU_MATERIA' },
    { label: 'Outros', value: 'OUTROS' }
];

const vehicleOptions = [
    { label: 'DUSTER RVX6I24', value: 'DUSTER_RVX6I24' },
    { label: 'DUSTER RVX6I20', value: 'DUSTER_RVX6I20' },
    { label: 'DUSTER RVX6I22', value: 'DUSTER_RVX6I22' }


];

const vehicleDamegeOptions = [
    { label: 'Porta traseira esquerda', value: 'PORTA_TRAS_ESQ'},
    { label: 'Porta dianteira esquerda', value: 'PORTA_DIANT_ESQ'},
    { label: 'Lateral traseira esquerda', value: 'LATERAL_TRAS_ESQ'},
    { label: 'Para-lama esquerdo', value: 'PARALAMA_ESQ'},
    { label: 'Capô motor', value: 'CAPO_MOTOR'},
    { label: 'Teto', value: 'TETO'},
    { label: 'Para-choque dianteiro', value: 'PARACHOQUE_DIANT'},
    { label: 'Para-choque traseiro', value: 'PARACHOQUE_TRAS'},
    { label: 'Rodas/Calotas', value: 'RODAS_CALOTAS'},
    { label: 'Vidros/Parabrisa', value: 'VIDROS_PARABRISA'},
    { label: 'Faróis', value: 'FAROIS'},
    { label: 'Lanternas', value: 'LANTERNAS'},
    { label: 'Antena', value: 'ANTENA'},
    { label: 'Bancos', value: 'BANCOS'},
    { label: 'Painél de veículo', value: 'PAINEL_DE_VEICULO'},
    { label: 'Retrovisor', value: 'RETROVISOR'},
    { label: 'Tampa porta-mala', value: 'TAMPA_PORTA_MALA'},
    { label: 'Para-lama direito', value: 'PARALAMA_DIR'},
    { label: 'Porta dianteira direita', value: 'PORTA_DIAN_DIR'},
    { label: 'Porta traseira direita', value: 'PORTA_TRAS_DIR'},
    { label: 'Guarda chuva', value: 'GUARDA_CHUVA'},
    { label: 'Repelente', value: 'REPELENTE'},
    { label: 'Protetor solar', value: 'PROTETOR_SOLAR'},
];

const kitCameraOptions = [
    { label: 'Kit 01', value: 'KIT01' },
    { label: 'Kit 02', value: 'KIT02' },
    { label: 'Kit 03', value: 'KIT03' }
];

const equipmentOptions = [
    { label: 'Câmera 01', value: 'CAMERA01' },
    { label: 'Câmera 02', value: 'CAMERA02' },
    { label: 'Câmera 03', value: 'CAMERA03' }
];

const nivelUrgenciaOptions = [
    {label: 'Circunstancial', value: 'CIRCUNSTANCIAL'},
    {label: 'Urgente', value: 'URGENTE'},
    {label: 'Importante', value: 'IMPORTANTE'}

];

const CameraFormsPage = () => {
    const [camera, setCamera] = useState({
        id: 0,
        presenca: false,
        motivo: '',
        servico: [
            {
                id: 0,
                equipeSemAtividade: false,
                tipoSemAtividade: 'NULL',
                notaCoberta: false,
                reporter: '',
                outros: '',
            }
        ],
        equipamento: [
            {
                id: 0,
                kitCamera: 'NULL',
                equipamentoCamera: 'NULL',
                bateriaCamera: '',
                pilhas: '',
                mochilink: false,
                obs: ''
            }
        ],
        inspecaoVeiculo: [
            {
                id: 0,
                veiculo: 'NULL',
                verificar_Condicoes: false,
                danos: false,
                tipo_Danos_Veiculo: 'NULL',
                kmInicial: '',
                kmFinal: '',
                obs: ''
            }
        ],
        links: false,
        retranca: [
            {
                id: 0,
                retranca: '',
                cidade: '',
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
    const cameraService = useMemo(() => new CameraService(), []);
    useEffect(() => {
        // Chama manterConexao ao abrir a página
        cameraService.manterConexao()
            .then(() => {
                console.log("Conexão mantida com sucesso");
            })
            .catch(error => {
                console.error("Erro ao manter a conexão", error);
            });
    }, []);

    const toast = useRef<Toast>(null);

    const handleSubmit = async () => {
        try {
            const response = await cameraService.envioCamera(camera);
            console.log('Dados enviados com sucesso:', response.data);
            
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Dados enviados com sucesso!',
                life: 3000

            });
    
            // Remove o token do localStorage
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
            const response = await cameraService.envioCamera(camera);
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

/*


const handleSubmit = async () => {
    try {
        const response = await cameraService.envioCamera(camera);
        console.log('Dados enviados com sucesso:', response.data);

        toast.current?.show({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Dados enviados com sucesso!',
            life: 3000
        });
    } catch (error) {
        console.error('Erro ao enviar dados:', error);

        toast.current?.show({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao enviar dados!',
            life: 3000
        });
    }
};*/

    const handlePresenceChange = (presence: boolean) => {
        setCamera({ ...camera, presenca: presence });
    };

    const handleServiceChange = (field: string, value: any) => {
        setCamera(prevState => ({
            ...prevState,
            servico: [
                {
                    ...prevState.servico[0],
                    [field]: value
                }
            ]
        }));
    };

    const handleEquipmentChange = (field: string, value: any) => {
        setCamera(prevState => ({
            ...prevState,
            equipamento: [ // Verifique se o nome do campo está correto
                {
                    ...prevState.equipamento[0],
                    [field]: value
                }
            ]
        }));
    };

    const handleInspecaoChange = (field: string, value: any) => {
        setCamera(prevState => ({
            ...prevState,
            inspecaoVeiculo: [
                {
                    ...prevState.inspecaoVeiculo[0],
                    [field]: value
                }
            ]
        }));
    };

    const handleLinkChange = (links: boolean) => {
        setCamera({ ...camera, links: links });
    };

    const handleRetrancaChange = (index: number, field: string, value: any) => {
        setCamera(prevState => ({
            ...prevState,
            retranca: prevState.retranca.map((retranca, i) => 
                i === index ? { ...retranca, [field]: value } : retranca
            )
        }));
    };

    const handleOcorrenciasChange = (field: string, value: any) => {
        setCamera(prevState => ({
            ...prevState,
            ocorrencias: [
                {
                    ...prevState.ocorrencias[0],
                    [field]: value
                }
            ]
        }));
    };

    const handleImagemChange = (imagem: boolean) => {
        setCamera(prevState => ({
            ...prevState,
            ocorrencias: [
                {
                    ...prevState.ocorrencias[0],
                    imagem: imagem
                }
            ]
        }));
    };
    

    const isTipoServicoDisabled = () => {
        // Apenas desabilita o Dropdown se equipeSemAtividade for false
        return !camera.servico[0].equipeSemAtividade;
    };

    const isOutrosVisible = () => {
        // Mostrar o campo Outros se tipoServico for 'OUTROS'
        return camera.servico[0].tipoSemAtividade === 'OUTROS';
    };

    const isNotaCobertaDisabled = () => {
        // Apenas desabilita o Nota Coberta se equipeSemAtividade for true
        return camera.servico[0].equipeSemAtividade;
    };

    const isReporterDisabled = () => {
        // Apenas desabilita o Reporter se notaCoberta for true
        return camera.servico[0].notaCoberta;
    };

    const isEquipamentoEnabled = () => {
        return camera.servico[0].notaCoberta || camera.servico[0].reporter !== '';
    };

    const isInspecaoEnabled = () => {
        return camera.servico[0].notaCoberta || camera.servico[0].reporter !== '';
    };



    
    return (
        <div className="card p-fluid">
            {/* Colocando o Toast aqui para que ele seja renderizado na página */}
            <Toast ref={toast} />
    
            <h5>Formulário de Câmera</h5>
            <Accordion activeIndex={0}>
                <AccordionTab header="Presença?">
                    <div className="p-field">
                        <label htmlFor="presenca" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}/*aqui se escreve oq vai estar em cima dos botoess*/>
                            
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${camera.presenca ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handlePresenceChange(true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: camera.presenca ? '#28a745' : 'transparent',
                                    color: camera.presenca ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!camera.presenca ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handlePresenceChange(false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: !camera.presenca ? '#dc3545' : 'transparent',
                                    color: !camera.presenca ? '#fff' : '#dc3545'
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
                            value={camera.motivo}
                            onChange={(e) => setCamera({ ...camera, motivo: e.target.value })}
                            disabled={camera.presenca}
                            style={{
                                marginTop: '8px',
                                border: camera.presenca ? '1px solid red' : '1px solid #ccc',
                                backgroundColor: camera.presenca ? '#f9f9f9' : '#f9f9f9'
                            }}
                            placeholder=""
                        />
                    </div>
                </AccordionTab>
                <AccordionTab header="Serviços" disabled={!camera.presenca}>
                    <div className="p-field">
                        <label htmlFor="equipeSemAtividade" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Equipe Sem Atividade
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${camera.servico[0].equipeSemAtividade ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleServiceChange('equipeSemAtividade', true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: camera.servico[0].equipeSemAtividade ? '#28a745' : 'transparent',
                                    color: camera.servico[0].equipeSemAtividade ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!camera.servico[0].equipeSemAtividade ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleServiceChange('equipeSemAtividade', false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: !camera.servico[0].equipeSemAtividade ? '#dc3545' : 'transparent',
                                    color: !camera.servico[0].equipeSemAtividade ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="tipoSemAtividade" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Tipo da Falta de Atividade
                        </label>
                        <Dropdown
                            id="tipoSemAtividade"
                            optionLabel="label"
                            value={camera.servico[0].tipoSemAtividade}
                            options={serviceOptions}
                            onChange={(e) => handleServiceChange('tipoSemAtividade', e.value)}
                            placeholder="Selecione o tipo da falta de atividade"
                            className="w-full md:w-30rem mb-5"
                            style={{ height: '4rem', padding: '0.5rem' }}
                            disabled={isTipoServicoDisabled()} // Controla a desativação do Dropdown
                        />
                    </div>
                    {isOutrosVisible() && (
                        <div className="p-field">
                            <label htmlFor="outros" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                                Outros
                            </label>
                            <InputTextarea
                                id="outros"
                                rows={3}
                                cols={30}
                                value={camera.servico[0].outros}
                                onChange={(e) => handleServiceChange('outros', e.target.value)}
                                disabled={isTipoServicoDisabled()} // Controla a desativação do campo Outros
                                style={{
                                    border: '1px solid #ccc',
                                    backgroundColor: '#f9f9f9'
                                }}
                                placeholder="Detalhes adicionais"
                            />
                        </div>
                    )}
                    <div className="p-field">
                        <label htmlFor="notaCoberta" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Nota Coberta
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${camera.servico[0].notaCoberta ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleServiceChange('notaCoberta', true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: camera.servico[0].notaCoberta ? '#28a745' : 'transparent',
                                    color: camera.servico[0].notaCoberta ? '#fff' : '#28a745'
                                }}
                                disabled={isNotaCobertaDisabled()} // Nota Coberta desativada quando equipeSemAtividade é true
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!camera.servico[0].notaCoberta ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleServiceChange('notaCoberta', false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: !camera.servico[0].notaCoberta ? '#dc3545' : 'transparent',
                                    color: !camera.servico[0].notaCoberta ? '#fff' : '#dc3545'
                                }}
                                disabled={isNotaCobertaDisabled()} // Nota Coberta desativada quando equipeSemAtividade é true
                            />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="reporter" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Reporter
                        </label>
                        <InputText
                            id="reporter"
                            value={camera.servico[0].reporter}
                            onChange={(e) => handleServiceChange('reporter', e.target.value)}
                            disabled={isReporterDisabled()} // Reporter desativado quando notaCoberta é true
                            style={{
                                border: `1px solid ${isReporterDisabled() ? 'red' : '#ccc'}`, // Borda vermelha se desativado
                                backgroundColor: '#f9f9f9'
                            }}
                        />
                    </div>
                </AccordionTab>
                <AccordionTab header="Equipamento" disabled={!isEquipamentoEnabled()}>
                    <div className="p-field">
                        <label htmlFor="kitCamera" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Kit Câmera
                        </label>
                        <Dropdown
                            id="kitCamera"
                            optionLabel="label"
                            value={camera.equipamento[0].kitCamera}
                            options={kitCameraOptions}
                            onChange={(e) => handleEquipmentChange('kitCamera', e.value)}
                            placeholder="Selecione o kit de câmera"
                            className="w-full md:w-30rem mb-5"
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="equipamentoCamera" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Equipamento de Câmera
                        </label>
                        <Dropdown
                            id="equipamentoCamera"
                            optionLabel="label"
                            value={camera.equipamento[0].equipamentoCamera}
                            options={equipmentOptions}
                            onChange={(e) => handleEquipmentChange('equipamentoCamera', e.value)}
                            placeholder="Selecione o equipamento de câmera"
                            className="w-full md:w-30rem mb-5"
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="bateriaCamera" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Bateria da Câmera
                        </label>
                        <InputText
                            id="bateriaCamera"
                            value={camera.equipamento[0].bateriaCamera}
                            onChange={(e) => handleEquipmentChange('bateriaCamera', e.target.value)}
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="pilhas" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Pilhas
                        </label>
                        <InputText
                            id="pilhas"
                            value={camera.equipamento[0].pilhas}
                            onChange={(e) => handleEquipmentChange('pilhas', e.target.value)}
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="mochilink" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Mochilink
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${camera.equipamento[0].mochilink ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleEquipmentChange('mochilink', true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: camera.equipamento[0].mochilink ? '#28a745' : 'transparent',
                                    color: camera.equipamento[0].mochilink ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!camera.equipamento[0].mochilink ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleEquipmentChange('mochilink', false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: !camera.equipamento[0].mochilink ? '#dc3545' : 'transparent',
                                    color: !camera.equipamento[0].mochilink ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="obs" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Observações
                        </label>
                        <InputTextarea
                            id="obs"
                            rows={3}
                            cols={30}
                            value={camera.equipamento[0].obs}
                            onChange={(e) => handleEquipmentChange('obs', e.target.value)}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '10px',
                                height: '100px'
                            }}
                        />
                    </div>
                </AccordionTab>

                <AccordionTab header="Inspeção Veículo" disabled={!isInspecaoEnabled()}>
                    <div className="p-field">
                        <label htmlFor="veiculo" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Veículo
                        </label>
                        <Dropdown
                            id="veiculo"
                            optionLabel="label"
                            value={camera.inspecaoVeiculo[0].veiculo}
                            options={vehicleOptions}
                            onChange={(e) => handleInspecaoChange('veiculo', e.value)}
                            placeholder="Selecione o veículo"
                            className="w-full md:w-30rem mb-5"
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="verificar_Condicoes" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Verificou condições?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${camera.inspecaoVeiculo[0].verificar_Condicoes ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleInspecaoChange('verificar_Condicoes', true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: camera.inspecaoVeiculo[0].verificar_Condicoes ? '#28a745' : 'transparent',
                                    color: camera.inspecaoVeiculo[0].verificar_Condicoes ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!camera.inspecaoVeiculo[0].verificar_Condicoes ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleInspecaoChange('verificar_Condicoes', false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: !camera.inspecaoVeiculo[0].verificar_Condicoes ? '#dc3545' : 'transparent',
                                    color: !camera.inspecaoVeiculo[0].verificar_Condicoes ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="danos" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Danos?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${camera.inspecaoVeiculo[0].danos ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleInspecaoChange('danos', true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: camera.inspecaoVeiculo[0].danos ? '#28a745' : 'transparent',
                                    color: camera.inspecaoVeiculo[0].danos ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!camera.inspecaoVeiculo[0].danos ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleInspecaoChange('danos', false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: !camera.inspecaoVeiculo[0].danos ? '#dc3545' : 'transparent',
                                    color: !camera.inspecaoVeiculo[0].danos ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="tipo_Danos_Veiculo" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Tipo de dano Veículo
                        </label>
                        <Dropdown
                            id="tipo_Danos_Veiculo"
                            optionLabel="label"
                            value={camera.inspecaoVeiculo[0].tipo_Danos_Veiculo}
                            options={vehicleDamegeOptions}
                            onChange={(e) => handleInspecaoChange('tipo_Danos_Veiculo', e.value)}
                            placeholder="Selecione o tipo de dano ao veículo"
                            className="w-full md:w-30rem mb-5"
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="kmInicial" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Km Inicial
                        </label>
                        <InputText
                            id="kmInicial"
                            value={camera.inspecaoVeiculo[0].kmInicial}
                            onChange={(e) => handleInspecaoChange('kmInicial', e.target.value)}
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="kmFinal" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Km Final
                        </label>
                        <InputText
                            id="kmFinal"
                            value={camera.inspecaoVeiculo[0].kmFinal}
                            onChange={(e) => handleInspecaoChange('kmFinal', e.target.value)}
                            style={{ height: '4rem', padding: '0.5rem' }}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="obs" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Observações
                        </label>
                        <InputTextarea
                            id="obs"
                            rows={3}
                            cols={30}
                            value={camera.inspecaoVeiculo[0].obs}
                            onChange={(e) => handleInspecaoChange('obs', e.target.value)}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '10px',
                                height: '100px'
                            }}
                        />
                    </div>
                </AccordionTab>

                <AccordionTab header="Link?" disabled={!isEquipamentoEnabled()}>
                    <div className="p-field">
                        <label htmlFor="link" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Link
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${camera.links ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleLinkChange(true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: camera.links ? '#28a745' : 'transparent',
                                    color: camera.links ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!camera.links ? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleLinkChange(false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ccc',
                                    backgroundColor: !camera.links ? '#dc3545' : 'transparent',
                                    color: !camera.links ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                    </div>
                </AccordionTab>

                <AccordionTab header="Retranca" disabled={!isEquipamentoEnabled()}>
                    {camera.retranca.map((retranca, index) => (
                        <div key={index}>
                            <div className="p-field">
                                <label htmlFor={`retrancaText-${index}`}>Retranca</label>
                                <InputText
                                    id={`retrancaText-${index}`}
                                    value={retranca.retranca}
                                    onChange={(e) => handleRetrancaChange(index, 'retranca', e.target.value)}
                                />
                            </div>

                            <div className="p-field">
                                <label htmlFor={`cidade-${index}`}>Cidade</label>
                                <InputText
                                    id={`cidade-${index}`}
                                    value={retranca.cidade}
                                    onChange={(e) => handleRetrancaChange(index, 'cidade', e.target.value)}
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
                                    disabled={retranca.execucao}
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
                            value={camera.ocorrencias[0].nivelUrgencia}
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
                            value={camera.ocorrencias[0].ocorrencia}
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
                    <h5></h5>
                        <label htmlFor="imagem" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                            Deseja enviar uma imagem?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-check"
                                className={`p-button-rounded ${camera.ocorrencias[0].imagem ? 'p-button-success' : 'p-button-outlined'}`}
                                onClick={() => handleImagemChange(true)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: camera.ocorrencias[0].imagem ? '#28a745' : 'transparent',
                                    color: camera.ocorrencias[0].imagem ? '#fff' : '#28a745'
                                }}
                            />
                            <Button
                                icon="pi pi-times"
                                className={`p-button-rounded ${!camera.ocorrencias[0].imagem? 'p-button-danger' : 'p-button-outlined'}`}
                                onClick={() => handleImagemChange(false)}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '1px solid #ccc',
                                    backgroundColor: !camera.ocorrencias[0].imagem ? '#dc3545' : 'transparent',
                                    color: !camera.ocorrencias[0].imagem ? '#fff' : '#dc3545'
                                }}
                            />
                        </div>
                    </div>

                    <label htmlFor="imagem" style={{ display: 'block', marginBottom: '8px', color: '#6c757d' }}>
                        Salvar Forms e Anexar Foto:
                    </label>
                    <Button label="Envio Imagem" icon="pi pi-upload" severity="help" onClick={SubmitAndImage} 
                        style={{ width: 'auto', minWidth: '100px' }} disabled={!camera.ocorrencias[0].imagem} />
                </AccordionTab>

</Accordion>

{/* Botão de Envio posicionado fora do Accordion */}
<div className="p-mt-3">
    <Button label="Enviar" icon="pi pi-send" className="p-button-primary" onClick={() => handleSubmit()} />
</div>
</div>
);
};

export default CameraFormsPage;