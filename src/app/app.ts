import { Component, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
// IMPORTANTE: El import siempre debe ir al inicio del archivo
import { HighlightChangeDirective } from './highlight.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  // CORRECCIÓN: Agregamos la directiva aquí para que el HTML la reconozca
  imports: [CommonModule, HighlightChangeDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // 1. Signal para el umbral de alerta
  threshold = signal<number>(0);

  prices = signal([
    { id: '1', name: 'Bitcoin', price: 45000, trend: 'neutral' },
    { id: '2', name: 'Ethereum', price: 2500, trend: 'neutral' },
    { id: '3', name: 'Solana', price: 100, trend: 'neutral' },
    { id: '4', name: 'Cardano', price: 0.5, trend: 'neutral' },
    { id: '5', name: 'Polkadot', price: 7, trend: 'neutral' }
  ]);

  stats = signal({ avg: 0, volatility: 0 });
  private worker?: Worker;

  constructor() {
    this.initWorker();
    this.startPriceSimulation();
    
    // Enviar datos al Web Worker automáticamente cuando cambien los precios
    effect(() => {
      const pList = this.prices().map(p => p.price);
      if (this.worker && pList.length > 0) {
        this.worker.postMessage({ prices: pList });
      }
    });
  }

  // Actualiza el umbral desde el input del HTML
  updateThreshold(event: Event) {
    const input = event.target as HTMLInputElement;
    this.threshold.set(parseFloat(input.value) || 0);
  }

  initWorker() {
    if (typeof Worker !== 'undefined') {
      // Asegúrate que el archivo se llame exactamente statistics.worker.ts en tu carpeta
      this.worker = new Worker(new URL('./statistics.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        if (data) this.stats.set(data);
      };
    }
  }

  startPriceSimulation() {
    // Simulación cada 200ms según requerimiento
    setInterval(() => {
      this.prices.update(current => current.map(p => {
        const variation = (Math.random() * 0.01 - 0.005);
        const newPrice = p.price * (1 + variation);
        const trend = newPrice > p.price ? 'up' : 'down';
        return { ...p, price: newPrice, trend: trend };
      }));
    }, 200); 
  }
}