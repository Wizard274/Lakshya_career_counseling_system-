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
  }
};

export default userService;
