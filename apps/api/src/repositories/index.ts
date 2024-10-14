export type Keys<T> = Exclude<keyof T, number>;
export type Filter<T> = Partial<Record<Keys<T>, T[keyof T]>>;
export type Insert<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export interface Repository<T extends object> {
  create: (data: Insert<T>) => Promise<T | undefined>;

  all: () => Promise<T[]>;

  find: (id: string) => Promise<T | undefined>;

  findBy: (filter: Filter<T>) => Promise<T[]>;

  update: (id: string, data: Partial<T>) => Promise<T | undefined>;

  updateBy: (filter: Filter<T>, data: Partial<T>) => Promise<T[]>;

  delete: (id: string) => Promise<void>;

  deleteBy: (filter: Filter<T>) => Promise<void>;
}
