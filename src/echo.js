import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echo = null;

try {
  const key = import.meta.env.VITE_PUSHER_APP_KEY;
  const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

  // ✅ تأكد من أن القيم موجودة
  console.log('🔑 Pusher key from env:', key);
  console.log('🌐 Pusher cluster from env:', cluster);

  if (key && cluster) {
    window.Pusher = Pusher;
    echo = new Echo({
      broadcaster: 'pusher',
      key: key,
      cluster: cluster,
      forceTLS: true,
    });
    console.log('✅ Echo initialized for invoice notifications');
  } else {
    console.warn('⚠️ Pusher keys missing — notifications disabled');
  }
} catch (e) {
  console.warn('⚠️ Echo initialization failed:', e.message);
}

export default echo;
