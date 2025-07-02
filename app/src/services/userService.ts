import axios from "axios";
import { authService } from "./authService";

const API_URL = "http://localhost:8000/api/users";

export interface User {
    id: string,
    email: string;
    lastSeen: string | null; 
};

export interface CreateUserDto {
    text: string;
}

export const userService = {
    async create(data: CreateUserDto): Promise<User> {
        const token = authService.getToken();
        const response = await axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    },

    async findAll(): Promise<User[]> {
        const response = await axios.get(API_URL);
        console.log(response.data);
        return response.data;
    },

    async findOne(id: string): Promise<User> {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async update(id: string, data: CreateUserDto): Promise<User> {
    const token = authService.getToken();
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async remove(id: string): Promise<void> {
    const token = authService.getToken();
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
