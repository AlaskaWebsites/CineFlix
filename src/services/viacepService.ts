// src/services/viacepService.ts
import axios from 'axios';

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
    erro?: boolean; // ViaCEP retorna { "erro": true } se o CEP não for encontrado
}

const VIA_CEP_BASE_URL = 'https://viacep.com.br/ws/';

/**
 * Busca informações de endereço pelo CEP usando a API do ViaCEP.
 * @param cep O CEP a ser buscado (apenas números).
 * @returns Uma Promise que resolve para os dados do endereço ou null se não encontrado/erro.
 */
export async function fetchAddressByCep(cep: string): Promise<ViaCEPAddress | null> {
    try {
        // Remove qualquer coisa que não seja dígito do CEP
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            console.warn("CEP inválido. Deve ter 8 dígitos.");
            return null;
        }

        const response = await axios.get<ViaCEPAddress>(`${VIA_CEP_BASE_URL}${cleanCep}/json/`);

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