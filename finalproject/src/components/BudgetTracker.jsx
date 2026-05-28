import { useState, useEffect } from 'react';
import FinanceCoach from './FinanceCoach';

function BudgetTracker({ budget, setBudget, totalExpense, transactions = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputBudget, setInputBudget] = useState(budget);

  // 💡 【全新內部狀態】控制預算中心裡面的「子分頁」
  // 'total' = 總預算中心與教練 ; 'categories' = 個別分類預算
  const [subPage, setSubPage] = useState('total');

  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    const saved = localStorage.getItem('categoryBudgets');
    return saved ? JSON.parse(saved) : { 飲食: 3000, 娛樂: 2000, 交通: 1500, 其他: 1500 };
  });

  useEffect(() => {
    localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  // 財務計算
  const remaining = budget - totalExpense;
  const percent = budget > 0 ? (totalExpense / budget) * 100 : 0;
  const barWidth = Math.min(percent, 100);

  // 分類實際花費計算
  const categoryExpenses = { 飲食: 0, 娛樂: 0, 交通: 0, 其他: 0 };
  const currentMonthExpenses = transactions.filter(item => item && item.type === '支出');
  currentMonthExpenses.forEach(item => {
    if (categoryExpenses[item.category] !== undefined) {
      categoryExpenses[item.category] += Number(item.amount || 0);
    }
  });

  const handleSave = () => {
    const num = Number(inputBudget);
    if (isNaN(num) || num <= 0) {
      alert('請輸入有效的預算金額！');
      return;
    }
    setBudget(num);
    setIsEditing(false);
  };

  const handleCategoryBudgetChange = (cat, val) => {
    setCategoryBudgets(prev => ({ ...prev, [cat]: Number(val) || 0 }));
  };

  return (
    <div style={{ width: '100%' }}>
      
      {/* 📝 分頁一：總預算中心 + AI 教練 */}
      {subPage === 'total' && (
        <div style={{ position: 'relative' }}>
          {/* 💡 右下角隱藏一個精緻的進階按鈕，引導去下一頁 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
            <div>
              <h3 style={{ margin: 0, display: 'inline-block', marginRight: '15px' }}>💰 本月預算</h3>
              {isEditing ? (
                <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    value={inputBudget} 
                    onChange={(e) => setInputBudget(e.target.value)}
                    style={{ width: '90px', padding: '2px 5px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <button onClick={handleSave} style={{ padding: '2px 8px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#52c41a', color: '#fff', border: 'none', borderRadius: '4px' }}>儲存</button>
                  <button onClick={() => setIsEditing(false)} style={{ padding: '2px 8px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '4px' }}>取消</button>
                </div>
              ) : (
                <span 
                  onClick={() => { setIsEditing(true); setInputBudget(budget); }} 
                  style={{ fontSize: '12px', color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  設定預算
                </span>
              )}
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                剩餘可用: <span style={{ fontWeight: 'bold', color: percent > 100 ? '#ff4d4f' : percent >= 90 ? '#c97f69' : percent >= 70 ? '#ffd279': percent >= 50 ? '#97bdff' : '#8fbe78', marginLeft: '5px' }}>${remaining}</span>
              </p>
            </div>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#999999' }}>${budget}</span>
            </div>
          </div>

          {/* 總進度條 */}
          <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '5px', height: '20px', overflow: 'hidden', marginBottom: '25px' }}>
            <div style={{ width: `${barWidth}%`, backgroundColor: percent > 100 ? '#ff4d4f' : percent >= 90 ? '#d84315' : percent >= 70 ? '#faad14': percent >= 50 ?'#1a73e8' : '#52c41a', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>

          {/* AI 理財教練 */}
          <FinanceCoach budget={budget} totalExpense={totalExpense} isAdvancedMode={true} categoryBudgets={categoryBudgets} categoryExpenses={categoryExpenses} />
          
          {/* ➔ 切換至個別預算按鈕 */}
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button 
              onClick={() => setSubPage('categories')} 
              style={{ background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
            >
              查看各類別個別預算 ➔
            </button>
          </div>
        </div>
      )}

      {/* 📝 分頁二：個別分類預算管理 */}
      {subPage === 'categories' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>各類別預算上限</h3>
            <button 
              onClick={() => setSubPage('total')} 
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}
            >
              ⬅ 返回總預算中心
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
            {Object.keys(categoryBudgets).map((cat) => {
              const catExpense = categoryExpenses[cat] || 0;
              const catBudget = categoryBudgets[cat] || 0;
              const isOver = catExpense > catBudget;
              const catPercent = Math.min((catExpense / (catBudget || 1)) * 100, 100);

              return (
                <div key={cat} style={{ fontSize: '13px', color: '#333', background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #e8e8e8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{cat}支出</span>
                    <span style={{ color: isOver ? '#ff4d4f' : '#666', fontSize: '12px' }}>
                      ${catExpense} / 
                      <input 
                        type="number" 
                        value={catBudget} 
                        onChange={(e) => handleCategoryBudgetChange(cat, e.target.value)}
                        style={{ width: '60px', marginLeft: '5px', fontSize: '12px', padding: '2px', textAlign: 'center', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </span>
                  </div>
                  {/* 分類小進度條 */}
                  <div style={{ width: '100%', backgroundColor: '#eee', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${catPercent}%`, 
                      backgroundColor: isOver ? '#ff4d4f' : '#1890ff', 
                      height: '100%',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      )}

    </div>
  );
}

export default BudgetTracker;