// Firebase configuration (Compat SDK)
const firebaseConfig = {
  apiKey: "AIzaSyCoLrZOjyIn_KbSMP35RAPzlnCpNQzfPl4",
  authDomain: "red-talk-2a888.firebaseapp.com",
  projectId: "red-talk-2a888",
  storageBucket: "red-talk-2a888.firebasestorage.app",
  messagingSenderId: "315227387862",
  appId: "1:315227387862:web:61e9b99c1ac40d0669d677"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// معرف المستخدم الحالي
const currentUserId = localStorage.getItem('currentUserId');
if (!currentUserId) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "index.html";
}

const cardGroup = document.querySelector(".card-group");

// دالة لإنشاء بطاقة صديق/محادثة
function createCard(title, content, friendId=null, friendName=null) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<h3>${title}</h3><p>${content}</p>`;
  
  if (friendId && friendName) {
    card.style.cursor = "pointer";
    card.addEventListener('click', () => {
      localStorage.setItem('chatFriendId', friendId);
      localStorage.setItem('chatFriendName', friendName);
      window.location.href = 'chat.html';
    });
  }

  return card;
}

// تحديث قائمة الأصدقاء و آخر المحادثات
db.collection('users').doc(currentUserId).collection('friends')
  .onSnapshot(snapshot => {
    cardGroup.innerHTML = "";

    if (snapshot.empty) {
      cardGroup.appendChild(createCard("📨 آخر المحادثات", "لا توجد محادثات بعد"));
      cardGroup.appendChild(createCard("🟢 الأصدقاء المتصلين", "لا يوجد أحد حالياً"));
      cardGroup.appendChild(createCard("🔔 الإشعارات", "لا إشعارات جديدة"));
    } else {
      // تجميع الأصدقاء
      let friendsContent = "";
      const friendsArray = [];
      snapshot.forEach(doc => {
        const friend = doc.data();
        friendsArray.push({id: doc.id, name: friend.username});
        friendsContent += friend.username + " ";
      });

      // آخر المحادثات
      cardGroup.appendChild(createCard("📨 آخر المحادثات", "اضغط على صديق لبدء المحادثة"));
      // الأصدقاء المتصلين (قابل للنقر)
      friendsArray.forEach(friend => {
        cardGroup.appendChild(createCard("🟢 " + friend.name, "اضغط لبدء المحادثة", friend.id, friend.name));
      });

      // الإشعارات
      cardGroup.appendChild(createCard("🔔 الإشعارات", "لا إشعارات جديدة"));
    }
  });
