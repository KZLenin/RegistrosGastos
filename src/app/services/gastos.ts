// src/app/services/gastos.service.ts
import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export interface Gasto {
  descripcion: string;
  monto: number;
  fecha: string;
  foto: string; 
}

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  gastos: Gasto[] = [];
  private FILE_NAME = 'gastos.txt';
  private STORAGE_KEY = 'GASTOS_APP';

  constructor() {
    this.cargarGastos();
  }

  async agregarGasto(gasto: Gasto) {
    this.gastos.push(gasto);
    await this.guardarEnArchivo(gasto);
    await this.guardarEnStorage();
  }

  private async guardarEnArchivo(gasto: Gasto) {
    const linea = `Descripción: ${gasto.descripcion}\nMonto: ${gasto.monto}\nFecha: ${gasto.fecha}\nFoto: ${gasto.foto}\n---\n`;
    try {
      await Filesystem.appendFile({
        path: this.FILE_NAME,
        data: linea,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
    } catch {
      await Filesystem.writeFile({
        path: this.FILE_NAME,
        data: linea,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
    }
  }

  private async guardarEnStorage() {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(this.gastos)
    });
  }

  async cargarGastos() {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    this.gastos = value ? JSON.parse(value) : [];
  }

  obtenerTotal(): number {
    return this.gastos.reduce((acc, g) => acc + g.monto, 0);
  }

  obtenerGastos(): Gasto[] {
    return this.gastos;
  }

  async limpiarTodo() {
    this.gastos = [];
    await Preferences.remove({ key: this.STORAGE_KEY });
    await Filesystem.deleteFile({
      path: this.FILE_NAME,
      directory: Directory.Documents
    });
  }
}
