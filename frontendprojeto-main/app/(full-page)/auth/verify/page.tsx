/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { LoginService } from '../../../../service/LoginService';
import { useRouter } from 'next/navigation';

const VerifyPage = () => {
    const [token, setTokens] = useState(Array(36).fill(''));
    const loginService = useMemo(() => new LoginService(), []);

    const { layoutConfig } = useContext(LayoutContext);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    
    const toast = useRef<Toast>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        const newTokens = [...token];
        newTokens[index] = value;
        setTokens(newTokens);

        // Move to next input
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        const pasteData = e.clipboardData.getData('Text').slice(0, 36 - index);
        const newTokens = [...token];

        pasteData.split('').forEach((char, i) => {
            if (index + i < newTokens.length) {
                newTokens[index + i] = char;
            }
        });

        setTokens(newTokens);

        // Move focus to the appropriate input
        const nextIndex = index + pasteData.length;
        if (nextIndex < inputRefs.current.length) {
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const router = useRouter();

    const handleVerify = () => {
        const uuid = token.join('');
        console.log('UUID a ser verificado:', uuid); // Adiciona log para ver o UUID

        loginService.verificar({ UUID: uuid }).then(() => {
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Código verificado com sucesso!'
            });
        }).catch(error => {
            console.error('Erro ao verificar o código:', error); // Adiciona log do erro
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao verificar o código!'
            });
        });
    };

    const customInput = ({ value, onChange, id, ...props }: { value: string; onChange: (value: string) => void; id: string }) => {
        return (
            <div className="custom-otp-input-wrapper">
                <input 
                    {...props} 
                    type="text" 
                    className="custom-otp-input-sample" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)} 
                    onInput={(e) => {
                        if (e.currentTarget.value.length > 1) {
                            e.currentTarget.value = e.currentTarget.value[0]; // Mantém apenas o primeiro caractere
                        }
                    }}
                    onPaste={(e) => handlePaste(e, parseInt(id))}
                    maxLength={1} // Limita a um caractere
                    ref={(el) => (inputRefs.current[parseInt(id)] = el)} // Armazena a referência do input
                    id={id} 
                />
            </div>
        );
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <style scoped>
                {`
                    .custom-otp-input-wrapper {
                        display: inline-block; /* Disposição horizontal */
                        margin-right: 4px; /* Espaçamento horizontal entre os campos */
                    }

                    .custom-otp-input-sample {
                        width: 30px; /* Largura ajustada */
                        height: 48px;
                        font-size: 16px; /* Fonte ajustada para caber no campo */
                        appearance: none;
                        text-align: center;
                        transition: all 0.2s;
                        border-radius: 4px;
                        border: 1px solid var(--surface-400);
                        background: transparent;
                        outline-offset: -2px;
                        outline-color: transparent;
                        transition: outline-color 0.3s;
                        color: var(--text-color);
                    }

                    .custom-otp-input-sample:focus {
                        outline: 2px solid var(--primary-color);
                    }
                `}
            </style>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">                            
                            <div className="text-900 text-3xl font-medium mb-3">Verifique seu Código</div>                            
                        </div>
                        <div className="flex flex-column align-items-center">
                            <p className="font-bold text-xl mb-2">Faça sua Autenticação</p>
                            <p className="text-color-secondary block mb-5">Por favor entre o código enviado ao email do administrador</p>
                            <div className="flex flex-row">
                                {token.map((value, index) => (
                                    <div key={index} className="custom-otp-input-wrapper">
                                        <input
                                            type="text"
                                            className="custom-otp-input-sample"
                                            value={value}
                                            onChange={(e) => handleChange(e.target.value, index)}
                                            onInput={(e) => {
                                                if (e.currentTarget.value.length > 1) {
                                                    e.currentTarget.value = e.currentTarget.value[0]; // Mantém apenas o primeiro caractere
                                                }
                                            }}
                                            onPaste={(e) => handlePaste(e, index)}
                                            maxLength={1} // Limita a um caractere
                                            ref={(el) => (inputRefs.current[index] = el)} // Armazena a referência do input
                                            id={`${index}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-content-between mt-5 align-self-stretch">
                               
                            <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} onClick={() => router.push('/auth/signup')}>
                                    Sou novo por aqui!
                                </a>
                                <Button label="Enviar Codigo" onClick={handleVerify}></Button>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} onClick={() => router.push('/auth/login')}>
                                    Já tenho cadastro!
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyPage;
