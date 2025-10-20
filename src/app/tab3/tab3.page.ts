import { Component } from '@angular/core';
import { GastosService } from '../services/gastos';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  constructor(public gastosService: GastosService) {}
}
