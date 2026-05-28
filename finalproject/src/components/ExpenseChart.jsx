import { useMemo } from 'react';

function ExpenseChart({ transactions = [] }) {
  // 1. 計算各分類的總支出，以及當月的總支出大計
  const { leaderboard, totalExpense } = useMemo(() => {
    const expenses = transactions.filter((item) => item && item.type === '支出');
    
    // 計算總支出
    const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    // 分類統計金額
    const categoryMap = {};
    expenses.forEach((item) => {
      if (item.category && item.amount) {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + Number(item.amount);
      }
    });

    // 轉換成陣列並從「金額大到小」排序
    const sortedList = Object.keys(categoryMap)
      .map((key) => ({
        name: key,
        amount: categoryMap[key],
      }))
      .sort((a, b) => b.amount - a.amount);

    return { leaderboard: sortedList, totalExpense: total };
  }, [transactions]);

  // 如果沒有支出資料，顯示友善提示
  if (leaderboard.length === 0) {
    return (
      <div style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#888', border: '1px solid #eee', marginBottom: '20px', fontSize: '14px' }}>
        本月尚無支出數據，暫無排行榜分析
      </div>
    );
  }

  // 定義能量條的顏色庫（由前到後輪流使用）
  const BAR_COLORS = ['#4285f4', '#34a853', '#fbbc05', '#ea4335', '#a142f4', '#24c1e0'];

  return (
    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #eee' }}>
      <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: '#333' }}>當月消費分類排行榜</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {leaderboard.map((item, index) => {
          // 計算各分類佔總支出的百分比
          const percentage = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
          const barColor = BAR_COLORS[index % BAR_COLORS.length];

          return (
            <div key={item.name}>
              {/* 文字資訊列 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>
                <span>
                  <span style={{ color: '#888', marginRight: '5px' }}>#{index + 1}</span>
                  {item.name}
                </span>
                <span style={{ color: '#555' }}>
                  ${item.amount} <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal' }}>({percentage.toFixed(1)}%)</span>
                </span>
              </div>

              {/* 外殼灰色槽 */}
              <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '4px', height: '12px', overflow: 'hidden' }}>
                {/* 內部彩色比例條 */}
                <div style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: barColor, 
                  height: '100%', 
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out' // 💡 新增酷炫的動態長出效果
                }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExpenseChart;