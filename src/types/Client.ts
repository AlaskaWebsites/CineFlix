// src/types/Client.ts
export interface Client {
    id: string;
    firstName: string; // "nome"
    lastName: string; // "sobrenome"
    cpf: string;
    email: string; // contato
    phone: string; // contato (celular)
    address: { // endereço - esta parte será preenchida pelo ViaCEP
        zipCode: string; // cep
        street: string; // logradouro
        neighborhood: string; // bairro
        city: string; // localidade
        state: string; // uf
        // Os campos abaixo (complemento, unidade, ibge, gia, ddd, siafi, estado, regiao)
        // podem ser adicionados se você precisar deles, ou ignorados se não forem relevantes para o projeto.
        // complemento?: string;
        // unidade?: string;
        // ibge?: string;
        // gia?: string;
        // ddd?: string;
        // siafi?: string;
        // estadoViaCep?: string; // Para evitar conflito com 'state' (UF)
        // regiao?: string;
    };
    status: 'active' | 'inactive'; // <-- Adicione esta linha
}