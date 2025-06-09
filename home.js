// home.js

// زر "إضافة محادثة"
const addBtn = document.getElementById('addChatBtn');
const options = document.getElementById('chatOptions');

addBtn.addEventListener('click', () => {
  if (options.style.display === 'flex') {
    options.style.display = 'none';
  } else {
    options.style.display = 'flex';
  }
});

// زر "الملف الشخصي"
const profileBtn = document.getElementById('profileBtn');

profileBtn.addEventListener('click', () => {
  window.location.href = 'profile.html';
});
