import { Component } from '@angular/core';
import { GastosService } from '../services/gastos';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page {
  total = 0;
  promedio = 0;
  fechaInicio = '';
  fechaFin = '';

  constructor(private gastosService: GastosService) {}

  ionViewWillEnter() {
  const gastos = this.gastosService.obtenerGastos();
  if (gastos.length > 0) {
    this.total = this.gastosService.obtenerTotal();

    const fechas = gastos.map(g => new Date(g.fecha));

    fechas.sort((a, b) => a.getTime() - b.getTime());

    const dias = new Set(fechas.map(f => f.toDateString()));
    this.promedio = this.total / dias.size;

    this.fechaInicio = fechas[0].toLocaleDateString();
    this.fechaFin = fechas[fechas.length - 1].toLocaleDateString();
  }
}

}
