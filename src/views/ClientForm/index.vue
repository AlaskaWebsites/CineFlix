<template>
    <div class="bg-cineflix-dark-gray p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-cineflix-red">
                {{ isEditMode ? 'Editar Cliente' : 'Novo Cliente' }}
            </h1>
        </div>

        <form @submit.prevent="handleSubmit">
            <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
                <div class="flex-1 mb-4 md:mb-0">
                    <label for="firstName" class="block text-cineflix-white text-sm font-bold mb-2">
                        Nome
                    </label>
                    <input type="text" id="firstName" v-model="formData.firstName" autocomplete="given-name"
                        :class="{ 'border-red-500': firstNameError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Primeiro nome" required />
                    <p v-if="firstNameError" class="text-red-500 text-xs italic mt-1">{{ firstNameError }}</p>
                </div>
                <div class="flex-1">
                    <label for="lastName" class="block text-cineflix-white text-sm font-bold mb-2">
                        Sobrenome
                    </label>
                    <input type="text" id="lastName" v-model="formData.lastName" autocomplete="family-name"
                        :class="{ 'border-red-500': lastNameError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Sobrenome" required />
                    <p v-if="lastNameError" class="text-red-500 text-xs italic mt-1">{{ lastNameError }}</p>
                </div>
            </div>

            <div class="mb-4">
                <label for="cpf" class="block text-cineflix-white text-sm font-bold mb-2">
                    CPF
                </label>
                <input type="text" id="cpf" v-model="formData.cpf" autocomplete="off"
                    :class="{ 'border-red-500': cpfError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="000.000.000-00" required />
                <p v-if="cpfError" class="text-red-500 text-xs italic mt-1">{{ cpfError }}</p>
            </div>

            <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
                <div class="flex-1 mb-4 md:mb-0">
                    <label for="email" class="block text-cineflix-white text-sm font-bold mb-2">
                        Email
                    </label>
                    <input type="email" id="email" v-model="formData.email" autocomplete="email"
                        :class="{ 'border-red-500': emailError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="email@exemplo.com" required />
                    <p v-if="emailError" class="text-red-500 text-xs italic mt-1">{{ emailError }}</p>
                </div>
                <div class="flex-1">
                    <label for="phone" class="block text-cineflix-white text-sm font-bold mb-2">
                        Celular
                    </label>
                    <input type="tel" id="phone" v-model="formData.phone" autocomplete="tel"
                        :class="{ 'border-red-500': phoneError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="(99) 99999-9999" required />
                    <p v-if="phoneError" class="text-red-500 text-xs italic mt-1">{{ phoneError }}</p>
                </div>
            </div>

            <div class="mb-4">
                <label for="zipCode" class="block text-cineflix-white text-sm font-bold mb-2">
                    CEP
                </label>
                <div class="flex">
                    <input type="text" id="zipCode" v-model="formData.address!.zipCode" @input="handleZipCodeInput"
                        @blur="handleZipCodeBlur" autocomplete="postal-code" :class="{ 'border-red-500': zipCodeError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline mr-2"
                        placeholder="00000-000" required />
                    <button type="button" @click="searchCep" :disabled="isSearchingCep"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {{ isSearchingCep ? 'Buscando...' : 'Buscar' }}
                    </button>
                </div>
                <p v-if="zipCodeError" class="text-red-500 text-xs italic mt-1">{{ zipCodeError }}</p>
            </div>

            <div class="mb-4">
                <label for="street" class="block text-cineflix-white text-sm font-bold mb-2">
                    Logradouro
                </label>
                <input type="text" id="street" v-model="formData.address!.street" autocomplete="address-line1"
                    :class="{ 'border-red-500': streetError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Rua, Avenida, etc." required />
                <p v-if="streetError" class="text-red-500 text-xs italic mt-1">{{ streetError }}</p>
            </div>

            <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
                <div class="flex-1 mb-4 md:mb-0">
                    <label for="neighborhood" class="block text-cineflix-white text-sm font-bold mb-2">
                        Bairro
                    </label>
                    <input type="text" id="neighborhood" v-model="formData.address!.neighborhood"
                        autocomplete="address-level2" :class="{ 'border-red-500': neighborhoodError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Bairro" required />
                    <p v-if="neighborhoodError" class="text-red-500 text-xs italic mt-1">{{ neighborhoodError }}</p>
                </div>
                <div class="flex-1">
                    <label for="city" class="block text-cineflix-white text-sm font-bold mb-2">
                        Cidade
                    </label>
                    <input type="text" id="city" v-model="formData.address!.city" autocomplete="address-level2"
                        :class="{ 'border-red-500': cityError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Cidade" required />
                    <p v-if="cityError" class="text-red-500 text-xs italic mt-1">{{ cityError }}</p>
                </div>
            </div>

            <div class="mb-6">
                <label for="state" class="block text-cineflix-white text-sm font-bold mb-2">
                    UF (Estado)
                </label>
                <input type="text" id="state" v-model="formData.address!.state" autocomplete="address-level1"
                    :class="{ 'border-red-500': stateError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="UF" maxlength="2" required />
                <p v-if="stateError" class="text-red-500 text-xs italic mt-1">{{ stateError }}</p>
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
                    {{ isEditMode ? 'Salvar Alterações' : 'Cadastrar Cliente' }}
                </button>
            </div>

            <div class="text-center mt-4">
                <router-link to="/dashboard/clients" class="text-blue-400 hover:text-blue-600 text-sm">
                    Voltar para a lista de Clientes
                </router-link>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // <--- Manter useRoute para watch no fullPath
