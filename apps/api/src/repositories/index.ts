export type Keys<T> = Exclude<keyof T, number>;
export type Filter<T> = Partial<Record<Keys<T>, T[keyof T]>>;

export type Insert<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

interface FindByOverload<T> {
  (key: Keys<T>, value: T[keyof T]): Promise<T[]>;
  (clause: Filter<T>): Promise<T[]>;
}

interface UpdateByOverload<T> {
  // biome-ignore lint/style/useShorthandFunctionType: TODO find better way to implement UpdateBy in the future
  (key: Keys<T>, value: T[keyof T], data: Partial<T>): Promise<T[]>;
  // (clause: Filter<T>, T[keyof T]>, data: Partial<T>): Promise<T[]>;
}

interface DeleteByOverload<T> {
  (key: Keys<T>, value: T[keyof T]): Promise<void>;
  (clause: Filter<T>): Promise<void>;
}

export interface Repository<T extends object> {
  create: (data: Insert<T>) => Promise<T | undefined>;

  all: () => Promise<T[]>;

  find: (id: string) => Promise<T | undefined>;

  findBy: FindByOverload<T>;

  update: (id: string, data: Partial<T>) => Promise<T | undefined>;

  updateBy: UpdateByOverload<T>;

  delete: (id: string) => Promise<void>;

  deleteBy: DeleteByOverload<T>;
}
