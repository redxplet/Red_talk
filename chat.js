// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoLrZOjyIn_KbSMP35RAPzlnCpNQzfPl4",
  authDomain: "red-talk-2a888.firebaseapp.com",
  projectId: "red-talk-2a888",
  storageBucket: "red-talk-2a888.firebasestorage.app",
  messagingSenderId: "315227387862",
  appId: "1:315227862:web:61e9b99c1ac40d0669d677"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const currentUserId = localStorage.getItem('currentUserId');
const friendId = localStorage.getItem('chatFriendId'); // معرف الصديق الذي نريد المحادثة معه
const friendName = localStorage.getItem('chatFriendName');

document.getElementById('friendName').textContent = friendName;

const messagesDiv = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

// عرض الرسائل Realtime
db.collection('users').doc(currentUserId)
  .collection('chats').doc(friendId).collection('messages')
  .orderBy('timestamp')
  .onSnapshot(snapshot => {
    messagesDiv.innerHTML = '';
    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement('div');
      div.classList.add('message', msg.sender === currentUserId ? 'sent' : 'received');
      div.textContent = msg.text;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

// إرسال رسالة
sendBtn.addEventListener('click', async () => {
  const text = msgInput.value.trim();
  if (!text) return;
  msgInput.value = '';

  const msgData = {
    text,
    sender: currentUserId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  // إضافة الرسالة للمستخدم الحالي
  await db.collection('users').doc(currentUserId)
    .collection('chats').doc(friendId)
    .collection('messages').add(msgData);

  // إضافة الرسالة للصديق أيضاً
  await db.collection('users').doc(friendId)
    .collection('chats').doc(currentUserId)
    .collection('messages').add(msgData);
});