import { useClientStore } from '@/stores/clients';
import { fetchAddressByCep } from '@/services/viacepService';
import type { Client } from '@/types/Client';
import type { ViaCEPAddress } from '@/services/viacepService';

// Props para receber o ID na rota de edição
const props = defineProps<{
    id?: string;
}>();

const router = useRouter();
const route = useRoute(); // <-- Manter esta linha

const clientStore = useClientStore();

// Determina se estamos em modo de edição
const isEditMode = computed(() => !!props.id);

// Estado do formulário
const formData = ref<Partial<Client>>({
    firstName: '',
    lastName: '',
    cpf: '',
    email: '',
    phone: '',
    address: {
        zipCode: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
    },
});

// Mensagens de erro por campo
const firstNameError = ref<string | null>(null);
const lastNameError = ref<string | null>(null);
const cpfError = ref<string | null>(null);
const emailError = ref<string | null>(null);
const phoneError = ref<string | null>(null);
const zipCodeError = ref<string | null>(null);
const streetError = ref<string | null>(null);
const neighborhoodError = ref<string | null>(null);
const cityError = ref<string | null>(null);
const stateError = ref<string | null>(null);

const formError = ref<string | null>(null);
const formSuccess = ref<string | null>(null);
const isSearchingCep = ref(false);

// Função para limpar todos os erros
const clearErrors = () => {
    firstNameError.value = null;
    lastNameError.value = null;
    cpfError.value = null;
    emailError.value = null;
    phoneError.value = null;
    zipCodeError.value = null;
    streetError.value = null;
    neighborhoodError.value = null;
    cityError.value = null;
    stateError.value = null;
    formError.value = null;
    formSuccess.value = null;
};

// Lógica de pré-preenchimento para edição ou limpeza para novo
watch([() => props.id, () => route.fullPath], ([newId, _]) => { // <-- Adicionar route.fullPath aqui
    clearErrors();
    if (isEditMode.value && newId) {
        const client = clientStore.getClientById(newId);
        if (client) {
            formData.value = { ...client };
        } else {
            formError.value = 'Cliente não encontrado para edição.';
            setTimeout(() => router.push({ name: 'Clients' }), 2000);
        }
    } else {
        // Modo de criação: limpar o formulário para valores iniciais
        formData.value = {
            firstName: '',
            lastName: '',
            cpf: '',
            email: '',
            phone: '',
            address: {
                zipCode: '',
                street: '',
                neighborhood: '',
                city: '',
                state: '',
            },
            status: 'active' // Clientes novos são ativos por padrão
        };
    }
}, { immediate: true });

// Lógica de busca de CEP (debounce para evitar muitas chamadas)
let cepSearchTimeout: number | undefined = undefined; // <-- Inicializar com undefined ou 0

const handleZipCodeInput = () => {
    formData.value.address!.zipCode = formData.value.address!.zipCode?.replace(/\D/g, '').slice(0, 8);
    zipCodeError.value = null;
};

const handleZipCodeBlur = () => {
    if (formData.value.address!.zipCode && formData.value.address!.zipCode.length === 8) {
        searchCep();
    }
};

const searchCep = async () => {
    clearTimeout(cepSearchTimeout);

    const cep = formData.value.address!.zipCode;
    if (!cep || cep.length !== 8) {
        zipCodeError.value = 'CEP inválido. Deve conter 8 dígitos.';
        return;
    }

    isSearchingCep.value = true;
    zipCodeError.value = null;
    formError.value = null;

    try {
        const addressData: ViaCEPAddress | null = await fetchAddressByCep(cep);
        if (addressData) {
            if (addressData.erro) {
                zipCodeError.value = 'CEP não encontrado.';
                formError.value = 'CEP não encontrado. Por favor, preencha o endereço manualmente.';
                formData.value.address!.street = '';
                formData.value.address!.neighborhood = '';
                formData.value.address!.city = '';
                formData.value.address!.state = '';
            } else {
                formData.value.address!.street = addressData.logradouro;
                formData.value.address!.neighborhood = addressData.bairro;
                formData.value.address!.city = addressData.localidade;
                formData.value.address!.state = addressData.uf;
                zipCodeError.value = null;
            }
        } else {
            zipCodeError.value = 'Erro ao buscar CEP. Verifique a conexão ou digite manualmente.';
            formError.value = 'Erro ao buscar CEP. Verifique a conexão ou digite manualmente.';
        }
    } catch (e) {
        console.error("Erro na busca de CEP:", e);
        zipCodeError.value = 'Erro ao buscar CEP. Tente novamente.';
        formError.value = 'Erro ao buscar CEP. Tente novamente ou digite manualmente.';
    } finally {
        isSearchingCep.value = false;
    }
};

