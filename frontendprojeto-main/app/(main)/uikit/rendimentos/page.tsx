/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';
import { AdminRedimentosService } from '../../../../service/AdminRendimentosService';

const Rendimento = () => {
    const [rendimentos, setRendimentos] = useState<Projeto.RendimentoView[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    const rendimentosService = useMemo(() => new AdminRedimentosService(), []);

    useEffect(() => {
        const fetchRendimentos = async () => {
            try {
                const response = await rendimentosService.listarTodos();
                setRendimentos(response.data || []);
            } catch (error) {
                console.error(error);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar rendimentos.' });
            } finally {
                setLoading(false);
            }
        };

        fetchRendimentos();
    }, [rendimentosService]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="grid p-fluid">
            <Toast ref={toast} />
            {rendimentos.map((rendimento) => {
                const enviosSucesso = rendimento.envios_sucesso;
                const faltas = rendimento.faltas;
                const equipeSemAtividade = rendimento.equipe_sem_atividade;
                const horaExtra = rendimento.hora_extras; // Corrigido para "hora_extras"
                const naoHoraExtra = enviosSucesso - horaExtra;

                const pieData = {
                    labels: ['Envios Bem Sucedidos', 'Faltas', 'Equipe Sem Atividade'],
                    datasets: [{
                        data: [enviosSucesso, faltas, equipeSemAtividade],
                        backgroundColor: ['#6366f1', '#a855f7', '#14b8a6'],
                        hoverBackgroundColor: ['#8183f4', '#b975f9', '#41c5b7']
                    }]
                };

                const doughnutData = {
                    labels: ['Hora Extra', 'Não Hora Extra'],
                    datasets: [{
                        data: [horaExtra, naoHoraExtra],
                        backgroundColor: ['#f97316', '#facc15'],
                        hoverBackgroundColor: ['#fb923c', '#fbbf24']
                    }]
                };

                return (
                    <div className="col-12 mb-4" key={rendimento.id}>
                        <div className="flex">
                            <div className="card flex flex-column align-items-center w-full mr-2">
                                <h5 className="text-left w-full">Rendimento do Funcionário: {rendimento.usuario.nome}</h5>
                                <Chart type="pie" data={pieData} />
                            </div>
                            <div className="card flex flex-column align-items-center w-full">
                                <h5 className="text-left w-full">Hora Extra do Funcionário: {rendimento.usuario.nome}</h5>
                                <Chart type="doughnut" data={doughnutData} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Rendimento;
