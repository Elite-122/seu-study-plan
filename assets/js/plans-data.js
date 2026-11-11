/* بيانات الخطط الدراسية للتخصصات الأربعة (مصدر واحد للخطة والجدول والرئيسية) */
window.NAJD_PLANS={
  mgt: {
    label: "إدارة الأعمال",
    name: "بكالوريوس إدارة الأعمال — تخصص الإدارة",
    en: "BSBA — Major in Management",
    mission:
      "إعداد مديرين وقادة أكفاء بمعرفة أعمال متقدمة عبر تعليم مدمج عالي الجودة، وكفاءات تدريسية مميزة، ومهارات إدارية متقدمة تسهل اندماجهم في بيئة الأعمال السعودية الديناميكية.",
    careers: ["مدير عام / رئيس قسم", "محلل أعمال", "منسق تطوير أعمال", "مستشار أنظمة أعمال", "أخصائي تخطيط", "مدير عمليات"],
    levels: [
      { label: "السنة الأولى", en: "First year", hours: 26, courses: [
        ["ENG001", "English Language Skills", "مهارات اللغة الإنجليزية", 8, "—"],
        ["CS001", "Computer Essentials", "أساسيات الحاسب", 3, "—"],
        ["COMM001", "Communication Skills", "مهارات الاتصال", 2, "—"],
        ["ENG001", "English Language Skills (Continued)", "تابع مهارات اللغة الإنجليزية", 8, "—"],
        ["MATH001", "Fundamentals of Math", "أساسيات الرياضيات", 3, "—"],
        ["CI001", "Academic Skills", "المهارات الأكاديمية", 2, "—"],
      ]},
      { label: "المستوى الثالث", en: "Level three", hours: 17, courses: [
        ["ISLM101", "Introduction to Islamic Culture", "مدخل إلى الثقافة الإسلامية", 2, "اجتياز السنة الأولى"],
        ["STAT101", "Statistics", "الإحصاء", 3, "اجتياز السنة الأولى"],
        ["LAW101", "Legal Environment of Business", "البيئة القانونية للأعمال", 3, "اجتياز السنة الأولى"],
        ["ECON101", "Microeconomics", "الاقتصاد الجزئي", 3, "اجتياز السنة الأولى"],
        ["MGT101", "Principles of Management", "مبادئ الإدارة", 3, "اجتياز السنة الأولى"],
        ["ACCT101", "Principles of Accounting", "مبادئ المحاسبة", 3, "اجتياز السنة الأولى"],
      ]},
      { label: "المستوى الرابع", en: "Level four", hours: 17, courses: [
        ["ISLM102", "Professional Conduct & Ethics in Islam", "أخلاقيات المهنة في الإسلام", 2, "—"],
        ["STAT201", "Quantitative Methods", "الأساليب الكمية", 3, "ACCT101"],
        ["FIN101", "Principles of Finance", "مبادئ المالية", 3, "MGT101"],
        ["MGT201", "Marketing Management", "إدارة التسويق", 3, "MGT101"],
        ["MGT211", "H.R Management", "إدارة الموارد البشرية", 3, "MGT101"],
        ["ECOM101", "E-Commerce", "التجارة الإلكترونية", 3, "—"],
      ]},
      { label: "المستوى الخامس", en: "Level five", hours: 18, courses: [
        ["ECON201", "Macroeconomics", "الاقتصاد الكلي", 3, "—"],
        ["MIS201", "Management of Information Systems", "إدارة نظم المعلومات", 3, "MGT101"],
        ["ECOM201", "Introduction to E-Management", "مقدمة في الإدارة الإلكترونية", 3, "MGT101"],
        ["MGT301", "Organizational Behavior", "السلوك التنظيمي", 3, "MGT211"],
        ["MGT311", "Intro to Operations Management", "مقدمة في إدارة العمليات", 3, "MGT101 + STAT101"],
        ["MGT312", "Decision Making and Problem Solving", "اتخاذ القرار وحل المشكلات", 3, "MGT101"],
      ]},
      { label: "المستوى السادس", en: "Level six", hours: 17, courses: [
        ["ISLM103", "Islamic Economic System", "النظام الاقتصادي في الإسلام", 2, "ISLM101"],
        ["ACCT301", "Cost Accounting", "محاسبة التكاليف", 3, "ACCT101"],
        ["MGT321", "Intro to International Business", "مقدمة في الأعمال الدولية", 3, "—"],
        ["MGT322", "Logistics Management", "إدارة الخدمات اللوجستية", 3, "MGT101"],
        ["MGT323", "Project Management", "إدارة المشاريع", 3, "MGT311"],
        ["MGT325", "Management of Technology", "إدارة التقنية", 3, "MGT101"],
      ]},
      { label: "المستوى السابع", en: "Level seven", hours: 17, courses: [
        ["ISLM104", "Social System and Human Rights", "النظام الاجتماعي وحقوق الإنسان", 2, "ISLM102"],
        ["MGT401", "Strategic Management", "الإدارة الاستراتيجية", 3, "MGT201 + FIN101"],
        ["MGT324", "Public Management", "الإدارة العامة", 3, "MGT101"],
        ["MGT402", "Entrepreneurship", "ريادة الأعمال", 3, "MGT101"],
        ["MGT403", "Knowledge Management", "إدارة المعرفة", 3, "MGT101"],
        ["MGT424", "Quality Management", "إدارة الجودة", 3, "MGT101"],
      ]},
      { label: "المستوى الثامن", en: "Level eight", hours: 18, courses: [
        ["MGT404", "Organization Design and Development", "التصميم والتطوير التنظيمي", 3, "MGT101"],
        ["MGT421", "Communications Management", "إدارة الاتصالات", 3, "MGT101"],
        ["MGT422", "Business Ethics & Social Responsibility", "أخلاقيات الأعمال والمسؤولية الاجتماعية", 3, "—"],
        ["MGT430", "Internship", "التدريب الميداني", 6, "إكمال 90 ساعة معتمدة"],
        ["MGT425", "Spreadsheet Decision Modeling", "نمذجة القرارات بالجداول الإلكترونية", 3, "MGT101"],
      ]},
    ],
  },
  fin: {
    label: "المالية",
    name: "بكالوريوس إدارة الأعمال — تخصص المالية",
    en: "BSBA — Major in Finance",
    mission:
      "إعداد قادة المستقبل في التخطيط المالي القائم على القيم، ارتكازاً على ركائز الجامعة في التميز والنزاهة والقيادة والولاء والاحترام والعطاء بلا حدود.",
    careers: ["مدير مالي", "باحث مالي", "مستشار مالي", "محلل مالي", "وسيط مالي (وكالات مالية)"],
    levels: [
      { label: "السنة الأولى", en: "First year", hours: 26, courses: [
        ["ENG001", "English Skills", "مهارات اللغة الإنجليزية", 16, "—"],
        ["CS001", "Computer Essentials", "أساسيات الحاسب", 3, "—"],
        ["COMM001", "Communication Skills", "مهارات الاتصال", 2, "—"],
        ["MATH001", "Fundamentals of Math", "أساسيات الرياضيات", 3, "—"],
        ["CI001", "Academic Skills", "المهارات الأكاديمية", 2, "—"],
      ]},
      { label: "المستوى الثالث", en: "Level three", hours: 17, courses: [
        ["ISLM101", "Introduction to Islamic Culture", "مدخل إلى الثقافة الإسلامية", 2, "اجتياز السنة الأولى"],
        ["STAT101", "Statistics", "الإحصاء", 3, "اجتياز السنة الأولى"],
        ["LAW101", "Legal Environment of Business", "البيئة القانونية للأعمال", 3, "اجتياز السنة الأولى"],
        ["ECON101", "Microeconomics", "الاقتصاد الجزئي", 3, "اجتياز السنة الأولى"],
        ["MGT101", "Principles of Management", "مبادئ الإدارة", 3, "اجتياز السنة الأولى"],
        ["ACCT101", "Principles of Accounting", "مبادئ المحاسبة", 3, "اجتياز السنة الأولى"],
      ]},
      { label: "المستوى الرابع", en: "Level four", hours: 17, courses: [
        ["ISLM102", "Professional Conduct & Ethics in Islam", "أخلاقيات المهنة في الإسلام", 2, "—"],
        ["STAT201", "Quantitative Methods", "الأساليب الكمية", 3, "STAT101"],
        ["FIN101", "Principles of Finance", "مبادئ المالية", 3, "ACCT101"],
        ["MGT201", "Marketing Management", "إدارة التسويق", 3, "MGT101"],
        ["MGT211", "H.R Management", "إدارة الموارد البشرية", 3, "MGT101"],
        ["ECOM101", "E-Commerce", "التجارة الإلكترونية", 3, "—"],
      ]},
      { label: "المستوى الخامس", en: "Level five", hours: 18, courses: [
        ["ECON201", "Macroeconomics", "الاقتصاد الكلي", 3, "—"],
        ["MIS201", "Management of Information Systems", "إدارة نظم المعلومات", 3, "MGT101"],
        ["ECOM201", "Introduction to E-Management", "مقدمة في الإدارة الإلكترونية", 3, "MGT101"],
        ["MGT301", "Organizational Behavior", "السلوك التنظيمي", 3, "MGT211"],
        ["MGT311", "Intro to Operations Management", "مقدمة في إدارة العمليات", 3, "MGT101 + STAT101"],
        ["FIN201", "Corporate Finance", "تمويل الشركات", 3, "FIN101"],
      ]},
      { label: "المستوى السادس", en: "Level six", hours: 17, courses: [
        ["ISLM103", "Islamic Economic System", "النظام الاقتصادي في الإسلام", 2, "ISLM101"],
        ["ACCT301", "Cost Accounting", "محاسبة التكاليف", 3, "ACCT101"],
        ["MGT321", "Intro to International Business", "مقدمة في الأعمال الدولية", 3, "—"],
        ["MGT322", "Logistics Management", "إدارة الخدمات اللوجستية", 3, "MGT101"],
        ["FIN301", "Risk Management", "إدارة المخاطر", 3, "FIN101"],
        ["FIN416", "Islamic Finance", "التمويل الإسلامي", 3, "FIN201"],
      ]},
      { label: "المستوى السابع", en: "Level seven", hours: 17, courses: [
        ["ISLM104", "Social System and Human Rights", "النظام الاجتماعي وحقوق الإنسان", 2, "ISLM102"],
        ["MGT401", "Strategic Management", "الإدارة الاستراتيجية", 3, "MGT201 + FIN101"],
        ["FIN401", "Banks Management", "إدارة البنوك", 3, "FIN101"],
        ["FIN402", "Financial Institutions and Markets", "المؤسسات والأسواق المالية", 3, "FIN101"],
        ["FIN403", "Investments", "الاستثمار", 3, "FIN101"],
        ["FIN414", "Real Estate Finance", "التمويل العقاري", 3, "FIN201"],
      ]},
      { label: "المستوى الثامن", en: "Level eight", hours: 18, courses: [
        ["FIN405", "Financial Derivatives", "المشتقات المالية", 3, "FIN402"],
        ["FIN406", "International Finance", "التمويل الدولي", 3, "FIN401"],
        ["FIN424", "Portfolio Management", "إدارة المحافظ الاستثمارية", 3, "FIN403"],
        ["FIN408", "Internship", "التدريب الميداني", 6, "إكمال 90 ساعة معتمدة"],
        ["FIN421", "Small Business Financing", "تمويل المنشآت الصغيرة", 3, "FIN301"],
      ]},
    ],
  },
  ecom: {
    label: "التجارة الإلكترونية",
    name: "بكالوريوس إدارة الأعمال — تخصص التجارة الإلكترونية",
    en: "BSBA — Major in E-Commerce",
    mission:
      "تزويد طلاب التجارة الإلكترونية بالمهارات اللازمة من خلال تعلم ذاتي مدعوم بتعليم تفاعلي عالي الجودة عبر الإنترنت، وتشجيع روح ريادة الأعمال، والمساهمة في الأبحاث والدراسات ضمن قطاع التجارة الإلكترونية.",
    careers: ["مدير تجارة إلكترونية", "محلل تجارة إلكترونية", "محلل استخبارات تجارية", "مستشار تجارة إلكترونية", "مستشار أمن معلومات", "مطوّر مواقع للأغراض التجارية"],
    levels: [
      { label: "السنة الأولى", en: "First year", hours: 26, courses: [
        ["ENG001", "English Skills", "مهارات اللغة الإنجليزية", 8, "—"],
        ["CS001", "Computer Essentials", "أساسيات الحاسب", 3, "—"],
        ["COMM001", "Communication Skills", "مهارات الاتصال", 2, "—"],
        ["ENG001", "English Skills (Continued)", "تابع مهارات اللغة الإنجليزية", 8, "—"],
        ["MATH001", "Fundamentals of Math", "أساسيات الرياضيات", 3, "—"],
        ["CI001", "Academic Skills", "المهارات الأكاديمية", 2, "—"],
      ]},
      { label: "المستوى الثالث", en: "Level three", hours: 17, courses: [
        ["ISLM101", "Introduction to Islamic Culture", "مدخل إلى الثقافة الإسلامية", 2, "اجتياز السنة الأولى"],
        ["STAT101", "Statistics", "الإحصاء", 3, "اجتياز السنة الأولى"],
        ["LAW101", "Legal Environment of Business", "البيئة القانونية للأعمال", 3, "اجتياز السنة الأولى"],
        ["ECON101", "Microeconomics", "الاقتصاد الجزئي", 3, "اجتياز السنة الأولى"],
        ["MGT101", "Principles of Management", "مبادئ الإدارة", 3, "اجتياز السنة الأولى"],
        ["ACCT101", "Principles of Accounting", "مبادئ المحاسبة", 3, "اجتياز السنة الأولى"],
      ]},
      { label: "المستوى الرابع", en: "Level four", hours: 17, courses: [
        ["ISLM102", "Professional Conduct & Ethics in Islam", "أخلاقيات المهنة في الإسلام", 2, "—"],
        ["STAT201", "Quantitative Methods", "الأساليب الكمية", 3, "STAT101"],
        ["FIN101", "Principles of Finance", "مبادئ المالية", 3, "ACCT101"],
        ["MGT201", "Marketing Management", "إدارة التسويق", 3, "MGT101"],
        ["MGT211", "H.R Management", "إدارة الموارد البشرية", 3, "MGT101"],
        ["ECOM101", "E-Commerce", "التجارة الإلكترونية", 3, "—"],
      ]},
      { label: "المستوى الخامس", en: "Level five", hours: 18, courses: [
        ["ECON201", "Macroeconomics", "الاقتصاد الكلي", 3, "—"],
        ["MIS201", "Management of Information Systems", "إدارة نظم المعلومات", 3, "MGT101"],
        ["ECOM201", "Introduction to E-Management", "مقدمة في الإدارة الإلكترونية", 3, "MGT101"],
        ["MGT301", "Organizational Behavior", "السلوك التنظيمي", 3, "MGT211"],
        ["MGT311", "Intro to Operations Management", "مقدمة في إدارة العمليات", 3, "MGT101 + STAT101"],
        ["ECOM301", "E-Marketing (Digital Marketing)", "التسويق الإلكتروني", 3, "MGT201"],
      ]},
      { label: "المستوى السادس", en: "Level six", hours: 17, courses: [
        ["ISLM103", "Islamic Economic System", "النظام الاقتصادي في الإسلام", 2, "ISLM101"],
        ["ACCT301", "Cost Accounting", "محاسبة التكاليف", 3, "ACCT101"],
        ["MGT321", "Intro to International Business", "مقدمة في الأعمال الدولية", 3, "—"],
        ["MGT322", "Logistics Management", "إدارة الخدمات اللوجستية", 3, "MGT101"],
        ["IT401", "Business Computer Languages", "لغات البرمجة للأعمال", 3, "MGT311"],
        ["ECOM322", "Social Media Marketing", "التسويق عبر وسائل التواصل الاجتماعي", 3, "ECOM301"],
      ]},
      { label: "المستوى السابع", en: "Level seven", hours: 17, courses: [
        ["ISLM104", "Social System and Human Rights", "النظام الاجتماعي وحقوق الإنسان", 2, "ISLM102"],
        ["MGT401", "Strategic Management", "الإدارة الاستراتيجية", 3, "MGT201 + FIN101"],
        ["IT403", "Fundamentals of Databases", "أساسيات قواعد البيانات", 3, "IT401"],
        ["IT404", "Website Design", "تصميم المواقع الإلكترونية", 3, "—"],
        ["LAW402", "Law of E-Commerce", "نظام التجارة الإلكترونية", 3, "LAW101"],
        ["ECOM425", "Virtual Organization Management", "إدارة المنظمات الافتراضية", 3, "MGT101"],
      ]},
      { label: "المستوى الثامن", en: "Level eight", hours: 18, courses: [
        ["IT402", "Integrated Enterprise Systems", "أنظمة المؤسسات المتكاملة", 3, "MIS201"],
        ["ECOM421", "E-Business Strategy and Business Models", "استراتيجية ونماذج الأعمال الإلكترونية", 3, "MGT401"],
        ["ECOM402", "E-Supply Chain Management", "إدارة سلسلة الإمداد الإلكترونية", 3, "MGT211"],
        ["ECOM430", "Internship", "التدريب الميداني", 6, "إكمال 90 ساعة معتمدة"],
        ["IT405", "E-Portals Development", "تطوير البوابات الإلكترونية", 3, "IT404"],
      ]},
    ],
  },
  acct: {
    label: "المحاسبة",
    name: "بكالوريوس إدارة الأعمال — تخصص المحاسبة",
    en: "BSBA — Major in Accounting",
    mission:
      "يهدف برنامج بكالوريوس المحاسبة إلى إعداد محاسبين مؤهلين وفق المعايير المهنية والأكاديمية الحديثة، مع تغطية شاملة للمحاسبة المالية والإدارية والحكومية والضريبية ومحاسبة المؤسسات المالية والتأمين.",
    careers: ["محاسب قانوني", "مراجع حسابات", "محاسب ضرائب وزكاة", "محاسب حكومي وغير ربحي", "محاسب مؤسسات مالية", "محاسب تأمين"],
    levels: [
      { label: "السنة الأولى", en: "First year", hours: 26, courses: [
        ["ENG001", "English Language Skills", "مهارات اللغة الإنجليزية", 8, "—"],
        ["CS001", "Intro to AI and Computing", "مقدمة في الذكاء الاصطناعي والحوسبة", 3, "—"],
        ["COMM001", "Communication Skills", "مهارات الاتصال", 2, "—"],
        ["ENG001", "English Language Skills (Continued)", "تابع مهارات اللغة الإنجليزية", 8, "—"],
        ["MATH001", "Fundamentals of Math", "أساسيات الرياضيات", 3, "—"],
        ["CI001", "Academic Skills", "المهارات الأكاديمية", 2, "—"],
      ]},
      { label: "المستوى الثالث", en: "Level three", hours: 17, courses: [
        ["ISLM101", "Introduction to Islamic Culture", "مدخل إلى الثقافة الإسلامية", 2, "اجتياز السنة الأولى"],
        ["STAT101", "Statistics", "الإحصاء", 3, "اجتياز السنة الأولى"],
        ["LAW101", "Legal Environment of Business", "البيئة القانونية للأعمال", 3, "اجتياز السنة الأولى"],
        ["ECON101", "Microeconomics", "الاقتصاد الجزئي", 3, "اجتياز السنة الأولى"],
        ["MGT101", "Principles of Management", "مبادئ الإدارة", 3, "اجتياز السنة الأولى"],
        ["ACCT101", "Principles of Accounting", "مبادئ المحاسبة", 3, "اجتياز السنة الأولى"],
      ]},
      { label: "المستوى الرابع", en: "Level four", hours: 17, courses: [
        ["ISLM102", "Professional Conduct & Ethics in Islam", "أخلاقيات المهنة في الإسلام", 2, "—"],
        ["STAT201", "Quantitative Methods", "الأساليب الكمية", 3, "STAT101"],
        ["FIN101", "Principles of Finance", "مبادئ المالية", 3, "ACCT101"],
        ["MGT201", "Marketing Management", "إدارة التسويق", 3, "MGT101"],
        ["MGT211", "H.R Management", "إدارة الموارد البشرية", 3, "MGT101"],
        ["ECOM101", "E-Commerce", "التجارة الإلكترونية", 3, "—"],
      ]},
      { label: "المستوى الخامس", en: "Level five", hours: 18, courses: [
        ["ECON201", "Macroeconomics", "الاقتصاد الكلي", 3, "—"],
        ["MIS201", "Management of Information Systems", "إدارة نظم المعلومات", 3, "MGT101"],
        ["ECOM201", "Introduction to E-Management", "مقدمة في الإدارة الإلكترونية", 3, "MGT101"],
        ["MGT301", "Organizational Behavior", "السلوك التنظيمي", 3, "MGT211"],
        ["MGT311", "Intro to Operations Management", "مقدمة في إدارة العمليات", 3, "MGT101 + STAT101"],
        ["ACCT201", "Financial Accounting", "المحاسبة المالية", 3, "ACCT101"],
      ]},
      { label: "المستوى السادس", en: "Level six", hours: 17, courses: [
        ["ISLM103", "Islamic Economic System", "النظام الاقتصادي في الإسلام", 2, "ISLM101"],
        ["ACCT301", "Cost Accounting", "محاسبة التكاليف", 3, "ACCT101"],
        ["MGT321", "Intro to International Business", "مقدمة في الأعمال الدولية", 3, "—"],
        ["MGT322", "Logistics Management", "إدارة الخدمات اللوجستية", 3, "MGT101"],
        ["ACCT302", "Advanced Financial Accounting", "المحاسبة المالية المتقدمة", 3, "ACCT201"],
        ["ACCT405", "Accounting of Financial Institutions", "محاسبة المؤسسات المالية", 3, "ACCT201"],
      ]},
      { label: "المستوى السابع", en: "Level seven", hours: 17, courses: [
        ["ISLM104", "Social System and Human Rights", "النظام الاجتماعي وحقوق الإنسان", 2, "ISLM102"],
        ["MGT401", "Strategic Management", "الإدارة الاستراتيجية", 3, "MGT201 + FIN101"],
        ["ACCT401", "Auditing Principles & Procedures", "أصول وإجراءات المراجعة", 3, "ACCT302"],
        ["ACCT403", "Accounting Research and Practice", "البحث والتطبيق المحاسبي", 3, "—"],
        ["ACCT402", "Intro to Accounting Information System", "مقدمة في نظم المعلومات المحاسبية", 3, "ACCT201 + MIS201"],
        ["ACCT321", "Government and Non-Profit Accounting", "المحاسبة الحكومية وغير الربحية", 3, "ACCT201"],
      ]},
      { label: "المستوى الثامن", en: "Level eight", hours: 18, courses: [
        ["ACCT422", "Tax and Zakat Accounting", "محاسبة الضرائب والزكاة", 3, "ACCT201"],
        ["LAW401", "Companies Law", "نظام الشركات", 3, "LAW101"],
        ["ACCT322", "Managerial Accounting", "المحاسبة الإدارية", 3, "ACCT301"],
        ["ACCT424", "Insurance Accounting", "محاسبة التأمين", 3, "ACCT201"],
        ["ACCT430", "Internship", "التدريب الميداني", 6, "إكمال 90 ساعة معتمدة"],
      ]},
    ],
  },
};

