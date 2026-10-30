import React, { useState, useEffect } from 'react';
import { ArrowUp, Delete, Send, Sparkles, CheckCheck, Smile } from 'lucide-react';
import { sound } from '../utils/audio';

interface VirtualKeyboardProps {
  targetText?: string;
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetText = '',
  onSend,
  disabled = false,
  placeholder = 'Ketik pesan...',
}) => {
  const [currentText, setCurrentText] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isTypingAuto, setIsTypingAuto] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<'abc' | '123' | 'emoji'>('abc');
  const [isShift, setIsShift] = useState(false);

  // Reset text when targetText changes
  useEffect(() => {
    setCurrentText('');
    setIsTypingAuto(false);
  }, [targetText]);

  const handleKeyPress = (char: string) => {
    if (disabled) return;
    sound.playKeyboardClick();
    setActiveKey(char);
    setTimeout(() => setActiveKey(null), 120);

    if (targetText) {
      // Advance by next character of target text
      if (currentText.length < targetText.length) {
        setCurrentText(targetText.slice(0, currentText.length + 1));
      }
    } else {
      setCurrentText((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    sound.playKeyboardClick();
    setCurrentText((prev) => prev.slice(0, -1));
  };

  // Instant full-fill typing feature ("Ketik Penuh")
  const handleFullType = () => {
    if (!targetText || disabled) return;
    sound.playKeyboardClick();
    setCurrentText(targetText);
  };

  const handleAutoType = () => {
    if (!targetText || isTypingAuto) return;
    setIsTypingAuto(true);
    let index = currentText.length;
    const interval = setInterval(() => {
      if (index < targetText.length) {
        index++;
        setCurrentText(targetText.slice(0, index));
        const key = targetText[index - 1]?.toUpperCase() || ' ';
        setActiveKey(key);
        sound.playKeyboardClick();
        setTimeout(() => setActiveKey(null), 80);
      } else {
        clearInterval(interval);
        setIsTypingAuto(false);
      }
    }, 45);
  };

  const handleSend = () => {
    if (!currentText.trim() || disabled) return;
    sound.playMessageSent();
    onSend(currentText);
    setCurrentText('');
  };

  const isReadyToSend = targetText ? currentText.length >= targetText.length : currentText.trim().length > 0;

  // Real physical keyboard listener
  useEffect(() => {
    if (disabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Backspace') {
        handleBackspace();
        e.preventDefault();
      } else if (e.key === 'Enter') {
        if (isReadyToSend) {
          handleSend();
        } else if (targetText) {
          handleFullType();
        }
        e.preventDefault();
      } else if (e.key === ' ') {
        handleKeyPress(' ');
        e.preventDefault();
      } else if (e.key.length === 1) {
        handleKeyPress(e.key);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentText, targetText, disabled, isReadyToSend]);

  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const numRow1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const numRow2 = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'];
  const numRow3 = ['.', ',', '?', '!', "'", '#', '%', '*', '+', '='];

  const emojis = ['🥰', '😭', '🤣', '🥺', '🍿', '🦦', '🦐', '🤍', '👀', '💀', '🔥', '✨', '📸', '💕', '😡', '😴', '🙄', '👍', '🙏', '❤️'];

  return (
    <div className="w-full bg-[#d1d5db]/90 backdrop-blur-md border-t border-gray-300 dark:bg-[#1c1c1e]/95 dark:border-gray-800 transition-colors select-none pb-2 pt-1 px-1">
      {/* Target hint, Ketik Penuh & Auto Type buttons */}
      {targetText && (
        <div className="px-2 py-1 mb-1 flex items-center justify-between text-xs bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
          <div className="truncate flex-1 mr-2 text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-blue-500 mr-1">Balas:</span>
            <span>"{targetText}"</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleFullType}
              disabled={currentText.length >= targetText.length}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium active:scale-95 transition text-[11px] disabled:opacity-50 shadow-xs cursor-pointer"
              title="Isi penuh teks secara instan"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Ketik Penuh</span>
            </button>
            <button
              onClick={handleAutoType}
              disabled={isTypingAuto || currentText.length >= targetText.length}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 active:scale-95 transition text-[11px] disabled:opacity-50 cursor-pointer"
              title="Ketikkan otomatis huruf demi huruf"
            >
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Otomatis</span>
            </button>
          </div>
        </div>
      )}

      {/* Input bar preview */}
      <div className="flex items-center gap-2 px-2 py-1.5 mb-1.5 bg-white dark:bg-[#2c2c2e] rounded-full border border-gray-300 dark:border-gray-700 shadow-sm">
        <div className="flex-1 px-2 text-sm text-gray-900 dark:text-white min-h-[22px] flex items-center overflow-x-auto whitespace-nowrap">
          {currentText ? (
            <span>
              {currentText}
              <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 align-middle animate-pulse" />
            </span>
          ) : (
            <span className="text-gray-400 text-xs italic">{placeholder}</span>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={!isReadyToSend || disabled}
          className={`p-1.5 rounded-full transition flex items-center justify-center cursor-pointer ${
            isReadyToSend
              ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-90 shadow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          title="Kirim Pesan"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 px-0.5 text-gray-900 dark:text-white text-base font-normal">
        {keyboardMode === 'emoji' ? (
          /* Emoji Grid */
          <div className="grid grid-cols-5 gap-1.5 p-1 h-32 overflow-y-auto bg-black/5 dark:bg-black/20 rounded-xl">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleKeyPress(emoji)}
                className="h-10 text-xl bg-white dark:bg-[#3a3a3c] rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#48484a] active:scale-95 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          /* ABC or 123 Character Grid */
          <>
            {/* Row 1 */}
            <div className="flex justify-center gap-1">
              {(keyboardMode === '123' ? numRow1 : row1).map((char) => (
                <button
                  key={char}
                  onClick={() => handleKeyPress(char)}
                  className={`flex-1 h-10 rounded-md shadow-sm flex items-center justify-center font-medium transition active:scale-95 ${
                    activeKey === char
                      ? 'bg-blue-500 text-white transform -translate-y-1'
                      : 'bg-white dark:bg-[#3a3a3c] hover:bg-gray-100 dark:hover:bg-[#48484a]'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex justify-center gap-1 px-2">
              {(keyboardMode === '123' ? numRow2 : row2).map((char) => (
                <button
                  key={char}
                  onClick={() => handleKeyPress(char)}
                  className={`flex-1 h-10 rounded-md shadow-sm flex items-center justify-center font-medium transition active:scale-95 ${
                    activeKey === char
                      ? 'bg-blue-500 text-white transform -translate-y-1'
                      : 'bg-white dark:bg-[#3a3a3c] hover:bg-gray-100 dark:hover:bg-[#48484a]'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>

            {/* Row 3 */}
            <div className="flex justify-between gap-1">
              <button
                onClick={() => {
                  sound.playTap();
                  setIsShift((prev) => !prev);
                }}
                className={`w-10 h-10 rounded-md flex items-center justify-center shadow-sm text-sm transition ${
                  isShift ? 'bg-white text-black font-bold' : 'bg-[#abb0ba] dark:bg-[#2b2b2c]'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              {(keyboardMode === '123' ? numRow3 : row3).map((char) => (
                <button
                  key={char}
                  onClick={() => handleKeyPress(char)}
                  className={`flex-1 h-10 rounded-md shadow-sm flex items-center justify-center font-medium transition active:scale-95 ${
                    activeKey === char
                      ? 'bg-blue-500 text-white transform -translate-y-1'
                      : 'bg-white dark:bg-[#3a3a3c] hover:bg-gray-100 dark:hover:bg-[#48484a]'
                  }`}
                >
                  {char}
                </button>
              ))}
              <button
                onClick={handleBackspace}
                className="w-10 h-10 bg-[#abb0ba] dark:bg-[#2b2b2c] rounded-md flex items-center justify-center shadow-sm text-sm active:scale-95 cursor-pointer"
                title="Hapus"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Row 4 (Bottom controls) */}
        <div className="flex justify-between gap-1 pt-0.5">
          <button
            onClick={() => {
              sound.playTap();
              setKeyboardMode((prev) => (prev === '123' ? 'abc' : '123'));
            }}
            className="px-2.5 h-10 bg-[#abb0ba] dark:bg-[#2b2b2c] rounded-md text-xs font-semibold shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition"
          >
            {keyboardMode === '123' ? 'ABC' : '123'}
          </button>
          <button
            onClick={() => {
              sound.playTap();
              setKeyboardMode((prev) => (prev === 'emoji' ? 'abc' : 'emoji'));
            }}
            className={`px-2.5 h-10 rounded-md text-base shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition ${
              keyboardMode === 'emoji'
                ? 'bg-blue-500 text-white'
                : 'bg-[#abb0ba] dark:bg-[#2b2b2c]'
            }`}
          >
            😊
          </button>
          <button
            onClick={() => handleKeyPress(' ')}
            className={`flex-1 h-10 rounded-md shadow-sm text-xs font-medium uppercase tracking-wider flex items-center justify-center transition active:scale-98 cursor-pointer ${
              activeKey === ' '
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-[#3a3a3c] hover:bg-gray-100 dark:hover:bg-[#48484a]'
            }`}
          >
            spasi
          </button>
          <button
            onClick={handleSend}
            disabled={!isReadyToSend}
            className={`px-3.5 h-10 rounded-md font-semibold text-xs shadow-sm transition active:scale-95 flex items-center justify-center cursor-pointer ${
              isReadyToSend
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-[#abb0ba] dark:bg-[#2b2b2c] text-gray-500 cursor-not-allowed'
            }`}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
