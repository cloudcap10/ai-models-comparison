import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { AIModel, ModelsData } from '@/types/model';

export function loadModels(): AIModel[] {
  const filePath = path.join(process.cwd(), 'models-data.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents) as ModelsData;
  return data.models;
}

export function getModelById(id: string): AIModel | undefined {
  return loadModels().find((m) => m.id === id);
}
