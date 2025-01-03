import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-tasinmaz',
  templateUrl: './update-tasinmaz.component.html',
  styleUrls: ['./update-tasinmaz.component.css']
})
export class UpdateTasinmazComponent implements OnInit {
  tasinmazForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];

  constructor( private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder) { }

  ngOnInit() {
   
    this.tasinmazForm = this.fb.group({
      ilId: [0, Validators.required],
      ilceId: [0, Validators.required],
      mahalleId: [0, Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      koordinat: ['', Validators.required],
      adres: ['', Validators.required]
    });
  
    
    
      // const tasinmazId = this.route.snapshot.paramMap.get('id');
      // if (tasinmazId) {
      //   this.apiService.getTasinmazById(Number(tasinmazId)).subscribe({
      //     next: (data) => {
      //       console.log('Gelen veri:', data);
      //       console.log(data.mahalle.ilce.il.id);
      //       console.log(typeof (data.mahalle.ilce.il.id));
      //       this.tasinmazForm.patchValue({
      //         id: data.id,
      //         ada: data.ada,
      //         parsel: data.parsel,
      //         koordinat: data.koordinat,
      //         adres: data.adres,
      //         nitelik: data.nitelik,
      //         mahalle: {
      //           id: data.mahalle.id,
      //           mahalleAdi: data.mahalle.mahalleAdi,
      //           ilceId: data.mahalle.ilce.id,
      //           ilce: {
      //             id: data.mahalle.ilce.id,
      //             ilceAdi: data.mahalle.ilce.ilceAdi,
      //             ilId: data.mahalle.ilce.il.id,
      //             il: {
      //               id: data.mahalle.ilceId.ilId,
      //               ilAdi: data.mahalle.ilceId.ilAdi,
      //             }
      //           }
      //         }
      //       });
      //     },
        
          
      //     error: (err) => console.error('Hata:', err)
      //   });
      // }
    
    

    const tasinmazId = this.route.snapshot.paramMap.get('id');
    if (tasinmazId) {
      this.apiService.getTasinmazById(Number(tasinmazId)).subscribe({
        next: (data) => {
          
          console.log('Gelen veri:', data);
          console.log(data.mahalle.ilce.il.id);
          console.log(typeof (data.mahalle.ilce.il.id));
          console.log("ilce id:",data.mahalle.ilceId);
          this.tasinmazForm.patchValue({
            ilId: data.mahalle.ilce.il.id || 0,
            ilceId: data.mahalle.ilceId || 0,
            mahalleId: data.mahalleId || 0,
            ada: data.ada || '',
            parsel: data.parsel || '',
            koordinat: data.koordinat || '',
            adres: data.adres || ''
          });
          console.log('Form Yapısı:', this.tasinmazForm);
console.log('İl ID Kontrolü:', this.tasinmazForm.get('ilId'));
console.log('İlçe ID Kontrolü:', this.tasinmazForm.get('ilceId'));
console.log('Mahalle ID Kontrolü:', this.tasinmazForm.get('mahalleId'));

this.ilceler = [data.mahalle.ilce];  
this.mahalleler = [data.mahalle]; 
                this.loadIller();


        },
      
        
        error: (err) => console.error('Hata:', err)
      });
    }
  }

 loadIller(): void {
    this.apiService.getIller().subscribe({
      next: (iller) => {
        this.iller = iller;
        console.log('İller Yüklendi:', this.iller);
        console.log('İller:', this.iller);
        console.log('Seçili İl ID:', this.tasinmazForm.get('ilId').value);
        
        
        const selectedIlId = this.tasinmazForm.get('mahalle.ilce.il.id').value;
        if (selectedIlId) {
          const selectedIl = this.iller.find(il => il.id === selectedIlId);
          console.log('Seçilen İl:', selectedIl);
          console.log('Seçili İl:', selectedIl);
          if (selectedIl) {
            this.tasinmazForm.get('mahalle.ilce.il.id').setValue(selectedIl.id);
          }
        }
      },
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
  
  // onSubmit(): void {
  //   if (this.tasinmazForm.valid) {
  //     const updatedTasinmaz = this.tasinmazForm.getRawValue();
  //     this.apiService.updateTasinmaz(updatedTasinmaz).subscribe({
  //       next: () => console.log('Taşınmaz başarıyla güncellendi!'),
  //       error: (err) => console.error('Güncelleme hatası:', err)
  //     });
  //   } else {
  //     console.error('Form geçersiz');
  //   }
  // }
}
  


  
