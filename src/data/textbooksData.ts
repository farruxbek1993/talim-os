export interface TextbookChapter {
  num: number;
  title: string;
  pages: string;
  summary?: string;
}

export interface Textbook {
  id: string;
  subjectId: string;
  title: string;
  author: string;
  grade: number; // e.g. 5, 6, 7, 8, 9, 10, 11
  year: number;
  pages: number;
  format: string; // e.g. 'PDF' | 'DOCX' | 'DOC' | 'TXT'
  publisher: string;
  desc: string;
  coverHue: number;
  chapters: TextbookChapter[];
  fileData?: string; // Base64 data URL
  fileName?: string;
  fileType?: string; // MIME type or extension
  fileSize?: string;
  extractedText?: string;
}


export const TEXTBOOKS: Textbook[] = [
  // MATEMATIKA
  {
    id: 'math_5',
    subjectId: 'math',
    title: 'Matematika 5-sinf darsligi',
    author: 'B.Q. Haydarov, E.S. Sariqov',
    grade: 5,
    year: 2024,
    pages: 224,
    format: 'PDF',
    publisher: 'Oʻqituvchi NMIU',
    desc: 'Tabiiy sonlar, kasrlar, geometrik figuralar va amaliy masalalar toʻplami.',
    coverHue: 215,
    fileName: 'Matematika_5_sinf.pdf',
    fileType: 'application/pdf',
    fileSize: '1.2 MB',
    chapters: [
      { num: 1, title: 'Natural sonlar va ular ustida amallar', pages: '5–45', summary: 'Natural sonlarni qoʻshish, ayirish, koʻpaytirish va boʻlish qoidalari.' },
      { num: 2, title: 'Oddiy kasrlar va oʻnli kasrlar', pages: '46–112', summary: 'Kasr tushunchasi, umumiy maxrajga keltirish va amallar.' },
      { num: 3, title: 'Geometrik shakllar va oʻlchovlar', pages: '113–168', summary: 'Burchaklar, toʻgʻri toʻrtburchak perimetri va yuzi.' },
      { num: 4, title: 'Foizlar va diagrammalar', pages: '169–220', summary: 'Sonning foizini topish va grafik diagrammalar chizish.' },
    ],
  },
  {
    id: 'math_8',
    subjectId: 'math',
    title: 'Algebra 8-sinf darsligi',
    author: 'Sh.A. Alimov, O.R. Xolmuhamedov',
    grade: 8,
    year: 2024,
    pages: 256,
    format: 'PDF',
    publisher: 'Oʻqituvchi NMIU',
    desc: 'Kvadrat tenglamalar, ratsional kasrlar, chiziqli va noaniq tengsizliklar.',
    coverHue: 220,
    chapters: [
      { num: 1, title: 'Kvadrat ildizlar va arifmetik amallar', pages: '4–52', summary: 'Haqiqiy sonlar toʻplami va kvadrat ildiz xossalari.' },
      { num: 2, title: 'Kvadrat tenglamalar va Viyet teoremasi', pages: '53–120', summary: 'Diskriminant formulasi, toʻliq va chala kvadrat tenglamalar.' },
      { num: 3, title: 'Kvadratik funksiya va uning grafigi', pages: '121–185', summary: 'Parabola xossalari, choʻqqi nuqtalari va nol qiymatlari.' },
      { num: 4, title: 'Tengsizliklar va oraliqlar usuli', pages: '186–250', summary: 'Kvadrat tengsizliklarni oraliqlar usulida yechish.' },
    ],
  },
  {
    id: 'math_9',
    subjectId: 'math',
    title: 'Geometriya 9-sinf darsligi',
    author: 'A.V. Pogorelov',
    grade: 9,
    year: 2024,
    pages: 192,
    format: 'PDF',
    publisher: 'Sharq NMAK',
    desc: 'Vektorlar, koordinatalar usuli, aylanaga oid teoremalar va fazoviy shakllar.',
    coverHue: 210,
    chapters: [
      { num: 1, title: 'Tekislikda vektorlar va amallar', pages: '6–48', summary: 'Vektorlarni qoʻshish, songa koʻpaytirish va skalyar koʻpaytma.' },
      { num: 2, title: 'Dekart koordinatalar sistemasi', pages: '49–96', summary: 'Nuqtalar orasidagi masofa, kesmani nisbatda boʻlish.' },
      { num: 3, title: 'Aylana va toʻgʻri chiziqning oʻzaro vaziyati', pages: '97–144', summary: 'Vatarlar, kesuvchilar va urinmalar xossalari.' },
      { num: 4, title: 'Muntazam koʻpburchaklar va doira yuzi', pages: '145–188', summary: 'Doira sektori, segmenti va pi sonining aniqligi.' },
    ],
  },
  {
    id: 'math_11',
    subjectId: 'math',
    title: 'Algebra va analiz asoslari 11-sinf',
    author: 'M.A. Mirzaahmedov, A.A. Rahimqoriyev',
    grade: 11,
    year: 2024,
    pages: 288,
    format: 'PDF',
    publisher: 'Oʻqituvchi NMIU',
    desc: 'Hosilaning tadbiqlari, integral hisob, kombinatorika va ehtimollar nazariyasi.',
    coverHue: 225,
    chapters: [
      { num: 1, title: 'Boshlangʻich funksiya va aniq integral', pages: '5–78', summary: 'Nyuton-Leybnits formulasi, egri chiziqli trapetsiya yuzi.' },
      { num: 2, title: 'Kombinatorika elementlari', pages: '79–134', summary: 'Oʻrinlashtirishlar, guruhlashlar va oʻrin almashtirishlar.' },
      { num: 3, title: 'Ehtimollar nazariyasi asoslari', pages: '135–204', summary: 'Tasodifiy hodisalar, geometrik ehtimollik va Bernulli formulasi.' },
      { num: 4, title: 'Tenglamalar va tengsizliklar sistemasi', pages: '205–280', summary: 'Koʻrsatkichli va logarifmik sistemalar tahlili.' },
    ],
  },

  // INFORMATIKA VA IT
  {
    id: 'it_7',
    subjectId: 'it',
    title: 'Informatika 7-sinf: Python dasturlash',
    author: 'M.T. Aripov, B.B. Begalov',
    grade: 7,
    year: 2024,
    pages: 176,
    format: 'PDF',
    publisher: 'Gʻafur Gʻulom',
    desc: 'Python tili sintaksisi, oʻzgaruvchilar, shart operatorlari va takrorlanishlar.',
    coverHue: 155,
    chapters: [
      { num: 1, title: 'Kompyuter va axborot texnologiyalari', pages: '4–36', summary: 'Axborot xavfsizligi qoidalari va OT interfeysi.' },
      { num: 2, title: 'Python tilida dasturlashga kirish', pages: '37–82', summary: 'Chiqarish (print), kiritish (input) va maʼlumot turlari.' },
      { num: 3, title: 'Tarmoqlanuvchi algoritmlar (if-else)', pages: '83–128', summary: 'Mantiqiy ifodalar va shart operatorlari.' },
      { num: 4, title: 'Takrorlanish jarayonlari (for, while)', pages: '129–172', summary: 'Tsikllar, range funksiyasi va sodda oʻyinlar yaratish.' },
    ],
  },
  {
    id: 'it_10',
    subjectId: 'it',
    title: 'Informatika 10-sinf: Maʼlumotlar bazasi va Web',
    author: 'A.A. Abduqodirov, R.X. Ayupov',
    grade: 10,
    year: 2024,
    pages: 208,
    format: 'PDF',
    publisher: 'Oʻqituvchi',
    desc: 'SQL soʻrovlari, relyatsion maʼlumotlar bazalari, HTML/CSS va veb-sayt tuzilishi.',
    coverHue: 160,
    chapters: [
      { num: 1, title: 'Relyatsion maʼlumotlar bazasi (RDBMS)', pages: '5–50', summary: 'Jadvallar, kalit maydonlar va SQL soʻrov tili.' },
      { num: 2, title: 'HTML5 va CSS3 asoslari', pages: '51–110', summary: 'Veb-sahifa teglari, stillar va zamonaviy flexbox tartibi.' },
      { num: 3, title: 'Algoritmlar murakkabligi va maʼlumotlar tuzilmalari', pages: '111–160', summary: 'Roʻyxatlar (list), lugʻatlar (dict) va saralash algoritmlari.' },
      { num: 4, title: 'Kiberxavfsizlik va axborot himoyasi', pages: '161–204', summary: 'Shifrlash algoritmlari va xavfsiz internet madaniyati.' },
    ],
  },

  // FIZIKA
  {
    id: 'phys_7',
    subjectId: 'physics',
    title: 'Fizika 7-sinf darsligi',
    author: 'P.Q. Habibullayev, A. Boydedayev',
    grade: 7,
    year: 2024,
    pages: 192,
    format: 'PDF',
    publisher: 'Oʻzbekiston milliy ensiklopediyasi',
    desc: 'Fizikaviy kattaliklar, mexanik harakat, kuchlar va Nyuton qonunlari.',
    coverHue: 245,
    chapters: [
      { num: 1, title: 'Fizika fani va tabiat qonunlari', pages: '4–38', summary: 'Oʻlchov birliklari, Xalqaro birliklar sistemasi (SI).' },
      { num: 2, title: 'Mexanik harakat va tezlik', pages: '39–88', summary: 'Yoʻl, vaqt, toʻgʻri chiziqli tekis harakat formulalari.' },
      { num: 3, title: 'Tabiatdagi kuchlar va massa', pages: '89–140', summary: 'Gravitatsiya kuchi, ogʻirlik kuchi va ishqalanish.' },
      { num: 4, title: 'Bosim va Arximed qonuni', pages: '141–186', summary: 'Suyuqlik va gazlarda bosim, suzish shartlari.' },
    ],
  },
  {
    id: 'phys_9',
    subjectId: 'physics',
    title: 'Fizika 9-sinf: Elektrodinamika',
    author: 'Oʻ. Abdullayev, M. Yusupov',
    grade: 9,
    year: 2024,
    pages: 224,
    format: 'PDF',
    publisher: 'Oʻqituvchi',
    desc: 'Elektr zaryadlari, doimiy tok qonunlari, magnit maydoni va elektromagnit induksiya.',
    coverHue: 250,
    chapters: [
      { num: 1, title: 'Elektr maydoni va Kulon qonuni', pages: '5–55', summary: 'Zaryadning saqlanish qonuni va kuch chiziqlari.' },
      { num: 2, title: 'Elektr toki va Om qonuni', pages: '56–112', summary: 'Zanjir qismi va toʻliq zanjir uchun Om qonuni, qarshilik.' },
      { num: 3, title: 'Magnit maydoni va uning xossalari', pages: '113–168', summary: 'Amper kuchi, Lorents kuchi va magnit oqimi.' },
      { num: 4, title: 'Elektromagnit tebranishlar va toʻlqinlar', pages: '169–220', summary: 'Transformatorlar, elektromagnit nurlanish spektri.' },
    ],
  },

  // KIMYO
  {
    id: 'chem_8',
    subjectId: 'chemistry',
    title: 'Kimyo 8-sinf: Noorganik kimyo',
    author: 'I.R. Asqarov, N.X. Toʻxtaboyev',
    grade: 8,
    year: 2024,
    pages: 208,
    format: 'PDF',
    publisher: 'Sharq',
    desc: 'Davriy qonun, Mendeleyev jadvali, kimyoviy bogʻlanish turlari va oksidlar.',
    coverHue: 280,
    chapters: [
      { num: 1, title: 'Kimyoning asosiy stexiometrik qonunlari', pages: '5–44', summary: 'Massaning saqlanish qonuni, modda miqdori va mol tushunchasi.' },
      { num: 2, title: 'Davriy qonun va kimyoviy elementlar davriy sistemasi', pages: '45–98', summary: 'Atom tuzilishi, elektron qavatlar va davriy xossalar.' },
      { num: 3, title: 'Kimyoviy bogʻlanish va modda tuzilishi', pages: '99–152', summary: 'Kovalent, ion va metall bogʻlanish mexanizmlari.' },
      { num: 4, title: 'Noorganik moddalarning asosiy sinflari', pages: '153–204', summary: 'Oksidlar, asoslar, kislotalar va tuzlarning olinishi.' },
    ],
  },

  // BIOLOGIYA
  {
    id: 'bio_8',
    subjectId: 'biology',
    title: 'Odam va uning salomatligi 8-sinf',
    author: 'J.A. Tolipova, A.T. Gʻofurov',
    grade: 8,
    year: 2024,
    pages: 240,
    format: 'PDF',
    publisher: 'Oʻqituvchi',
    desc: 'Odam organizmi, toʻqimalar, yurak-qon tomir, nerv va nafas olish sistemalari.',
    coverHue: 170,
    chapters: [
      { num: 1, title: 'Organizmning umumiy tuzilishi va toʻqimalar', pages: '4–48', summary: 'Hujayra organellalari, epiteliy va muskul toʻqimalari.' },
      { num: 2, title: 'Qon aylanish sistemasi va immunitet', pages: '49–112', summary: 'Yurak fazalari, leykotsitlar va himoya mexanizmlari.' },
      { num: 3, title: 'Nerv sistemasi va oliy nerv faoliyati', pages: '113–180', summary: 'Bosh miya boʻlimlari, reflekslar va shartli reflekslar.' },
      { num: 4, title: 'Moddalar almashinuvi va energiya balansi', pages: '181–236', summary: 'Vitaminlar, oqsillar, yogʻlar va sogʻlom ovqatlanish.' },
    ],
  },

  // ONA TILI VA ADABIYOT
  {
    id: 'lit_9',
    subjectId: 'literature',
    title: 'Ona tili 9-sinf darsligi',
    author: 'N. Mahmudov, A. Sobirov',
    grade: 9,
    year: 2024,
    pages: 176,
    format: 'PDF',
    publisher: 'Tasvir',
    desc: 'Qoʻshma gap sintaksisi, ergashgan qoʻshma gaplar va tinish belgilari qoidalari.',
    coverHue: 40,
    chapters: [
      { num: 1, title: 'Bogʻlangan qoʻshma gaplar va ularning tuzilishi', pages: '4–46', summary: 'Biriktiruv, zidlov va ayiruv bogʻlovchili gaplar.' },
      { num: 2, title: 'Ergashgan qoʻshma gaplar turlari', pages: '47–102', summary: 'Ega, kesim, toʻldiruvchi va hol ergash gaplar.' },
      { num: 3, title: 'Bogʻlovchisiz qoʻshma gaplar va intonatsiya', pages: '103–140', summary: 'Ikki nuqta, tire va nuqtali vergul ishlatilishi.' },
      { num: 4, title: 'Nutq madaniyati va matn tuzilishi', pages: '141–172', summary: 'Uslubiyat, publitsistik va rasmiy uslub talablari.' },
    ],
  },

  // INGLIZ TILI
  {
    id: 'eng_9',
    subjectId: 'english',
    title: 'English 9: Student’s Book (CEFR B1)',
    author: 'L. Lutfullayeva, M. Qodirova',
    grade: 9,
    year: 2024,
    pages: 192,
    format: 'PDF',
    publisher: 'Oʻqituvchi',
    desc: 'Reading, Grammar in context, Active listening exercises and vocabulary builders.',
    coverHue: 350,
    chapters: [
      { num: 1, title: 'Unit 1: Education and Modern Careers', pages: '4–40', summary: 'Present Perfect vs Past Simple, career aspirations.' },
      { num: 2, title: 'Unit 2: Science and Technological Inventions', pages: '41–86', summary: 'Passive Voice, conditional clauses (Type 1 and 2).' },
      { num: 3, title: 'Unit 3: Ecology and Sustainable Living', pages: '87–138', summary: 'Modal verbs of obligation, environmental protection.' },
      { num: 4, title: 'Unit 4: Global Culture and World Traditions', pages: '139–188', summary: 'Reported speech, narrative tenses and storytelling.' },
    ],
  },

  // TARIX
  {
    id: 'hist_8',
    subjectId: 'history',
    title: 'Oʻzbekiston tarixi 8-sinf (XVI–XIX asrlar)',
    author: 'Q. Usmonov, M. Sodiqov',
    grade: 8,
    year: 2024,
    pages: 208,
    format: 'PDF',
    publisher: 'Sharq',
    desc: 'Buxoro, Xiva va Qoʻqon xonliklari tarixi, ijtimoiy-iqtisodiy va madaniy hayot.',
    coverHue: 25,
    chapters: [
      { num: 1, title: 'Buxoro xonligi (amirligi) tarixi', pages: '5–58', summary: 'Ashtarxoniylar va Mangʻitlar sulolasi davri.' },
      { num: 2, title: 'Xiva xonligining tashkil topishi va taraqqiyoti', pages: '59–108', summary: 'Qoʻngʻirotlar sulolasi, meʼmorchilik va xalqaro aloqalar.' },
      { num: 3, title: 'Qoʻqon xonligi va Fargʻona vodiysi', pages: '109–160', summary: 'Minglar sulolasi, ichki nizolar va madaniyat.' },
      { num: 4, title: 'Oʻrta Osiyo xonliklarida fan, madaniyat va meʼmorchilik', pages: '161–204', summary: 'Madrasalar taʼlimi, adabiy muhit va kutubxonalar.' },
    ],
  },

  // GEOGRAFIYA
  {
    id: 'geog_7',
    subjectId: 'geography',
    title: 'Materiklar va okeanlar tabiiy geografiyasi 7-sinf',
    author: 'P. Gʻulomov, H. Vahobov',
    grade: 7,
    year: 2024,
    pages: 224,
    format: 'PDF',
    publisher: 'Oʻqituvchi',
    desc: 'Yer yuzining relefi, iqlim mintaqalari, materiklar tabiati va okeanlar boyligi.',
    coverHue: 195,
    chapters: [
      { num: 1, title: 'Dunyo okeanlari va ularning qismlari', pages: '4–52', summary: 'Tinch, Atlantika, Hind va Shimoliy Muz okeanlari.' },
      { num: 2, title: 'Afrika va Avstraliya materiklari', pages: '53–110', summary: 'Relef, daryolar, choʻllar va organik dunyo xususiyatlari.' },
      { num: 3, title: 'Janubiy va Shimoliy Amerika', pages: '111–170', summary: 'Kordilyera, Amazonka havzasi va iqlim zonalari.' },
      { num: 4, title: 'Yevroosiyo materigi geografiyasi', pages: '171–220', summary: 'Materikning ulkan tabiati, oʻrmonlar va dashtlar.' },
    ],
  },

  // HUQUQ
  {
    id: 'law_9',
    subjectId: 'law',
    title: 'Davlat va huquq asoslari 9-sinf',
    author: 'A. Saidov, Sh. Tojixonov',
    grade: 9,
    year: 2024,
    pages: 176,
    format: 'PDF',
    publisher: 'Adolat',
    desc: 'Oʻzbekiston Respublikasi Konstitutsiyasi, fuqarolik, mehnat va oila huquqi.',
    coverHue: 205,
    chapters: [
      { num: 1, title: 'Konstitutsiya — asosiy qonunimiz', pages: '4–44', summary: 'Davlat suvereniteti, xalq hokimiyatchiligi va inson qadri.' },
      { num: 2, title: 'Fuqarolarning asosiy huquqlari va majburiyatlari', pages: '45–90', summary: 'Shaxsiy, siyosiy, iqtisodiy va madaniy huquqlar.' },
      { num: 3, title: 'Oila, mehnat va fuqarolik huquqi asoslari', pages: '91–134', summary: 'Mehnat shartnomasi, mulk huquqi va nikoh munosabatlari.' },
      { num: 4, title: 'Sud hokimiyati va qonun ustuvorligi', pages: '135–172', summary: 'Huquqni muhofaza qiluvchi organlar va adolat tamoyillari.' },
    ],
  },
];
