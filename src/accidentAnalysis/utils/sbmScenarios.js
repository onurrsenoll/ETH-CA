// SBM (Sigortacılık Bilgi Merkezi) Maddi Hasarlı Kaza Durum Senaryoları
// Kaynak: https://www.sbm.org.tr/upload/Sbm/Sayfalar/ktt_kaza_durum_senaryolari-1.pdf

export const SBM_CATEGORIES = [
  { id: 'traffic_signal', label: 'Trafik İşaretleri Bulunan Kavşaklar' },
  { id: 'road', label: 'Tek ve Çift Yönlü Yollar' },
  { id: 'unmarked_junction', label: 'Kavşak Kolları İşaretlenmemiş Kavşaklar' },
  { id: 'roundabout', label: 'Dönel Kavşaklar' },
  { id: 'three_vehicle', label: 'Üç Araçlı Kazalar' },
  { id: 'chain', label: 'Çok Araçlı Zincirleme Kazalar' },
];

export const SBM_SCENARIOS = [
  // TRAFİK İŞARETLERİ BULUNAN KAVŞAKLAR
  {
    id: 'D1A',
    category: 'traffic_signal',
    title: 'Durum 1A - Kırmızı Işıkta Arkadan Çarpma',
    description: 'Her iki araç aynı yönde seyir halinde iken A aracı kırmızı ışıkta kavşakta duruyor. Takip mesafesini korumayan B aracı, A aracına çarpıyor.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.56/c ve Yön:107',
    keywords: ['arkadan çarpma', 'kırmızı ışık', 'takip mesafesi', 'kavşak'],
  },
  {
    id: 'D1B',
    category: 'traffic_signal',
    title: 'Durum 1B - Yeşil Işıkta Ani Durma',
    description: 'Her iki araç aynı yönde seyir halinde iken A aracı yeşil ışıkta aniden duruyor. B aracı duraklamanın yasak olduğu yerde A aracına çarpıyor.',
    faultA: 50,
    faultB: 50,
    legalBasis: 'A: K.Y.T.K.57 ve Yön:109/e, B: K.Y.T.K.52 ve Yön:101',
    keywords: ['ani durma', 'yeşil ışık', 'duraklama yasağı', 'hız'],
  },
  {
    id: 'D1C',
    category: 'traffic_signal',
    title: 'Durum 1C - Kırmızı Işıktan Yeşile Geçişte Geri Manevra',
    description: 'Her iki araç aynı yönde seyir halinde iken kırmızı ışık yeşile dönüyor. A aracı geriye doğru hareket ediyor.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.67 ve Yön:137',
    keywords: ['geri manevra', 'ışık', 'geriye hareket'],
  },
  {
    id: 'D2',
    category: 'traffic_signal',
    title: 'Durum 2 - Kırmızı Işık İhlali',
    description: 'Kırmızı ışıkta geçiş yapan A aracı kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.47 ve Yön.95',
    keywords: ['kırmızı ışık', 'ışık ihlali', 'kavşak'],
  },
  {
    id: 'D3',
    category: 'traffic_signal',
    title: 'Durum 3 - Yanlış Şeritten Gelen Araç',
    description: 'A aracına yeşil ışık yanıyor ve kurala uygun olarak dönüş yapıyor. Yanlış şeritten gelen ya da yanlış şeritte bekleyen B aracı kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.47-56 ve Yön:95',
    keywords: ['yanlış şerit', 'yeşil ışık', 'dönüş', 'şerit ihlali'],
  },
  {
    id: 'D4',
    category: 'traffic_signal',
    title: 'Durum 4 - İki Taraf da Yeşil Işık İddiası',
    description: 'Her iki araç sürücüsü de kendisine yeşil ışık yandığını iddia ediyor. Her iki araç da kavşağa yaklaşırken dikkatli olmadığı için eşit kusurludur.',
    faultA: 50,
    faultB: 50,
    legalBasis: 'K.Y.T.K.57 ve Yön:109/d',
    keywords: ['yeşil ışık iddiası', 'kavşak', 'dikkat'],
  },
  {
    id: 'D5',
    category: 'traffic_signal',
    title: 'Durum 5 - Yetkili Kişinin İşaretine Uymama',
    description: 'B aracı, yetkili ve görevli kişilerin işaretine uymadığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.47/a ve Yön:95/a',
    keywords: ['trafik polisi', 'yetkili işaret', 'dur işareti'],
  },
  {
    id: 'D6',
    category: 'traffic_signal',
    title: 'Durum 6 - Tali Yoldan Ana Yola Çıkış',
    description: 'Tali yoldan ana yola çıkan B aracı ana yolda seyir halinde olan araca yol vermediği için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.57/b-5 Yön:109/c-4',
    keywords: ['tali yol', 'ana yol', 'geçiş hakkı', 'yol verme'],
  },

  // TEK VE ÇİFT YÖNLÜ YOLLAR
  {
    id: 'D7',
    category: 'road',
    title: 'Durum 7 - Karşı Şeride Geçme',
    description: 'B aracı karşı şeride geçerek kural ihlali yapmıştır.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.56-1, 84/3 ve Yön:94/m, 157/3',
    keywords: ['karşı şerit', 'şerit ihlali', 'karşı yön'],
  },
  {
    id: 'D8',
    category: 'road',
    title: 'Durum 8 - Mecburi İstikametten Ters Geri Manevra',
    description: 'B aracı, mecburi istikametten ters istikamete geri manevra yaptığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.67 ve Yön:137',
    keywords: ['geri manevra', 'mecburi istikamet', 'ters yön'],
  },
  {
    id: 'D9',
    category: 'road',
    title: 'Durum 9 - Arkadan Çarpma (Düz Yol)',
    description: 'A aracı B aracına arkadan çarptığı için kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.56/1-c ve Yön:107',
    keywords: ['arkadan çarpma', 'takip mesafesi', 'düz yol'],
  },
  {
    id: 'D10',
    category: 'road',
    title: 'Durum 10 - Arkadan Çarpma (Yavaşlayan Araca)',
    description: 'A aracı arkadan çarptığı için kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.56/1-c ve Yön:107',
    keywords: ['arkadan çarpma', 'yavaşlama', 'takip mesafesi'],
  },
  {
    id: 'D18',
    category: 'road',
    title: 'Durum 18 - Dar Yolda Karşılaşma',
    description: 'Tek aracın geçebileceği kadar dar yollarda karşılaşma halinde, B aracı, A aracına geçiş hakkı vermesi gerekirken vermediği için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.56/e ve Yön:106/c',
    keywords: ['dar yol', 'karşılaşma', 'geçiş hakkı'],
  },
  {
    id: 'D19',
    category: 'road',
    title: 'Durum 19 - Karşılıklı Şerit İhlali',
    description: 'Her iki araç da diğerinin şeridini ihlal edip en sağ şeridi takip etmedikleri için eşit kusurludur.',
    faultA: 50,
    faultB: 50,
    legalBasis: 'K.Y.T.K.46/a ve Yön:94/a',
    keywords: ['şerit ihlali', 'karşılıklı', 'sağ şerit'],
  },
  {
    id: 'D20',
    category: 'road',
    title: 'Durum 20 - Hatalı Sollama',
    description: 'A aracı, önünde seyreden aracı geçerken sol tarafından gelen diğer aracın geçmesini beklemediği için kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.54/l-a ve Yön:103/a',
    keywords: ['sollama', 'geçme', 'sol taraf'],
  },
  {
    id: 'D22',
    category: 'road',
    title: 'Durum 22 - Güvenli Mesafe Bırakmadan Sollama',
    description: 'Geçiş yapmak isteyen araç sürücüsü, geçeceği aracı uyararak güvenli mesafede sollamalıdır. Bu kuralları ihlal eden A aracı kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.54, 55 ve 56 ve Yön:103',
    keywords: ['sollama', 'güvenli mesafe', 'geçme kuralı'],
  },
  {
    id: 'D25',
    category: 'road',
    title: 'Durum 25 - İz/Mülkten Çıkış',
    description: 'B aracı, bir iz veya mülkten çıkarken karayolundaki A aracının geçişini beklemediği için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.57 ve Yön:109/c-6',
    keywords: ['mülk çıkışı', 'iz', 'otopark çıkışı', 'yol verme'],
  },
  {
    id: 'D26',
    category: 'road',
    title: 'Durum 26 - Şerit İzleme İhlali',
    description: 'B aracı, şerit izleme değiştirme kuralını ihlal ederek her iki şeridi de kullandığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.56/a-1 ve Yön:94',
    keywords: ['şerit değiştirme', 'şerit ihlali', 'çift şerit'],
  },
  {
    id: 'D27',
    category: 'road',
    title: 'Durum 27 - Park Halindeki Araca Çarpma',
    description: 'A aracı kurallara uygun park etmiş araçlara çarptığı için kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.84/ı',
    keywords: ['park', 'duran araç', 'park halinde', 'çarpma'],
  },
  {
    id: 'D35',
    category: 'road',
    title: 'Durum 35 - Akan Trafikte Kapı Açma',
    description: 'A aracı, akan trafiğin önünde kapısını açtığı için kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.',
    keywords: ['kapı açma', 'akan trafik', 'kapı'],
  },
  {
    id: 'D46',
    category: 'road',
    title: 'Durum 46 - Araçtan Yük/Parça Düşmesi',
    description: 'A aracı seyir halindeyken aracının kasasından düşen yük ya da araca ait parçalar kazaya sebebiyet verdiği için kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.',
    keywords: ['yük düşmesi', 'parça düşmesi', 'kasa'],
  },
  {
    id: 'D47',
    category: 'road',
    title: 'Durum 47 - Kontrolsüz U Dönüşü',
    description: 'B aracı, kontrolsüz U dönüşü yaparak A aracı ile çarpışıyor.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.',
    keywords: ['u dönüşü', 'kontrolsüz dönüş'],
  },
  {
    id: 'D48',
    category: 'road',
    title: 'Durum 48 - Ters Yöne Giriş',
    description: 'A aracı, ters yöne girerek B aracı ile çarpışıyor.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.',
    keywords: ['ters yön', 'karşı yön', 'ters istikamet'],
  },

  // KAVŞAK KOLLARI İŞARETLENMEMİŞ KAVŞAKLAR
  {
    id: 'D11',
    category: 'unmarked_junction',
    title: 'Durum 11 - İşaretsiz Kavşakta Arkadan Çarpma',
    description: 'A aracı arkadan çarptığı için kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.56/1-c ve Yön:107',
    keywords: ['arkadan çarpma', 'işaretsiz kavşak'],
  },
  {
    id: 'D12',
    category: 'unmarked_junction',
    title: 'Durum 12 - Dar Kavisle Dönüş Yapmama',
    description: 'B aracı sağ şeritten dar kavisle dönüş yapmadığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.53/a-1 ve Yön:102/a',
    keywords: ['dar kavis', 'dönüş', 'sağ şerit', 'kavşak'],
  },
  {
    id: 'D13',
    category: 'unmarked_junction',
    title: 'Durum 13 - Sağdan Gelen Aracın Geçiş Önceliği',
    description: 'İşaretsiz kavşakta B aracı, sağdan gelen A aracının geçiş önceliği kuralına uymadığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.57/1-c ve Yön:109/d-2',
    keywords: ['sağdan gelen', 'geçiş önceliği', 'işaretsiz kavşak'],
  },
  {
    id: 'D14',
    category: 'unmarked_junction',
    title: 'Durum 14 - Karşılıklı Şerit İhlali (Kavşak)',
    description: 'Her iki araç da en sağ şeridi takip etmeyip, kavşak ortasında diğer aracın şeridini ihlal etmektedir.',
    faultA: 50,
    faultB: 50,
    legalBasis: 'K.Y.T.K.46/a ve Yön:94/a',
    keywords: ['şerit ihlali', 'kavşak', 'karşılıklı'],
  },
  {
    id: 'D15',
    category: 'unmarked_junction',
    title: 'Durum 15 - Yasak Yerde Durma ve Dar Kavis Dönüş',
    description: 'B aracı sağ şeritte durması gerekirken yasak yerde durduğu için %50 kusurlu. A aracı da sağa dönüşü dar kavis ile yapmadığı için %50 kusurludur.',
    faultA: 50,
    faultB: 50,
    legalBasis: 'A: K.Y.T.K.53/a-4, B: K.Y.T.K.60 ve Yön:113/b',
    keywords: ['yasak yerde durma', 'dar kavis', 'dönüş'],
  },
  {
    id: 'D23',
    category: 'unmarked_junction',
    title: 'Durum 23 - Kavşağa Hızlı Yaklaşma',
    description: 'A aracı dönüşünü kurallara uygun tamamlarken B aracı kavşağa yaklaşırken hızını azaltmadığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.52/a Yön:101',
    keywords: ['kavşak', 'hız', 'dönüş', 'hız azaltma'],
  },

  // DÖNEL KAVŞAKLAR
  {
    id: 'D16',
    category: 'roundabout',
    title: 'Durum 16 - Dönel Kavşakta Yanlış Yön Dönüş',
    description: 'B aracı, dönel kavşakta ada etrafında sağdan dönüş yapmadığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.53/c ve Yön:102/c',
    keywords: ['dönel kavşak', 'döner kavşak', 'ada', 'sağdan dönüş'],
  },
  {
    id: 'D17',
    category: 'roundabout',
    title: 'Durum 17 - Dönel Kavşakta Ada Etrafında Yanlış Dönüş',
    description: 'B aracı, döner kavşakta ada etrafında sağdan dönüş yapmadığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.53/c ve Yön:102/c',
    keywords: ['dönel kavşak', 'döner kavşak', 'yanlış dönüş'],
  },
  {
    id: 'D32',
    category: 'roundabout',
    title: 'Durum 32 - Dönel Kavşakta Şerit İhlali',
    description: 'B aracı dönel kavşakta orta adaya yakın şeritten dönüş yapması gerekirken, A aracının şeridini ihlal ettiği için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.53 ve Yön:102',
    keywords: ['dönel kavşak', 'şerit ihlali', 'orta ada'],
  },
  {
    id: 'D33A',
    category: 'roundabout',
    title: 'Durum 33A - Dönel Kavşakta İçeri Giren Araç Çarpması',
    description: 'A aracı dönel kavşakta kurallara uygun olarak dönüş yapan B aracına çarptığı için kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'K.Y.T.K.57/b-6 ve Yön:109',
    keywords: ['dönel kavşak', 'giriş', 'içeri giren araç'],
  },
  {
    id: 'D33B',
    category: 'roundabout',
    title: 'Durum 33B - Dönel Kavşakta Dışardan Çarpma',
    description: 'B aracı dönel kavşakta kurallara uygun olarak dönüş yapan A aracına çarptığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.57/b-6 ve Yön:109',
    keywords: ['dönel kavşak', 'dışardan çarpma'],
  },

  // ÜÇ ARAÇLI KAZALAR
  {
    id: 'D28A',
    category: 'three_vehicle',
    title: 'Durum 28A - Arızalı Araç Önlem Almış (B Çarpıyor)',
    description: 'Arıza yapan araç önlem almış ise; A aracı yavaşladığı esnada B aracı A aracına çarpıyor. B aracı takip mesafesini korumadığı için kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.56/1-c',
    keywords: ['arızalı araç', 'önlem', 'arkadan çarpma', 'üç araç'],
  },
  {
    id: 'D28B',
    category: 'three_vehicle',
    title: 'Durum 28B - Arızalı Araç Önlem Almış (A Çarpıyor)',
    description: 'Arıza yapan araç önlem almış ise; A aracı arıza yapmış araca çarptığı için kusurlu. Akabinde B aracı A aracına arkadan çarptığı için B de kusurludur.',
    faultA: 100,
    faultB: 0,
    legalBasis: 'A-C: K.Y.T.K.84/12, B-A: K.Y.T.K.56/1-c',
    keywords: ['arızalı araç', 'önlem almış', 'arkadan çarpma'],
  },
  {
    id: 'D28C',
    category: 'three_vehicle',
    title: 'Durum 28C - Arızalı Araç Önlem Almamış',
    description: 'Arıza yapan araç önlem almadığı için %50, A aracı duran araca çarptığı için %50 kusurlu. B aracı A aracına karşı %100 kusurludur.',
    faultA: 50,
    faultB: 50,
    legalBasis: 'C: K.Y.T.K.59 ve Yön:116, B-A: K.Y.T.K.56/1-c',
    keywords: ['arızalı araç', 'önlem almamış', 'üç araç'],
  },
  {
    id: 'D29',
    category: 'three_vehicle',
    title: 'Durum 29 - Arızalı Araçtan Kaçınma ile Karşı Araca Çarpma',
    description: 'Arıza yapan ve önlem almayan araç %50 kusurlu. A aracı arıza yapan araca çarpmamak için karşı şeride geçerek C aracı ile çarpıştığı için %50 kusurludur.',
    faultA: 50,
    faultB: 50,
    legalBasis: 'A: K.Y.T.K.84/b, B: K.Y.T.K.59,60 ve Yön:116',
    keywords: ['arıza', 'karşı şerit', 'kaçınma', 'üç araç'],
  },
  {
    id: 'D34',
    category: 'three_vehicle',
    title: 'Durum 34 - Dönel Kavşakta Üç Araçlı Kaza',
    description: 'A aracı dönel kavşakta dönüşünü tamamlamayıp kazaya sebebiyet verdiği için %50, C aracı takip mesafesini korumadığı için %50 kusurludur. B aracında kusur yoktur.',
    faultA: 50,
    faultB: 0,
    legalBasis: 'A: K.Y.T.K.53/c ve Yön:102, C: K.Y.T.K.56/1c ve Yön:107',
    keywords: ['dönel kavşak', 'üç araç', 'takip mesafesi'],
  },
  {
    id: 'D44',
    category: 'three_vehicle',
    title: 'Durum 44 - Ana Yola Dikkatsiz Çıkış + Arkadan Çarpma',
    description: 'A aracı ana yola dikkatsiz çıkarak B aracına çarpıyor (%100 kusurlu). C aracı da B aracına arkadan çarpıyor (C, B\'ye karşı %100 kusurlu).',
    faultA: 100,
    faultB: 0,
    legalBasis: 'A-B: K.Y.T.K.57, C-B: K.Y.T.K.56/1-c',
    keywords: ['ana yol çıkışı', 'arkadan çarpma', 'dikkatsiz', 'üç araç'],
  },
  {
    id: 'D45',
    category: 'three_vehicle',
    title: 'Durum 45 - Çok Şeritli Yolda Yandan Çarpma Etkisi',
    description: 'C aracı çok şeritli yolda B aracına çarpıyor. Çarpmanın etkisi ile B aracı A aracına çarpıyor. C aracı %100 kusurludur.',
    faultA: 0,
    faultB: 0,
    legalBasis: 'K.Y.T.K.',
    keywords: ['çok şerit', 'yandan çarpma', 'etki', 'zincirleme'],
  },

  // ZİNCİRLEME KAZALAR
  {
    id: 'D30',
    category: 'chain',
    title: 'Durum 30 - Sıralı Arkadan Çarpma (Ayrı Ayrı)',
    description: 'A aracı beklerken B çarpıyor, C B\'ye çarpıyor, D C\'ye çarpıyor. Her arkadan çarpan araç, önündekine karşı %100 kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.56/1c ve Yön:107',
    keywords: ['zincirleme', 'arkadan çarpma', 'sıralı', 'çok araçlı'],
  },
  {
    id: 'D31',
    category: 'chain',
    title: 'Durum 31 - Zincirleme Tek Sebep',
    description: 'D aracı takip mesafesini korumayıp C aracına hızla çarpması, zincirleme kazaya neden olmuştur. D aracı tüm araçlara karşı %100 kusurludur.',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.56/1c ve Yön:107',
    keywords: ['zincirleme', 'tek sebep', 'hızlı çarpma', 'domino'],
  },
  {
    id: 'D43',
    category: 'chain',
    title: 'Durum 43 - İki Ayrı Zincirleme Olay',
    description: 'A aracı duruyor, B aracı A\'ya çarpıyor (B %100 kusurlu). C aracı kaza nedeniyle duruyor, D aracı C\'ye çarpıyor (D %100 kusurlu).',
    faultA: 0,
    faultB: 100,
    legalBasis: 'K.Y.T.K.56/1c ve Yön:107',
    keywords: ['iki olay', 'ayrı zincirleme', 'duran araç'],
  },
];

