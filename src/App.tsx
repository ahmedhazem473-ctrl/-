import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, ArrowRight, CheckCircle2, LogOut, RotateCcw, Clock, User, Users } from 'lucide-react';

const botDictionary: Record<string, Record<string, string>> = {
  'أ': { boy: 'أحمد', girl: 'أمل', plant: 'أرز', animal: 'أسد', object: 'أريكة', country: 'أمريكا' },
  'ب': { boy: 'باسم', girl: 'بسمة', plant: 'بصل', animal: 'بطة', object: 'باب', country: 'باريس' },
  'ت': { boy: 'تامر', girl: 'تالا', plant: 'تفاح', animal: 'تمساح', object: 'تلفاز', country: 'تركيا' },
  'ث': { boy: 'ثابت', girl: 'ثريا', plant: 'ثوم', animal: 'ثعلب', object: 'ثلاجة', country: 'ثيساليا' },
  'ج': { boy: 'جمال', girl: 'جميلة', plant: 'جزر', animal: 'جمل', object: 'جرس', country: 'جامايكا' },
  'ح': { boy: 'حسام', girl: 'حنان', plant: 'حمص', animal: 'حصان', object: 'حائط', country: 'حلب' },
  'خ': { boy: 'خالد', girl: 'خديجة', plant: 'خس', animal: 'خروف', object: 'خاتم', country: 'خوارزم' },
  'د': { boy: 'داوود', girl: 'دينا', plant: 'دراق', animal: 'دب', object: 'دراجة', country: 'دنمارك' },
  'ذ': { boy: 'ذاكر', girl: 'ذكرى', plant: 'ذرة', animal: 'ذئب', object: 'ذهب', country: 'ذي قار' },
  'ر': { boy: 'رامي', girl: 'رانيا', plant: 'رمان', animal: 'راكون', object: 'راديو', country: 'روسيا' },
  'ز': { boy: 'زياد', girl: 'زينة', plant: 'زيتون', animal: 'زرافة', object: 'زجاج', country: 'زمبابوي' },
  'س': { boy: 'سالم', girl: 'سارة', plant: 'سبانخ', animal: 'سمكة', object: 'ساعة', country: 'سوريا' },
  'ش': { boy: 'شادي', girl: 'شيرين', plant: 'شمام', animal: 'شبل', object: 'شباك', country: 'شيلي' },
  'ص': { boy: 'صالح', girl: 'صفاء', plant: 'صبار', animal: 'صقر', object: 'صاروخ', country: 'صومال' },
  'ض': { boy: 'ضياء', girl: 'ضحى', plant: 'ضرم', animal: 'ضفدع', object: 'ضرس', country: 'ضبا' },
  'ط': { boy: 'طارق', girl: 'طاهرة', plant: 'طماطم', animal: 'طاووس', object: 'طاولة', country: 'طوكيو' },
  'ظ': { boy: 'ظافر', girl: 'ظريفة', plant: 'ظل', animal: 'ظبي', object: 'ظرف', country: 'ظفار' },
  'ع': { boy: 'عمر', girl: 'علياء', plant: 'عنب', animal: 'عصفور', object: 'عجلة', country: 'عراق' },
  'غ': { boy: 'غسان', girl: 'غادة', plant: 'غار', animal: 'غراب', object: 'غسالة', country: 'غانا' },
  'ف': { boy: 'فادي', girl: 'فاطمة', plant: 'فراولة', animal: 'فيل', object: 'فانوس', country: 'فرنسا' },
  'ق': { boy: 'قاسم', girl: 'قمر', plant: 'قرنبيط', animal: 'قرد', object: 'قلم', country: 'قطر' },
  'ك': { boy: 'كريم', girl: 'كوثر', plant: 'كرز', animal: 'كلب', object: 'كرسي', country: 'كندا' },
  'ل': { boy: 'لؤي', girl: 'ليلى', plant: 'ليمون', animal: 'لبوة', object: 'لوحة', country: 'لبنان' },
  'م': { boy: 'محمد', girl: 'مريم', plant: 'موز', animal: 'ماعز', object: 'مكتب', country: 'مصر' },
  'ن': { boy: 'نادر', girl: 'نور', plant: 'نعناع', animal: 'نمر', object: 'نظارة', country: 'نرويج' },
  'ه': { boy: 'هاني', girl: 'هند', plant: 'هيل', animal: 'هدهد', object: 'هاتف', country: 'هند' },
  'و': { boy: 'وليد', girl: 'وفاء', plant: 'ورد', animal: 'وطواط', object: 'ورقة', country: 'واشنطن' },
  'ي': { boy: 'ياسر', girl: 'ياسمين', plant: 'يقطين', animal: 'يمامة', object: 'يخت', country: 'يابان' }
};