const handleSubmit = async () => {
    clearErrors();

    let hasFieldErrors = false;
    if (!formData.value.firstName) { firstNameError.value = 'Nome é obrigatório.'; hasFieldErrors = true; }
    if (!formData.value.lastName) { lastNameError.value = 'Sobrenome é obrigatório.'; hasFieldErrors = true; }
    if (!formData.value.cpf) { cpfError.value = 'CPF é obrigatório.'; hasFieldErrors = true; }
    if (!formData.value.email) { emailError.value = 'Email é obrigatório.'; hasFieldErrors = true; }
    if (!formData.value.phone) { phoneError.value = 'Telefone é obrigatório.'; hasFieldErrors = true; }
    if (!formData.value.address!.zipCode) { zipCodeError.value = 'CEP é obrigatório.'; hasFieldErrors = true; }
    if (!formData.value.address!.street) { streetError.value = 'Logradouro é obrigatório.'; hasFieldErrors = true; }
    if (!formData.value.address!.neighborhood) { neighborhoodError.value = 'Bairro é obrigatório.'; hasFieldErrors = true; }
    if (!formData.value.address!.city) { cityError.value = 'Cidade é obrigatória.'; hasFieldErrors = true; }
    if (!formData.value.address!.state) { stateError.value = 'UF é obrigatória.'; hasFieldErrors = true; }

    if (hasFieldErrors) {
        formError.value = 'Por favor, preencha todos os campos obrigatórios.';
        return;
    }

    const existingClientByCpf = clientStore.allClients.find(
        c => c.cpf === formData.value.cpf && c.id !== formData.value.id
    );
    if (existingClientByCpf) {
        cpfError.value = 'Este CPF já está cadastrado.';
        formError.value = 'Falha: CPF já utilizado por outro cliente.';
        return;
    }

    try {
        if (isEditMode.value) {
            if (formData.value.id) {
                const clientToUpdate: Client = {
                    id: formData.value.id,
                    firstName: formData.value.firstName as string,
                    lastName: formData.value.lastName as string,
                    cpf: formData.value.cpf as string,
                    email: formData.value.email as string,
                    phone: formData.value.phone as string,
                    address: {
                        zipCode: formData.value.address!.zipCode as string,
                        street: formData.value.address!.street as string,
                        neighborhood: formData.value.address!.neighborhood as string,
                        city: formData.value.address!.city as string,
                        state: formData.value.address!.state as string,
                    },
                    status: clientStore.getClientById(formData.value.id)?.status || 'active',
                };
                clientStore.updateClient(clientToUpdate);
                formSuccess.value = 'Cliente atualizado com sucesso!';
                console.log('Cliente atualizado:', clientToUpdate);
            }
        } else {
            const newClient: Omit<Client, 'id' | 'status'> = {
                firstName: formData.value.firstName as string,
                lastName: formData.value.lastName as string,
                cpf: formData.value.cpf as string,
                email: formData.value.email as string,
                phone: formData.value.phone as string,
                address: {
                    zipCode: formData.value.address!.zipCode as string,
                    street: formData.value.address!.street as string,
                    neighborhood: formData.value.address!.neighborhood as string,
                    city: formData.value.address!.city as string,
                    state: formData.value.address!.state as string,
                },
            };
            clientStore.addClient(newClient);
            formSuccess.value = 'Cliente cadastrado com sucesso!';
            console.log('Novo cliente cadastrado:', newClient);
            formData.value = {
                firstName: '',
                lastName: '',
                cpf: '',
                email: '',
                phone: '',
                address: {
                    zipCode: '',
                    street: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                },
                status: 'active'
            };
        }

        setTimeout(() => {
            router.push({ name: 'Clients' });
        }, 1500);

    } catch (e) {
        console.error("Erro ao salvar cliente:", e);
        formError.value = 'Ocorreu um erro inesperado ao tentar salvar.';
    }
};
</script>

<style scoped>
/* Adicione estilos específicos se necessário */
</style>