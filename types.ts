/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface ServiceItem {
  id: string;
  phase: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  SERVICES = 'services',
  PROCESS = 'process',
  PRICING = 'pricing',
}