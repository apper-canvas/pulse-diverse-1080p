import mockData from '../mockData/bmiCalculations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BMIService {
  constructor() {
    this.data = [...mockData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(calc => calc.id === id);
    if (!item) {
      throw new Error('BMI calculation not found');
    }
    return { ...item };
  }

  calculateBMI(heightCm, weightKg) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    let category;
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi < 25) {
      category = 'Normal';
    } else if (bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    return { bmi, category };
  }

  async create(calculationData) {
    await delay(300);
    
    const { height, weight, unit } = calculationData;
    
    // Validate input
    if (!height || !weight || height <= 0 || weight <= 0) {
      throw new Error('Invalid height or weight values');
    }

    // Additional validation based on unit
    if (unit === 'metric') {
      if (height < 50 || height > 300) {
        throw new Error('Height must be between 50-300 cm');
      }
      if (weight < 20 || weight > 500) {
        throw new Error('Weight must be between 20-500 kg'); 
      }
    } else {
      if (height < 121.92 || height > 243.84) { // 4-8 feet in cm
        throw new Error('Height must be between 4-8 feet');
      }
      if (weight * 0.453592 < 20 || weight * 0.453592 > 500) {
        throw new Error('Weight must be between 44-1100 lbs');
      }
    }

    const { bmi, category } = this.calculateBMI(height, weight);
    
    const newCalculation = {
      id: Date.now(),
      height,
      weight,
      unit,
      bmi,
      category,
      timestamp: new Date().toISOString(),
      ...calculationData
    };

    this.data.unshift(newCalculation);
    
    // Keep only last 10 calculations
    if (this.data.length > 10) {
      this.data = this.data.slice(0, 10);
    }

    return { ...newCalculation };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.data.findIndex(calc => calc.id === id);
    if (index === -1) {
      throw new Error('BMI calculation not found');
    }

    const updated = { ...this.data[index], ...updateData };
    
    // Recalculate if height or weight changed
    if (updateData.height || updateData.weight) {
      const { bmi, category } = this.calculateBMI(updated.height, updated.weight);
      updated.bmi = bmi;
      updated.category = category;
    }

    this.data[index] = updated;
    return { ...updated };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(calc => calc.id === id);
    if (index === -1) {
      throw new Error('BMI calculation not found');
    }

    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new BMIService();