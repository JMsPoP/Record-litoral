"use client"; 

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ImagemService } from "../../../../../service/ImagemService";
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

const ImagemPage = () => {
    const { id } = useParams();
    const [imagens, setImagens] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const toast = useRef<Toast | null>(null);
    const imagemService = useMemo(() => new ImagemService(), []);

    useEffect(() => {
        if(imagens == null){
            imagemService.buscarPordId(id).then(result => {
                if (result.data && result.data.length > 0) {
                    const imagem = result.data[0]; // Acessa o primeiro objeto no array
                    buscarPorOcorrencia(imagem.id); // Aqui você deve usar imagem.id
                } else {
                    console.error("Nenhuma imagem encontrada na resposta:", result);
                }
            }).catch(error => {
                console.error("Erro ao buscar a imagem:", error);
            });
            




        /* imagemService.manterConexao()
            .then(() => {
                console.log("Conexão mantida com sucesso");
            })
            .catch(error => {
                console.error("Erro ao manter a conexão", error);
            });
 
        setImagens([{}]); */}
    }, /*[imagemService]*/[imagens]);


    const buscarPorOcorrencia = (ID_OCORRENCIA: any) => {
        imagemService.buscarPorOcorrencia(ID_OCORRENCIA).then(result => {
            setImagens(result.data);
        })
    }

    const handleFileUpload = (event: FileUploadHandlerEvent) => {
        const files = event.files;
        if (files.length > 0) {
            setSelectedFiles(files); // Armazena os arquivos selecionados
        }
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Nenhum arquivo selecionado para upload.', life: 3000 });
            setImagens(null)
            return;
        }

        const imagem = {
            ID_OCORRENCIA: id,
            file: selectedFiles[0],
            nome: null
        };

        try {
            await imagemService.uploadImagens(imagem);
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Imagem adicionada', life: 3000 });
            setSelectedFiles([]); // Limpa os arquivos selecionados após o upload
            setImagens(null);
        } catch (err: any) {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha no upload', life: 3000 });
        }
    };

    const renderGridItem = (data: any) => {
        return (
            <div className="col-12 md:col-4" key={data.nome}>
                <div className="product-grid-item card">
                    <div className="product-grid-item-content">
                        <Image 
                            src={'data:image;base64, '+data.arquivo} 
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png';
                            }} 
                            //alt={data.nome || "Imagem"} 
                            style={{ width: '100%', height: 'auto' }} 
                            preview
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div className="grid grid-nogutter">
                <div className="col-6" style={{ textAlign: 'left' }}>
                    <FileUpload 
                        customUpload 
                        auto 
                        uploadHandler={handleFileUpload} 
                        accept="image/*" 
                        maxFileSize={10000000}
                        chooseLabel="Adicionar Imagem"
                    />
                </div>
                <div className="col-6" style={{ textAlign: 'right' }}>
                    <Button label="Enviar" icon="pi pi-upload" onClick={uploadFiles} /> {/* Botão de envio */}
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="dataview-demo">
            <Toast ref={toast} />
            <div className="card">
                <DataView 
                    value={imagens}
                    layout={'grid'}
                    header={header}
                    itemTemplate={renderGridItem} 
                />
            </div>
        </div>
    );
};

export default ImagemPage;
