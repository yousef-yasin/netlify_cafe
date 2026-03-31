Arab Cafe - Netlify Version

المشروع تم تحويله ليشتغل على Netlify باستخدام:
- Static pages
- Netlify Functions (Node/Express)
- Netlify Blobs لتخزين الطلبات والمنيو

خطوات التشغيل على Netlify:
1) ارفع هذا المجلد على GitHub.
2) من Netlify اعمل Import from Git.
3) لا تغيّر إعدادات النشر إذا Netlify قرأ netlify.toml.
4) بعد أول Deploy افتح Site configuration > Environment variables وأضف:
   ADMIN_USERNAME = اسم المستخدم اللي بدك ياه
   ADMIN_PASSWORD = كلمة المرور اللي بدك ياها
   ADMIN_TOKEN = أي نص سري طويل
5) أعد deploy مرة ثانية بعد إضافة المتغيرات.

روابط الموقع:
- الصفحة الرئيسية: /
- دخول الإدارة: /admin/loginarabcafeaau/
- لوحة الإدارة: /afdminarabcafeaau123/
- إدارة المنيو: /admin/menu/
- التقارير: /admin/reports/

ملاحظات مهمة:
- الطلبات والمنيو تنحفظ داخل Netlify Blobs.
- الصور الأصلية محفوظة في مجلد /seed.
- الصور الجديدة التي يرفعها الأدمن تنحفظ كنص Base64 داخل التخزين.
- الطباعة هنا من المتصفح عبر صفحة receipt.
