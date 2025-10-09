// Endereço: apps/frontend/src/app/cadastro/medico/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
// MODIFICAÇÃO: Importado AxiosError para tipagem de erro
import axios, { AxiosError } from 'axios';

interface IBGE_UF_Response {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGE_City_Response {
  id: number;
  nome: string;
}

export default function DoctorRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '', crm: '', specialty: '', email: '', phone: '', password: '',
    passwordConfirmation: '', street: '', number: '', neighborhood: '',
    city: '', state: '', zipCode: '', complement: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const [states, setStates] = useState<IBGE_UF_Response[]>([]);
  const [cities, setCities] = useState<IBGE_City_Response[]>([]);

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setStates(response.data);
      });
  }, []);

  // helpers (shared behaviour with patient form)
  const sanitize = (value: string) => value.replace(/<[^>]*>/g, '').trim();
  const onlyDigits = (value: string) => value.replace(/\D/g, '');
  const formatPhone = (value: string) => {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };
  const validateEmail = (email: string) => /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email.trim());

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    setTouched((t) => ({ ...t, [name]: true }));
    const fieldError = validateField(name, (formData as any)[name] || '');
    setFieldErrors((s) => ({ ...s, [name]: fieldError }));
  };

  const validateField = (name: string, value: string) => {
    if (name === 'email') {
      if (!value) return 'E-mail é obrigatório.';
      if (!validateEmail(value)) return 'Formato de e-mail inválido.';
      return null;
    }
    if (name === 'phone') {
      const raw = onlyDigits(value);
      if (!raw) return null; // optional
      if (raw.length > 11) return 'Telefone inválido. Máx 11 dígitos.';
      return null;
    }
    if (name === 'password') {
      if (!value) return 'Senha é obrigatória.';
      if (value.length < 8) return 'Senha deve ter ao menos 8 caracteres.';
      return null;
    }
    if (name === 'passwordConfirmation') {
      if (!value) return 'Confirmação de senha é obrigatória.';
      if (value !== formData.password) return 'As senhas não coincidem.';
      return null;
    }
    if (name === 'name') {
      if (!value) return 'Nome é obrigatório.';
      if (value.length > 120) return 'Nome muito longo.';
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value)) return 'Nome inválido. Use apenas letras e espaços.';
      return null;
    }
    return null;
  };

  useEffect(() => {
    if (formData.state) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`)
        .then(response => {
          setCities(response.data);
        });
    }
  }, [formData.state]);

  const handleCepLookup = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) return;
    setIsCepLoading(true);
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      if (response.data && !response.data.erro) {
        setFormData(prevData => ({
          ...prevData,
          street: response.data.logradouro,
          neighborhood: response.data.bairro,
          city: response.data.localidade,
          state: response.data.uf,
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    let value = (e.target as HTMLInputElement).value;

    if (name === 'phone') {
      value = formatPhone(value);
    }

    if (name === 'name') {
      const withoutTags = value.replace(/<[^>]*>/g, '');
      value = withoutTags.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' \-]/g, '').replace(/\s{2,}/g, ' ').slice(0, 120);
    }

    setFormData({ ...formData, [name]: value });
    if (name === 'zipCode' && value.replace(/\D/g, '').length === 8) {
      handleCepLookup(value);
    }

    const fieldError = validateField(name, value);
    setFieldErrors((s) => ({ ...s, [name]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirmation) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/users', { ...formData, role: 'DOCTOR' });
      router.push('/login?status=success');
    } catch (err) {
      // MODIFICAÇÃO: Tipagem de erro segura, substituindo o 'any'
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string | string[] }>;
        const errorMessage = axiosError.response?.data?.message || 'Ocorreu um erro ao criar a conta.';
        setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputStyles = "mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelStyles = "block text-sm font-medium text-gray-700";

  return (
    <PublicLayout>
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg mb-10">
        <h1 className="text-2xl font-bold text-gray-600 mb-6">Cadastro de Médico(a)</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-blue-500 border-b pb-2 mb-4">Dados da Conta</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className={labelStyles}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} required className={inputStyles}/>
                {touched.email && fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}
              </div>
              <div>
                <label className={labelStyles}>Telefone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={inputStyles}/>
                {touched.phone && fieldErrors.phone && <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>}
              </div>
              <div>
                <label className={labelStyles}>Senha</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} required className={inputStyles}/>
                {touched.password && fieldErrors.password && <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>}
              </div>
              <div>
                <label className={labelStyles}>Confirmar Senha</label>
                <input type="password" name="passwordConfirmation" value={formData.passwordConfirmation} onChange={handleChange} onBlur={handleBlur} required className={inputStyles}/>
                {touched.passwordConfirmation && fieldErrors.passwordConfirmation && <p className="text-sm text-red-600 mt-1">{fieldErrors.passwordConfirmation}</p>}
              </div>
            </div>
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-blue-500 border-b pb-2 mb-4">Perfil Profissional</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div className="md:col-span-3">
                <label className={labelStyles}>Nome Completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} required className={inputStyles}/>
                {touched.name && fieldErrors.name && <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>}
              </div>
              <div className="md:col-span-1">
                <label className={labelStyles}>CRM</label>
                <input type="text" name="crm" value={formData.crm} onChange={handleChange} required className={inputStyles}/>
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Especialidade</label>
                <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className={inputStyles}/>
              </div>
            </div>
          </fieldset>
          
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-blue-500 border-b pb-2 mb-4">Endereço do Consultório</legend>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-2">
              <div className="md:col-span-2 relative">
                <label className={labelStyles}>CEP</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} onBlur={(e) => handleCepLookup(e.target.value)} maxLength={9} className={inputStyles} />
                {isCepLoading && <LoaderCircle className="absolute right-3 top-[34px] h-5 w-5 animate-spin text-gray-400" />}
              </div>
              <div className="md:col-span-1">
                <label className={labelStyles}>Estado</label>
                <select name="state" value={formData.state} onChange={handleChange} className={inputStyles}>
                  <option value="">UF</option>
                  {states.map(state => (
                    <option key={state.id} value={state.sigla}>{state.sigla}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className={labelStyles}>Cidade</label>
                <select name="city" value={formData.city} onChange={handleChange} disabled={!formData.state} className={`${inputStyles} disabled:bg-gray-100`}>
                  <option value="">Selecione um estado</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.nome}>{city.nome}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4">
                <label className={labelStyles}>Rua / Logradouro</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} className={inputStyles}/>
              </div>
               <div className="md:col-span-2">
                <label className={labelStyles}>Número</label>
                <input type="text" name="number" onChange={handleChange} className={inputStyles}/>
              </div>
              <div className="md:col-span-3">
                <label className={labelStyles}>Bairro</label>
                <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} className={inputStyles}/>
              </div>
               <div className="md:col-span-3">
                <label className={labelStyles}>Complemento</label>
                <input type="text" name="complement" value={formData.complement} onChange={handleChange} className={inputStyles}/>
              </div>
            </div>
          </fieldset>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
            {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}