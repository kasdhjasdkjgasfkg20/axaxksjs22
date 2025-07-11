importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBAhJbI0ydZDGNGa1fCJZE4zYxWUZuyXL8",
    authDomain: "chatbot-support-e1774.firebaseapp.com",
    projectId: "chatbot-support-e1774",
    messagingSenderId: "913372631582",
    appId: "1:913372631582:web:598a0740593bc063c5940f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Background message:', payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/image/Favicon.png'
    });
});
