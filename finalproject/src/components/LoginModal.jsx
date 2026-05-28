import { useState } from 'react';

function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 如果 Modal 沒有被開啟，就不渲染任何東西
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 簡單的防呆與驗證 (15% UI體驗)
    if (!username.trim() || !password.trim()) {
      alert('請輸入帳號與密碼！');
      return;
    }

    // 模擬登入驗證（體驗請輸入 123456）
    if (password === '123456') {
      onLogin(username); // 觸發 App.jsx 的登入邏輯
      setUsername('');
      setPassword('');
    } else {
      alert('密碼錯誤！(提示：請輸入 123456)');
    }
  };

  return (
    // 整個螢幕的黑色半透明背景遮罩
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      {/* 彈出視窗白底本體 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '320px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'relative'
      }}>
        <h3 style={{ marginTop: 0, textAlign: 'center', marginBottom: '20px' }}>🔐 會員登入</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>使用者帳號：</label>
            <input 
              type="text" 
              placeholder="請輸入帳號 (任意名稱)" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>密碼：</label>
            <input 
              type="password" 
              placeholder="請輸入密碼 (體驗請打 123456)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* 💡 這裡已經將「取消」與「登入」按鈕順序對調 */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              type="submit" 
              style={{ flex: 1, padding: '10px', border: 'none', backgroundColor: '#479df9', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              登入
            </button>
            <button 
              type="button" 
              onClick={onClose}
              style={{ flex: 1, padding: '10px', border: 'none', backgroundColor: '#ffbd72', borderRadius: '4px', cursor: 'pointer' }}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;