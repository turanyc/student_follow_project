import React, { useState } from 'react';
import { X, ShieldCheck, Building2, CreditCard, FileText, Receipt, Code, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: '1. Yasal Şirket Kurulumu & Vergi Altyapısı',
    icon: Building2,
    color: '#38bdf8',
    summary: 'Türkiye içinde online ödeme almak ve abonelik satmak için vergi mükellefi olmak yasal zorunluluktur.',
    content: [
      'Türkiye sınırları içerisinde mesafeli satış yapabilmek için Şahıs Şirketi, Limited Şirket veya Anonim Şirket sahibi olmalısınız.',
      'Şahıs şirketi bir muhasebeci yardımıyla veya interaktif vergi dairesi üzerinden 1-2 gün içinde kurulabilir ve maliyeti en düşük seçenektir.',
      'Gerekli belgeler: Vergi Levhası, İmza Sirküleri/Beyannamesi, Ticaret/Esnaf Odası Kayıt Belgesi ve Şirket adına açılmış Ticari Banka Hesabı (IBAN).'
    ]
  },
  {
    id: 2,
    title: '2. Sanal POS & Abonelik (Recurring) Servisi Seçimi',
    icon: CreditCard,
    color: '#10b981',
    summary: 'Aylık 900 TL otomatik yenileme (subscription) için BDDK lisanslı doğru ödeme kuruluşunu seçme.',
    content: [
      'İyzico ile Ödeme & Abonelik API (Önerilen): Türkiye’nin en gelişmiş abonelik altyapısına sahiptir. Müşterinin kartını güvenle saklar ve her ayın aynı günü 900 TL veya yıllık 9.000 TL çekimi otomatik yapar. Başvuru ortalama 24-48 saatte onaylanır.',
      'PayTR Tekrar Eden Ödeme: Düşük komisyon oranları (ort. %2.5 - %3.5) ve ertesi iş günü ödeme avantajıyla tercih edilir.',
      'Param / Sipay / Vallet: Alternatif yerli sanal POS çözümleri. Komisyon ve ödeme vadelerine göre karşılaştırma yapılabilir.',
      'Stripe (Atlas ile Yurt Dışı): Eğer sadece Türkiye değil, küresel çapta yabancı öğrencilere de satış yapılacaksa ABD/İngiltere şirketi kurarak Stripe kullanılabilir.'
    ]
  },
  {
    id: 3,
    title: '3. Hukuki Sözleşmeler & ETBİS Uyumluluğu',
    icon: FileText,
    color: '#f472b6',
    summary: 'Müşteri güvenliği ve Ticaret Bakanlığı denetimleri için siteye eklenmesi gereken zorunlu yasal metinler.',
    content: [
      'Mesafeli Satış Sözleşmesi & Ön Bilgilendirme Formu: Ödeme sayfasında (Checkout) müşterinin onay kutucuğunu (checkbox) işaretlemesi yasal zorunluluktur. Bu sözleşmede paket bedelinin (900 TL / 9.000 TL) ve hizmet içeriğinin net tanımlanması gerekir.',
      'KVKK Aydınlatma Metni & Gizlilik Politikası: Öğrenci ve koç verilerinin (telefon, e-posta, sınav sonuçları) nasıl korunduğuna dair beyan.',
      'İptal, İade ve Abonelik Fesih Koşulları: Tüketici Kanunu gereği kullanıcı, aboneliğini istediği ay iptal edebilmeli ve bir sonraki ay çekim yapılmamalıdır.',
      'ETBİS Kaydı: Ticaret Bakanlığı’nın Elektronik Ticaret Bilgi Sistemi’ne (etbis.eticaret.gov.tr) sitenizin adresi ve şirket bilgilerinizle kayıt olunmalıdır.'
    ]
  },
  {
    id: 4,
    title: '4. e-Fatura / e-Arşiv Entegrasyonu',
    icon: Receipt,
    color: '#eab308',
    summary: 'Tahsil edilen her ödeme sonrasında müşteriye resmî faturanın otomatik kesilip e-postayla gönderilmesi.',
    content: [
      'İyzico veya PayTR üzerinden başarılı bir tahsilat (ör. 900 TL) gerçekleştiğinde, sistemin otomatik fatura oluşturması zaman kazandırır.',
      'Paraşüt, BirFatura, BizimHesap veya Sovos gibi ön muhasebe ve e-Fatura sağlayıcılarının API entegrasyonları kurulur.',
      'Webhook sayesinde ödeme onaylandığı an fatura PDF olarak oluşturulur ve öğrencinin/velinin e-posta adresine "EduKoç PRO - VİP Koçluk Faturanız" başlığıyla iletilir.'
    ]
  },
  {
    id: 5,
    title: '5. Teknik Mimari: React & Firebase Webhook Entegrasyonu',
    icon: Code,
    color: '#8b5cf6',
    summary: 'Ödeme güvenliği için Secret Key saklama kuralları, Ödeme formu başlatma ve Firestore yetki güncellenmesi.',
    content: [
      'KRİTİK GÜVENLİK KURALI: İyzico veya PayTR API Gizli Anahtarı (Secret Key) asla React (Frontend) kodları içine yazılmaz! Mutlaka bir Backend (Firebase Cloud Functions veya Node.js / Express sunucusu) kullanılmalıdır.',
      'Adım A (Ödeme Formu Başlatma): Kullanıcı "VİP Paketi Al" butonuna bastığında React, Firebase Cloud Function\'a istek atar. Backend, İyzico API ile görüşüp bir Ödeme Formu Iframe Token dönüp ekranda açar.',
      'Adım B (Webhook / Bildirim): Ödeme 3D Secure ile başarıyla tamamlandığında İyzico, sunucunuzdaki webhook adresine (`/api/iyzico-webhook`) anlık bildirim gönderir.',
      'Adım C (Firestore Güncelleme): Webhook endpoint\'imiz ödemenin doğruluğunu kontrol eder ve Firebase Firestore\'daki kullanıcı dokümanını anında günceller: `plan: "vip_pro"`, `status: "active"`, `billingCycle: "monthly"`, `expiresAt: ...`',
      'Adım D (Anlık VİP Erişimi): React frontend\'imiz Firestore\'daki bu değişikliği real-time algılar, öğrencinin efsanevi ağaçlarını ve koç randevu modülünü saniyesinde açar!'
    ]
  },
  {
    id: 6,
    title: '6. Sandbox Testi & Canlı Yayına (Production) Geçiş',
    icon: CheckCircle2,
    color: '#06b6d4',
    summary: 'Gerçek para çekilmeden önce simülasyon ortamında tüm akışların hatasız çalışıp çalışmadığının test edilmesi.',
    content: [
      'İyzico / PayTR Sandbox (Test) paneli üzerinden sağlanan test kart numaraları (ör. 4111 1111 1111 1111) ile denemeler yapılır.',
      'Başarılı ödeme, yetersiz bakiye, hatalı SMS kodu, abonelik iptali ve yenileme senaryoları simüle edilir.',
      'Testler başarıyla geçtikten sonra İyzico panelinden "Canlı Ortam (Production)" anahtarları alınır ve Node.js environment (.env) değişkenleri güncellenerek aktif satışa başlanır!'
    ]
  }
];

const PaymentRoadmapModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(1);
  const currentStep = steps.find(s => s.id === activeTab);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(5, 8, 16, 0.85)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%', maxWidth: 1000, maxHeight: '90vh',
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
        border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 28,
        boxShadow: '0 30px 100px rgba(0,0,0,0.8), 0 0 50px rgba(99,102,241,0.2)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        position: 'relative', color: 'white'
      }}>
        
        {/* Modal Top Bar */}
        <div style={{
          padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                Türkiye Online Ödeme & Abonelik Altyapısı Yol Haritası
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                Aylık 900 TL & Yıllık 9.000 TL Paket satışı için geçilmesi gereken 6 yasal ve teknik aşama
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 40, height: 40, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Body: Left Step Selector, Right Content Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', flex: 1, overflow: 'hidden' }}>
          
          {/* Left: Step Selector Accordion / List */}
          <div style={{
            background: 'rgba(11, 15, 25, 0.6)', borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem'
          }} className="custom-scrollbar">
            {steps.map((s) => {
              const IconC = s.icon;
              const isSelected = activeTab === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  style={{
                    padding: '1rem', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
                    background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'transparent',
                    border: `1.5px solid ${isSelected ? s.color : 'rgba(255, 255, 255, 0.05)'}`,
                    display: 'flex', alignItems: 'flex-start', gap: '0.85rem'
                  }}
                  onMouseOver={e => !isSelected && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                  onMouseOut={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: `${s.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color,
                    flexShrink: 0
                  }}>
                    <IconC size={18} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.92rem', fontWeight: 800, color: isSelected ? 'white' : '#cbd5e1' }}>
                      {s.title}
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {s.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Content View */}
          <div style={{ padding: '2.5rem 3rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="custom-scrollbar">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{
                  padding: '0.35rem 0.85rem', borderRadius: 8, background: `${currentStep.color}20`,
                  color: currentStep.color, fontWeight: 800, fontSize: '0.8rem', border: `1px solid ${currentStep.color}40`
                }}>
                  ADIM {currentStep.id} / 6
                </span>
                <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>
                  {currentStep.title}
                </h4>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.6)', padding: '1.2rem 1.5rem', borderRadius: 16,
                borderLeft: `4px solid ${currentStep.color}`, marginBottom: '2rem'
              }}>
                <p style={{ margin: 0, fontSize: '1rem', color: '#cbd5e1', fontWeight: 600, lineHeight: 1.6 }}>
                  {currentStep.summary}
                </p>
              </div>

              <h5 style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                UYGULAMA DETAYLARI VE DİKKAT EDİLMESİ GEREKENLER:
              </h5>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentStep.content.map((point, index) => (
                  <div key={index} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.02)', padding: '1rem 1.25rem', borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <CheckCircle2 size={20} color={currentStep.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Step Navigation Bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                disabled={activeTab === 1}
                onClick={() => setActiveTab(prev => Math.max(1, prev - 1))}
                style={{
                  padding: '0.65rem 1.25rem', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.04)', color: activeTab === 1 ? '#475569' : 'white',
                  fontWeight: 700, fontSize: '0.88rem', cursor: activeTab === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ← Önceki Adım
              </button>

              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                {activeTab === 6 ? 'Tüm Aşamalar Tamamlandı 🎉' : `Adım ${activeTab} / 6`}
              </span>

              {activeTab < 6 ? (
                <button
                  onClick={() => setActiveTab(prev => Math.min(6, prev + 1))}
                  style={{
                    padding: '0.65rem 1.4rem', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white',
                    fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  <span>Sonraki Adım</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  style={{
                    padding: '0.65rem 1.4rem', borderRadius: 12, border: 'none',
                    background: '#10b981', color: '#064e3b',
                    fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  Rehberi Kapat & İncelemeye Devam Et
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentRoadmapModal;
