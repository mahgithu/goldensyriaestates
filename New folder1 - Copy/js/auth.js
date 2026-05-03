// ===== AUTHENTICATION =====

function initAuth() {
  const users = JSON.parse(localStorage.getItem('aqari_users') || '[]');
  if (!users.length) {
    // Create default admin
    users.push({
      id: 1,
      name: 'مدير النظام',
      email: 'admin@aqari.com',
      password: 'admin123',
      phone: '0900000000',
      role: 'admin',
      date: new Date().toISOString()
    });
    localStorage.setItem('aqari_users', JSON.stringify(users));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem('aqari_users') || '[]');
}

function getCurrentUser() {
  const userStr = localStorage.getItem('aqari_current_user');
  return userStr ? JSON.parse(userStr) : null;
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    user.lastLogin = new Date().toISOString();
    localStorage.setItem('aqari_users', JSON.stringify(users));
    localStorage.setItem('aqari_current_user', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
}

function registerUser(name, email, password, phone) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
  }
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    phone,
    role: 'user',
    date: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem('aqari_users', JSON.stringify(users));
  localStorage.setItem('aqari_current_user', JSON.stringify(newUser));
  return { success: true, user: newUser };
}

function logoutUser() {
  localStorage.removeItem('aqari_current_user');
  window.location.href = 'index.html';
}

function requireAuth(redirectUrl = 'login.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl;
    return false;
  }
  return user;
}

function requireAdmin(redirectUrl = 'index.html') {
  const user = requireAuth();
  if (user && user.role !== 'admin') {
    window.location.href = redirectUrl;
    return false;
  }
  return user;
}

function isSuperAdmin() {
  const user = getCurrentUser();
  return user && user.email === 'admin@aqari.com';
}

// Initialize on load
initAuth();
