import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { PhotoService } from '../services/photo';
import { GastosService, Gasto } from '../services/gastos';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  @ViewChild('modal', { static: false }) modal!: IonModal;

  descripcion = '';
  monto: any = '';
  fotoSeleccionada: string | null = null;

  constructor(
    public photoService: PhotoService,
    public gastosService: GastosService
  ) {}
  async ngOnInit() {
    await this.gastosService.cargarGastos();
  }

  abrirModal() {
    this.modal.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      const nombre = event.detail.data;
      console.log('Confirmado con:', nombre);

    } else {
      console.log('Modal cancelado');
    }
  }
  async confirm() {
    if (!this.descripcion || !this.monto || !this.fotoSeleccionada) {
      alert('Por favor llena todos los campos y sube una foto.');
      return;
    }

    const nuevoGasto: Gasto = {
      descripcion: this.descripcion,
      monto: parseFloat(this.monto),
      fecha: new Date().toISOString(),
      foto: this.fotoSeleccionada,
    };

    await this.gastosService.agregarGasto(nuevoGasto);

    this.modal.dismiss(this.descripcion, 'confirm');
    this.descripcion = '';
    this.monto = '';
    this.fotoSeleccionada = null;
  }

  async addPhotoToGallery() {
    const photo = await this.photoService.addNewToGallery();
    this.fotoSeleccionada = photo.webPath || null;
  }

  get totalGastado() {
    return this.gastosService.obtenerTotal();
  }

  get gastosRecientes() {
    return this.gastosService.obtenerGastos().slice(-5).reverse();
  }

}




