import { useState } from 'react';

function TransactionForm({ onAdd }) {
  const [type, setType] = useState('支出');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('飲食');
  const [customCategory, setCustomCategory] = useState(''); // 💡 新增：儲存使用者自訂的分類名稱
  const [date, setDate] = useState('2026-05-25');
  const [remark, setRemark] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 基本錯誤處理/防呆
    if (!amount || Number(amount) <= 0) {
      alert('請輸入大於 0 的有效金額！');
      return;
    }

    // 💡 判斷分類：如果選了「其他」，就使用自訂輸入框的值；如果自訂輸入框是空的，就預設叫「其他」
    let finalCategory = category;
    if (category === '其他') {
      finalCategory = customCategory.trim() ? customCategory.trim() : '其他';
    }

    // 建立新資料物件
    const newRecord = {
      id: Date.now().toString(),
      type,
      amount: Number(amount),
      category: finalCategory, // 💡 寫入最終判斷的分類
      date,
      remark
    };

    // 傳回給 App.jsx
    onAdd(newRecord);

    // 清空表單金額、備註與自訂分類
    setAmount('');
    setRemark('');
    setCustomCategory('');
  };

  // 當切換收入/支出時，重置分類預設值
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === '支出' ? '飲食' : '薪水');
    setCustomCategory(''); // 切換時也清空自訂欄位
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
      {/* 💡 恢復原樣：類型這一行完全不加額外的對齊外殼 */}
      <div>
        <button type="button" onClick={() => handleTypeChange('收入')} style={{ backgroundColor: type === '收入' ? 'green' : '#ccc', color: 'white', marginRight: '5px' , border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>收入</button>
        <button type="button" onClick={() => handleTypeChange('支出')} style={{ backgroundColor: type === '支出' ? 'red' : '#ccc', color: 'white', marginRight: '5px', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>支出</button>
      </div>

      {/* 💡 金額：標籤改為 block 並靠左對齊 */}
      <div>
        <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px' }}>金額：</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="請輸入金額" style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }} />
      </div>

      {/* 💡 分類：標籤改為 block 並靠左對齊 */}
      <div>
        <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px' }}>分類：</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }}>
          {type === '支出' ? (
            <>
              <option value="飲食">飲食</option>
              <option value="娛樂">娛樂</option>
              <option value="交通">交通</option>
              <option value="其他">其他...</option>
            </>
          ) : (
            <>
              <option value="薪水">薪水</option>
              <option value="獎金">獎金</option>
              <option value="其他">其他...</option>
            </>
          )}
        </select>
      </div>

      {/* 💡 【新功能】條件渲染：只有當選擇「其他」時，才會顯示底下的輸入框 */}
      {category === ' '}
      {category === '其他' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
          {/* 💡 自訂分類標籤：也同步改為 block 並靠左對齊 */}
          <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontSize: '14px', color: '#555' }}>請輸入自訂分類名稱：</label>
          <input 
            type="text" 
            value={customCategory} 
            onChange={(e) => setCustomCategory(e.target.value)} 
            placeholder="例如：醫療、貓咪罐頭" 
            style={{ width: '100%', padding: '5px', boxSizing: 'border-box', border: '1px solid #ffa500', borderRadius: '4px' }} 
          />
        </div>
      )}

      {/* 💡 日期：標籤改為 block 並靠左對齊 */}
      <div>
        <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px' }}>日期：</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }} />
      </div>

      {/* 💡 備註：標籤改為 block 並靠左對齊 */}
      <div>
        <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px' }}>備註：</label>
        <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="例如：午餐吃麥當勞" style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }} />
      </div>

      <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px' }}>
        記一筆
      </button>
    </form>
  );
}

export default TransactionForm;