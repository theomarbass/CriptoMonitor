import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightChange]',
  standalone: true
})
export class HighlightChangeDirective implements OnChanges {
  // Este es el precio que la directiva va a vigilar
  @Input('appHighlightChange') value: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['value'];
    
    // Si el valor cambia y no es la primera vez que carga...
    if (change && !change.firstChange) {
      const oldVal = change.previousValue;
      const newVal = change.currentValue;
      
      // Si subió, usamos verde. Si bajó, rojo.
      const color = newVal > oldVal ? '#22c55e' : '#ef4444';
      
      // 1. Aplicamos el color de fondo rápido (flash)
      this.renderer.setStyle(this.el.nativeElement, 'transition', 'none');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', color + '44'); // El '44' le da transparencia
      
      // 2. Quitamos el color suavemente después de 150 milisegundos
      setTimeout(() => {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.6s ease');
        this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
      }, 150);
    }
  }
}