// Senaryo eşleştirme - ihlallere göre en uygun senaryoyu bul
export function matchScenario(vehicleAViolations, vehicleBViolations, impactA, impactB) {
  const matches = [];

  // Arkadan çarpma senaryoları
  if (vehicleAViolations.includes('v7')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D9'), confidence: 95 });
  }
  if (vehicleBViolations.includes('v7')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D1A'), confidence: 95 });
  }

  // Kırmızı ışık ihlali
  if (vehicleAViolations.includes('v1') && !vehicleBViolations.includes('v1')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D2'), confidence: 90 });
  }
  if (vehicleBViolations.includes('v1') && !vehicleAViolations.includes('v1')) {
    // D2 ters (B kırmızı ışıkta geçmiş)
    matches.push({ scenario: { ...SBM_SCENARIOS.find(s => s.id === 'D2'), faultA: 0, faultB: 100, description: 'Kırmızı ışıkta geçiş yapan B aracı kusurludur.' }, confidence: 90 });
  }

  // Karşı yönden gelme / ters yön
  if (vehicleAViolations.includes('v3')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D48'), confidence: 85 });
  }
  if (vehicleBViolations.includes('v3')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D7'), confidence: 85 });
  }

  // Kavşakta geçiş önceliğine uymama
  if (vehicleBViolations.includes('v5') && !vehicleAViolations.includes('v5')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D6'), confidence: 80 });
  }
  if (vehicleAViolations.includes('v5') && !vehicleBViolations.includes('v5')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D13'), confidence: 80 });
  }

  // Yetkili memurun dur işaretinde geçmek
  if (vehicleBViolations.includes('v6')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D5'), confidence: 90 });
  }
  if (vehicleAViolations.includes('v6')) {
    matches.push({ scenario: { ...SBM_SCENARIOS.find(s => s.id === 'D5'), faultA: 100, faultB: 0 }, confidence: 90 });
  }

  // Sağa / Sola dönüş kurallarına uymama
  if (vehicleAViolations.includes('v8') || vehicleAViolations.includes('v9')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D12'), confidence: 70 });
  }
  if (vehicleBViolations.includes('v8') || vehicleBViolations.includes('v9')) {
    matches.push({ scenario: { ...SBM_SCENARIOS.find(s => s.id === 'D12'), faultA: 0, faultB: 100 }, confidence: 70 });
  }

  // Geri manevra
  if (vehicleAViolations.includes('v10')) {
    matches.push({ scenario: { ...SBM_SCENARIOS.find(s => s.id === 'D8'), faultA: 100, faultB: 0 }, confidence: 85 });
  }
  if (vehicleBViolations.includes('v10')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D8'), confidence: 85 });
  }

  // Sollama kurallarına uymama
  if (vehicleAViolations.includes('v11')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D22'), confidence: 80 });
  }
  if (vehicleBViolations.includes('v11')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D20'), confidence: 80 });
  }

  // Geçiş önceliğine uymamak
  if (vehicleBViolations.includes('v12') && !vehicleAViolations.includes('v12')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D25'), confidence: 75 });
  }

  // Park kuralları / Parketme
  if (vehicleAViolations.includes('v13') && vehicleBViolations.includes('v15')) {
    // A hatalı park, B park edilmiş araca çarpmış gibi - karmaşık senaryo
  }

  // Park halindeki araca çarpma
  if (vehicleAViolations.includes('v15')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D27'), confidence: 95 });
  }
  if (vehicleBViolations.includes('v15')) {
    matches.push({ scenario: { ...SBM_SCENARIOS.find(s => s.id === 'D27'), faultA: 0, faultB: 100 }, confidence: 95 });
  }

  // Geçme yasağı
  if (vehicleAViolations.includes('v4')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D20'), confidence: 75 });
  }

  // Taşıt giremez
  if (vehicleAViolations.includes('v2')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D48'), confidence: 80 });
  }
  if (vehicleBViolations.includes('v2')) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D7'), confidence: 80 });
  }

  // Hiç ihlal yoksa eşit kusur
  if (vehicleAViolations.length === 0 && vehicleBViolations.length === 0) {
    matches.push({ scenario: SBM_SCENARIOS.find(s => s.id === 'D4'), confidence: 50 });
  }

  // Güvenilirliğe göre sırala
  matches.sort((a, b) => b.confidence - a.confidence);

  return matches;
}

// Manuel senaryo seçimine göre kusur belirle
export function getScenarioFault(scenarioId) {
  const scenario = SBM_SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) return null;
  return {
    faultA: scenario.faultA,
    faultB: scenario.faultB,
    scenario,
  };
}
