import { useMemo } from 'react';

function FinanceCoach({ budget, totalExpense, isAdvancedMode = false, categoryBudgets = {}, categoryExpenses = {} }) {
  
  const coachData = useMemo(() => {
    const remaining = budget - totalExpense;
    const percent = budget > 0 ? (remaining / budget) * 100 : 0;

    let status = '';
    let emoji = '';
    let comment = '';
    let bgColor = '';
    let textColor = '';

    // 基礎大總體預算判斷
    if (remaining < 0) {
      status = '預算刷爆・破產危機';
      emoji = '🚨❌';
      comment = '慘不忍睹！總預算已經被你刷爆了。請立刻放下你準備清空購物車的手，接下來的日子需要認真考慮省吃儉用了。你現在的可用預算已經是負數了，這意味著你正在透支未來的生存基金！請摸著自己的良心捫心自問：下個月的信用卡帳單你真的付得出來嗎？請立刻進入財務宵禁狀態，除了生存必需品，其餘一律不准再刷卡！';
      bgColor = '#fce8e6';
      textColor = '#c5221f';
    } else if (percent <= 10) { // 💡 新增：最緊急的 10% 警報，必須放在最上層
      status = '極度危急・全面吃土';
      emoji = '☠️🍂';
      comment = '天啊！你的剩餘預算已經低於 10% 了！這不是吃緊，這是準備吃土的節奏！請立刻啟動極簡生存模式！你距離全面破產只剩下一線之隔，任何一筆突如其來的意外開銷都會直接把你推下懸崖！現在開始請自動切換成「出家人生活模式」。月底前的唯一目標就是活著，只要能呼吸就好，不要再對你的錢包進行任何肉體傷害了！';
      bgColor = '#fbe9e7'; // 更深一點的警告橘紅底
      textColor = '#d84315'; // 焦慮感十足的深橘紅字
    } else if (percent <= 30) {
      status = '錢包吃緊・紅色警報';
      emoji = '⚠️💸';
      comment = '警報！你的錢包正在裝呼吸器！剩餘預算低於 30% 了。答應我，接下來眼神自動避開任何手搖杯和網購好嗎？';
      bgColor = '#fef7e0';
      textColor = '#b06000';
    } else if (percent <= 50) {
      status = '穩定控制・繼續保持';
      emoji = '⚖️☕';
      comment = '表現平平，算你過關。目前花費還在控制內，但切記不要因為一時的「犒賞自己」就破功囉。';
      bgColor = '#e8f0fe';
      textColor = '#1a73e8';
    } else {
      status = '理財大師・財務健康';
      emoji = '🌟💰';
      comment = '太優秀了！你節省得像個理財奇才。目前的總預算非常充裕，保持這個節奏，月底就能存下一大筆錢！';
      bgColor = '#e6f4ea';
      textColor = '#137333';
    }

    // 💡 亮點功能：如果啟動了進階分類預算，教練會追加「精準抓戰犯」小語
    let advancedAlert = '';
    if (isAdvancedMode) {
      const overCategories = [];
      Object.keys(categoryBudgets).forEach((cat) => {
        if ((categoryExpenses[cat] || 0) > (categoryBudgets[cat] || 0)) {
          overCategories.push(cat);
        }
      });
      if (overCategories.length > 0) {
        advancedAlert += ` \n注意！偵測到個別分類 【${overCategories.join('、')}】 已經超出你設定的單項上限囉！`;
      }
    }

    return { remaining, percent, status, emoji, comment: comment + advancedAlert, bgColor, textColor };
  }, [budget, totalExpense, isAdvancedMode, categoryBudgets, categoryExpenses]);

  return (
    <div style={{ 
      background: coachData.bgColor, 
      color: coachData.textColor, 
      padding: '15px', 
      borderRadius: '8px', 
      border: `1px solid ${coachData.textColor}40`, 
      minHeight: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <h4 style={{ margin: 0, fontSize: '15px' }}>
          {coachData.emoji} AI 理財教練 {coachData.emoji}
        </h4>
        <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#fff', padding: '1px 8px', borderRadius: '12px' }}>
          {coachData.status}
        </span>
      </div>
      
      <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', fontWeight: '500', whiteSpace: 'pre-line' }}>
        「{coachData.comment}」
      </p>
      
      <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8, textAlign: 'right' }}>
        預算剩餘比例：{coachData.percent.toFixed(1)}% (餘額 ${coachData.remaining})
      </div>
    </div>
  );
}

export default FinanceCoach;