/* منطق المتطلبات السابقة وحساب الساعات (مشترك بين الخطة والرئيسية) */
(function(){
  var P=window.NAJD_PLANS;
  /* سلسلة مواد الثقافة الإسلامية: كل مادة تفتح اللي بعدها */
  var CHAIN={ISLM102:['ISLM101'],ISLM103:['ISLM102'],ISLM104:['ISLM103']};
  var CO_HOURS=90;
  function key(m,li,ci){return m+'|'+li+'|'+ci;}
  function find(m,code){var r=[];P[m].levels.forEach(function(lv,li){lv.courses.forEach(function(c,ci){if(c[0]===code)r.push([li,ci]);});});return r;}
  function isDone(m,done,code){var f=find(m,code);if(!f.length)return true;return f.every(function(x){return !!done[key(m,x[0],x[1])];});}
  function hours(m,done,skip){var h=0;if(!P[m])return 0;P[m].levels.forEach(function(lv,li){lv.courses.forEach(function(c,ci){var k=key(m,li,ci);if(done[k]&&k!==skip)h+=c[3];});});return h;}
  function codes(m,li,ci){var c=P[m].levels[li].courses[ci];if(CHAIN[c[0]])return CHAIN[c[0]];return (String(c[4]).match(/[A-Z]{2,5}\d{3}/g)||[]);}
  function isCoop(c){return /90/.test(String(c[4]));}
  /* يرجّع قائمة اللي ناقص عشان تنفتح المادة (فاضية = مفتوحة) */
  function missing(m,done,li,ci){
    var out=[],c=P[m].levels[li].courses[ci];
    if(li>0){var y1=P[m].levels[0].courses.every(function(_,i){return !!done[key(m,0,i)];});if(!y1)out.push({t:'year1'});}
    codes(m,li,ci).forEach(function(code){if(!isDone(m,done,code))out.push({t:'course',code:code});});
    if(isCoop(c)){var h=hours(m,done,key(m,li,ci));if(h<CO_HOURS)out.push({t:'hours',need:CO_HOURS,have:h});}
    return out;
  }
  /* يشيل أي مادة معلّمة ومتطلبها مو مجتاز، ويكرر لين تستقر. يرجّع عدد اللي انشال */
  function clean(m,done){
    var n=0,again=true;if(!P[m])return 0;
    while(again){again=false;P[m].levels.forEach(function(lv,li){lv.courses.forEach(function(c,ci){var k=key(m,li,ci);if(done[k]&&missing(m,done,li,ci).length){delete done[k];n++;again=true;}});});}
    return n;
  }
  function cleanAll(done){var n=0;Object.keys(P).forEach(function(m){n+=clean(m,done);});return n;}
  /* المستوى الحالي حسب الساعات المجتازة: 0=السنة الأولى، 1=الثالث ... 6=الثامن، 7=خريج */
  var CUT=[26,43,60,78,95,112,130];
  function level(h){for(var i=0;i<CUT.length;i++){if(h<CUT[i])return i;}return 7;}
  function prereqText(m,li,ci){var c=P[m].levels[li].courses[ci];return CHAIN[c[0]]?CHAIN[c[0]].join(' + '):c[4];}
  window.NajdPlan={key:key,hours:hours,missing:missing,clean:clean,cleanAll:cleanAll,level:level,prereqText:prereqText,TOTAL:130};
})();