const arabicLetters = Object.keys(botDictionary);

type GameState = 'SPLASH' | 'JOIN_CREATE' | 'WAITING_ROOM' | 'LETTER_REVEAL' | 'GAMEPLAY' | 'RESULTS';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('SPLASH');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [generatedRoomCode, setGeneratedRoomCode] = useState('');
  const [currentLetter, setCurrentLetter] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  
  const [answers, setAnswers] = useState({
    boy: '',
    girl: '',
    plant: '',
    animal: '',
    object: '',
    country: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const submitToGoogleSheets = async () => {
    const fatmaAnswers = botDictionary[currentLetter] || botDictionary['أ'];
    
    const payload = {
      player: {
        boy: answers.boy || '',
        girl: answers.girl || '',
        plant: answers.plant || '',
        animal: answers.animal || '',
        object: answers.object || '',
        country: answers.country || ''
      },
      fatma: {
        boy: fatmaAnswers.boy || '',
        girl: fatmaAnswers.girl || '',
        plant: fatmaAnswers.plant || '',
        animal: fatmaAnswers.animal || '',
        object: fatmaAnswers.object || '',
        country: fatmaAnswers.country || ''
      },
      letter: currentLetter
    };

    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbx_AJ8uj9j87U1fFB8zNNk1jNDXQtsRgQh6PFm2VM_GtwDzBr5cZyGQL2QVGaynGJTiEw/exec';
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
    }
  };

  const handleFinishGame = () => {
    setGameState('RESULTS');
    submitToGoogleSheets();
  };

  useEffect(() => {
    if (gameState === 'SPLASH') {
      const timer = setTimeout(() => setGameState('JOIN_CREATE'), 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState === 'GAMEPLAY' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (gameState === 'GAMEPLAY' && timeLeft === 0) {
      handleFinishGame();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, timeLeft]);

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setErrorMsg('الرجاء إدخال اسمك');
      return;
    }
    if (!roomCode.trim()) {
      setErrorMsg('الرجاء إدخال كود الغرفة');
      return;
    }
    const validCodes = ['8349', '9870', '3678', '9836', '5248', '6759', '7539', '5635'];
    if (validCodes.includes(roomCode)) {
      startGame();
    } else {
      setErrorMsg('عفوا لا يوجد غرفة بهذا الكود');
    }
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setErrorMsg('الرجاء إدخال اسمك أولاً');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedRoomCode(code);
    setGameState('WAITING_ROOM');
  };

  const startGame = () => {
    const randomLetter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
    setCurrentLetter(randomLetter);
    setAnswers({ boy: '', girl: '', plant: '', animal: '', object: '', country: '' });
    setTimeLeft(180);
    setGameState('LETTER_REVEAL');
    
    setTimeout(() => {
      setGameState('GAMEPLAY');
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleInputChange = (field: keyof typeof answers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const renderScreen = () => {
    switch (gameState) {
      case 'SPLASH':
        return (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="flex flex-col items-center justify-center h-full space-y-6"
          >
            <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform rotate-12">
              <span className="text-6xl">🏃‍♂️</span>
            </div>
            <h1 className="text-5xl font-black text-white drop-shadow-lg tracking-tight">سباق الكلمات</h1>
            <div className="flex space-x-2 rtl:space-x-reverse mt-4">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        );

      case 'JOIN_CREATE':
        return (
          <motion.div
            key="join"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-indigo-900">مرحباً بك!</h2>
              <p className="text-indigo-600/80">أدخل بياناتك للبدء في اللعب</p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-center text-sm font-medium"
              >
                {errorMsg}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                  <User size={16} />
                  اسم اللاعب
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="اكتب اسمك هنا..."
                  className="w-full px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-indigo-900 placeholder-indigo-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                  <Users size={16} />
                  كود الغرفة
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="ادخل الكود"
                  className="w-full px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-indigo-900 placeholder-indigo-300 text-center text-xl tracking-widest"
                  maxLength={4}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-center text-indigo-400 font-medium">يجب ادخال اسمك و كود الغرفة</p>
                <button
                  onClick={handleJoinRoom}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play size={20} />
                  انضمام للغرفة
                </button>
              </div>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-indigo-100"></div>
                <span className="flex-shrink-0 mx-4 text-indigo-300 text-sm">أو</span>
                <div className="flex-grow border-t border-indigo-100"></div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-center text-indigo-400 font-medium">يجب ادخال اسمك</p>
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-bold py-4 rounded-xl border-2 border-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus size={20} />
                  إنشاء غرفة جديدة
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'WAITING_ROOM':
        return (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-indigo-900">غرفة الانتظار</h2>
              <p className="text-indigo-600/80">شارك هذا الكود مع صديقك</p>
            </div>

            <div className="py-8 px-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 border-dashed">
              <span className="text-6xl font-black text-indigo-600 tracking-[0.2em]">{generatedRoomCode}</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-indigo-900 font-medium animate-pulse">جاري انتظار انضمام الخصم...</p>
            </div>

            <button
              onClick={() => setGameState('JOIN_CREATE')}
              className="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-bold py-4 rounded-xl border-2 border-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ArrowRight size={20} />
              الرجوع للخلف
            </button>
          </motion.div>
        );

      case 'LETTER_REVEAL':
        return (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <h2 className="text-3xl font-bold text-white drop-shadow-md">الحرف المختار هو</h2>
            <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center">
              <span className="text-8xl font-black text-indigo-600">{currentLetter}</span>
            </div>
            <p className="text-white/80 text-lg animate-pulse">استعد...</p>
          </motion.div>
        );

      case 'GAMEPLAY':
        return (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 space-y-6 max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                  {currentLetter}
                </div>
                <div>
                  <p className="text-xs text-indigo-400 font-semibold">الحرف</p>
                  <p className="text-sm font-bold text-indigo-900">ابدأ بـ {currentLetter}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className={`flex items-center gap-2 text-xl font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`}>
                  <Clock size={20} />
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-indigo-400 font-semibold">الوقت المتبقي</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { id: 'boy', label: 'اسم ولد', icon: '👦' },
                { id: 'girl', label: 'اسم بنت', icon: '👧' },
                { id: 'plant', label: 'نبات', icon: '🌿' },
                { id: 'animal', label: 'حيوان', icon: '🦁' },
                { id: 'object', label: 'جماد', icon: '🪑' },
                { id: 'country', label: 'بلاد', icon: '🌍' },
              ].map((field) => (
                <div key={field.id} className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-xl">{field.icon}</span>
                  </div>
                  <input
                    type="text"
                    value={answers[field.id as keyof typeof answers]}
                    onChange={(e) => handleInputChange(field.id as keyof typeof answers, e.target.value)}
                    placeholder={field.label}
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-indigo-900 font-medium"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleFinishGame}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCircle2 size={20} />
              انتهيت
            </button>
          </motion.div>
        );

      case 'RESULTS':
        const fatmaAnswers = botDictionary[currentLetter] || botDictionary['أ'];
        
        return (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 space-y-8 max-h-[95dvh] overflow-y-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-indigo-900">النتائج</h2>
              <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-lg">
                حرف {currentLetter}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player Results */}
              <div className="bg-indigo-50 rounded-2xl p-5 border-2 border-indigo-100">
                <div className="flex items-center gap-3 mb-6 border-b border-indigo-100 pb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-indigo-900">{playerName}</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { id: 'boy', label: 'ولد' },
                    { id: 'girl', label: 'بنت' },
                    { id: 'plant', label: 'نبات' },
                    { id: 'animal', label: 'حيوان' },
                    { id: 'object', label: 'جماد' },
                    { id: 'country', label: 'بلاد' },
                  ].map((field) => (
                    <div key={field.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                      <span className="text-sm font-semibold text-indigo-400">{field.label}</span>
                      <span className={`font-bold ${answers[field.id as keyof typeof answers] ? 'text-indigo-900' : 'text-red-400'}`}>
                        {answers[field.id as keyof typeof answers] || '---'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fatma Results */}
              <div className="bg-pink-50 rounded-2xl p-5 border-2 border-pink-100">
                <div className="flex items-center gap-3 mb-6 border-b border-pink-100 pb-4">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-pink-900">Fatma</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { id: 'boy', label: 'ولد' },
                    { id: 'girl', label: 'بنت' },
                    { id: 'plant', label: 'نبات' },
                    { id: 'animal', label: 'حيوان' },
                    { id: 'object', label: 'جماد' },
                    { id: 'country', label: 'بلاد' },
                  ].map((field) => (
                    <div key={field.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                      <span className="text-sm font-semibold text-pink-400">{field.label}</span>
                      <span className="font-bold text-pink-900">
                        {fatmaAnswers[field.id as keyof typeof fatmaAnswers]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw size={20} />
                العب مرة أخرى
              </button>
              
              <button
                onClick={() => setGameState('JOIN_CREATE')}
                className="bg-white hover:bg-red-50 text-red-500 font-bold py-4 rounded-xl border-2 border-red-100 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <LogOut size={20} />
                خروج
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div dir="rtl" className="min-h-[100dvh] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 font-sans selection:bg-indigo-200">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
}
