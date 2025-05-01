import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    
    // Add sample users for testing
    const sampleUsers = [
      {
        id: 1,
        username: "professor1",
        email: "professor@escola.com",
        password: "123456",
        role: "professor",
        name: "João Silva"
      } as User,
      {
        id: 2,
        username: "coordenador1",
        email: "coordenador@escola.com",
        password: "123456",
        role: "coordenador",
        name: "Maria Oliveira"
      } as User,
      {
        id: 3,
        username: "diretor1",
        email: "diretor@escola.com",
        password: "123456",
        role: "diretor",
        name: "Carlos Santos"
      } as User
    ];
    
    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });
    
    this.currentId = sampleUsers.length + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    // Ensure role is not undefined
    const userWithRole = {
      ...insertUser,
      role: insertUser.role || 'professor'
    };
    const user: User = { ...userWithRole, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
