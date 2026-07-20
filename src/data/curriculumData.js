// ── KAPSAMLI ÖSYM & SINAV MÜFREDATLARI VE SIK ÇIKAN KONULAR VERİTABANI ──
// Bu dosya hem OsymCurriculum.jsx hem de CoachDashboard.jsx tarafından kullanılır.

export const CURRICULUM_DATA = {
  YKS: {
    TYT: [
      { id: 'tyt_m1', subject: 'Matematik', name: 'Temel Kavramlar ve Sayı Kümeleri', isFrequent: false },
      { id: 'tyt_m2', subject: 'Matematik', name: 'Sayı Basamakları ve Çözümleme', isFrequent: false },
      { id: 'tyt_m3', subject: 'Matematik', name: 'Bölme ve Bölünebilme Kuralları', isFrequent: false },
      { id: 'tyt_m4', subject: 'Matematik', name: 'Asal Sayılar ve EBOB - EKOK', isFrequent: false },
      { id: 'tyt_m5', subject: 'Matematik', name: 'Rasyonel ve Ondalık Sayılar', isFrequent: false },
      { id: 'tyt_m6', subject: 'Matematik', name: 'Basit Eşitsizlikler ve Sıralama', isFrequent: false },
      { id: 'tyt_m7', subject: 'Matematik', name: 'Mutlak Değer', isFrequent: true, note: 'Her yıl kesin 1 soru gelir.' },
      { id: 'tyt_m8', subject: 'Matematik', name: 'Üslü Sayılar ve İşlemler', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_m9', subject: 'Matematik', name: 'Köklü Sayılar', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_m10', subject: 'Matematik', name: 'Çarpanlara Ayırma ve Özdeşlikler', isFrequent: false },
      { id: 'tyt_m11', subject: 'Matematik', name: 'Oran ve Orantı', isFrequent: true, note: 'Problemlerin temel anahtarıdır.' },
      { id: 'tyt_m12', subject: 'Matematik', name: 'Sayı, Kesir ve Yaş Problemleri', isFrequent: true, note: '🔥 Her yıl en az 5-6 soru gelir!' },
      { id: 'tyt_m13', subject: 'Matematik', name: 'İşçi, Hareket ve Hız Problemleri', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'tyt_m14', subject: 'Matematik', name: 'Yüzde, Kar-Zarar ve Karışım Problemleri', isFrequent: true, note: '🔥 Her yıl 3-4 soru.' },
      { id: 'tyt_m15', subject: 'Matematik', name: 'Grafik, Tablo ve Rutin Olmayan Problemler', isFrequent: true, note: 'ÖSYM yeni nesilde çok sever.' },
      { id: 'tyt_m16', subject: 'Matematik', name: 'Kümeler ve Kümelerde İşlemler', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_m17', subject: 'Matematik', name: 'Mantık', isFrequent: true, note: 'Her yıl 1 soru gelir.' },
      { id: 'tyt_m18', subject: 'Matematik', name: 'Fonksiyonlar', isFrequent: true, note: '🔥 TYT ve AYT ortak, en az 2 soru!' },
      { id: 'tyt_m19', subject: 'Matematik', name: 'Polinomlar (TYT Giriş)', isFrequent: false },
      { id: 'tyt_m20', subject: 'Matematik', name: 'Permütasyon ve Kombinasyon', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_m21', subject: 'Matematik', name: 'Olasılık', isFrequent: true, note: '🔥 Her yıl kesin 1 veya 2 soru gelir.' },
      { id: 'tyt_m22', subject: 'Matematik', name: 'Veri ve İstatistik (Mod, Medyan)', isFrequent: true, note: 'Her yıl 1 soru gelir.' },
      { id: 'tyt_g1', subject: 'Geometri', name: 'Doğruda ve Üçgende Açılar', isFrequent: true },
      { id: 'tyt_g2', subject: 'Geometri', name: 'Dik Üçgen ve Özel Üçgenler', isFrequent: true, note: 'Tüm geometrinin temelidir.' },
      { id: 'tyt_g3', subject: 'Geometri', name: 'Üçgende Alan ve Benzerlik', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_g4', subject: 'Geometri', name: 'Çokgenler ve Dörtgenler', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'tyt_g5', subject: 'Geometri', name: 'Katı Cisimler (Prizma, Silindir vb.)', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      { id: 'tyt_t1', subject: 'Türkçe', name: 'Sözcükte Anlam ve Söz Öbekleri', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'tyt_t2', subject: 'Türkçe', name: 'Cümlede Anlam ve Yorumlama', isFrequent: true, note: 'Her yıl 3-4 soru.' },
      { id: 'tyt_t3', subject: 'Türkçe', name: 'Paragrafta Ana Düşünce ve Yardımcı Düşünceler', isFrequent: true, note: '🔥 TYT Türkçe\'nin kalbi! (14-16 Soru)' },
      { id: 'tyt_t4', subject: 'Türkçe', name: 'Paragrafta Yapı, Akış ve Akışı Bozan Cümle', isFrequent: true, note: '🔥 Her yıl 6-8 soru.' },
      { id: 'tyt_t5', subject: 'Türkçe', name: 'Ses Bilgisi (Ünlü/Ünsüz Olayları)', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_t6', subject: 'Türkçe', name: 'Yazım Kuralları', isFrequent: true, note: '🔥 Her yıl 2 soru!' },
      { id: 'tyt_t7', subject: 'Türkçe', name: 'Noktalama İşaretleri', isFrequent: true, note: '🔥 Her yıl 2 soru!' },
      { id: 'tyt_t8', subject: 'Türkçe', name: 'Sözcük Türleri (İsim, Sıfat, Zamir, Zarf, Edat, Bağlaç)', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_t9', subject: 'Türkçe', name: 'Fiiller, Ek Fiil ve Fiilimsi', isFrequent: false },
      { id: 'tyt_t10', subject: 'Türkçe', name: 'Cümlenin Ögeleri', isFrequent: true, note: 'Her yıl 1 soru gelir.' },
      { id: 'tyt_t11', subject: 'Türkçe', name: 'Anlatım Bozuklukları', isFrequent: false },
      { id: 'tyt_f1', subject: 'Fizik', name: 'Fizik Bilimine Giriş', isFrequent: false },
      { id: 'tyt_f2', subject: 'Fizik', name: 'Madde ve Özellikleri (Özkütle, Dayanıklılık)', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_f3', subject: 'Fizik', name: 'Hareket ve Kuvvet (Newton Kanunları)', isFrequent: true, note: '🔥 Her yıl 1-2 soru.' },
      { id: 'tyt_f4', subject: 'Fizik', name: 'İş, Güç ve Enerji', isFrequent: true, note: 'Her yıl 1 soru gelir.' },
      { id: 'tyt_f5', subject: 'Fizik', name: 'Isı, Sıcaklık ve Genleşme', isFrequent: true, note: '🔥 Her yıl banko 1 soru!' },
      { id: 'tyt_f6', subject: 'Fizik', name: 'Elektrostatik ve Elektrik Akımı', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_f7', subject: 'Fizik', name: 'Optik (Aynalar, Kırılma, Mercekler)', isFrequent: true, note: '🔥 Her yıl kesin 2 soru gelir!' },
      { id: 'tyt_f8', subject: 'Fizik', name: 'Dalgalar ve Ses Bilgisi', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_k1', subject: 'Kimya', name: 'Kimya Bilimi ve Güvenlik', isFrequent: false },
      { id: 'tyt_k2', subject: 'Kimya', name: 'Atom ve Periyodik Sistem', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_k3', subject: 'Kimya', name: 'Kimyasal Türler Arası Etkileşimler', isFrequent: true, note: '🔥 Her yıl kesin 1 soru gelir.' },
      { id: 'tyt_k4', subject: 'Kimya', name: 'Maddenin Halleri', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_k5', subject: 'Kimya', name: 'Kimya Kanunları ve Mol Kavramı', isFrequent: false },
      { id: 'tyt_k6', subject: 'Kimya', name: 'Karışımlar ve Ayırma Yöntemleri', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_k7', subject: 'Kimya', name: 'Asitler, Bazlar ve Tuzlar', isFrequent: true, note: '🔥 Her yıl 1 soru gelir.' },
      { id: 'tyt_k8', subject: 'Kimya', name: 'Kimya Her Yerde (Temizlik, Polymer vb.)', isFrequent: false },
      { id: 'tyt_b1', subject: 'Biyoloji', name: 'Canlıların Ortak Özellikleri ve Temel Bileşenler', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_b2', subject: 'Biyoloji', name: 'Hücre Yapısı ve Organelleri', isFrequent: true, note: '🔥 Her yıl kesin 1 soru gelir.' },
      { id: 'tyt_b3', subject: 'Biyoloji', name: 'Canlıların Sınıflandırılması ve Alem Bilgisi', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_b4', subject: 'Biyoloji', name: 'Hücre Bölünmeleri (Mitoz ve Mayoz)', isFrequent: true, note: '🔥 Her yıl 1 soru.' },
      { id: 'tyt_b5', subject: 'Biyoloji', name: 'Kalıtım ve Soy Ağaçları', isFrequent: true, note: '🔥 Her yıl banko 1-2 soru!' },
      { id: 'tyt_b6', subject: 'Biyoloji', name: 'Ekosistem Ekolojisi ve Güncel Çevre Sorunları', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_tr1', subject: 'Tarih', name: 'Tarih ve Zaman', isFrequent: false },
      { id: 'tyt_tr2', subject: 'Tarih', name: 'İlk ve Orta Çağlarda Türk Dünyası', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_tr3', subject: 'Tarih', name: 'Türk-İslam Devletleri (Selçuklular vb.)', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_tr4', subject: 'Tarih', name: 'Osmanlı Devleti Kuruluş ve Yükselme Dönemi', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_tr5', subject: 'Tarih', name: 'Osmanlı Devleti Dağılma Dönemi ve XX. Yüzyıl', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_tr6', subject: 'Tarih', name: 'Milli Mücadele ve Atatürk İnkılapları', isFrequent: true, note: '🔥 Her yıl kesin 1-2 soru!' },
      { id: 'tyt_c1', subject: 'Coğrafya', name: 'Doğa, İnsan ve Coğrafi Koordinatlar', isFrequent: false },
      { id: 'tyt_c2', subject: 'Coğrafya', name: 'Dünya\'nın Şekli ve Hareketleri', isFrequent: false },
      { id: 'tyt_c3', subject: 'Coğrafya', name: 'Harita Bilgisi ve İzohipsler', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_c4', subject: 'Coğrafya', name: 'İklim Bilgisi ve Türkiye\'nin İklimi', isFrequent: true, note: '🔥 Her yıl kesin 1 soru gelir.' },
      { id: 'tyt_c5', subject: 'Coğrafya', name: 'İç ve Dış Kuvvetler', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_c6', subject: 'Coğrafya', name: 'Nüfus, Yerleşme ve Göç', isFrequent: true, note: '🔥 Her yıl 1 soru.' },
      { id: 'tyt_c7', subject: 'Coğrafya', name: 'Doğal Afetler ve Çevre', isFrequent: true, note: '🔥 Her yıl kesin 1 soru banko!' },
      { id: 'tyt_fl1', subject: 'Felsefe & Din Kültürü', name: 'Bilgi, Varlık ve Ahlak Felsefesi', isFrequent: true, note: 'Her yıl 2-3 soru.' },
      { id: 'tyt_fl2', subject: 'Felsefe & Din Kültürü', name: 'Din Kültürü: Temel İnanç ve İbadetler', isFrequent: true, note: 'Her yıl 3-4 soru.' }
    ],
    AYT: [
      { id: 'ayt_m1', subject: 'Matematik', name: 'Polinomlar (İleri Düzey)', isFrequent: true, note: '🔥 Her yıl 1-2 zorlayıcı soru.' },
      { id: 'ayt_m2', subject: 'Matematik', name: 'İkinci Dereceden Denklemler ve Eşitsizlikler', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'ayt_m3', subject: 'Matematik', name: 'Parabol', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'ayt_m4', subject: 'Matematik', name: 'Trigonometri', isFrequent: true, note: '🔥 AYT\'nin yıldızı! Her yıl 4-5 soru!' },
      { id: 'ayt_m5', subject: 'Matematik', name: 'Logaritma ve Üslü Fonksiyonlar', isFrequent: true, note: '🔥 Her yıl banko 2-3 soru.' },
      { id: 'ayt_m6', subject: 'Matematik', name: 'Diziler', isFrequent: true, note: 'Her yıl 1-2 soru banko.' },
      { id: 'ayt_m7', subject: 'Matematik', name: 'Limit ve Süreklilik', isFrequent: true, note: '🔥 Her yıl 2 soru!' },
      { id: 'ayt_m8', subject: 'Matematik', name: 'Türev ve Uygulamaları', isFrequent: true, note: '🔥 AYT\'nin zirvesi! Her yıl 4-5 soru!' },
      { id: 'ayt_m9', subject: 'Matematik', name: 'İntegral ve Alan Hesabı', isFrequent: true, note: '🔥 Her yıl kesin 4 soru!' },
      { id: 'ayt_g1', subject: 'Geometri', name: 'Çember ve Daire (İleri Düzey)', isFrequent: true, note: 'Her yıl 2-3 soru.' },
      { id: 'ayt_g2', subject: 'Geometri', name: 'Analitik Geometri (Doğru ve Çember Analitiği)', isFrequent: true, note: '🔥 Her yıl 3-4 soru!' },
      { id: 'ayt_f1', subject: 'Fizik', name: 'Vektörler, Bağıl Hareket ve Newton Yasaları', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'ayt_f2', subject: 'Fizik', name: 'Bir ve İki Boyutta Sabit İvmeli Hareket (Atışlar)', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'ayt_f3', subject: 'Fizik', name: 'İtme ve Çizgisel Momentum', isFrequent: true, note: '🔥 Her yıl 1-2 soru.' },
      { id: 'ayt_f4', subject: 'Fizik', name: 'Tork, Denge ve Ağırlık Merkezi', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'ayt_f5', subject: 'Fizik', name: 'Elektrik Alan, Potansiyel ve Sığa', isFrequent: true, note: '🔥 Her yıl 2 soru.' },
      { id: 'ayt_f6', subject: 'Fizik', name: 'Manyetizma ve Elektromanyetik İndüksiyon', isFrequent: true, note: '🔥 Her yıl 2 soru!' },
      { id: 'ayt_f7', subject: 'Fizik', name: 'Çembersel Hareket ve Basit Harmonik Hareket', isFrequent: true, note: '🔥 Her yıl 2-3 soru.' },
      { id: 'ayt_f8', subject: 'Fizik', name: 'Dalga Mekaniği ve Atom Kuantum Modelleri', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'ayt_f9', subject: 'Fizik', name: 'Modern Fizik ve Uygulamaları', isFrequent: true, note: '🔥 Her yıl 2 soru banko.' },
      { id: 'ayt_k1', subject: 'Kimya', name: 'Modern Atom Teorisi ve Kuantum Sayıları', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'ayt_k2', subject: 'Kimya', name: 'Gazlar ve Gaz Yasaları', isFrequent: true, note: '🔥 Her yıl 1-2 soru gelir.' },
      { id: 'ayt_k3', subject: 'Kimya', name: 'Sıvı Çözeltiler ve Çözünürlük', isFrequent: true, note: '🔥 Her yıl 1-2 soru.' },
      { id: 'ayt_k4', subject: 'Kimya', name: 'Kimyasal Tepkimelerde Enerji ve Hız', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'ayt_k5', subject: 'Kimya', name: 'Kimyasal Denge ve Asit-Baz Dengesi (Kç, pH)', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      { id: 'ayt_k6', subject: 'Kimya', name: 'Kimya ve Elektrik (Piller ve Elektroliz)', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      { id: 'ayt_k7', subject: 'Kimya', name: 'Karbon Kimyasına Giriş ve Organik Kimya', isFrequent: true, note: '🔥 AYT Kimya\'nın kalbi! Her yıl 3-4 soru!' },
      { id: 'ayt_b1', subject: 'Biyoloji', name: 'Sinir, Endokrin ve Duyu Organları', isFrequent: true, note: '🔥 Her yıl 2-3 soru.' },
      { id: 'ayt_b2', subject: 'Biyoloji', name: 'Destek-Hareket, Sindirim, Dolaşım ve Solunum Sistemleri', isFrequent: true, note: '🔥 Her yıl en az 3-4 soru!' },
      { id: 'ayt_b3', subject: 'Biyoloji', name: 'Üreme Sistemi ve Embriyonik Gelişim', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'ayt_b4', subject: 'Biyoloji', name: 'Genden Proteine (DNA, RNA, Protein Sentezi)', isFrequent: true, note: '🔥 Her yıl kesin 2-3 soru!' },
      { id: 'ayt_b5', subject: 'Biyoloji', name: 'Hücresel Solunum ve Fotosentez / Kemosentez', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      { id: 'ayt_b6', subject: 'Biyoloji', name: 'Bitki Biyolojisi (Dokular, Taşıma, Üreme)', isFrequent: true, note: '🔥 Her yıl 3 soru banko.' },
      { id: 'ayt_ed1', subject: 'Edebiyat & Sosyal', name: 'Şiir Bilgisi ve Söz Sanatları', isFrequent: true, note: '🔥 Her yıl 3-4 soru.' },
      { id: 'ayt_ed2', subject: 'Edebiyat & Sosyal', name: 'Halk ve Divan Edebiyatı', isFrequent: true, note: '🔥 Divan Edebiyatı\'ndan her yıl 4-5 soru!' },
      { id: 'ayt_ed3', subject: 'Edebiyat & Sosyal', name: 'Tanzimat, Servetifünun ve Milli Edebiyat', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'ayt_ed4', subject: 'Edebiyat & Sosyal', name: 'Cumhuriyet Dönemi Türk Edebiyatı', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' },
      { id: 'ayt_ed5', subject: 'Edebiyat & Sosyal', name: 'AYT Tarih ve Coğrafya-1 Önemli Konuları', isFrequent: true, note: 'Her yıl düzenli soru çıkar.' }
    ]
  },
  LGS: {
    LGS: [
      { id: 'lgs_m1', subject: 'Matematik', name: 'Çarpanlar ve Katlar / EBOB - EKOK', isFrequent: true, note: '🔥 Her yıl 2-3 soru gelir.' },
      { id: 'lgs_m2', subject: 'Matematik', name: 'Üslü İfadeler', isFrequent: true, note: '🔥 Her yıl banko 3 soru!' },
      { id: 'lgs_m3', subject: 'Matematik', name: 'Kareköklü İfadeler', isFrequent: true, note: '🔥 LGS Matematik\'in kralı! Her yıl 3-4 soru!' },
      { id: 'lgs_m4', subject: 'Matematik', name: 'Veri Analizi (Daire ve Sütun Grafikleri)', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'lgs_m5', subject: 'Matematik', name: 'Basit Olayların Olasılığı', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'lgs_m6', subject: 'Matematik', name: 'Cebirsel İfadeler ve Özdeşlikler', isFrequent: true, note: '🔥 Her yıl kesin 3 soru!' },
      { id: 'lgs_m7', subject: 'Matematik', name: 'Doğrusal Denklemler ve Eğim', isFrequent: true, note: '🔥 Her yıl 3-4 soru.' },
      { id: 'lgs_m8', subject: 'Matematik', name: 'Eşitsizlikler', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'lgs_m9', subject: 'Matematik', name: 'Üçgenler ve Benzerlik', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'lgs_m10', subject: 'Matematik', name: 'Geometrik Cisimler (Prizma, Silindir)', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'lgs_t1', subject: 'Türkçe', name: 'Sözcükte ve Söz Öbeklerinde Anlam', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'lgs_t2', subject: 'Türkçe', name: 'Cümlede Anlam ve Deyimler / Atasözleri', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'lgs_t3', subject: 'Türkçe', name: 'Paragrafta Anlam, Ana Düşünce ve Yardımcı Düşünce', isFrequent: true, note: '🔥 LGS\'nin kalbi! Her yıl 10-12 soru!' },
      { id: 'lgs_t4', subject: 'Türkçe', name: 'Görsel Okuma, Tablo ve Sözel Mantık', isFrequent: true, note: '🔥 Her yıl 3-4 yeni nesil soru!' },
      { id: 'lgs_t5', subject: 'Türkçe', name: 'Fiilimsiler (İsim-Fiil, Sıfat-Fiil, Zarf-Fiil)', isFrequent: true, note: '🔥 Her yıl banko 1 soru!' },
      { id: 'lgs_t6', subject: 'Türkçe', name: 'Cümlenin Ögeleri ve Cümle Türleri', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'lgs_t7', subject: 'Türkçe', name: 'Yazım Kuralları ve Noktalama İşaretleri', isFrequent: true, note: '🔥 Her yıl kesin 2 soru.' },
      { id: 'lgs_f1', subject: 'Fen Bilimleri', name: 'Mevsimlerin Oluşumu ve İklim Hareketleri', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'lgs_f2', subject: 'Fen Bilimleri', name: 'DNA, Genetik Kod, Kalıtım ve Biyoteknoloji', isFrequent: true, note: '🔥 Her yıl 3-4 soru!' },
      { id: 'lgs_f3', subject: 'Fen Bilimleri', name: 'Basınç (Katı, Sıvı ve Gaz Basıncı)', isFrequent: true, note: '🔥 Her yıl kesin 2-3 soru!' },
      { id: 'lgs_f4', subject: 'Fen Bilimleri', name: 'Madde ve Endüstri (Periyodik Sistem, Asit-Baz)', isFrequent: true, note: '🔥 LGS Fen\'in en büyük ünitesi! Her yıl 4-5 soru!' },
      { id: 'lgs_f5', subject: 'Fen Bilimleri', name: 'Basit Makineler (Kaldıraç, Makara, Dişli vb.)', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'lgs_f6', subject: 'Fen Bilimleri', name: 'Enerji Dönüşümleri ve Çevre Bilimi', isFrequent: true, note: 'Her yıl 2-3 soru.' },
      { id: 'lgs_f7', subject: 'Fen Bilimleri', name: 'Elektrik Yükleri ve Elektrik Enerjisi', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'lgs_in1', subject: 'İnkılap Tarihi', name: 'Bir Kahraman Doğuyor (Atatürk\'ün Hayatı)', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'lgs_in2', subject: 'İnkılap Tarihi', name: 'Milli Uyanış: Bağımsızlık Yolunda Adımlar', isFrequent: true, note: '🔥 Her yıl 3-4 soru!' },
      { id: 'lgs_in3', subject: 'İnkılap Tarihi', name: 'Ya İstiklal Ya Ölüm! (Milli Mücadele Cepheleri)', isFrequent: true, note: '🔥 Her yıl 2-3 soru.' },
      { id: 'lgs_in4', subject: 'İnkılap Tarihi', name: 'Atatürkçülük ve Çağdaşlaşan Türkiye', isFrequent: true, note: '🔥 Her yıl 3 soru.' },
      { id: 'lgs_dn1', subject: 'Din & İngilizce', name: 'Kader İnancı, Zekat ve Sadaka / Hz. Muhammed\'in Örnekliği', isFrequent: true, note: 'Din Kültürü banko konuları.' },
      { id: 'lgs_dn2', subject: 'Din & İngilizce', name: 'İngilizce: Friendship, Teen Life, In the Kitchen & Adventures', isFrequent: true, note: 'İngilizce\'de en çok çıkan üniteler.' }
    ]
  },
  KPSS: {
    'KPSS Lisans': [
      { id: 'kpssl_t1', subject: 'Genel Yetenek (Türkçe)', name: 'Sözcükte ve Söz Öbeklerinde Anlam', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'kpssl_t2', subject: 'Genel Yetenek (Türkçe)', name: 'Cümlede Anlam, Yorum ve İlişkiler', isFrequent: true, note: 'Her yıl 3-4 soru.' },
      { id: 'kpssl_t3', subject: 'Genel Yetenek (Türkçe)', name: 'Paragrafta Anlam, Yapı ve Akış', isFrequent: true, note: '🔥 KPSS Türkçe\'nin kalbi! Her yıl 15-18 Soru!' },
      { id: 'kpssl_t4', subject: 'Genel Yetenek (Türkçe)', name: 'Dil Bilgisi (Ses, Yapı, Sözcük Türleri, Ögeler)', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' },
      { id: 'kpssl_t5', subject: 'Genel Yetenek (Türkçe)', name: 'Sözel Mantık ve Akıl Yürütme', isFrequent: true, note: '🔥 Her yıl banko 4 soru!' },
      { id: 'kpssl_m1', subject: 'Genel Yetenek (Matematik)', name: 'Temel Kavramlar, Sayı Basamakları ve Rasyonel Sayılar', isFrequent: true, note: 'Her yıl 3-4 soru.' },
      { id: 'kpssl_m2', subject: 'Genel Yetenek (Matematik)', name: 'Üslü, Köklü Sayılar ve Çarpanlara Ayırma', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' },
      { id: 'kpssl_m3', subject: 'Genel Yetenek (Matematik)', name: 'Sayı, Kesir, Yaş, Hareket ve Kar-Zarar Problemleri', isFrequent: true, note: '🔥 En yüksek ağırlık! Her yıl 10-12 Soru!' },
      { id: 'kpssl_m4', subject: 'Genel Yetenek (Matematik)', name: 'Sayısal Mantık, Tablo ve Grafik Yorumlama', isFrequent: true, note: '🔥 Her yıl 4-6 soru banko.' },
      { id: 'kpssl_m5', subject: 'Genel Yetenek (Matematik)', name: 'Temel Geometri (Üçgenler, Dörtgenler, Çember)', isFrequent: true, note: 'Her yıl 3-4 soru.' },
      { id: 'kpssl_tr1', subject: 'Genel Kültür (Tarih)', name: 'İslamiyet Öncesi Türk Tarihi ve İlk Türk-İslam Devletleri', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'kpssl_tr2', subject: 'Genel Kültür (Tarih)', name: 'Osmanlı Kuruluş, Yükselme ve Teşkilat Tarihi', isFrequent: true, note: '🔥 Her yıl 4-5 soru.' },
      { id: 'kpssl_tr3', subject: 'Genel Kültür (Tarih)', name: 'Osmanlı Dağılma Dönemi ve XIX. Yüzyıl Islahatları', isFrequent: true, note: '🔥 Her yıl 4 soru!' },
      { id: 'kpssl_tr4', subject: 'Genel Kültür (Tarih)', name: 'Milli Mücadele Hazırlık, Kongreler ve Muharebeler', isFrequent: true, note: '🔥 Her yıl kesin 6-7 soru!' },
      { id: 'kpssl_tr5', subject: 'Genel Kültür (Tarih)', name: 'Atatürk İlkeleri ve İnkılap Tarihi', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' },
      { id: 'kpssl_tr6', subject: 'Genel Kültür (Tarih)', name: 'Çağdaş Türk ve Dünya Tarihi', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'kpssl_c1', subject: 'Genel Kültür (Coğrafya)', name: 'Türkiye\'nin Coğrafi Konumu ve Yer Şekilleri', isFrequent: true, note: '🔥 Her yıl 4-5 soru.' },
      { id: 'kpssl_c2', subject: 'Genel Kültür (Coğrafya)', name: 'Türkiye\'nin İklimi, Su, Toprak ve Bitki Varlığı', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'kpssl_c3', subject: 'Genel Kültür (Coğrafya)', name: 'Türkiye\'de Nüfus, Yerleşme ve Göç', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'kpssl_c4', subject: 'Genel Kültür (Coğrafya)', name: 'Tarım, Hayvancılık, Ormancılık ve Madenler/Enerji', isFrequent: true, note: '🔥 Her yıl 4-5 soru.' },
      { id: 'kpssl_c5', subject: 'Genel Kültür (Coğrafya)', name: 'Sanayi, Ulaşım, Ticaret, Turizm ve Bölgesel Kalkınma', isFrequent: true, note: 'Her yıl 2-3 soru.' },
      { id: 'kpssl_v1', subject: 'Genel Kültür (Vatandaşlık)', name: 'Hukukun Temel Kavramları ve Devlet Yapısı', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'kpssl_v2', subject: 'Genel Kültür (Vatandaşlık)', name: '1982 Anayasası ve Yasama - Yürütme - Yargı', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' },
      { id: 'kpssl_v3', subject: 'Genel Kültür (Vatandaşlık)', name: 'İdare Hukuku ve Mahalli İdareler', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'kpssl_v4', subject: 'Genel Kültür (Vatandaşlık)', name: 'Ulusal ve Uluslararası Güncel Olaylar / Genel Kültür', isFrequent: true, note: '🔥 Banko 6 Güncel Soru!' }
    ],
    'KPSS Önlisans': [
      { id: 'kpsso_t1', subject: 'Genel Yetenek (Türkçe)', name: 'Sözcük ve Cümle Yorumlama', isFrequent: true, note: 'Her yıl 6 soru.' },
      { id: 'kpsso_t2', subject: 'Genel Yetenek (Türkçe)', name: 'Paragrafta Anlam, Ana Fikir ve Yapı', isFrequent: true, note: '🔥 Her yıl 14-16 Soru!' },
      { id: 'kpsso_t3', subject: 'Genel Yetenek (Türkçe)', name: 'Temel Dil Bilgisi ve Yazım-Noktalama', isFrequent: true, note: 'Her yıl 4-5 soru.' },
      { id: 'kpsso_t4', subject: 'Genel Yetenek (Türkçe)', name: 'Sözel Mantık Bulmacaları', isFrequent: true, note: '🔥 Banko 4 soru.' },
      { id: 'kpsso_m1', subject: 'Genel Yetenek (Matematik)', name: 'Temel İşlemler, Sayılar ve Kesirler', isFrequent: true, note: 'Her yıl 4 soru.' },
      { id: 'kpsso_m2', subject: 'Genel Yetenek (Matematik)', name: 'Üslü, Köklü ve Çarpanlara Ayırma', isFrequent: true, note: '🔥 Her yıl 4-5 soru.' },
      { id: 'kpsso_m3', subject: 'Genel Yetenek (Matematik)', name: 'Sayı, Yaş, Yüzde ve Kar-Zarar Problemleri', isFrequent: true, note: '🔥 Her yıl 10 Soru!' },
      { id: 'kpsso_m4', subject: 'Genel Yetenek (Matematik)', name: 'Sayısal Mantık ve Tablo Yorumlama', isFrequent: true, note: 'Her yıl 4 soru.' },
      { id: 'kpsso_tr1', subject: 'Genel Kültür (Tarih)', name: 'Türk-İslam ve Osmanlı Devleti Kuruluş/Yükselme', isFrequent: true, note: 'Her yıl 5 soru.' },
      { id: 'kpsso_tr2', subject: 'Genel Kültür (Tarih)', name: 'Osmanlı Dağılma Dönemi ve Islahatlar', isFrequent: true, note: '🔥 Her yıl 4 soru.' },
      { id: 'kpsso_tr3', subject: 'Genel Kültür (Tarih)', name: 'Kurtuluş Savaşı ve Milli Mücadele Cepheleri', isFrequent: true, note: '🔥 Her yıl 6-7 soru.' },
      { id: 'kpsso_tr4', subject: 'Genel Kültür (Tarih)', name: 'Atatürk İnkılapları ve İlkeler', isFrequent: true, note: '🔥 Her yıl 5 soru.' },
      { id: 'kpsso_cv1', subject: 'Coğrafya & Vatandaşlık', name: 'Türkiye Coğrafyası (İklim, Tarım, Sanayi, Nüfus)', isFrequent: true, note: '🔥 Her yıl 18 soru.' },
      { id: 'kpsso_cv2', subject: 'Coğrafya & Vatandaşlık', name: 'Anayasa Hukuku, Temel Haklar ve İdari Kurumlar', isFrequent: true, note: 'Her yıl 9 soru.' },
      { id: 'kpsso_cv3', subject: 'Coğrafya & Vatandaşlık', name: 'Türkiye ve Dünya Güncel Gelişmeleri', isFrequent: true, note: '🔥 Banko 6 güncel soru.' }
    ],
    'KPSS Ortaöğretim': [
      { id: 'kpssrt_t1', subject: 'Genel Yetenek (Türkçe)', name: 'Sözcük ve Deyimlerde Anlam', isFrequent: true, note: 'Her yıl 4 soru.' },
      { id: 'kpssrt_t2', subject: 'Genel Yetenek (Türkçe)', name: 'Cümlede Anlam ve Temel Yorumlama', isFrequent: true, note: 'Her yıl 4 soru.' },
      { id: 'kpssrt_t3', subject: 'Genel Yetenek (Türkçe)', name: 'Paragraf Okuma, Yorumlama ve Ana Fikir', isFrequent: true, note: '🔥 Her yıl 15-17 Soru!' },
      { id: 'kpssrt_t4', subject: 'Genel Yetenek (Türkçe)', name: 'Temel Dil Bilgisi Kuralları ve Sözel Mantık', isFrequent: true, note: 'Her yıl 5-6 soru.' },
      { id: 'kpssrt_m1', subject: 'Genel Yetenek (Matematik)', name: 'Dört İşlem, Kesirler ve Ondalık Sayılar Pratiği', isFrequent: true, note: 'Her yıl 5 soru.' },
      { id: 'kpssrt_m2', subject: 'Genel Yetenek (Matematik)', name: 'Üslü, Köklü Temel İşlemler ve Eşitsizlikler', isFrequent: true, note: 'Her yıl 4 soru.' },
      { id: 'kpssrt_m3', subject: 'Genel Yetenek (Matematik)', name: 'Günlük Hayat Problemleri (Sayı, Kesir, Yüzde vb.)', isFrequent: true, note: '🔥 Her yıl 9-10 soru!' },
      { id: 'kpssrt_m4', subject: 'Genel Yetenek (Matematik)', name: 'Temel Geometri (Üçgen ve Çevre/Alan)', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'kpssrt_tr1', subject: 'Genel Kültür (Tarih)', name: 'Osmanlı Devleti Kültür, Medeniyet ve Siyasi Tarihi', isFrequent: true, note: '🔥 Her yıl 8 soru.' },
      { id: 'kpssrt_tr2', subject: 'Genel Kültür (Tarih)', name: 'İnkılap Tarihi ve Milli Mücadele Dönemi', isFrequent: true, note: '🔥 Her yıl 8 soru.' },
      { id: 'kpssrt_tr3', subject: 'Genel Kültür (Tarih)', name: 'Atatürk İlkeleri ve İnkılaplar', isFrequent: true, note: '🔥 Her yıl 5 soru.' },
      { id: 'kpssrt_cv1', subject: 'Coğrafya & Vatandaşlık', name: 'Türkiye Harita Bilgisi, İklim ve Bölgeler', isFrequent: true, note: 'Her yıl 6 soru.' },
      { id: 'kpssrt_cv2', subject: 'Coğrafya & Vatandaşlık', name: 'Tarım Ürünleri, Hayvancılık, Maden ve Sanayi', isFrequent: true, note: '🔥 Her yıl 6 soru.' },
      { id: 'kpssrt_cv3', subject: 'Coğrafya & Vatandaşlık', name: 'Toplum Kuralları, Anayasa Temel Haklar ve İdari Yapı', isFrequent: true, note: 'Her yıl 9 soru.' },
      { id: 'kpssrt_cv4', subject: 'Coğrafya & Vatandaşlık', name: 'Güncel Genel Kültür Soruları', isFrequent: true, note: '🔥 Banko 6 soru.' }
    ]
  }
};

// Helper: Belirli sınav grubu ve alt tab için konu listesi döndürür
export const getTopicsForExam = (examGroup, subTab) => {
  if (examGroup === 'YKS') return CURRICULUM_DATA.YKS[subTab] || [];
  if (examGroup === 'LGS') return CURRICULUM_DATA.LGS.LGS || [];
  if (examGroup === 'KPSS') return CURRICULUM_DATA.KPSS[subTab] || [];
  return [];
};

// Helper: Tüm alt sekmeler için konu listesi döndürür
export const getSubTabsForExam = (examGroup) => {
  if (examGroup === 'YKS') return ['TYT', 'AYT'];
  if (examGroup === 'LGS') return ['LGS'];
  if (examGroup === 'KPSS') return ['KPSS Lisans', 'KPSS Önlisans', 'KPSS Ortaöğretim'];
  return [];
};

// Helper: Konu adından hangi derse ait olduğunu bulur (Tüm müfredatı tarar)
export const findSubjectOfTopic = (topicName) => {
  if (!topicName) return 'Genel / Diğer';
  for (const groupKey of Object.keys(CURRICULUM_DATA)) {
    const group = CURRICULUM_DATA[groupKey];
    for (const tabKey of Object.keys(group)) {
      const topics = group[tabKey] || [];
      const found = topics.find(t => t.name === topicName || t.name.toLowerCase() === topicName.toLowerCase());
      if (found) return found.subject || 'Genel / Diğer';
    }
  }
  return 'Genel / Diğer';
};

// Helper: Konu listesini (string array) derslere göre { "Matematik": ["Konu 1", "Konu 2"], ... } şeklinde gruplar
export const groupTopicsBySubject = (topicsArray = [], examGroup = null, subTab = null) => {
  const grouped = {};
  if (!Array.isArray(topicsArray) || topicsArray.length === 0) return grouped;

  // Eğer belirli bir sınav/tab varsa önce oradaki konuları map e alalım
  let specificMap = {};
  if (examGroup && subTab) {
    const list = getTopicsForExam(examGroup, subTab);
    list.forEach(t => { specificMap[t.name] = t.subject; });
  }

  topicsArray.forEach(topic => {
    const subj = specificMap[topic] || findSubjectOfTopic(topic) || 'Diğer Dersler';
    if (!grouped[subj]) grouped[subj] = [];
    grouped[subj].push(topic);
  });

  return grouped;
};
