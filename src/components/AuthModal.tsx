import { useState } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: { id: string; email: string; full_name: string }, token: string) => void;
}

type Mode = 'login' | 'register';

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [pdpAgreed, setPdpAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const inp = "w-full rounded-xl border border-grey-200 bg-grey-50 px-4 py-3 font-onest text-sm placeholder:text-grey-500 focus:outline-none focus:border-blue focus:bg-white transition-all";
  const lbl = "block font-onest text-xs font-medium text-grey-500 uppercase tracking-wider mb-1.5";

  const baseUrl = func2url['auth'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && !pdpAgreed) {
      setError('Необходимо согласие на обработку персональных данных');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body = mode === 'login'
        ? { action: 'login', email, password }
        : { action: 'register', email, password, full_name: fullName, pdp_agreed: pdpAgreed };

      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      onSuccess(data.user, data.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grey-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-grey-200">
          <div>
            <h2 className="font-syne font-bold text-grey-900 text-2xl">
              {mode === 'login' ? 'Вход' : 'Регистрация'}
            </h2>
            <p className="font-onest text-sm text-grey-500 mt-0.5">
              {mode === 'login' ? 'Войдите в личный кабинет' : 'Создайте аккаунт бесплатно'}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-grey-100 text-grey-500 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className={lbl}>Имя</label>
              <input
                className={inp}
                placeholder="Иван Иванов"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className={lbl}>Email *</label>
            <input
              required
              type="email"
              className={inp}
              placeholder="ivan@mail.ru"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={lbl}>Пароль *</label>
            <div className="relative">
              <input
                required
                type={showPass ? 'text' : 'password'}
                className={`${inp} pr-11`}
                placeholder={mode === 'register' ? 'Минимум 6 символов' : '••••••••'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-900 transition-colors"
              >
                <Icon name={showPass ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <button
                type="button"
                onClick={() => setPdpAgreed(v => !v)}
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  pdpAgreed ? 'bg-blue border-blue' : 'border-grey-200'
                }`}
              >
                {pdpAgreed && <Icon name="Check" size={11} className="text-white" />}
              </button>
              <span className="font-onest text-sm text-grey-500 leading-relaxed">
                Я согласен на{' '}
                <a href="#" className="text-blue underline" onClick={e => e.stopPropagation()}>
                  обработку персональных данных
                </a>{' '}
                в соответствии с 152-ФЗ
              </span>
            </label>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl">
              <Icon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0" />
              <p className="font-onest text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (mode === 'register' && !pdpAgreed)}
            className="w-full py-3.5 rounded-full bg-blue text-white font-onest font-medium shadow-blue hover:bg-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            <Icon name={loading ? 'Loader' : (mode === 'login' ? 'LogIn' : 'UserPlus')} size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Подождите...' : (mode === 'login' ? 'Войти' : 'Создать аккаунт')}
          </button>
        </form>

        <div className="px-7 pb-7 text-center">
          <span className="font-onest text-sm text-grey-500">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          </span>
          <button onClick={switchMode} className="font-onest text-sm text-blue font-medium hover:underline">
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}