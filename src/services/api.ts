// src/services/api.ts
import axios from 'axios';

// Crie uma instância padrão do Axios.
// Se houvesse uma base URL comum para TODAS as suas APIs, você poderia defini-la aqui.
// Para este desafio, as URLs base são específicas de cada serviço (OMDb, ViaCEP),
// então configuraremos as base URLs diretamente nos serviços.
const api = axios.create({
    // Você pode adicionar configurações globais aqui, como timeouts, cabeçalhos comuns, etc.
    // timeout: 5000,
});

// Exemplo (Opcional, para o futuro): Adicionar um interceptor de requisição
// api.interceptors.request.use(
//     (config) => {
//         // Por exemplo, se você tivesse um token de autenticação para adicionar a cada requisição
//         // const authStore = useAuthStore(); // Você precisaria importar a store aqui
//         // if (authStore.isLoggedIn && authStore.user?.token) {
//         //     config.headers.Authorization = `Bearer ${authStore.user.token}`;
//         // }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default api;