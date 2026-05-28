import { useState, useEffect, useMemo } from 'react';
import TransactionForm from './components/TransactionForm';
import BudgetTracker from './components/BudgetTracker';
import LoginModal from './components/LoginModal'; 
import ExpenseChart from './components/ExpenseChart'; 

function App() {
  // --- 狀態與 LocalStorage 邏輯 ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? Number(saved) : 10000;
  });

  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // 登入狀態管理
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || null; 
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 💡 看板輪播索引：0 表示預算控制中心（內含教練），1 表示消費排行榜
  const [blockIndex, setBlockIndex] = useState(1);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
  }, [budget]);

  // --- 登入與登出處理 ---
  const handleLogin = (username) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // --- 帳目新增與刪除 ---
  const handleAddTransaction = (newRecord) => {
    setTransactions((prev) => [newRecord, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  // --- 資料篩選與財務交叉計算 (useMemo 優化效能) ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      // 💡 核心安全鎖：如果這筆資料不完整或沒有日期，就直接跳過，防止整顆 React 樹當機黑畫面
      if (!item || !item.date) return false;
      const matchMonth = item.date.startsWith(selectedMonth);
      const matchCategory = selectedCategory === '全部' || item.category === selectedCategory;
      return matchMonth && matchCategory;
    });
  }, [transactions, selectedMonth, selectedCategory]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((item) => item && item.type === '支出')
      .reduce((sum, item) => sum + Number(item.amount), 0);
  }, [filteredTransactions]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((item) => item && item.type === '收入')
      .reduce((sum, item) => sum + Number(item.amount), 0);
  }, [filteredTransactions]);

  // 💡 左右按鈕切換看板邏輯（在 0 與 1 之間循環）
  const handlePrevBlock = () => {
  setBlockIndex((prev) => (prev === 0 ? 1 : 1));
};

// 💡 按右箭頭：如果是 1（預算）就變成 0（排行）；如果是 0（排行）就前進 1（預算）
const handleNextBlock = () => {
  setBlockIndex((prev) => (prev === 1 ? 0 : 0));
};

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* 頂部導覽列：右上角登入按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px 18px', borderRadius: '20px', backgroundColor: '#e6f4ea', color: '#137333', fontWeight: 'bold', border: '1px solid #ceead6' }}>
              👤 {currentUser}
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}>
              登出
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsLoginModalOpen(true)} 
            style={{ padding: '8px 20px', borderRadius: '20px', backgroundColor: '#f1f3f5', color: '#495057', border: '1px solid #ced4da', fontWeight: 'bold', cursor: 'pointer' }}
          >
            👤 訪客 (點擊登入)
          </button>
        )}
      </div>

      <h1 style={{ textAlign: 'center', fontWeight: '500', letterSpacing: '1px', color: '#fff' }}>🪙  隨手記  | Finance Tracker </h1>

      {/* 💡 修正關鍵：將 padding 改為 '20px 55px'，讓上下有固定的安全間距，並確保箭頭抓到的是卡片的真正中線 */}
      <div style={{ position: 'relative', margin: '10px 0', padding: '20px 55px' }}>
        
        {/* 左切換箭頭 */}
        <button 
          onClick={handlePrevBlock}
          style={{ 
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)', 
            background: '#424242', 
            color: '#fff',
            border: '1px solid #ccc', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            cursor: 'pointer', 
            fontSize: '18px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 10 
          }}
        >
          ❮
        </button>

        {/* 中央動態看板內容 */}
        <div style={{ width: '100%', boxSizing: 'border-box', minHeight: '260px' }}>
          {blockIndex === 0 ? (
            // 💡 消費排行榜動態比例條（零套件安全版）
            <ExpenseChart transactions={filteredTransactions} />
          ) : (
            // 💡 預算控制中心（內部已封裝嵌入了 FinanceCoach 理財教練與個別預算子頁面）
            <BudgetTracker 
              budget={budget} 
              setBudget={setBudget} 
              totalExpense={totalExpense} 
              transactions={filteredTransactions}
            />
          )}
        </div>

        {/* 右切換箭頭 */}
        <button 
          onClick={handleNextBlock}
          style={{ 
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)', 
            background: '#424242', 
            color: '#fff',
            border: '1px solid #ccc', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            cursor: 'pointer', 
            fontSize: '18px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 10 
          }}
        >
          ❯
        </button>
      </div>

      <hr style={{ margin: '30px 0' }} />

      {/* 下方左右對分区块 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* 左側：記帳輸入表單 */}
        <div>
          <h3>新增帳目</h3>
          <TransactionForm onAdd={handleAddTransaction} />
        </div>

        {/* 右側：歷史明細與條件篩選 */}
        <div>
          <h3>歷史紀錄</h3>
          
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)} 
            />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="全部">全部分類</option>
              <option value="飲食">飲食</option>
              <option value="娛樂">娛樂</option>
              <option value="交通">交通</option>
              <option value="薪水">薪水</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
            <span style={{ color: 'green' }}>總收入: ${totalIncome}</span>
            <span style={{ color: 'red' }}>總支出: ${totalExpense}</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredTransactions.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center' }}>本月尚無此分類的記帳紀錄</p>
            ) : (
              filteredTransactions.map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                  <div>
                    <span style={{ 
                      backgroundColor: item.type === '收入' ? '#e6f4ea' : '#fce8e6', 
                      color: item.type === '收入' ? 'green' : 'red', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      marginRight: '10px', 
                      fontSize: '12px' 
                    }}>{item.category}</span>
                    <strong>{item.remark || '未備註'}</strong>
                    <div style={{ fontSize: '12px', color: '#888' }}>{item.date}</div>
                  </div>
                  <div>
                    <span style={{ color: item.type === '收入' ? 'green' : 'red', fontWeight: 'bold', marginRight: '15px' }}>
                      {item.type === '收入' ? '+' : '-'}${item.amount}
                    </span>
                    <button 
                      onClick={() => handleDeleteTransaction(item.id)} 
                      style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '3px 8px' }}
                    >
                      刪除
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* 登入彈出視窗 */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
}

export default App;