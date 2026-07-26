// ── KAPSAMLI ÖSYM & SINAV MÜFREDATLARI VE SIK ÇIKAN KONULAR VERİTABANI ──
// Bu dosya OsymCurriculum.jsx, SmartPlanner.jsx ve CoachDashboard.jsx tarafından kullanılır.

export const CURRICULUM_DATA = {
  YKS: {
    TYT: [
      { id: 'tyt_m1', subject: 'Matematik', name: 'Temel Kavramlar', isFrequent: false },
      { id: 'tyt_m2', subject: 'Matematik', name: 'Sayı Kümeleri ve Basamakları', isFrequent: false },
      { id: 'tyt_m3', subject: 'Matematik', name: 'Bölme ve Bölünebilme', isFrequent: false },
      { id: 'tyt_m4', subject: 'Matematik', name: 'Asal Sayılar', isFrequent: false },
      { id: 'tyt_m5', subject: 'Matematik', name: 'EBOB - EKOK', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_m6', subject: 'Matematik', name: 'Rasyonel ve Ondalık Sayılar', isFrequent: false },
      { id: 'tyt_m7', subject: 'Matematik', name: 'Basit Eşitsizlikler', isFrequent: false },
      { id: 'tyt_m8', subject: 'Matematik', name: 'Mutlak Değer', isFrequent: true, note: 'Her yıl kesin 1 soru gelir.' },
      { id: 'tyt_m9', subject: 'Matematik', name: 'Üslü Sayılar', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_m10', subject: 'Matematik', name: 'Köklü Sayılar', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_m11', subject: 'Matematik', name: 'Çarpanlara Ayırma', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_m12', subject: 'Matematik', name: 'Özdeşlikler', isFrequent: false },
      { id: 'tyt_m13', subject: 'Matematik', name: 'Oran ve Orantı', isFrequent: true, note: 'Problemlerin temel anahtarıdır.' },
      { id: 'tyt_m14', subject: 'Matematik', name: 'Sayı ve Kesir Problemleri', isFrequent: true, note: '🔥 Her yıl en az 4-5 soru gelir!' },
      { id: 'tyt_m15', subject: 'Matematik', name: 'Yaş Problemleri', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_m16', subject: 'Matematik', name: 'İşçi ve Havuz Problemleri', isFrequent: false },
      { id: 'tyt_m17', subject: 'Matematik', name: 'Hız ve Hareket Problemleri', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_m18', subject: 'Matematik', name: 'Yüzde ve Kar-Zarar Problemleri', isFrequent: true, note: '🔥 Her yıl 2-3 soru.' },
      { id: 'tyt_m19', subject: 'Matematik', name: 'Karışım Problemleri', isFrequent: false },
      { id: 'tyt_m20', subject: 'Matematik', name: 'Grafik ve Tablo Okuma', isFrequent: true, note: 'ÖSYM yeni nesilde çok sever.' },
      { id: 'tyt_m21', subject: 'Matematik', name: 'Rutin Olmayan Problemler', isFrequent: true, note: 'Yeni nesil akıl yürütme.' },
      { id: 'tyt_m22', subject: 'Matematik', name: 'Kümeler ve İşlemler', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_m23', subject: 'Matematik', name: 'Mantık', isFrequent: true, note: 'Her yıl 1 soru gelir.' },
      { id: 'tyt_m24', subject: 'Matematik', name: 'Fonksiyonlar', isFrequent: true, note: '🔥 TYT ve AYT ortak, en az 2 soru!' },
      { id: 'tyt_m25', subject: 'Matematik', name: 'Polinomlar (TYT Giriş)', isFrequent: false },
      { id: 'tyt_m26', subject: 'Matematik', name: 'Permütasyon ve Kombinasyon', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_m27', subject: 'Matematik', name: 'Olasılık', isFrequent: true, note: '🔥 Her yıl kesin 1 veya 2 soru gelir.' },
      { id: 'tyt_m28', subject: 'Matematik', name: 'Veri ve İstatistik', isFrequent: true, note: 'Her yıl 1 soru gelir.' },
      
      { id: 'tyt_g1', subject: 'Geometri', name: 'Doğruda Açılar', isFrequent: true },
      { id: 'tyt_g2', subject: 'Geometri', name: 'Üçgende Açılar', isFrequent: true },
      { id: 'tyt_g3', subject: 'Geometri', name: 'Dik Üçgen ve Pisagor', isFrequent: true, note: 'Tüm geometrinin temelidir.' },
      { id: 'tyt_g4', subject: 'Geometri', name: 'İkizkenar ve Eşkenar Üçgen', isFrequent: true },
      { id: 'tyt_g5', subject: 'Geometri', name: 'Üçgende Benzerlik', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_g6', subject: 'Geometri', name: 'Üçgende Alan', isFrequent: true },
      { id: 'tyt_g7', subject: 'Geometri', name: 'Çokgenler ve Dörtgenler', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'tyt_g8', subject: 'Geometri', name: 'Katı Cisimler (Prizma ve Silindir)', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      
      { id: 'tyt_t1', subject: 'Türkçe', name: 'Sözcükte Anlam', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'tyt_t2', subject: 'Türkçe', name: 'Cümlede Anlam ve Yorum', isFrequent: true, note: 'Her yıl 3-4 soru.' },
      { id: 'tyt_t3', subject: 'Türkçe', name: 'Paragrafta Ana Düşünce', isFrequent: true, note: '🔥 TYT Türkçe\'nin kalbi!' },
      { id: 'tyt_t4', subject: 'Türkçe', name: 'Paragrafta Yapı ve Akış', isFrequent: true, note: '🔥 Her yıl 6-8 soru.' },
      { id: 'tyt_t5', subject: 'Türkçe', name: 'Ses Bilgisi', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_t6', subject: 'Türkçe', name: 'Yazım Kuralları', isFrequent: true, note: '🔥 Her yıl 2 soru!' },
      { id: 'tyt_t7', subject: 'Türkçe', name: 'Noktalama İşaretleri', isFrequent: true, note: '🔥 Her yıl 2 soru!' },
      { id: 'tyt_t8', subject: 'Türkçe', name: 'Sözcük Türleri (İsim, Sıfat, Zamir)', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'tyt_t9', subject: 'Türkçe', name: 'Zarf, Edat, Bağlaç', isFrequent: false },
      { id: 'tyt_t10', subject: 'Türkçe', name: 'Fiiller ve Fiilimsi', isFrequent: false },
      { id: 'tyt_t11', subject: 'Türkçe', name: 'Cümlenin Ögeleri', isFrequent: true, note: 'Her yıl 1 soru gelir.' },
      
      { id: 'tyt_f1', subject: 'Fizik', name: 'Fizik Bilimine Giriş', isFrequent: false },
      { id: 'tyt_f2', subject: 'Fizik', name: 'Madde ve Özellikleri', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_f3', subject: 'Fizik', name: 'Hareket ve Kuvvet', isFrequent: true, note: '🔥 Her yıl 1-2 soru.' },
      { id: 'tyt_f4', subject: 'Fizik', name: 'İş, Güç ve Enerji', isFrequent: true, note: 'Her yıl 1 soru gelir.' },
      { id: 'tyt_f5', subject: 'Fizik', name: 'Isı ve Sıcaklık', isFrequent: true, note: '🔥 Her yıl banko 1 soru!' },
      { id: 'tyt_f6', subject: 'Fizik', name: 'Genleşme', isFrequent: false },
      { id: 'tyt_f7', subject: 'Fizik', name: 'Elektrostatik ve Akım', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_f8', subject: 'Fizik', name: 'Optik ve Mercekler', isFrequent: true, note: '🔥 Her yıl kesin 2 soru gelir!' },
      { id: 'tyt_f9', subject: 'Fizik', name: 'Dalgalar ve Ses', isFrequent: true, note: 'Her yıl 1 soru.' },
      
      { id: 'tyt_k1', subject: 'Kimya', name: 'Kimya Bilimi', isFrequent: false },
      { id: 'tyt_k2', subject: 'Kimya', name: 'Atom ve Periyodik Sistem', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_k3', subject: 'Kimya', name: 'Kimyasal Türler Arası Etkileşimler', isFrequent: true, note: '🔥 Her yıl kesin 1 soru gelir.' },
      { id: 'tyt_k4', subject: 'Kimya', name: 'Maddenin Halleri', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_k5', subject: 'Kimya', name: 'Mol Kavramı ve Hesaplamalar', isFrequent: false },
      { id: 'tyt_k6', subject: 'Kimya', name: 'Karışımlar ve Ayırma Yöntemleri', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'tyt_k7', subject: 'Kimya', name: 'Asitler, Bazlar ve Tuzlar', isFrequent: true, note: '🔥 Her yıl 1 soru gelir.' },
      
      { id: 'tyt_b1', subject: 'Biyoloji', name: 'Canlıların Temel Bileşenleri', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_b2', subject: 'Biyoloji', name: 'Hücre Yapısı ve Organelleri', isFrequent: true, note: '🔥 Her yıl kesin 1 soru gelir.' },
      { id: 'tyt_b3', subject: 'Biyoloji', name: 'Canlıların Sınıflandırılması', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_b4', subject: 'Biyoloji', name: 'Mitoz Bölünme', isFrequent: true },
      { id: 'tyt_b5', subject: 'Biyoloji', name: 'Mayoz Bölünme', isFrequent: true },
      { id: 'tyt_b6', subject: 'Biyoloji', name: 'Kalıtım ve Soy Ağaçları', isFrequent: true, note: '🔥 Her yıl banko 1-2 soru!' },
      { id: 'tyt_b7', subject: 'Biyoloji', name: 'Ekosistem Ekolojisi', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      
      { id: 'tyt_tr1', subject: 'Tarih', name: 'Tarih ve Zaman', isFrequent: false },
      { id: 'tyt_tr2', subject: 'Tarih', name: 'İlk ve Orta Çağlarda Türk Dünyası', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_tr3', subject: 'Tarih', name: 'Türk-İslam Devletleri', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_tr4', subject: 'Tarih', name: 'Osmanlı Devleti Kuruluş ve Yükselme', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_tr5', subject: 'Tarih', name: 'Milli Mücadele ve İnkılaplar', isFrequent: true, note: '🔥 Her yıl kesin 1-2 soru!' },
      
      { id: 'tyt_c1', subject: 'Coğrafya', name: 'Harita Bilgisi ve İzohipsler', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_c2', subject: 'Coğrafya', name: 'İklim Bilgisi', isFrequent: true, note: '🔥 Her yıl kesin 1 soru gelir.' },
      { id: 'tyt_c3', subject: 'Coğrafya', name: 'İç ve Dış Kuvvetler', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'tyt_c4', subject: 'Coğrafya', name: 'Nüfus ve Yerleşme', isFrequent: true, note: '🔥 Her yıl 1 soru.' },
      { id: 'tyt_c5', subject: 'Coğrafya', name: 'Doğal Afetler', isFrequent: true, note: '🔥 Her yıl kesin 1 soru banko!' },
      
      { id: 'tyt_fl1', subject: 'Felsefe & Din Kültürü', name: 'Bilgi, Varlık ve Ahlak Felsefesi', isFrequent: true, note: 'Her yıl 2-3 soru.' },
      { id: 'tyt_fl2', subject: 'Felsefe & Din Kültürü', name: 'Din Kültürü Temel İnançlar', isFrequent: true, note: 'Her yıl 3-4 soru.' }
    ],
    AYT: [
      { id: 'ayt_m1', subject: 'Matematik', name: 'Polinomlar', isFrequent: true, note: '🔥 Her yıl 1-2 soru.' },
      { id: 'ayt_m2', subject: 'Matematik', name: 'İkinci Dereceden Denklemler', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'ayt_m3', subject: 'Matematik', name: 'Parabol', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'ayt_m4', subject: 'Matematik', name: 'Trigonometri', isFrequent: true, note: '🔥 AYT\'nin yıldızı! Her yıl 4-5 soru!' },
      { id: 'ayt_m5', subject: 'Matematik', name: 'Logaritma', isFrequent: true, note: '🔥 Her yıl banko 2 soru.' },
      { id: 'ayt_m6', subject: 'Matematik', name: 'Diziler', isFrequent: true, note: 'Her yıl 1-2 soru banko.' },
      { id: 'ayt_m7', subject: 'Matematik', name: 'Limit', isFrequent: true, note: '🔥 Her yıl 2 soru!' },
      { id: 'ayt_m8', subject: 'Matematik', name: 'Süreklilik', isFrequent: true },
      { id: 'ayt_m9', subject: 'Matematik', name: 'Türev ve Uygulamaları', isFrequent: true, note: '🔥 AYT\'nin zirvesi! Her yıl 4-5 soru!' },
      { id: 'ayt_m10', subject: 'Matematik', name: 'İntegral ve Alan', isFrequent: true, note: '🔥 Her yıl kesin 4 soru!' },
      
      { id: 'ayt_g1', subject: 'Geometri', name: 'Çember ve Daire', isFrequent: true, note: 'Her yıl 2-3 soru.' },
      { id: 'ayt_g2', subject: 'Geometri', name: 'Analitik Geometri', isFrequent: true, note: '🔥 Her yıl 3-4 soru!' },
      { id: 'ayt_g3', subject: 'Geometri', name: 'Çemberin Analitiği', isFrequent: true },
      
      { id: 'ayt_f1', subject: 'Fizik', name: 'Vektörler ve Bağıl Hareket', isFrequent: true },
      { id: 'ayt_f2', subject: 'Fizik', name: 'Atışlar ve İvmeli Hareket', isFrequent: true, note: 'Her yıl 1 soru.' },
      { id: 'ayt_f3', subject: 'Fizik', name: 'İtme ve Momentum', isFrequent: true, note: '🔥 Her yıl 1-2 soru.' },
      { id: 'ayt_f4', subject: 'Fizik', name: 'Tork ve Denge', isFrequent: true },
      { id: 'ayt_f5', subject: 'Fizik', name: 'Elektrik Alan ve Potansiyel', isFrequent: true, note: '🔥 Her yıl 2 soru.' },
      { id: 'ayt_f6', subject: 'Fizik', name: 'Manyetizma ve İndüksiyon', isFrequent: true, note: '🔥 Her yıl 2 soru!' },
      { id: 'ayt_f7', subject: 'Fizik', name: 'Çembersel ve Harmonik Hareket', isFrequent: true, note: '🔥 Her yıl 2-3 soru.' },
      { id: 'ayt_f8', subject: 'Fizik', name: 'Dalga Mekaniği', isFrequent: true },
      { id: 'ayt_f9', subject: 'Fizik', name: 'Modern Fizik', isFrequent: true, note: '🔥 Her yıl 2 soru banko.' },
      
      { id: 'ayt_k1', subject: 'Kimya', name: 'Modern Atom Teorisi', isFrequent: true },
      { id: 'ayt_k2', subject: 'Kimya', name: 'Gazlar ve Gaz Yasaları', isFrequent: true, note: '🔥 Her yıl 1-2 soru.' },
      { id: 'ayt_k3', subject: 'Kimya', name: 'Sıvı Çözeltiler ve Çözünürlük', isFrequent: true, note: '🔥 Her yıl 1-2 soru.' },
      { id: 'ayt_k4', subject: 'Kimya', name: 'Tepkimelerde Enerji ve Hız', isFrequent: true },
      { id: 'ayt_k5', subject: 'Kimya', name: 'Kimyasal Denge ve pH', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      { id: 'ayt_k6', subject: 'Kimya', name: 'Kimya ve Elektrik (Elektroliz)', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      { id: 'ayt_k7', subject: 'Kimya', name: 'Organik Kimya', isFrequent: true, note: '🔥 AYT Kimya\'nın kalbi! Her yıl 3-4 soru!' },
      
      { id: 'ayt_b1', subject: 'Biyoloji', name: 'Sinir ve Endokrin Sistemi', isFrequent: true },
      { id: 'ayt_b2', subject: 'Biyoloji', name: 'Destek ve Hareket Sistemi', isFrequent: true },
      { id: 'ayt_b3', subject: 'Biyoloji', name: 'Sindirim ve Dolaşım Sistemi', isFrequent: true, note: '🔥 Her yıl en az 2 soru!' },
      { id: 'ayt_b4', subject: 'Biyoloji', name: 'Solunum ve Boşaltım Sistemi', isFrequent: true },
      { id: 'ayt_b5', subject: 'Biyoloji', name: 'DNA, RNA ve Protein Sentezi', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      { id: 'ayt_b6', subject: 'Biyoloji', name: 'Fotosentez ve Kemosentez', isFrequent: true },
      { id: 'ayt_b7', subject: 'Biyoloji', name: 'Hücresel Solunum', isFrequent: true },
      { id: 'ayt_b8', subject: 'Biyoloji', name: 'Bitki Biyolojisi', isFrequent: true, note: '🔥 Her yıl 3 soru banko.' },
      
      { id: 'ayt_ed1', subject: 'Edebiyat & Sosyal', name: 'Şiir Bilgisi ve Söz Sanatları', isFrequent: true, note: '🔥 Her yıl 3-4 soru.' },
      { id: 'ayt_ed2', subject: 'Edebiyat & Sosyal', name: 'Divan Edebiyatı', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' },
      { id: 'ayt_ed3', subject: 'Edebiyat & Sosyal', name: 'Tanzimat ve Servetifünun Edebiyatı', isFrequent: true },
      { id: 'ayt_ed4', subject: 'Edebiyat & Sosyal', name: 'Cumhuriyet Dönemi Edebiyatı', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' }
    ]
  },
  LGS: {
    LGS: [
      { id: 'lgs_m1', subject: 'Matematik', name: 'Çarpanlar ve Katlar', isFrequent: true, note: 'Her yıl 1-2 soru.' },
      { id: 'lgs_m2', subject: 'Matematik', name: 'EBOB ve EKOK', isFrequent: true },
      { id: 'lgs_m3', subject: 'Matematik', name: 'Üslü İfadeler', isFrequent: true, note: '🔥 Her yıl banko 2-3 soru!' },
      { id: 'lgs_m4', subject: 'Matematik', name: 'Kareköklü İfadeler', isFrequent: true, note: '🔥 LGS Matematik\'in kralı! (3 Soru)' },
      { id: 'lgs_m5', subject: 'Matematik', name: 'Veri Analizi ve Grafikler', isFrequent: true },
      { id: 'lgs_m6', subject: 'Matematik', name: 'Olasılık', isFrequent: true, note: 'Her yıl 1 soru banko.' },
      { id: 'lgs_m7', subject: 'Matematik', name: 'Cebirsel İfadeler', isFrequent: true },
      { id: 'lgs_m8', subject: 'Matematik', name: 'Özdeşlikler', isFrequent: true, note: '🔥 Her yıl kesin 2 soru!' },
      { id: 'lgs_m9', subject: 'Matematik', name: 'Doğrusal Denklemler ve Eğim', isFrequent: true, note: '🔥 Her yıl 3-4 soru.' },
      { id: 'lgs_m10', subject: 'Matematik', name: 'Eşitsizlikler', isFrequent: true },
      { id: 'lgs_m11', subject: 'Matematik', name: 'Üçgenler ve Benzerlik', isFrequent: true, note: 'Her yıl 2 soru.' },
      
      { id: 'lgs_t1', subject: 'Türkçe', name: 'Sözcükte Anlam', isFrequent: true, note: 'Her yıl 3 soru.' },
      { id: 'lgs_t2', subject: 'Türkçe', name: 'Cümlede Anlam', isFrequent: true },
      { id: 'lgs_t3', subject: 'Türkçe', name: 'Paragrafta Anlam', isFrequent: true, note: '🔥 LGS\'nin kalbi! Her yıl 10-12 soru!' },
      { id: 'lgs_t4', subject: 'Türkçe', name: 'Sözel Mantık ve Tablo Okuma', isFrequent: true, note: '🔥 Her yıl 3-4 yeni nesil soru!' },
      { id: 'lgs_t5', subject: 'Türkçe', name: 'Fiilimsiler', isFrequent: true, note: '🔥 Her yıl banko 1 soru!' },
      { id: 'lgs_t6', subject: 'Türkçe', name: 'Cümlenin Ögeleri', isFrequent: true },
      { id: 'lgs_t7', subject: 'Türkçe', name: 'Yazım Rules ve Noktalama', isFrequent: true, note: '🔥 Her yıl 2 soru.' },
      
      { id: 'lgs_f1', subject: 'Fen Bilimleri', name: 'Mevsimler ve İklim', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'lgs_f2', subject: 'Fen Bilimleri', name: 'DNA ve Genetik Kod', isFrequent: true, note: '🔥 Her yıl 3-4 soru!' },
      { id: 'lgs_f3', subject: 'Fen Bilimleri', name: 'Katı, Sıvı ve Gaz Basıncı', isFrequent: true, note: '🔥 Her yıl kesin 2-3 soru!' },
      { id: 'lgs_f4', subject: 'Fen Bilimleri', name: 'Periyodik Sistem ve Asit-Bazlar', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' },
      { id: 'lgs_f5', subject: 'Fen Bilimleri', name: 'Basit Makineler', isFrequent: true, note: 'Her yıl 2 soru.' },
      { id: 'lgs_f6', subject: 'Fen Bilimleri', name: 'Enerji Dönüşümleri', isFrequent: true },
      
      { id: 'lgs_in1', subject: 'İnkılap Tarihi', name: 'Bir Kahraman Doğuyor', isFrequent: true },
      { id: 'lgs_in2', subject: 'İnkılap Tarihi', name: 'Milli Uyanış ve Cepheler', isFrequent: true, note: '🔥 Her yıl 3-4 soru!' },
      { id: 'lgs_in3', subject: 'İnkılap Tarihi', name: 'Atatürkçülük ve İnkılaplar', isFrequent: true, note: '🔥 Her yıl 3 soru.' }
    ]
  },
  KPSS: {
    'KPSS Lisans': [
      { id: 'kpssl_t1', subject: 'Genel Yetenek (Türkçe)', name: 'Sözcükte Anlam', isFrequent: true },
      { id: 'kpssl_t2', subject: 'Genel Yetenek (Türkçe)', name: 'Cümlede Anlam', isFrequent: true },
      { id: 'kpssl_t3', subject: 'Genel Yetenek (Türkçe)', name: 'Paragrafta Yapı ve Anlam', isFrequent: true, note: '🔥 Her yıl 15-18 Soru!' },
      { id: 'kpssl_t4', subject: 'Genel Yetenek (Türkçe)', name: 'Dil Bilgisi', isFrequent: true, note: 'Her yıl 4 soru.' },
      { id: 'kpssl_t5', subject: 'Genel Yetenek (Türkçe)', name: 'Sözel Mantık', isFrequent: true, note: '🔥 Her yıl banko 4 soru!' },
      
      { id: 'kpssl_m1', subject: 'Genel Yetenek (Matematik)', name: 'Temel Kavramlar ve Sayılar', isFrequent: true },
      { id: 'kpssl_m2', subject: 'Genel Yetenek (Matematik)', name: 'Üslü Sayılar', isFrequent: true },
      { id: 'kpssl_m3', subject: 'Genel Yetenek (Matematik)', name: 'Köklü Sayılar', isFrequent: true },
      { id: 'kpssl_m4', subject: 'Genel Yetenek (Matematik)', name: 'Çarpanlara Ayırma', isFrequent: true },
      { id: 'kpssl_m5', subject: 'Genel Yetenek (Matematik)', name: 'Sayı ve Kesir Problemleri', isFrequent: true, note: '🔥 Her yıl 10-12 Soru!' },
      { id: 'kpssl_m6', subject: 'Genel Yetenek (Matematik)', name: 'Sayısal Mantık', isFrequent: true, note: '🔥 Her yıl 4-6 soru banko.' },
      { id: 'kpssl_m7', subject: 'Genel Yetenek (Matematik)', name: 'Geometri', isFrequent: true },
      
      { id: 'kpssl_tr1', subject: 'Genel Kültür (Tarih)', name: 'İslamiyet Öncesi Türk Tarihi', isFrequent: true },
      { id: 'kpssl_tr2', subject: 'Genel Kültür (Tarih)', name: 'Osmanlı Tarihi ve Kültür Medeniyet', isFrequent: true, note: '🔥 Her yıl 6-7 soru.' },
      { id: 'kpssl_tr3', subject: 'Genel Kültür (Tarih)', name: 'Milli Mücadele Dönemi', isFrequent: true, note: '🔥 Her yıl kesin 6-7 soru!' },
      { id: 'kpssl_tr4', subject: 'Genel Kültür (Tarih)', name: 'Atatürk İnkılapları', isFrequent: true, note: '🔥 Her yıl 4-5 soru!' },
      { id: 'kpssl_tr5', subject: 'Genel Kültür (Tarih)', name: 'Çağdaş Türk ve Dünya Tarihi', isFrequent: true },
      
      { id: 'kpssl_c1', subject: 'Genel Kültür (Coğrafya)', name: 'Türkiye Coğrafi Konumu', isFrequent: true },
      { id: 'kpssl_c2', subject: 'Genel Kültür (Coğrafya)', name: 'Türkiye İklimi ve Yer Şekilleri', isFrequent: true },
      { id: 'kpssl_c3', subject: 'Genel Kültür (Coğrafya)', name: 'Türkiye Nüfusu ve Tarım/Sanayi', isFrequent: true, note: '🔥 Her yıl 8-10 soru.' },
      
      { id: 'kpssl_v1', subject: 'Genel Kültür (Vatandaşlık)', name: 'Anayasa Hukuku ve Temel Haklar', isFrequent: true, note: '🔥 Her yıl 5 soru.' },
      { id: 'kpssl_v2', subject: 'Genel Kültür (Vatandaşlık)', name: 'İdare Hukuku', isFrequent: true },
      { id: 'kpssl_v3', subject: 'Genel Kültür (Vatandaşlık)', name: 'Güncel Bilgiler', isFrequent: true, note: '🔥 Banko 6 Güncel Soru!' }
    ],
    'KPSS Önlisans': [
      { id: 'kpsso_t1', subject: 'Genel Yetenek (Türkçe)', name: 'Sözcük ve Cümlede Anlam', isFrequent: true },
      { id: 'kpsso_t2', subject: 'Genel Yetenek (Türkçe)', name: 'Paragrafta Anlam ve Yapı', isFrequent: true, note: '🔥 Her yıl 14-16 Soru!' },
      { id: 'kpsso_t3', subject: 'Genel Yetenek (Türkçe)', name: 'Sözel Mantık', isFrequent: true, note: '🔥 Banko 4 soru.' },
      { id: 'kpsso_m1', subject: 'Genel Yetenek (Matematik)', name: 'Temel Sayılar ve İşlemler', isFrequent: true },
      { id: 'kpsso_m2', subject: 'Genel Yetenek (Matematik)', name: 'Üslü ve Köklü Sayılar', isFrequent: true },
      { id: 'kpsso_m3', subject: 'Genel Yetenek (Matematik)', name: 'Problemler ve Sayısal Mantık', isFrequent: true, note: '🔥 Her yıl 10 Soru!' },
      { id: 'kpsso_tr1', subject: 'Genel Kültür (Tarih)', name: 'Osmanlı ve İnkılap Tarihi', isFrequent: true, note: '🔥 Her yıl 12 soru.' },
      { id: 'kpsso_cv1', subject: 'Coğrafya & Vatandaşlık', name: 'Türkiye Coğrafyası ve Anayasa', isFrequent: true, note: '🔥 Her yıl 27 soru.' }
    ],
    'KPSS Ortaöğretim': [
      { id: 'kpssrt_t1', subject: 'Genel Yetenek (Türkçe)', name: 'Sözcük ve Paragraf Yorumlama', isFrequent: true, note: '🔥 Her yıl 16 soru.' },
      { id: 'kpssrt_m1', subject: 'Genel Yetenek (Matematik)', name: 'Temel Matematik ve Problemler', isFrequent: true, note: '🔥 Her yıl 12 soru.' },
      { id: 'kpssrt_tr1', subject: 'Genel Kültür (Tarih)', name: 'Osmanlı ve İnkılap Tarihi', isFrequent: true, note: '🔥 Her yıl 14 soru.' },
      { id: 'kpssrt_cv1', subject: 'Coğrafya & Vatandaşlık', name: 'Türkiye Coğrafyası ve Vatandaşlık', isFrequent: true }
    ]
  }
};

// Derslerin Canlı Renk Paleti Haritası (Badge, Border, Background)
export const SUBJECT_COLOR_MAP = {
  'Matematik':                  { main: '#6366f1', bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
  'Geometri':                   { main: '#3b82f6', bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
  'Türkçe':                     { main: '#f43f5e', bg: '#ffe4e6', text: '#9f1239', border: '#fecdd3' },
  'Fizik':                      { main: '#06b6d4', bg: '#cffafe', text: '#155e75', border: '#a5f3fc' },
  'Kimya':                      { main: '#a855f7', bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' },
  'Biyoloji':                   { main: '#10b981', bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  'Tarih':                      { main: '#f59e0b', bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  'Coğrafya':                   { main: '#14b8a6', bg: '#ccfbf1', text: '#115e59', border: '#99f6e4' },
  'Felsefe & Din Kültürü':      { main: '#8b5cf6', bg: '#ede9fe', text: '#5b21b6', border: '#ddd6fe' },
  'Edebiyat & Sosyal':          { main: '#e11d48', bg: '#ffe4e6', text: '#881337', border: '#fecdd3' },
  'Fen Bilimleri':              { main: '#0ea5e9', bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  'İnkılap Tarihi':             { main: '#d97706', bg: '#fef3c7', text: '#78350f', border: '#fde68a' },
  'Din & İngilizce':            { main: '#8b5cf6', bg: '#ede9fe', text: '#4c1d95', border: '#ddd6fe' },
  'Genel Yetenek (Türkçe)':     { main: '#f43f5e', bg: '#ffe4e6', text: '#9f1239', border: '#fecdd3' },
  'Genel Yetenek (Matematik)':  { main: '#6366f1', bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
  'Genel Kültür (Tarih)':       { main: '#f59e0b', bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  'Genel Kültür (Coğrafya)':    { main: '#14b8a6', bg: '#ccfbf1', text: '#115e59', border: '#99f6e4' },
  'Genel Kültür (Vatandaşlık)': { main: '#64748b', bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
  'Coğrafya & Vatandaşlık':     { main: '#0d9488', bg: '#ccfbf1', text: '#115e59', border: '#99f6e4' }
};

export const getSubjectColor = (subject) => {
  return SUBJECT_COLOR_MAP[subject] || { main: '#6366f1', bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' };
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
