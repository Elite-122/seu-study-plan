/* عامل ملفات دليل التدريب التعاوني (najd-files) — منفصل عن البوت.
   يقدّم ملفات najdacdemy.com/files/coop/ من رابط برّا التطبيق، عشان التطبيق المثبت في الآيفون
   يفتحها في نافذة فيها «تم» بدل ما يفتحها مكان الصفحة. أي ملف يتبدل في الموقع يتحدث هنا لحاله. */
const SITE = 'https://najdacdemy.com';
const TYPES = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pdf: 'application/pdf'
};

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const cors = { 'Access-Control-Allow-Origin': '*' };
    if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: cors });
    // مقفول على مجلد ملفات الدليل بس، عشان ما يستخدمه أحد يجيب أي شي ثاني
    const m = url.pathname.match(/^\/files\/coop\/([A-Za-z0-9._-]+)\.(docx|pptx|pdf)$/);
    if (!m) return new Response('Not found', { status: 404, headers: cors });
    const res = await fetch(SITE + url.pathname, { cf: { cacheTtl: 600, cacheEverything: true } });
    if (!res.ok) return new Response('Not found', { status: 404, headers: cors });
    return new Response(req.method === 'HEAD' ? null : res.body, {
      headers: {
        ...cors,
        'Content-Type': TYPES[m[2]],
        'Content-Disposition': `inline; filename="${m[1]}.${m[2]}"`,
        'Cache-Control': 'public, max-age=600'
      }
    });
  }
};
