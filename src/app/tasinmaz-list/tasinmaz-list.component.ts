import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Tasinmaz } from '../../models/tasinmaz-model';

@Component({
  selector: 'tasinmaz-list',
  templateUrl: './tasinmaz-list.component.html',
  styleUrls: ['./tasinmaz-list.component.css']
})
export class TasinmazList implements OnInit {
  tasinmazlar: (Tasinmaz & { selected: boolean })[] = [];  allSelected: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllTasinmaz().subscribe({
      next: (data: Tasinmaz[]) => {
        this.tasinmazlar = data.map(item => ({
          ...item,
          selected: false
        }));
        console.log(this.tasinmazlar);
      },
      error: (error) => {
        console.error('Veri çekme hatası:', error);
      },
    });
  }
  deleteSelected(): void {
    const selectedIds = this.tasinmazlar
      .filter(t => t.selected)
      .map(t => t.id);
  
    if (selectedIds.length === 0) {
      alert('Silinecek taşınmaz seçilmedi!');
      return;
    }
  
    if (confirm('Seçili taşınmazları silmek istediğinizden emin misiniz?')) {
      this.apiService.deleteMultipleTasinmaz(selectedIds).subscribe({
        next: () => {
          this.tasinmazlar = this.tasinmazlar.filter(t => !selectedIds.includes(t.id));
        },
        error: (err) => {
          console.error('Silme işlemi hatası:', err);
        }
      });
    }
  }
  
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tasinmazlar.forEach(t => (t.selected = checked));
    this.onSelectionChange();
  }
  
  onSelectionChange(): void {
    this.allSelected = this.tasinmazlar.every(t => t.selected);
  }
  
  
}  