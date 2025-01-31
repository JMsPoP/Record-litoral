'use client';

import { Button } from 'primereact/button';
import { Galleria } from 'primereact/galleria';
import React, { useEffect, useState } from 'react';
import { PhotoService } from '../../demo/service/PhotoService';
import { ProductService } from '../../demo/service/ProductService';
import type { Demo } from '../../types/types';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [images, setImages] = useState<Demo.Photo[]>([]);

    const galleriaResponsiveOptions = [
        { breakpoint: '1024px', numVisible: 5 },
        { breakpoint: '960px', numVisible: 4 },
        { breakpoint: '768px', numVisible: 3 },
        { breakpoint: '560px', numVisible: 1 }
    ];

    useEffect(() => {
        ProductService.getProductsSmall().then((products) => setProducts(products));
        PhotoService.getImages().then((images) => setImages(images));
    }, []);

    const galleriaItemTemplate = (item: Demo.Photo) => (
        <img 
            src={`/${item.itemImageSrc}`} 
            alt={item.alt} 
            style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} // Definindo altura fixa
        />
    );

    const galleriaThumbnailTemplate = (item: Demo.Photo) => (
        <img 
            src={`/${item.thumbnailImageSrc}`} 
            alt={item.alt} 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
        />
    );

    const router = useRouter();


    return (
        <>
            <div className="grid grid-nogutter surface-0 text-800">
                <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
                    <section>
                        <span className="block text-6xl font-bold mb-1">Record Litoral</span>
                        <div className="text-6xl text-primary font-bold mb-3">Gestão Operacional</div>
                        <p className="mt-0 mb-4 text-700 line-height-3">
                            Aplicação realizada para gestão de funcionários, gerando facilidade para envios e coleta dos dados entre gestores e a equipe Record Litoral.
                        </p>
                        <Button label="Sign Up" type="button" className="mr-3 p-button-raised"  onClick={() => router.push('/auth/signup')}/>
                        <Button label="Log in" type="button" className="p-button-outlined" onClick={() => router.push('/auth/login')}/>
                    </section>
                </div>
                <div className="col-12 md:col-6 overflow-hidden">
                    <img //imagem capa
                        src="/demo/images/blocks/hero/hero-1.png" 
                        alt="hero-1" 
                        className="md:ml-auto block md:h-full" 
                        style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} 
                    />
                </div>
            </div>


            <div className="surface-0 text-center">
                    <div className="mb-3 font-bold text-3xl">
                        <h5></h5>
                        <span className="text-900">Um Produto, </span>
                        <span className="text-blue-600">Muitas Soluções</span>
                    </div>
                    
                    <div className="text-700 mb-6">Envios e Retornos de dados das atividades da equipe.</div>
                    <div className="grid">
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-desktop text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text xl mb-3 font-medium">Portabilidade de Dispositivos</div>
                            <span className="text-700 line-height-3">Produto pensado para todo tipo de Dispositivos de forma que atenda a suas necessidades sem prejudicar a experiência.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-lock text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text xl mb-3 font-medium">Proteção de dados</div>
                            <span className="text-700 line-height-3">Privacidade dos envios e informações de usuarios. Apenas Administradores tem acesso aos seus envios.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-check-circle text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text xl mb-3 font-medium">Fácil de Usar</div>
                            <span className="text-700 line-height-3">Pensado para ultilização facilitada para todos os usuários, com personalização de sua atividade.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-database text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text xl mb-3 font-medium">Banco de Dados</div>
                            <span className="text-700 line-height-3">Uso de banco de dados de ponta, para assegurar o volume de dados e informações enviadas.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-inbox text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text xl mb-3 font-medium">Envios via email</div>
                            <span className="text-700 line-height-3">Ocorrências enviam emails, mantendo a garantia de de que suas informações serão enviadas aos gerentes. </span>
                        </div>
                        <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-shield text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text xl mb-3 font-medium">Segurança da Informação</div>
                            <span className="text-700 line-height-3">Proteções contra vírus e invasões hackers para garantir a segurança de seus dados.</span>
                        </div>
                    </div>
                </div>


            <div className="grid p-fluid">
                <div className="col-12">
                    <div className="card" style={{ padding: 0 }}>
                        <h5></h5>
                        <Galleria
                            value={images}
                            responsiveOptions={galleriaResponsiveOptions}
                            numVisible={7}
                            circular
                            style={{ maxWidth: '3050px', margin: 'auto' }}
                            item={galleriaItemTemplate}
                            thumbnail={galleriaThumbnailTemplate}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
