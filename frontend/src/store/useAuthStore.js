import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
      try {
        const response = await axiosInstance.get('/auth/check');
        set({ authUser: response.data});
      } catch (error) {
        console.error("Error checking auth:", error);
        set({ authUser: null });
      }finally {
        set({ isCheckingAuth: false });
      }
    },
    signUp: async (formData) => {
      set({ isSigningUp: true });
      try {
        const response = await axiosInstance.post('/auth/signup', formData);
        set({ authUser: response.data });
        toast.success("Account created successfully!");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error during sign up");
      }
      finally {
        set({ isSigningUp: false });
      }
    },
    logout: async () => {
      try {
        await axiosInstance.post('/auth/logout');
        set({ authUser: null });
        toast.success("Logged out successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error during logout");
      }
    },

  }));