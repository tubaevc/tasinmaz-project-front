import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Tasinmaz } from '../../models/tasinmaz-model';

@Component({
  selector: 'app-add-tasinmaz',
  templateUrl: './add-tasinmaz.component.html',
  styleUrls: ['./add-tasinmaz.component.css']
})
export class AddTasinmazComponent implements OnInit {
  tasinmazForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.createForm();
    this.loadIller(); 
  }

  private createForm(): void {
    this.tasinmazForm = this.fb.group({
      ilId: [0, Validators.required],
      ilceId: [0, Validators.required],
      mahalleId: [0, Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      koordinat: ['', Validators.required],
      adres: ['', Validators.required]
    });
  }

  private loadIller(): void {
    this.apiService.getIller().subscribe({
      next: (data) => (this.iller = data),
      error: (err) => console.error('İller yüklenemedi:', err)
    });
  }

  onIlChange(event: Event): void {
    const ilId = parseInt((event.target as HTMLSelectElement).value, 10); 
    console.log('İl ID Tipi:', typeof ilId, 'Değer:', ilId);
    this.apiService.getIlceler(ilId).subscribe({
      next: (data) => (this.ilceler = data),
      error: (err) => console.error('İlçeler yüklenemedi:', err),
    });
  }
  
  onIlceChange(event: Event): void {
    const ilceId = parseInt((event.target as HTMLSelectElement).value, 10); 
    console.log('İlçe ID Tipi:', typeof ilceId, 'Değer:', ilceId); 
    this.apiService.getMahalleler(ilceId).subscribe({
      next: (data) => (this.mahalleler = data),
      error: (err) => console.error('Mahalleler yüklenemedi:', err),
    });
  }
  onMahalleChange(event: Event): void {
    const mahalleId = parseInt((event.target as HTMLSelectElement).value, 10); 
    console.log('Mahalle ID Tipi:', typeof mahalleId, 'Değer:', mahalleId); 
  }
  
  onSubmit(): void {
    if (this.tasinmazForm.valid) {
      const tasinmazData = {
        ...this.tasinmazForm.value,
        ilId: parseInt(this.tasinmazForm.value.ilId, 10),
        ilceId: parseInt(this.tasinmazForm.value.ilceId, 10),
        mahalleId: parseInt(this.tasinmazForm.value.mahalleId, 10),
      };
  
      console.log('Gönderilen Veri:', tasinmazData);
  
      this.apiService.addTasinmaz(tasinmazData).subscribe({
        next: (response) => console.log('Taşınmaz başarıyla eklendi:', response),
        error: (err) => console.error('Hata:', err),
      });
    } else {
      console.error('Form geçersiz');
    }
  }
  
}