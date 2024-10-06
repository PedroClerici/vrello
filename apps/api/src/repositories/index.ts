export interface Repository<T> {
  create: (
    data: Omit<T, "id" | "createdAt" | "updatedAt">,
  ) => Promise<T | undefined>;

  all: () => Promise<T[]>;

  find: (id: string) => Promise<T | undefined>;

  findBy: (key: Exclude<keyof T, number>, value: T[keyof T]) => Promise<T[]>;

  update: (id: string, data: Partial<T>) => Promise<T | undefined>;

  delete: (id: string) => Promise<void>;
}
