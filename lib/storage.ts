// Minimal storage wrapper with RN/no-op web fallback
let memoryStore: Record<string, string> = {};

async function getItem(key: string): Promise<string | null> {
  try {
    // Lazy require AsyncStorage only if available at runtime
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem(key);
  } catch {
    return memoryStore[key] ?? null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.setItem(key, value);
  } catch {
    memoryStore[key] = value;
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem(key);
  } catch {
    delete memoryStore[key];
  }
}

export const storage = { getItem, setItem, removeItem };


