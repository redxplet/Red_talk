// Firebase configuration
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

const searchBtn = document.getElementById('searchBtn');
const codeInput = document.getElementById('codeInput');
const resultDiv = document.getElementById('result');

searchBtn.addEventListener('click', async () => {
  const code = codeInput.value.trim();
  if (!code) {
    resultDiv.textContent = "يرجى إدخال رمز الصديق!";
    return;
  }

  try {
    // البحث عن المستخدم بالرمز
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('code', '==', code).get();

    if (querySnapshot.empty) {
      resultDiv.textContent = "لم يتم العثور على مستخدم بهذا الرمز.";
    } else {
      querySnapshot.forEach((doc) => {
        const friendData = doc.data();
        resultDiv.textContent = `تم العثور على ${friendData.username} وتمت إضافته!`;

        // إضافة الصديق لقائمة المحادثات (مثال)
        const currentUser = localStorage.getItem('currentUserId'); // تأكد أن لديك معرف المستخدم الحالي
        if (currentUser) {
          db.collection('users').doc(currentUser).collection('friends').doc(doc.id).set({
            username: friendData.username,
            code: friendData.code
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    resultDiv.textContent = "حدث خطأ أثناء البحث. حاول مرة أخرى.";
  }
});
