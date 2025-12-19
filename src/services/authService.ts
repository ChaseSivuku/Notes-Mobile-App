import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface UserWithPassword extends User {
  password: string;
}

const USERS_KEY = 'users';

export const authService = {
  async getUsers(): Promise<UserWithPassword[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  async saveUsers(users: UserWithPassword[]): Promise<void> {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw error;
    }
  },

  async register(
    email: string,
    password: string,
    username: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = await this.getUsers();
      
      // Check if email already exists
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Check if username already exists
      if (users.find(u => u.username === username)) {
        return { success: false, error: 'Username already taken' };
      }

      const newUser: UserWithPassword = {
        id: Date.now().toString(),
        email,
        password,
        username,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await this.saveUsers(users);

      // Remove password from returned user
      const { password: _, ...userWithoutPassword } = newUser;
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  },

  async login(email: string, password: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  },

  async updateUser(
    userId: string,
    email: string,
    password: string | undefined,
    username: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      // Check if email is taken by another user
      if (email !== users[userIndex].email && users.find(u => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Check if username is taken by another user
      if (username !== users[userIndex].username && users.find(u => u.username === username)) {
        return { success: false, error: 'Username already taken' };
      }

      users[userIndex].email = email;
      users[userIndex].username = username;
      if (password && password.trim() !== '') {
        users[userIndex].password = password;
      }

      await this.saveUsers(users);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  },
};

