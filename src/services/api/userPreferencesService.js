import mockData from '../mockData/userPreferences.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserPreferencesService {
  constructor() {
    this.data = [...mockData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(pref => pref.id === id);
    if (!item) {
      throw new Error('User preferences not found');
    }
    return { ...item };
  }

  async create(preferencesData) {
    await delay(300);
    
    // Remove existing preferences (only one set per user)
    this.data = [];
    
    const newPreferences = {
      id: Date.now(),
      defaultUnit: preferencesData.defaultUnit || 'metric',
      savedHeight: preferencesData.savedHeight || null,
      theme: preferencesData.theme || 'light',
      timestamp: new Date().toISOString(),
      ...preferencesData
    };

    this.data.push(newPreferences);
    return { ...newPreferences };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.data.findIndex(pref => pref.id === id);
    if (index === -1) {
      throw new Error('User preferences not found');
    }

    const updated = { ...this.data[index], ...updateData };
    this.data[index] = updated;
    return { ...updated };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(pref => pref.id === id);
    if (index === -1) {
      throw new Error('User preferences not found');
    }

    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new UserPreferencesService();