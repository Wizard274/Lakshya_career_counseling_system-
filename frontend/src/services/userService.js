// services/userService.js
import api from "./api.js";

const userService = {
  updateProfile: async (profileData) => {
    const { data } = await api.put("/users/profile", profileData);
    return data;
  },
  changePassword: async (currentPassword, newPassword) => {
    const { data } = await api.put("/users/change-password", { currentPassword, newPassword });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data.data.user;
  }
};

export default userService;
