import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
@Component({
  selector: "app-update-tasinmaz",
  templateUrl: "./update-tasinmaz.component.html",
  styleUrls: ["./update-tasinmaz.component.css"],
})
export class UpdateTasinmazComponent implements OnInit {
  tasinmazForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  tasinmazId: number;
  map: Map | undefined;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tasinmazId = Number(this.route.snapshot.paramMap.get("id"));
    if (!this.tasinmazId) {
      console.error("Taşınmaz ID alınamadı!");
      return;
    }

    this.tasinmazForm = this.fb.group({
      ilId: [0, Validators.required],
      ilceId: [0, Validators.required],
      mahalleId: [0, Validators.required],
      ada: ["", Validators.required],
      parsel: ["", Validators.required],
      koordinat: ["", Validators.required],
      nitelik: ["", Validators.required],
      adres: ["", Validators.required],
    });

    this.apiService.getTasinmazById(this.tasinmazId).subscribe({
      next: (data) => {
        console.log("Gelen veri:", data);
        console.log("tasinmaz id:", data.id);

        this.tasinmazForm.patchValue({
          ilId: data.mahalle.ilce.il.id || 0,
          ilceId: data.mahalle.ilce.id || 0,
          mahalleId: data.mahalle.id || 0,
          ada: data.ada || "",
          parsel: data.parsel || "",
          koordinat: data.koordinat || "",
          nitelik: data.nitelik || "",
          adres: data.adres || "",
        });

        this.ilceler = [data.mahalle.ilce];
        this.mahalleler = [data.mahalle];

        this.loadIller();
      },
      error: (err) => console.error("Taşınmaz yüklenemedi:", err),
    });
    this.map = new Map({
      target: "map", // HTML element id
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([32.8597, 39.9334]),
        zoom: 6,
      }),
    });
    this.map.on("click", (event) => {
      const coordinates = toLonLat(event.coordinate); // Koordinatları LonLat formatına çevir
      console.log("Tıklanan Koordinatlar:", coordinates);

      // Koordinatları form alanına yerleştir
      this.tasinmazForm.patchValue({
        koordinat: `${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}`, // 6 basamaklı hassasiyet
      });
    });
  }

  loadIller(): void {
    this.apiService.getIller().subscribe({
      next: (iller) => {
        this.iller = iller;
        // console.log('İller Yüklendi:', this.iller);
        // console.log('İller:', this.iller);
        // console.log('Seçili İl ID:', this.tasinmazForm.get('ilId').value);

        const selectedIlId = this.tasinmazForm.get("mahalle.ilce.il.id").value;
        if (selectedIlId) {
          const selectedIl = this.iller.find((il) => il.id === selectedIlId);
          console.log("Seçilen İl:", selectedIl);
          console.log("Seçili İl:", selectedIl);
          if (selectedIl) {
            this.tasinmazForm.get("mahalle.ilce.il.id").setValue(selectedIl.id);
          }
        }
      },
      error: (err) => console.error("İller yüklenemedi:", err),
    });
  }

  onIlChange(event: Event): void {
    const ilId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log("İl ID Tipi:", typeof ilId, "Değer:", ilId);
    this.tasinmazForm.patchValue({
      //secince ilce mahalle sifirlama
      ilceId: 0,
      mahalleId: 0,
    });

    this.ilceler = []; //secince ilce mahalle sifirlama
    this.mahalleler = [];
    this.apiService.getIlceler(ilId).subscribe({
      next: (data) => (this.ilceler = data),
      error: (err) => console.error("İlçeler yüklenemedi:", err),
    });
  }

  onIlceChange(event: Event): void {
    const ilceId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log("İlçe ID Tipi:", typeof ilceId, "Değer:", ilceId);
    this.apiService.getMahalleler(ilceId).subscribe({
      next: (data) => (this.mahalleler = data),
      error: (err) => console.error("Mahalleler yüklenemedi:", err),
    });
  }
  onMahalleChange(event: Event): void {
    const mahalleId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log("Mahalle ID Tipi:", typeof mahalleId, "Değer:", mahalleId);
  }

  onSubmit(): void {
    if (this.tasinmazForm.valid) {
      const updatedTasinmaz = {
        ...this.tasinmazForm.value,
        id: this.tasinmazId,
        ilId: Number(this.tasinmazForm.value.ilId),
        ilceId: Number(this.tasinmazForm.value.ilceId),
        mahalleId: Number(this.tasinmazForm.value.mahalleId),
      };
      console.log("Güncelleme için gönderilen veri:", updatedTasinmaz);

      this.apiService.updateTasinmaz(updatedTasinmaz).subscribe({
        next: () => {
          console.log("Taşınmaz başarıyla güncellendi!"),
            alert("tasinmaz başariyla guncellendi");
          this.router.navigate(["/tasinmaz"]);
        },

        error: (err) => console.error("Güncelleme hatası:", err),
      });
    } else {
      console.error("Form geçersiz");
    }
  }
}
