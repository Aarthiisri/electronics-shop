import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// ✅  set the conditions
export const CONDITIONS = {
  name: {
    test: (v) => v.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(v),
    message: "name minimum 3 letters, numbers no",
  },
  email: {
    test: (v) => /^[^\s@]+@gmail\.com$/.test(v.trim()),
    message: "Gmail only allow (@gmail.com)",
  },
  phone: {
    test: (v) => /^\+?[0-9]{10,15}$/.test(v.replace(/\s/g, "")),
    message: " Enter your vaild phone number",
  },
  password: {
    test: (v) =>
      v.length >= 8 &&
      /[A-Z]/.test(v) &&
      /[a-z]/.test(v) &&
      /[0-9]/.test(v) &&
      /[@#$%^&*!]/.test(v),
    message: "Min 8 chars, A-Z, a-z, 0-9, @#$% ",
  },
};

export function validate(field, value) {
  if (!value || value.trim() === "") return " field!";
  const rule = CONDITIONS[field];
  if (!rule) return "";
  if (!rule.test(value)) return rule.message;
  return "";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  // ✅ App start  localStorage load
  useEffect(() => {
    const savedUser = localStorage.getItem("electro_user");
    const savedUsers = localStorage.getItem("electro_users");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
  }, []);

  function login(identifier, password) {
    const allUsers = JSON.parse(localStorage.getItem("electro_users") || "[]");
    const id = identifier.trim().toLowerCase();
    const pass = password.trim();

    const found = allUsers.find(u =>
      (u.email.toLowerCase() === id || u.phone === id) &&
      u.password === pass
    );

    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem("electro_user", JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, message: "Email/Phone or Password தப்பு!" };
  }

  function register(name, email, phone, password) {
    const allUsers = JSON.parse(localStorage.getItem("electro_users") || "[]");
    const trimEmail = email.trim().toLowerCase();
    const trimPhone = phone.trim();

    if (allUsers.find(u => u.email.toLowerCase() === trimEmail))
      return { success: false, message: "This Email already registered!" };

    if (allUsers.find(u => u.phone === trimPhone))
      return { success: false, message: "This Phone number already registered!" };

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: trimEmail,
      phone: trimPhone,
      password: password.trim(),
      role: "user",
      joinedAt: new Date().toLocaleDateString("en-IN"),
    };

    const updated = [...allUsers, newUser];
    localStorage.setItem("electro_users", JSON.stringify(updated));
    setUsers(updated);

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("electro_user", JSON.stringify(safeUser));
    return { success: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("electro_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);