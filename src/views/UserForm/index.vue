<template>
    <div class="bg-cineflix-dark-gray p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-cineflix-red">
                {{ isEditMode ? 'Editar Funcionário' : 'Novo Funcionário' }}
            </h1>
        </div>

        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label for="name" class="block text-cineflix-white text-sm font-bold mb-2">
                    Nome Completo
                </label>
                <input type="text" id="name" v-model="formData.name" autocomplete="name"
                    :class="{ 'border-red-500': nameError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Nome completo do funcionário" required />
                <p v-if="nameError" class="text-red-500 text-xs italic mt-1">{{ nameError }}</p>
            </div>

            <div class="mb-4">
                <label for="document" class="block text-cineflix-white text-sm font-bold mb-2">
                    Documento (CPF)
                </label>
                <input type="text" id="document" v-model="formData.document" autocomplete="off"
                    :class="{ 'border-red-500': documentError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="CPF ou documento do funcionário" required />
                <p v-if="documentError" class="text-red-500 text-xs italic mt-1">{{ documentError }}</p>
            </div>

            <div v-if="!isEditMode" class="mb-6">
                <label for="password" class="block text-cineflix-white text-sm font-bold mb-2">
                    Senha
                </label>
                <input type="password" id="password" v-model="formData.password" autocomplete="new-password"
                    :class="{ 'border-red-500': passwordError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Defina uma senha" required />
                <p v-if="passwordError" class="text-red-500 text-xs italic mt-1">{{ passwordError }}</p>
            </div>

            <div v-if="formError" class="bg-red-500 text-white p-2 rounded mb-4 text-center">
                {{ formError }}
            </div>
            <div v-if="formSuccess" class="bg-green-500 text-white p-2 rounded mb-4 text-center">
                {{ formSuccess }}
            </div>

            <div class="flex items-center justify-between">
                <button type="submit"
                    class="bg-cineflix-red hover:bg-red-700 text-cineflix-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                    {{ isEditMode ? 'Salvar Alterações' : 'Cadastrar Funcionário' }}
                </button>
            </div>

            <div class="text-center mt-4">
                <router-link to="/dashboard/users" class="text-blue-400 hover:text-blue-600 text-sm">
                    Voltar para a lista de Usuários
                </router-link>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'; // <-- Removido 'onMounted'
import { useRouter, useRoute } from 'vue-router'; // <-- 'useRoute' ainda é necessário para 'route.fullPath' no watch, ou você pode remover ele e usar só useRouter se não precisar do fullPath
import { useUserStore } from '@/stores/users';
import type { User } from '@/types/User';

// Props para receber o ID na rota de edição
const props = defineProps<{
    id?: string; // O ID é opcional, só existe em modo de edição
}>();

const router = useRouter();
const route = useRoute(); // Manter se precisar de route.fullPath no watcher, ou se não, remova também

const userStore = useUserStore();

// Determina se estamos em modo de edição (se um ID foi passado nas props)
const isEditMode = computed(() => !!props.id);

// Estado do formulário
const formData = ref<Partial<User>>({ // Partial<User> para permitir campos opcionais no início
    name: '',
    document: '',
    password: '',
});

// Mensagens de erro por campo
const nameError = ref<string | null>(null);
const documentError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const formError = ref<string | null>(null); // Erro geral do formulário
const formSuccess = ref<string | null>(null); // Mensagem de sucesso geral

// Função para limpar todos os erros
const clearErrors = () => {
    nameError.value = null;
    documentError.value = null;
    passwordError.value = null;
    formError.value = null;
    formSuccess.value = null;
};

// Carregar dados do usuário se estiver em modo de edição
// watch para reagir a mudanças no ID (útil se o componente for reutilizado para IDs diferentes sem ser desmontado)
// E watch para route.fullPath para forçar recarregamento se o usuário navegar entre /new e /:id/edit sem desmontar
watch([() => props.id, () => route.fullPath], ([newId, _]) => { // Observa o ID e o caminho completo da rota
    clearErrors(); // Limpar erros ao carregar novo usuário/modo
    if (isEditMode.value && newId) {
        const user = userStore.getUserById(newId);
        if (user) {
            // Preencher o formulário com os dados do usuário existente
            formData.value.id = user.id; // Manter o ID para atualização
            formData.value.name = user.name;
            formData.value.document = user.document;
            // Senha não é pré-preenchida por segurança, nem solicitada na edição
            // formData.value.status = user.status; // Status é alterado na listagem
        } else {
            formError.value = 'Usuário não encontrado para edição.';
            // Opcional: Redirecionar de volta para a lista se o usuário não for encontrado
            setTimeout(() => router.push({ name: 'Users' }), 2000);
        }
    } else {
        // Modo de criação: limpar o formulário
        formData.value = { name: '', document: '', password: '' };
    }
}, { immediate: true }); // Executar imediatamente na montagem

const handleSubmit = async () => {
    clearErrors(); // Limpa erros anteriores

    // Validação de campos obrigatórios
    let hasFieldErrors = false;
    if (!formData.value.name) {
        nameError.value = 'O nome é obrigatório.';
        hasFieldErrors = true;
    }
    if (!formData.value.document) {
        documentError.value = 'O documento (CPF) é obrigatório.';
        hasFieldErrors = true;
    }
    // Senha é obrigatória apenas para novos usuários
    if (!isEditMode.value && !formData.value.password) {
        passwordError.value = 'A senha é obrigatória.';
        hasFieldErrors = true;
    }

    if (hasFieldErrors) {
        formError.value = 'Por favor, preencha todos os campos obrigatórios.';
        return;
    }

    // Validação de documento único (apenas se for novo usuário OU se o documento mudou no modo edição)
    const existingUserByDocument = userStore.users.find(
        u => u.document === formData.value.document && u.id !== formData.value.id // Ignora o próprio usuário em edição
    );
    if (existingUserByDocument) {
        documentError.value = 'Este documento (CPF) já está cadastrado.';
        formError.value = 'Falha: Documento já utilizado por outro usuário.';
        return;
    }

    try {
        if (isEditMode.value) {
            // Modo de edição: Chamar updateUser
            if (formData.value.id) { // Garante que o ID exista para update
                const userToUpdate: User = {
                    id: formData.value.id,
                    name: formData.value.name as string,
                    document: formData.value.document as string,
                    password: userStore.getUserById(formData.value.id)?.password || '', // Manter senha existente
                    status: userStore.getUserById(formData.value.id)?.status || 'active', // Manter status existente
                };
                userStore.updateUser(userToUpdate);
                formSuccess.value = 'Funcionário atualizado com sucesso!';
                console.log('Funcionário atualizado:', userToUpdate);
            }
        } else {
            // Modo de cadastro: Chamar addUser
            const newUser: Omit<User, 'id' | 'status'> = {
                name: formData.value.name as string,
                document: formData.value.document as string,
                password: formData.value.password as string,
            };
            userStore.addUser(newUser);
            formSuccess.value = 'Funcionário cadastrado com sucesso!';
            console.log('Novo funcionário cadastrado:', newUser);
            // Limpar formulário após cadastro
            formData.value = { name: '', document: '', password: '' };
        }

        // Redireciona para a lista de usuários após um pequeno atraso
        setTimeout(() => {
            router.push({ name: 'Users' });
        }, 1500); // 1.5 segundos para o usuário ler a mensagem

    } catch (e) {
        console.error("Erro ao salvar funcionário:", e);
        formError.value = 'Ocorreu um erro inesperado ao tentar salvar.';
    }
};
</script>

<style scoped>
/* Adicione estilos específicos se necessário */
</style>