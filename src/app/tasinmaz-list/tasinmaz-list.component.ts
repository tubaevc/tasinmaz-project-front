import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Tasinmaz } from '../../models/tasinmaz-model';

@Component({
  selector: 'tasinmaz-list',
  templateUrl: './tasinmaz-list.component.html',
  styleUrls: ['./tasinmaz-list.component.css']
})
export class TasinmazList implements OnInit {
  tasinmazlar: Tasinmaz[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllTasinmaz().subscribe({
      next: (data) => {
        this.tasinmazlar = data; 
        console.log(this.tasinmazlar);
      },
      error: (error) => {
        console.error('Veri çekme hatası:', error); 
      },
    });
  }
}