// src/services/viacepService.ts
import api from '@/services/api'; // <-- Importe a instância do Axios

// Interface para a resposta da API do ViaCEP
export interface ViaCEPAddress {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

const VIA_CEP_BASE_URL = 'https://viacep.com.br/ws/';

export async function fetchAddressByCep(cep: string): Promise<ViaCEPAddress | null> {
    try {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            console.warn("CEP inválido. Deve ter 8 dígitos.");
            return null;
        }

        const response = await api.get<ViaCEPAddress>(`${VIA_CEP_BASE_URL}${cleanCep}/json/`); // <-- Use 'api.get'

        if (response.data.erro) {
            console.warn(`CEP ${cep} não encontrado.`);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar CEP ${cep}:`, error);
        return null;
    }
}